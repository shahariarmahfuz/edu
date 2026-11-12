import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { DifficultyLevel } from "@prisma/client";

export const dynamic = "force-dynamic";

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

// GET /api/passages - List passages
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const difficultyParam = searchParams.get("difficulty");
    const categoryParam = searchParams.get("category");
    const searchParam = searchParams.get("q");

    const whereClause: any = { isPublished: true };

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

    return NextResponse.json({
      success: true,
      data: passages,
    });
  } catch (error) {
    console.error("Error fetching passages:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch passages from database" },
      { status: 500 }
    );
  }
}

// POST /api/passages - Upload new bilingual passage
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      titleEn,
      titleBn,
      slug,
      category = "General",
      difficulty = "BEGINNER",
      englishContent,
      bengaliContent,
      summaryEn,
      summaryBn,
      readingTimeMinutes,
      sections,
      vocabularies,
    } = body;

    if (!titleEn || !titleBn) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields: titleEn, titleBn",
        },
        { status: 400 }
      );
    }

    const finalSlug = slug ? slugify(slug) : slugify(titleEn);

    // Calculate reading time
    const rawEnglish =
      englishContent ||
      (Array.isArray(sections)
        ? sections.map((s: any) => s.englishText).join(" ")
        : "");
    const wordCount = rawEnglish.trim().split(/\s+/).filter(Boolean).length;
    const calculatedReadingTime =
      readingTimeMinutes || Math.max(1, Math.round(wordCount / 160));

    // Prepare sections
    let sectionsData: Array<{
      orderIndex: number;
      englishText: string;
      banglaPronunciation?: string | null;
      bengaliText: string;
      sentences?: any;
    }> = [];

    if (Array.isArray(sections) && sections.length > 0) {
      sectionsData = sections.map((sec, idx) => ({
        orderIndex: sec.orderIndex ?? idx,
        englishText: sec.englishText.trim(),
        banglaPronunciation: sec.banglaPronunciation?.trim() || null,
        bengaliText: sec.bengaliText.trim(),
        ...(Array.isArray(sec.sentences) ? { sentences: sec.sentences } : {}),
      }));
    } else {
      const enParagraphs = (englishContent || "")
        .split(/\n\s*\n/)
        .map((p: string) => p.trim())
        .filter(Boolean);
      const bnParagraphs = (bengaliContent || "")
        .split(/\n\s*\n/)
        .map((p: string) => p.trim())
        .filter(Boolean);

      sectionsData = enParagraphs.map((enP: string, idx: number) => ({
        orderIndex: idx,
        englishText: enP,
        banglaPronunciation: null,
        bengaliText: bnParagraphs[idx] || "",
      }));
    }

    // Prepare vocabulary items
    const vocabData = Array.isArray(vocabularies)
      ? vocabularies.map((v) => ({
          word: v.word.trim(),
          cleanWord: (v.cleanWord || v.word).toLowerCase().replace(/[^a-zA-Z]/g, ""),
          phonetic: v.phonetic?.trim() || null,
          banglaPronunciation: v.banglaPronunciation?.trim() || null,
          partOfSpeech: v.partOfSpeech?.trim() || null,
          bengaliMeaning: v.bengaliMeaning.trim(),
          englishDefinition: v.englishDefinition?.trim() || null,
          exampleSentenceEn: v.exampleSentenceEn?.trim() || null,
          exampleSentenceBn: v.exampleSentenceBn?.trim() || null,
        }))
      : [];

    const fullEn =
      englishContent?.trim() ||
      sectionsData.map((s) => s.englishText).join("\n\n");
    const fullBn =
      bengaliContent?.trim() ||
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
            create: sectionsData,
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

    return NextResponse.json(
      {
        success: true,
        message: "Passage created successfully",
        data: newPassage,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating passage:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to create passage in database",
      },
      { status: 500 }
    );
  }
}
