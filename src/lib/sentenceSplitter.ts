import { PassageSectionItem, SentenceItem } from "@/types/reading";

function splitEnSmart(text: string): string[] {
  const protectedText = text
    .replace(/\b(Mr|Mrs|Mme|Ms|Dr|Prof|St|Jr|Sr|O|J|U\.S\.A|B\.C)\./g, "$1\u0000")
    .replace(/([A-Z])\.\s*([A-Z])\./g, "$1\u0000 $2\u0000");
  return protectedText
    .split(/(?<=[.!?]["”'’)]?)\s+/)
    .map((s) => s.replace(/\u0000/g, ".").trim())
    .filter(Boolean);
}

function splitBnSmart(text: string): string[] {
  const protectedText = text.replace(/(আ|মি|মিসেস|ড)\./g, "$1\u0000");
  return protectedText
    .split(/(?<=[।!?]["”'’)]?)\s+/)
    .map((s) => s.replace(/\u0000/g, ".").trim())
    .filter(Boolean);
}

/**
 * Splits a PassageSection into individual sentences with aligned English,
 * Bengali pronunciation, and Bengali translation.
 * - Uses explicit `section.sentences` array if provided in DB/JSON.
 * - Otherwise auto-splits English by `. ! ?` and Bengali by `। ! ?`.
 * - If sentence counts match, aligns 1-to-1; otherwise falls back to full section text.
 */
export function extractSentencesFromSection(
  section: PassageSectionItem
): SentenceItem[] {
  if (Array.isArray(section.sentences) && section.sentences.length > 0) {
    return section.sentences;
  }

  const enSentences = splitEnSmart(section.englishText);

  if (enSentences.length <= 1) {
    return [
      {
        en: section.englishText.trim(),
        bnPronounce: section.banglaPronunciation || null,
        bn: section.bengaliText.trim(),
      },
    ];
  }

  const bnPronounceSentences = section.banglaPronunciation
    ? splitBnSmart(section.banglaPronunciation)
    : [];

  const bnSentences = section.bengaliText
    ? splitBnSmart(section.bengaliText)
    : [];

  const canAlignBn = bnSentences.length === enSentences.length;
  const canAlignPronounce = bnPronounceSentences.length === enSentences.length;

  return enSentences.map((en, idx) => ({
    en,
    bnPronounce: canAlignPronounce
      ? bnPronounceSentences[idx]
      : section.banglaPronunciation || null,
    bn: canAlignBn ? bnSentences[idx] : section.bengaliText,
  }));
}
