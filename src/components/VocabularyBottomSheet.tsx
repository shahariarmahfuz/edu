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

  const playAudio = (textToSpeak: string, rate = 0.86) => {
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
      {/* Lightweight solid scrim (no costly backdrop-blur pass on mobile) */}
      <div
        className="fixed inset-0 bg-[#202124]/40"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Compact, Snappy Bottom Sheet */}
      <div
        className="relative z-10 w-full max-w-lg mx-auto rounded-t-3xl bg-white border-t border-[#e8eaed] shadow-[0_-4px_24px_rgba(0,0,0,0.08)] px-5 pt-2.5 pb-6 animate-slide-up text-[#202124] max-h-[75vh] overflow-y-auto"
        role="dialog"
        aria-modal="true"
      >
        <div className="w-9 h-1 bg-[#dadce0] rounded-full mx-auto mb-3" />

        {/* Header Row */}
        <div className="flex items-center justify-between gap-2.5 pb-3 border-b border-[#e8eaed]">
          {showTabSwitcher ? (
            <div className="flex-1 grid grid-cols-2 p-0.5 rounded-xl bg-[#f1f3f4]">
              <button
                type="button"
                onClick={() => setActiveTab("word")}
                className={`min-h-[34px] rounded-[10px] text-xs font-medium font-bengali ${
                  activeTab === "word"
                    ? "bg-white text-[#202124] shadow-2xs"
                    : "text-[#5f6368]"
                }`}
              >
                শব্দের অর্থ
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("sentence")}
                className={`min-h-[34px] rounded-[10px] text-xs font-medium font-bengali ${
                  activeTab === "sentence"
                    ? "bg-white text-[#202124] shadow-2xs"
                    : "text-[#5f6368]"
                }`}
              >
                পুরো বাক্য
              </button>
            </div>
          ) : (
            <span className="text-xs font-medium text-[#5f6368] uppercase tracking-wider">
              {activeTab === "sentence"
                ? "Sentence Meaning"
                : vocab?.partOfSpeech || "Word Meaning"}
            </span>
          )}

          <button
            onClick={onClose}
            className="min-w-[38px] min-h-[38px] flex items-center justify-center rounded-full hover:bg-[#f1f3f4] text-[#5f6368] active:scale-95"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* FULL SENTENCE VIEW */}
        {activeTab === "sentence" && sentenceContext ? (
          <div className="mt-4 space-y-3.5">
            <div className="flex items-start justify-between gap-3">
              <p className="font-english text-[17px] font-normal text-[#202124] leading-[1.65] flex-1">
                {sentenceContext.en}
              </p>
              <button
                onClick={() => playAudio(sentenceContext.en, 0.88)}
                className={`min-w-[40px] min-h-[40px] shrink-0 rounded-full flex items-center justify-center active:scale-95 ${
                  isPlayingAudio
                    ? "bg-[#1a73e8] text-white"
                    : "bg-[#f1f3f4] text-[#3c4043]"
                }`}
                aria-label="Listen to sentence"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>

            {sentenceContext.bnPronounce && (
              <p className="font-bengali text-[14.5px] text-[#5f6368] leading-[1.68] pt-3 border-t border-[#e8eaed]">
                {sentenceContext.bnPronounce}
              </p>
            )}

            <p className="font-bengali text-[17px] font-medium text-[#202124] leading-[1.7] pt-3 border-t border-[#e8eaed]">
              {sentenceContext.bn}
            </p>
          </div>
        ) : (
          /* WORD VIEW */
          vocab && (
            <div className="mt-4 space-y-3.5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <h2 className="text-[23px] font-normal text-[#202124] capitalize leading-tight">
                      {vocab.cleanWord || vocab.word}
                    </h2>
                    {vocab.partOfSpeech && (
                      <span className="text-xs text-[#5f6368]">
                        {vocab.partOfSpeech}
                      </span>
                    )}
                  </div>
                  {(vocab.phonetic || vocab.banglaPronunciation) && (
                    <p className="text-[13.5px] text-[#5f6368] mt-1 flex items-center gap-2">
                      {vocab.banglaPronunciation && (
                        <span className="font-bengali font-medium text-[#3c4043]">
                          {vocab.banglaPronunciation}
                        </span>
                      )}
                      {vocab.phonetic && (
                        <span className="font-mono text-xs text-[#5f6368]">
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
                  className={`min-w-[42px] min-h-[42px] shrink-0 rounded-full flex items-center justify-center active:scale-95 ${
                    isPlayingAudio
                      ? "bg-[#1a73e8] text-white"
                      : "bg-[#f1f3f4] text-[#3c4043]"
                  }`}
                  aria-label="Listen pronunciation"
                >
                  <Volume2 className="w-[18px] h-[18px]" />
                </button>
              </div>

              {/* Word Meaning */}
              <div className="pt-3 border-t border-[#e8eaed]">
                <div className="font-bengali text-[19px] font-medium text-[#202124] leading-snug">
                  {vocab.bengaliMeaning}
                </div>
                {vocab.englishDefinition && (
                  <p className="text-[13px] text-[#5f6368] mt-1 leading-relaxed">
                    {vocab.englishDefinition}
                  </p>
                )}
              </div>

              {/* Compact 1-tap Sentence Link */}
              {sentenceContext && (
                <button
                  type="button"
                  onClick={() => setActiveTab("sentence")}
                  className="w-full p-3 rounded-xl bg-[#f8f9fa] border border-[#e8eaed] text-left active:opacity-80"
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-[11px] font-medium text-[#5f6368] font-bengali">
                      বাক্যের অর্থ
                    </span>
                    <span className="inline-flex items-center gap-0.5 text-[11.5px] font-medium text-[#1a73e8] font-bengali">
                      উচ্চারণ ও অডিও
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                  <p className="font-bengali text-[14px] text-[#202124] leading-[1.6]">
                    {sentenceContext.bn}
                  </p>
                </button>
              )}

              {/* Prev / Next Controls (Only when browsing passage glossary words) */}
              {currentIndex >= 0 && vocabList.length > 1 && onSelectVocab && (
                <div className="pt-2.5 border-t border-[#e8eaed] flex items-center justify-between">
                  <button
                    onClick={() =>
                      hasPrev && onSelectVocab(vocabList[currentIndex - 1])
                    }
                    disabled={!hasPrev}
                    className={`min-h-[38px] px-2 flex items-center gap-1 text-xs font-medium ${
                      hasPrev
                        ? "text-[#1a73e8]"
                        : "opacity-30 text-[#5f6368]"
                    }`}
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Prev
                  </button>

                  <span className="text-[11px] text-[#5f6368]">
                    {currentIndex + 1} / {vocabList.length}
                  </span>

                  <button
                    onClick={() =>
                      hasNext && onSelectVocab(vocabList[currentIndex + 1])
                    }
                    disabled={!hasNext}
                    className={`min-h-[38px] px-2 flex items-center gap-1 text-xs font-medium ${
                      hasNext
                        ? "text-[#1a73e8]"
                        : "opacity-30 text-[#5f6368]"
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
