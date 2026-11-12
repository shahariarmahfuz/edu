"use client";

import React, { useState } from "react";
import { X, Volume2, Bookmark, Check, ChevronRight, ChevronLeft } from "lucide-react";
import { VocabularyItem, ThemeMode } from "@/types/reading";

interface VocabularyBottomSheetProps {
  vocab: VocabularyItem | null;
  vocabList?: VocabularyItem[];
  theme: ThemeMode;
  onClose: () => void;
  onSelectVocab?: (vocab: VocabularyItem) => void;
}

export default function VocabularyBottomSheet({
  vocab,
  vocabList = [],
  theme,
  onClose,
  onSelectVocab,
}: VocabularyBottomSheetProps) {
  const [copied, setCopied] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  if (!vocab) return null;

  const currentIndex = vocabList.findIndex(
    (v) => v.id === vocab.id || v.word.toLowerCase() === vocab.word.toLowerCase()
  );
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex >= 0 && currentIndex < vocabList.length - 1;

  const playPronunciation = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(vocab.word);
      utterance.lang = "en-US";
      utterance.rate = 0.85; // Slightly slower for language learners
      setIsPlayingAudio(true);
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleCopy = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(`${vocab.word} - ${vocab.bengaliMeaning}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Bottom Sheet Container (Mobile-first, centered in desktop frame) */}
      <div
        className="relative z-10 w-full max-w-md mx-auto rounded-t-3xl border-t shadow-2xl p-6 transition-all duration-300 animate-slide-up"
        style={{
          backgroundColor: "var(--bg-secondary)",
          borderColor: "var(--border-color)",
          color: "var(--text-primary)",
        }}
        role="dialog"
        aria-modal="true"
      >
        {/* Drag Handle Indicator */}
        <div className="w-12 h-1.5 bg-slate-400/40 rounded-full mx-auto mb-4" />

        {/* Top Control Bar */}
        <div className="flex items-center justify-between pb-3 border-b border-black/10 dark:border-white/10">
          <div className="flex items-center gap-2">
            {vocab.partOfSpeech && (
              <span className="px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                {vocab.partOfSpeech}
              </span>
            )}
            {vocabList.length > 1 && currentIndex >= 0 && (
              <span className="text-xs opacity-60">
                {currentIndex + 1} of {vocabList.length}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1">
            {/* Quick Copy / Bookmark Action */}
            <button
              onClick={handleCopy}
              className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 active:scale-95 transition-transform"
              title="Copy vocabulary definition"
              aria-label="Copy word"
            >
              {copied ? (
                <Check className="w-5 h-5 text-emerald-500" />
              ) : (
                <Bookmark className="w-5 h-5 opacity-70" />
              )}
            </button>

            {/* Close Button (44px min tap target) */}
            <button
              onClick={onClose}
              className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 active:scale-95 transition-transform"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5 opacity-80" />
            </button>
          </div>
        </div>

        {/* Word & Pronunciation */}
        <div className="mt-4 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight capitalize">
              {vocab.word}
            </h2>
            {vocab.phonetic && (
              <p className="text-sm font-mono opacity-70 mt-0.5">
                {vocab.phonetic}
              </p>
            )}
          </div>

          {/* Audio Pronunciation Button (48px tap target) */}
          <button
            onClick={playPronunciation}
            className={`min-w-[48px] min-h-[48px] rounded-2xl flex items-center justify-center shadow-xs transition-all active:scale-95 ${
              isPlayingAudio
                ? "bg-indigo-600 text-white animate-pulse"
                : "bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500/25"
            }`}
            title="Listen to English pronunciation"
            aria-label="Listen pronunciation"
          >
            <Volume2 className="w-6 h-6" />
          </button>
        </div>

        {/* Bengali Meaning Highlight Box */}
        <div
          className="mt-4 p-4 rounded-2xl border"
          style={{
            backgroundColor: "var(--highlight-vocab)",
            borderColor: "var(--highlight-vocab-border)",
            color: "var(--highlight-vocab-text)",
          }}
        >
          <div className="text-xs font-semibold uppercase tracking-wider opacity-75 mb-1">
            বাংলা অর্থ (Bengali Meaning)
          </div>
          <div className="font-bengali text-2xl font-bold leading-relaxed">
            {vocab.bengaliMeaning}
          </div>
        </div>

        {/* English Definition */}
        {vocab.englishDefinition && (
          <div className="mt-3.5">
            <div className="text-xs font-semibold uppercase tracking-wider opacity-60 mb-0.5">
              Definition
            </div>
            <p className="text-sm leading-relaxed opacity-90">
              {vocab.englishDefinition}
            </p>
          </div>
        )}

        {/* Context Sentence Example */}
        {(vocab.exampleSentenceEn || vocab.exampleSentenceBn) && (
          <div
            className="mt-3.5 p-3.5 rounded-xl border text-sm"
            style={{
              backgroundColor: "var(--bg-surface)",
              borderColor: "var(--border-color)",
            }}
          >
            <div className="text-xs font-semibold uppercase tracking-wider opacity-60 mb-1">
              Context Example
            </div>
            {vocab.exampleSentenceEn && (
              <p className="font-medium italic text-slate-800 dark:text-slate-200">
                &ldquo;{vocab.exampleSentenceEn}&rdquo;
              </p>
            )}
            {vocab.exampleSentenceBn && (
              <p className="font-bengali text-slate-600 dark:text-slate-400 mt-1">
                {vocab.exampleSentenceBn}
              </p>
            )}
          </div>
        )}

        {/* Bottom Navigation for multiple vocabs (Thumb zone friendly) */}
        {vocabList.length > 1 && onSelectVocab && (
          <div className="mt-5 pt-3 flex items-center justify-between border-t border-black/10 dark:border-white/10">
            <button
              onClick={() => hasPrev && onSelectVocab(vocabList[currentIndex - 1])}
              disabled={!hasPrev}
              className={`min-h-[44px] px-3 flex items-center gap-1.5 text-xs font-medium rounded-xl transition-all ${
                hasPrev
                  ? "hover:bg-black/5 dark:hover:bg-white/10 active:scale-95"
                  : "opacity-30 cursor-not-allowed"
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>

            <span className="text-xs font-medium opacity-60">
              Swipe or tap arrows
            </span>

            <button
              onClick={() => hasNext && onSelectVocab(vocabList[currentIndex + 1])}
              disabled={!hasNext}
              className={`min-h-[44px] px-3 flex items-center gap-1.5 text-xs font-medium rounded-xl transition-all ${
                hasNext
                  ? "hover:bg-black/5 dark:hover:bg-white/10 active:scale-95"
                  : "opacity-30 cursor-not-allowed"
              }`}
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
