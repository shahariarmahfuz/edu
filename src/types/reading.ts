export type Difficulty = "BEGINNER" | "INTERMEDIATE" | "ADVANCED";

export type ThemeMode = "light" | "dark";

export type FontSize = "sm" | "md" | "lg" | "xl";

export type ReadingMode = "tap-to-reveal" | "parallel" | "english-only";

export interface VocabularyItem {
  id: string;
  passageId?: string | null;
  word: string;
  cleanWord?: string | null;
  phonetic?: string | null;
  banglaPronunciation?: string | null; // বাংলা উচ্চারণ (যেমন: অ্যানশেন্ট)
  partOfSpeech?: string | null;
  bengaliMeaning: string;             // বাংলা অর্থ (যেমন: প্রাচীন)
  englishDefinition?: string | null;
  exampleSentenceEn?: string | null;
  exampleSentenceBn?: string | null;
}

export interface SentenceItem {
  en: string;
  bnPronounce?: string | null;
  bn: string;
}

export interface PassageSectionItem {
  id: string;
  passageId: string;
  orderIndex: number;
  englishText: string;
  banglaPronunciation?: string | null; // বাক্যের বাংলা উচ্চারণ (যেমন: ওয়ান্স আপন আ টাইম...)
  bengaliText: string;                 // বাক্যের সম্পূর্ণ বাংলা অনুবাদ
  sentences?: SentenceItem[] | null;
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
