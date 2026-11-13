import http from "node:http";
import { timingSafeEqual } from "node:crypto";
import { URL } from "node:url";
import { DifficultyLevel, PrismaClient } from "@prisma/client";

const HOST = process.env.BACKEND_HOST || "127.0.0.1";
const PORT = Number(process.env.BACKEND_PORT || 4000);
const INTERNAL_API_KEY = process.env.INTERNAL_API_KEY || "";

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
});

function sendJson(
  res: http.ServerResponse,
  statusCode: number,
  payload: unknown
) {
  const body = JSON.stringify(payload);
  res.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
  });
  res.end(body);
}

function isAuthorized(req: http.IncomingMessage): boolean {
  if (!INTERNAL_API_KEY) return true;
  const headerVal = req.headers["x-internal-key"];
  const provided = Array.isArray(headerVal) ? headerVal[0] : headerVal;
  if (!provided) return false;
  const expectedBuf = Buffer.from(INTERNAL_API_KEY);
  const providedBuf = Buffer.from(provided);
  if (expectedBuf.length !== providedBuf.length) return false;
  return timingSafeEqual(expectedBuf, providedBuf);
}

async function readJsonBody(req: http.IncomingMessage): Promise<Record<string, unknown>> {
  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }
  const raw = Buffer.concat(chunks).toString("utf8");
  if (!raw.trim()) return {};
  return JSON.parse(raw) as Record<string, unknown>;
}

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
}

