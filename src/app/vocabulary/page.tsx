import React from "react";
import prisma from "@/lib/prisma";
import { BUILTIN_DICTIONARY } from "@/lib/dictionary";
import VocabularyExplorer from "@/components/VocabularyExplorer";

export const dynamic = "force-dynamic";

export default async function VocabularyPage() {
  const dbVocabularies = await prisma.vocabulary.findMany({
    include: {
      passage: {
        select: {
          slug: true,
          titleEn: true,
          titleBn: true,
        },
      },
    },
    orderBy: {
      word: "asc",
    },
  });

  const builtinDictionary = Object.entries(BUILTIN_DICTIONARY).map(
    ([word, entry]) => ({
      id: `builtin-${word}`,
      word,
      cleanWord: word,
      phonetic: entry.phonetic,
      banglaPronunciation: entry.banglaPronunciation,
      partOfSpeech: entry.partOfSpeech,
      bengaliMeaning: entry.bengaliMeaning,
      englishDefinition: entry.definition,
      exampleSentenceEn: entry.exampleEn,
      exampleSentenceBn: entry.exampleBn,
      passage: null,
    })
  );

  return (
    <VocabularyExplorer
      dbVocabularies={dbVocabularies}
      builtinDictionary={builtinDictionary}
    />
  );
}
