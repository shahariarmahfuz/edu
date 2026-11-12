export type Difficulty = "BEGINNER" | "INTERMEDIATE" | "ADVANCED";

export type ThemeMode = "light" | "sepia" | "dark";

export type FontSize = "sm" | "md" | "lg" | "xl";

export type ReadingMode = "tap-to-reveal" | "parallel" | "english-only";

export interface VocabularyItem {
  id: string;
  passageId?: string | null;
  word: string;
  phonetic?: string | null;
  partOfSpeech?: string | null;
  bengaliMeaning: string;
  englishDefinition?: string | null;
  exampleSentenceEn?: string | null;
  exampleSentenceBn?: string | null;
}

export interface PassageSectionItem {
  id: string;
  passageId: string;
  orderIndex: number;
  englishText: string;
  bengaliText: string;
}

export interface PassageItem {
  id: string;
  slug: string;
  titleEn: string;
  titleBn: string;
  category: string;
  difficulty: Difficulty;
  englishContent: string;
  bengaliContent: string;
  summaryEn?: string | null;
  summaryBn?: string | null;
  readingTimeMinutes: number;
  isPublished: boolean;
  createdAt: string | Date;
  updatedAt?: string | Date;
  sections: PassageSectionItem[];
  vocabularies: VocabularyItem[];
  _count?: {
    sections: number;
    vocabularies: number;
  };
}

export interface PassageListItem {
  id: string;
  slug: string;
  titleEn: string;
  titleBn: string;
  category: string;
  difficulty: Difficulty;
  readingTimeMinutes: number;
  summaryEn?: string | null;
  summaryBn?: string | null;
  createdAt: string | Date;
  _count: {
    sections: number;
    vocabularies: number;
  };
}