async function handleRequest(
  req: http.IncomingMessage,
  res: http.ServerResponse
) {
  const method = req.method || "GET";
  const url = new URL(req.url || "/", `http://${HOST}:${PORT}`);
  const pathname = url.pathname;

  if (method === "GET" && pathname === "/internal/health") {
    try {
      await prisma.$queryRaw`SELECT 1`;
      return sendJson(res, 200, { ok: true, service: "bhasharead-backend" });
    } catch (error) {
      console.error("Backend healthcheck failed:", error);
      return sendJson(res, 503, { ok: false, error: "Database unreachable" });
    }
  }

  if (!isAuthorized(req)) {
    return sendJson(res, 403, { success: false, error: "Forbidden" });
  }

  // GET /internal/home
  if (method === "GET" && pathname === "/internal/home") {
    try {
      const [passages, dbVocabCount] = await Promise.all([
        prisma.passage.findMany({
          where: { isPublished: true },
          select: {
            id: true,
            slug: true,
            titleEn: true,
            titleBn: true,
            category: true,
            difficulty: true,
            readingTimeMinutes: true,
            summaryEn: true,
            summaryBn: true,
            createdAt: true,
            _count: {
              select: {
                sections: true,
                vocabularies: true,
              },
            },
          },
          orderBy: {
            createdAt: "asc",
          },
        }),
        prisma.vocabulary.count(),
      ]);

      return sendJson(res, 200, {
        success: true,
        data: {
          passages: passages.map((p) => ({
            ...p,
            createdAt: p.createdAt.toISOString(),
          })),
          dbVocabCount,
        },
      });
    } catch (error) {
      console.error("Error fetching home feed:", error);
      return sendJson(res, 500, {
        success: false,
        error: "Failed to fetch home data",
      });
    }
  }

  // GET /internal/passages
  if (method === "GET" && pathname === "/internal/passages") {
    try {
      const difficultyParam = url.searchParams.get("difficulty");
      const categoryParam = url.searchParams.get("category");
      const searchParam = url.searchParams.get("q");

      const whereClause: Record<string, unknown> = { isPublished: true };

      if (
        difficultyParam &&
        Object.values(DifficultyLevel).includes(difficultyParam as DifficultyLevel)
      ) {
        whereClause.difficulty = difficultyParam as DifficultyLevel;
      }

      if (categoryParam && categoryParam !== "all") {
        whereClause.category = categoryParam;
      }

      if (searchParam && searchParam.trim()) {
        const q = searchParam.trim();
        whereClause.OR = [
          { titleEn: { contains: q, mode: "insensitive" } },
          { titleBn: { contains: q } },
          { summaryEn: { contains: q, mode: "insensitive" } },
        ];
      }

      const passages = await prisma.passage.findMany({
        where: whereClause,
        select: {
          id: true,
          slug: true,
          titleEn: true,
          titleBn: true,
          category: true,
          difficulty: true,
          readingTimeMinutes: true,
          summaryEn: true,
          summaryBn: true,
          createdAt: true,
          _count: {
            select: {
              sections: true,
              vocabularies: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      return sendJson(res, 200, { success: true, data: passages });
    } catch (error) {
      console.error("Error fetching passages:", error);
      return sendJson(res, 500, {
        success: false,
        error: "Failed to fetch passages from database",
      });
    }
  }

  // POST /internal/passages
  if (method === "POST" && pathname === "/internal/passages") {
    try {
      const body = await readJsonBody(req);
      const titleEn = typeof body.titleEn === "string" ? body.titleEn : "";
      const titleBn = typeof body.titleBn === "string" ? body.titleBn : "";
      const slug = typeof body.slug === "string" ? body.slug : undefined;
      const category =
        typeof body.category === "string" ? body.category : "General";
      const difficulty =
        typeof body.difficulty === "string" ? body.difficulty : "BEGINNER";
      const englishContent =
        typeof body.englishContent === "string" ? body.englishContent : "";
      const bengaliContent =
        typeof body.bengaliContent === "string" ? body.bengaliContent : "";
      const summaryEn =
        typeof body.summaryEn === "string" ? body.summaryEn : undefined;
      const summaryBn =
        typeof body.summaryBn === "string" ? body.summaryBn : undefined;
      const readingTimeMinutes =
        typeof body.readingTimeMinutes === "number"
          ? body.readingTimeMinutes
          : undefined;
      const sections = Array.isArray(body.sections)
        ? (body.sections as Array<Record<string, unknown>>)
        : undefined;
      const vocabularies = Array.isArray(body.vocabularies)
        ? (body.vocabularies as Array<Record<string, unknown>>)
        : undefined;

      if (!titleEn || !titleBn) {
        return sendJson(res, 400, {
          success: false,
          error: "Missing required fields: titleEn, titleBn",
        });
      }

      const finalSlug = slug ? slugify(slug) : slugify(titleEn);
      const rawEnglish =
        englishContent ||
        (sections
          ? sections.map((s) => String(s.englishText || "")).join(" ")
          : "");
      const wordCount = rawEnglish.trim().split(/\s+/).filter(Boolean).length;
      const calculatedReadingTime =
        readingTimeMinutes || Math.max(1, Math.round(wordCount / 160));

      let sectionsData: Array<{
        orderIndex: number;
        englishText: string;
        banglaPronunciation?: string | null;
        bengaliText: string;
        sentences?: unknown;
      }> = [];

      if (sections && sections.length > 0) {
        sectionsData = sections.map((sec, idx) => ({
          orderIndex:
            typeof sec.orderIndex === "number" ? sec.orderIndex : idx,
          englishText: String(sec.englishText || "").trim(),
          banglaPronunciation:
            typeof sec.banglaPronunciation === "string"
              ? sec.banglaPronunciation.trim() || null
              : null,
          bengaliText: String(sec.bengaliText || "").trim(),
          ...(Array.isArray(sec.sentences) ? { sentences: sec.sentences } : {}),
        }));
      } else {
        const enParagraphs = englishContent
          .split(/\n\s*\n/)
          .map((p) => p.trim())
          .filter(Boolean);
        const bnParagraphs = bengaliContent
          .split(/\n\s*\n/)
          .map((p) => p.trim())
          .filter(Boolean);

        sectionsData = enParagraphs.map((enP, idx) => ({
          orderIndex: idx,
          englishText: enP,
          banglaPronunciation: null,
          bengaliText: bnParagraphs[idx] || "",
        }));
      }

      const vocabData = vocabularies
        ? vocabularies.map((v) => {
            const wordStr = String(v.word || "").trim();
            const cleanStr =
              typeof v.cleanWord === "string" && v.cleanWord.trim()
                ? v.cleanWord
                : wordStr;
            return {
              word: wordStr,
              cleanWord: cleanStr.toLowerCase().replace(/[^a-zA-Z]/g, ""),
              phonetic:
                typeof v.phonetic === "string"
                  ? v.phonetic.trim() || null
                  : null,
              banglaPronunciation:
                typeof v.banglaPronunciation === "string"
                  ? v.banglaPronunciation.trim() || null
                  : null,
              partOfSpeech:
                typeof v.partOfSpeech === "string"
                  ? v.partOfSpeech.trim() || null
                  : null,
              bengaliMeaning: String(v.bengaliMeaning || "").trim(),
              englishDefinition:
                typeof v.englishDefinition === "string"
                  ? v.englishDefinition.trim() || null
                  : null,
              exampleSentenceEn:
                typeof v.exampleSentenceEn === "string"
                  ? v.exampleSentenceEn.trim() || null
                  : null,
              exampleSentenceBn:
                typeof v.exampleSentenceBn === "string"
                  ? v.exampleSentenceBn.trim() || null
                  : null,
            };
          })
        : [];

      const fullEn =
        englishContent.trim() ||
        sectionsData.map((s) => s.englishText).join("\n\n");
      const fullBn =
        bengaliContent.trim() ||
        sectionsData.map((s) => s.bengaliText).join("\n\n");

      const newPassage = await prisma.$transaction(async (tx) => {
        const existing = await tx.passage.findUnique({
          where: { slug: finalSlug },
        });
        const uniqueSlug = existing
          ? `${finalSlug}-${Date.now().toString().slice(-4)}`
          : finalSlug;

        return tx.passage.create({
          data: {
            slug: uniqueSlug,
            titleEn: titleEn.trim(),
            titleBn: titleBn.trim(),
            category: category.trim(),
            difficulty: difficulty as DifficultyLevel,
            englishContent: fullEn,
            bengaliContent: fullBn,
            summaryEn: summaryEn?.trim() || null,
            summaryBn: summaryBn?.trim() || null,
            readingTimeMinutes: calculatedReadingTime,
            sections: {
              create: sectionsData as never,
            },
            vocabularies: {
              create: vocabData,
            },
          },
          include: {
            sections: true,
            vocabularies: true,
          },
        });
      });

      return sendJson(res, 201, {
        success: true,
        message: "Passage created successfully",
        data: newPassage,
      });
    } catch (error) {
      const msg =
        error instanceof Error
          ? error.message
          : "Failed to create passage in database";
      console.error("Error creating passage:", error);
      return sendJson(res, 500, { success: false, error: msg });
    }
  }

  // GET /internal/passages/:slug
  if (method === "GET" && pathname.startsWith("/internal/passages/")) {
    try {
      const slug = decodeURIComponent(
        pathname.slice("/internal/passages/".length)
      );
      if (!slug) {
        return sendJson(res, 400, {
          success: false,
          error: "Slug parameter is required",
        });
      }

      const passage = await prisma.passage.findFirst({
        where: {
          OR: [{ slug }, { id: slug }],
          isPublished: true,
        },
        include: {
          sections: {
            orderBy: {
              orderIndex: "asc",
            },
          },
          vocabularies: {
            orderBy: {
              word: "asc",
            },
          },
        },
      });

      if (!passage) {
        return sendJson(res, 404, {
          success: false,
          error: `Passage not found with identifier '${slug}'`,
        });
      }

      return sendJson(res, 200, {
        success: true,
        data: {
          ...passage,
          createdAt: passage.createdAt.toISOString(),
          updatedAt: passage.updatedAt.toISOString(),
        },
      });
    } catch (error) {
      console.error("Error fetching single passage:", error);
      return sendJson(res, 500, {
        success: false,
        error: "Failed to fetch passage from database",
      });
    }
  }

  // GET /internal/vocabulary
  if (method === "GET" && pathname === "/internal/vocabulary") {
    try {
      const passageId = url.searchParams.get("passageId");
      const query = url.searchParams.get("q");
      const all = url.searchParams.get("all") === "true";

      const whereClause: Record<string, unknown> = {};
      if (passageId) {
        whereClause.passageId = passageId;
      }
      if (query && query.trim()) {
        const q = query.trim();
        whereClause.OR = [
          { word: { contains: q, mode: "insensitive" } },
          { bengaliMeaning: { contains: q } },
          { englishDefinition: { contains: q, mode: "insensitive" } },
        ];
      }

      const vocabularies = await prisma.vocabulary.findMany({
        where: whereClause,
        include: {
          passage: {
            select: {
              id: true,
              slug: true,
              titleEn: true,
              titleBn: true,
            },
          },
        },
        orderBy: {
          word: "asc",
        },
        ...(all ? {} : { take: 50 }),
      });

      return sendJson(res, 200, { success: true, data: vocabularies });
    } catch (error) {
      console.error("Error fetching vocabulary:", error);
      return sendJson(res, 500, {
        success: false,
        error: "Failed to fetch vocabulary from database",
      });
    }
  }

  return sendJson(res, 404, { success: false, error: "Not found" });
}

const server = http.createServer((req, res) => {
  void handleRequest(req, res);
});

server.listen(PORT, HOST, () => {
  console.log(`BhashaRead internal backend listening on http://${HOST}:${PORT}`);
});

async function shutdown(signal: string) {
  console.log(`Backend received ${signal}, shutting down...`);
  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
}

process.on("SIGINT", () => void shutdown("SIGINT"));
process.on("SIGTERM", () => void shutdown("SIGTERM"));
