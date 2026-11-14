import fs from "node:fs";
import path from "node:path";
import { PrismaClient, DifficultyLevel } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding BhashaRead data into PostgreSQL...");

  const dataPath = path.join(__dirname, "magi-data.json");
  const raw = fs.readFileSync(dataPath, "utf8");
  const magi = JSON.parse(raw);

  await prisma.vocabulary.deleteMany();
  await prisma.passageSection.deleteMany();
  await prisma.passage.deleteMany();

  const created = await prisma.passage.create({
    data: {
      slug: magi.slug,
      titleEn: magi.titleEn,
      titleBn: magi.titleBn,
      category: magi.category,
      difficulty: (magi.difficulty as DifficultyLevel) || DifficultyLevel.INTERMEDIATE,
      readingTimeMinutes: magi.readingTimeMinutes,
      summaryEn: magi.summaryEn,
      summaryBn: magi.summaryBn,
      englishContent: magi.englishContent,
      bengaliContent: magi.bengaliContent,
      sections: {
        create: magi.sections,
      },
      vocabularies: {
        create: magi.vocabularies,
      },
    },
    include: {
      _count: {
        select: { sections: true, vocabularies: true },
      },
    },
  });

  console.log(
    `Seeded '${created.slug}' with ${created._count.sections} sections and ${created._count.vocabularies} word notes!`
  );
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
