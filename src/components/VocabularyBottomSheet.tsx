"use client";

import React, { useState } from "react";
import { X, Volume2, Bookmark, Check, ChevronRight, ChevronLeft, Sparkles } from "lucide-react";
import { VocabularyItem } from "@/types/reading";

interface VocabularyBottomSheetProps {
  vocab: VocabularyItem | null;
  vocabList?: VocabularyItem[];
  onClose: () => void;
  onSelectVocab?: (vocab: VocabularyItem) => void;
}

export default function VocabularyBottomSheet({
  vocab,
  vocabList = [],
  onClose,
  onSelectVocab,
}: VocabularyBottomSheetProps) {
  const [copied, setCopied] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  if (!vocab) return null;

  const currentIndex = vocabList.findIndex(
    (v) =>
      v.id === vocab.id ||
      (v.cleanWord && vocab.cleanWord && v.cleanWord.toLowerCase() === vocab.cleanWord.toLowerCase()) ||
      v.word.toLowerCase() === vocab.word.toLowerCase()
  );
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex >= 0 && currentIndex < vocabList.length - 1;

  const playPronunciation = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const clean = vocab.cleanWord || vocab.word.replace(/[^a-zA-Z]/g, "");
      const utterance = new SpeechSynthesisUtterance(clean);
      utterance.lang = "en-US";
      utterance.rate = 0.85; // Learner-friendly speed
      setIsPlayingAudio(true);
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleCopy = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(`${vocab.word} (${vocab.banglaPronunciation || ""}) - ${vocab.bengaliMeaning}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Bottom Sheet Container (High Contrast Light Mode) */}
      <div
        className="relative z-10 w-full max-w-md mx-auto rounded-t-3xl bg-white border-t border-slate-200 shadow-2xl p-6 transition-all duration-300 animate-slide-up text-slate-900 max-h-[85vh] overflow-y-auto"
        role="dialog"
        aria-modal="true"
      >
        {/* Drag Handle Indicator */}
        <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto mb-4" />

        {/* Top Control Bar */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            {vocab.partOfSpeech && (
              <span className="px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                {vocab.partOfSpeech}
              </span>
            )}
            {vocabList.length > 1 && currentIndex >= 0 && (
              <span className="text-xs text-slate-500 font-medium">
                Word {currentIndex + 1} of {vocabList.length}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handleCopy}
              className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-600 active:scale-95 transition-transform"
              title="Copy vocabulary definition"
              aria-label="Copy word"
            >
              {copied ? (
                <Check className="w-5 h-5 text-emerald-600" />
              ) : (
                <Bookmark className="w-5 h-5" />
              )}
            </button>

            <button
              onClick={onClose}
              className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-700 active:scale-95 transition-transform"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Word, Phonetic & Audio Pronunciation */}
        <div className="mt-4 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 capitalize">
              {vocab.cleanWord || vocab.word}
            </h2>
            {vocab.phonetic && (
              <p className="text-xs font-mono text-slate-500 mt-0.5">
                {vocab.phonetic}
              </p>
            )}
          </div>

          {/* Audio Pronunciation Button (48px tap target) */}
          <button
            onClick={playPronunciation}
            className={`min-w-[48px] min-h-[48px] rounded-2xl flex items-center justify-center shadow-xs transition-all active:scale-95 ${
              isPlayingAudio
                ? "bg-indigo-700 text-white animate-pulse"
                : "bg-indigo-600 text-white hover:bg-indigo-700"
            }`}
            title="Listen to English pronunciation"
            aria-label="Listen pronunciation"
          >
            <Volume2 className="w-6 h-6" />
          </button>
        </div>

        {/* Bengali Pronunciation Box (বাংলা উচ্চারণ) */}
        {vocab.banglaPronunciation && (
          <div className="mt-3.5 p-3 rounded-2xl bg-violet-50 border border-violet-200 text-violet-950 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-semibold text-violet-700 uppercase tracking-wider block">
                বাংলা উচ্চারণ (Pronunciation in Bangla)
              </span>
              <span className="font-bengali text-lg font-bold text-violet-900 mt-0.5 block">
                {vocab.banglaPronunciation}
              </span>
            </div>
            <button
              onClick={playPronunciation}
              className="text-xs font-semibold text-violet-700 hover:underline flex items-center gap-1 active:scale-95"
            >
              <Volume2 className="w-4 h-4" />
              শুনুন
            </button>
          </div>
        )}

        {/* Bengali Meaning Highlight Box (বাংলা অর্থ) */}
        <div className="mt-3.5 p-4 rounded-2xl bg-indigo-50/80 border border-indigo-200 text-indigo-950">
          <div className="text-xs font-semibold uppercase tracking-wider text-indigo-800 mb-1 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" />
            বাংলা অর্থ (Meaning)
          </div>
          <div className="font-bengali text-xl font-bold text-slate-900 leading-snug">
            {vocab.bengaliMeaning}
          </div>
        </div>

        {/* English Definition */}
        {vocab.englishDefinition && (
          <div className="mt-3.5">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-0.5">
              English Definition
            </div>
            <p className="text-xs leading-relaxed text-slate-700 font-medium">
              {vocab.englishDefinition}
            </p>
          </div>
        )}

        {/* Example Context Sentence */}
        {(vocab.exampleSentenceEn || vocab.exampleSentenceBn) && (
          <div className="mt-3.5 p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              ব্যবহার ও উদাহরণ (Example Sentence)
            </div>
            {vocab.exampleSentenceEn && (
              <p className="font-semibold text-slate-900 italic text-sm">
                &ldquo;{vocab.exampleSentenceEn}&rdquo;
              </p>
            )}
            {vocab.exampleSentenceBn && (
              <p className="font-bengali text-slate-700 mt-1 font-medium text-[13px]">
                {vocab.exampleSentenceBn}
              </p>
            )}
          </div>
        )}

        {/* Bottom Navigation for multiple vocabs */}
        {vocabList.length > 1 && onSelectVocab && (
          <div className="mt-5 pt-3 flex items-center justify-between border-t border-slate-100">
            <button
              onClick={() => hasPrev && onSelectVocab(vocabList[currentIndex - 1])}
              disabled={!hasPrev}
              className={`min-h-[44px] px-3 flex items-center gap-1 text-xs font-semibold rounded-xl transition-all ${
                hasPrev
                  ? "hover:bg-slate-100 text-slate-700 active:scale-95"
                  : "opacity-30 text-slate-400 cursor-not-allowed"
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>

            <span className="text-xs font-medium text-slate-500">
              Tap any word to inspect
            </span>

            <button
              onClick={() => hasNext && onSelectVocab(vocabList[currentIndex + 1])}
              disabled={!hasNext}
              className={`min-h-[44px] px-3 flex items-center gap-1 text-xs font-semibold rounded-xl transition-all ${
                hasNext
                  ? "hover:bg-slate-100 text-slate-700 active:scale-95"
                  : "opacity-30 text-slate-400 cursor-not-allowed"
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
