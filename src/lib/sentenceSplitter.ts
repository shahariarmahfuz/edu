import { PassageSectionItem, SentenceItem } from "@/types/reading";

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

  const enSentences = section.englishText
    .split(/(?<=[.!?]["”']?)\s+/)
    .map((s) => s.trim())
    .filter(Boolean);

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
    ? section.banglaPronunciation
        .split(/(?<=[।.!?]["”']?)\s+/)
        .map((s) => s.trim())
        .filter(Boolean)
    : [];

  const bnSentences = section.bengaliText
    ? section.bengaliText
        .split(/(?<=[।.!?]["”']?)\s+/)
        .map((s) => s.trim())
        .filter(Boolean)
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
