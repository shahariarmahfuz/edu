"use client";

import React, { useState, useEffect } from "react";
import { X, Volume2, ChevronRight, ChevronLeft } from "lucide-react";
import { VocabularyItem, SentenceItem } from "@/types/reading";

interface VocabularyBottomSheetProps {
  vocab: VocabularyItem | null;
  sentenceContext?: SentenceItem | null;
  initialTab?: "word" | "sentence";
  vocabList?: VocabularyItem[];
  onClose: () => void;
  onSelectVocab?: (vocab: VocabularyItem) => void;
}

export default function VocabularyBottomSheet({
  vocab,
  sentenceContext = null,
  initialTab = "word",
  vocabList = [],
  onClose,
  onSelectVocab,
}: VocabularyBottomSheetProps) {
  const [activeTab, setActiveTab] = useState<"word" | "sentence">(initialTab);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  useEffect(() => {
    if (!vocab && sentenceContext) {
      setActiveTab("sentence");
    } else {
      setActiveTab(initialTab);
    }
  }, [vocab, sentenceContext, initialTab]);

  if (!vocab && !sentenceContext) return null;

  const currentIndex = vocab
    ? vocabList.findIndex(
        (v) =>
          v.id === vocab.id ||
          (v.cleanWord &&
            vocab.cleanWord &&
            v.cleanWord.toLowerCase() === vocab.cleanWord.toLowerCase()) ||
          v.word.toLowerCase() === vocab.word.toLowerCase()
      )
    : -1;
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex >= 0 && currentIndex < vocabList.length - 1;

  const playAudio = (textToSpeak: string, rate = 0.85) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = "en-US";
      utterance.rate = rate;
      setIsPlayingAudio(true);
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const showTabSwitcher = Boolean(vocab && sentenceContext);

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Clean Minimal Bottom Sheet */}
      <div
        className="relative z-10 w-full max-w-md mx-auto rounded-t-3xl bg-white border-t border-slate-100 shadow-2xl px-6 pt-3 pb-7 animate-slide-up text-slate-900 max-h-[85vh] overflow-y-auto"
        role="dialog"
        aria-modal="true"
      >
        <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto mb-4" />

        {/* Header Row */}
        <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-100">
          {showTabSwitcher ? (
            <div className="flex-1 grid grid-cols-2 p-1 rounded-xl bg-slate-100">
              <button
                type="button"
                onClick={() => setActiveTab("word")}
                className={`min-h-[36px] rounded-lg text-xs font-semibold font-bengali transition-all ${
                  activeTab === "word"
                    ? "bg-white text-slate-900 shadow-2xs"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                শব্দ (Word)
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("sentence")}
                className={`min-h-[36px] rounded-lg text-xs font-semibold font-bengali transition-all ${
                  activeTab === "sentence"
                    ? "bg-white text-slate-900 shadow-2xs"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                পুরো বাক্য (Sentence)
              </button>
            </div>
          ) : (
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              {activeTab === "sentence" ? "Sentence Meaning" : vocab?.partOfSpeech || "Word"}
            </span>
          )}

          <button
            onClick={onClose}
            className="min-w-[40px] min-h-[40px] flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-500 active:scale-95 transition-transform"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* FULL SENTENCE VIEW */}
        {activeTab === "sentence" && sentenceContext ? (
          <div className="mt-5 space-y-4">
            <div className="flex items-start justify-between gap-3">
              <p className="font-english text-[17px] font-medium text-slate-900 leading-relaxed flex-1">
                {sentenceContext.en}
              </p>
              <button
                onClick={() => playAudio(sentenceContext.en, 0.88)}
                className={`min-w-[42px] min-h-[42px] shrink-0 rounded-full flex items-center justify-center transition-colors active:scale-95 ${
                  isPlayingAudio
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
                aria-label="Listen to sentence"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>

            {sentenceContext.bnPronounce && (
              <div className="pt-3 border-t border-slate-100">
                <div className="text-[11px] font-medium text-slate-400 mb-1 font-bengali">
                  বাংলা উচ্চারণ
                </div>
                <p className="font-bengali text-[15px] text-slate-600 leading-relaxed">
                  {sentenceContext.bnPronounce}
                </p>
              </div>
            )}

            <div className="pt-3 border-t border-slate-100">
              <div className="text-[11px] font-medium text-slate-400 mb-1 font-bengali">
                বাংলা অর্থ
              </div>
              <p className="font-bengali text-[17px] font-semibold text-slate-900 leading-relaxed">
                {sentenceContext.bn}
              </p>
            </div>
          </div>
        ) : (
          /* WORD VIEW */
          vocab && (
            <div className="mt-5 space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-baseline gap-2">
                    <h2 className="text-2xl font-bold text-slate-900 capitalize">
                      {vocab.cleanWord || vocab.word}
                    </h2>
                    {vocab.partOfSpeech && (
                      <span className="text-xs text-slate-400 font-medium">
                        {vocab.partOfSpeech}
                      </span>
                    )}
                  </div>
                  {(vocab.phonetic || vocab.banglaPronunciation) && (
                    <p className="text-sm text-slate-500 mt-1 flex items-center gap-2">
                      {vocab.banglaPronunciation && (
                        <span className="font-bengali font-medium text-slate-700">
                          {vocab.banglaPronunciation}
                        </span>
                      )}
                      {vocab.phonetic && (
                        <span className="font-mono text-xs text-slate-400">
                          {vocab.phonetic}
                        </span>
                      )}
                    </p>
                  )}
                </div>

                <button
                  onClick={() =>
                    playAudio(
                      vocab.cleanWord || vocab.word.replace(/[^a-zA-Z]/g, ""),
                      0.85
                    )
                  }
                  className={`min-w-[44px] min-h-[44px] rounded-full flex items-center justify-center transition-colors active:scale-95 ${
                    isPlayingAudio
                      ? "bg-slate-900 text-white"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                  aria-label="Listen pronunciation"
                >
                  <Volume2 className="w-5 h-5" />
                </button>
              </div>

              {/* Meaning */}
              <div className="pt-3 border-t border-slate-100">
                <div className="text-[11px] font-medium text-slate-400 mb-1 font-bengali">
                  বাংলা অর্থ
                </div>
                <div className="font-bengali text-xl font-semibold text-slate-900">
                  {vocab.bengaliMeaning}
                </div>
                {vocab.englishDefinition && (
                  <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                    {vocab.englishDefinition}
                  </p>
                )}
              </div>

              {/* Clean 1-Tap Full Sentence Link */}
              {sentenceContext && (
                <button
                  type="button"
                  onClick={() => setActiveTab("sentence")}
                  className="w-full py-3 px-4 rounded-2xl bg-slate-50 hover:bg-slate-100 text-left flex items-center justify-between gap-3 transition-colors active:scale-[0.99]"
                >
                  <div className="min-w-0">
                    <div className="text-[11px] font-semibold text-indigo-600 font-bengali">
                      পুরো বাক্যটির অর্থ দেখুন
                    </div>
                    <p className="font-bengali text-xs text-slate-600 truncate mt-0.5">
                      {sentenceContext.bn}
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                </button>
              )}

              {/* Example Sentence */}
              {(vocab.exampleSentenceEn || vocab.exampleSentenceBn) && (
                <div className="pt-3 border-t border-slate-100 text-xs">
                  <div className="text-[11px] font-medium text-slate-400 mb-1">
                    Example
                  </div>
                  {vocab.exampleSentenceEn && (
                    <p className="text-slate-700 italic">
                      &ldquo;{vocab.exampleSentenceEn}&rdquo;
                    </p>
                  )}
                  {vocab.exampleSentenceBn && (
                    <p className="font-bengali text-slate-500 mt-1">
                      {vocab.exampleSentenceBn}
                    </p>
                  )}
                </div>
              )}

              {/* Prev / Next Word Controls */}
              {vocabList.length > 1 && onSelectVocab && (
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() =>
                      hasPrev && onSelectVocab(vocabList[currentIndex - 1])
                    }
                    disabled={!hasPrev}
                    className={`min-h-[40px] px-2 flex items-center gap-1 text-xs font-medium ${
                      hasPrev
                        ? "text-slate-700 hover:text-slate-900"
                        : "opacity-30 text-slate-400"
                    }`}
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Prev
                  </button>

                  <span className="text-[11px] text-slate-400">
                    {currentIndex >= 0
                      ? `${currentIndex + 1} / ${vocabList.length}`
                      : ""}
                  </span>

                  <button
                    onClick={() =>
                      hasNext && onSelectVocab(vocabList[currentIndex + 1])
                    }
                    disabled={!hasNext}
                    className={`min-h-[40px] px-2 flex items-center gap-1 text-xs font-medium ${
                      hasNext
                        ? "text-slate-700 hover:text-slate-900"
                        : "opacity-30 text-slate-400"
                    }`}
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          )
        )}
      </div>
    </div>
  );
}
