import React from "react";
import prisma from "@/lib/prisma";
import { BUILTIN_DICTIONARY } from "@/lib/dictionary";
import HomeFeed from "@/components/HomeFeed";
import { PassageListItem } from "@/types/reading";

export const dynamic = "force-dynamic";

export default async function HomePage() {
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

  const serializedPassages: PassageListItem[] = passages.map((p) => ({
    ...p,
    createdAt: p.createdAt.toISOString(),
  }));

  const totalVocabCount =
    dbVocabCount + Object.keys(BUILTIN_DICTIONARY).length;

  return (
    <HomeFeed
      passages={serializedPassages}
      totalVocabCount={totalVocabCount}
    />
  );
}
