import React from "react";
import { backendFetch } from "@/lib/backendClient";
import { BUILTIN_DICTIONARY } from "@/lib/dictionary";
import VocabularyExplorer from "@/components/VocabularyExplorer";
import { VocabularyItem } from "@/types/reading";

export const dynamic = "force-dynamic";

interface VocabWithPassage extends VocabularyItem {
  passage?: {
    slug: string;
    titleEn: string;
    titleBn: string;
  } | null;
}

interface VocabBackendPayload {
  success: boolean;
  data?: VocabWithPassage[];
}

export default async function VocabularyPage() {
  const res = await backendFetch<VocabBackendPayload>(
    "/internal/vocabulary?all=true"
  );
  const dbVocabularies = res.body?.data ?? [];

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
