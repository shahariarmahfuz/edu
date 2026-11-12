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
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#202124]/35 backdrop-blur-[1px] transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Clean Google-Style Bottom Sheet */}
      <div
        className="relative z-10 w-full max-w-lg mx-auto rounded-t-3xl bg-white border-t border-[#e8eaed] shadow-2xl px-6 pt-3 pb-7 animate-slide-up text-[#202124] max-h-[85vh] overflow-y-auto"
        role="dialog"
        aria-modal="true"
      >
        <div className="w-10 h-1 bg-[#dadce0] rounded-full mx-auto mb-4" />

        {/* Header Row */}
        <div className="flex items-center justify-between gap-3 pb-3.5 border-b border-[#e8eaed]">
          {showTabSwitcher ? (
            <div className="flex-1 grid grid-cols-2 p-1 rounded-xl bg-[#f1f3f4]">
              <button
                type="button"
                onClick={() => setActiveTab("word")}
                className={`min-h-[36px] rounded-lg text-xs font-medium font-bengali transition-all ${
                  activeTab === "word"
                    ? "bg-white text-[#202124] shadow-2xs"
                    : "text-[#5f6368] hover:text-[#202124]"
                }`}
              >
                শব্দের অর্থ
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("sentence")}
                className={`min-h-[36px] rounded-lg text-xs font-medium font-bengali transition-all ${
                  activeTab === "sentence"
                    ? "bg-white text-[#202124] shadow-2xs"
                    : "text-[#5f6368] hover:text-[#202124]"
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
            className="min-w-[40px] min-h-[40px] flex items-center justify-center rounded-full hover:bg-[#f1f3f4] text-[#5f6368] active:scale-95 transition-transform"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* FULL SENTENCE VIEW */}
        {activeTab === "sentence" && sentenceContext ? (
          <div className="mt-5 space-y-4">
            <div className="flex items-start justify-between gap-3">
              <p className="font-english text-[17.5px] font-normal text-[#202124] leading-[1.65] flex-1">
                {sentenceContext.en}
              </p>
              <button
                onClick={() => playAudio(sentenceContext.en, 0.88)}
                className={`min-w-[42px] min-h-[42px] shrink-0 rounded-full flex items-center justify-center transition-colors active:scale-95 ${
                  isPlayingAudio
                    ? "bg-[#1a73e8] text-white"
                    : "bg-[#f1f3f4] text-[#3c4043] hover:bg-[#e8eaed]"
                }`}
                aria-label="Listen to sentence"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>

            {sentenceContext.bnPronounce && (
              <div className="pt-3.5 border-t border-[#e8eaed]">
                <div className="text-[11px] font-medium text-[#5f6368] mb-1 font-bengali">
                  বাংলা উচ্চারণ
                </div>
                <p className="font-bengali text-[15px] text-[#3c4043] leading-[1.7]">
                  {sentenceContext.bnPronounce}
                </p>
              </div>
            )}

            <div className="pt-3.5 border-t border-[#e8eaed]">
              <div className="text-[11px] font-medium text-[#5f6368] mb-1 font-bengali">
                বাংলা অর্থ
              </div>
              <p className="font-bengali text-[17.5px] font-medium text-[#202124] leading-[1.7]">
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
                  <div className="flex items-baseline gap-2.5">
                    <h2 className="text-[26px] font-normal text-[#202124] capitalize leading-tight">
                      {vocab.cleanWord || vocab.word}
                    </h2>
                    {vocab.partOfSpeech && (
                      <span className="text-xs text-[#5f6368] font-medium">
                        {vocab.partOfSpeech}
                      </span>
                    )}
                  </div>
                  {(vocab.phonetic || vocab.banglaPronunciation) && (
                    <p className="text-sm text-[#5f6368] mt-1.5 flex items-center gap-2">
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
                  className={`min-w-[44px] min-h-[44px] rounded-full flex items-center justify-center transition-colors active:scale-95 ${
                    isPlayingAudio
                      ? "bg-[#1a73e8] text-white"
                      : "bg-[#f1f3f4] text-[#3c4043] hover:bg-[#e8eaed]"
                  }`}
                  aria-label="Listen pronunciation"
                >
                  <Volume2 className="w-5 h-5" />
                </button>
              </div>

              {/* Word Meaning */}
              <div className="pt-3.5 border-t border-[#e8eaed]">
                <div className="text-[11px] font-medium text-[#5f6368] mb-1 font-bengali">
                  শব্দের বাংলা অর্থ
                </div>
                <div className="font-bengali text-[20px] font-medium text-[#202124] leading-snug">
                  {vocab.bengaliMeaning}
                </div>
                {vocab.englishDefinition && (
                  <p className="text-[13.5px] text-[#5f6368] mt-1.5 leading-relaxed">
                    {vocab.englishDefinition}
                  </p>
                )}
              </div>

              {/* Instant Full-Sentence Meaning & Pronunciation Preview */}
              {sentenceContext && (
                <div className="p-3.5 rounded-2xl bg-[#f8f9fa] border border-[#e8eaed] space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-medium text-[#5f6368] font-bengali">
                      পুরো বাক্যের উচ্চারণ ও অর্থ
                    </span>
                    <button
                      type="button"
                      onClick={() => setActiveTab("sentence")}
                      className="inline-flex items-center gap-0.5 text-[11.5px] font-medium text-[#1a73e8] hover:underline font-bengali cursor-pointer"
                    >
                      বিস্তারিত ও অডিও
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  {sentenceContext.bnPronounce && (
                    <p className="font-bengali text-[13px] text-[#5f6368] leading-[1.6]">
                      {sentenceContext.bnPronounce}
                    </p>
                  )}
                  <p className="font-bengali text-[14.5px] text-[#202124] leading-[1.65]">
                    {sentenceContext.bn}
                  </p>
                </div>
              )}

              {/* Example Sentence */}
              {(vocab.exampleSentenceEn || vocab.exampleSentenceBn) && (
                <div className="pt-3.5 border-t border-[#e8eaed] text-[13px]">
                  <div className="text-[11px] font-medium text-[#5f6368] mb-1">
                    Example
                  </div>
                  {vocab.exampleSentenceEn && (
                    <p className="text-[#3c4043] leading-relaxed">
                      &ldquo;{vocab.exampleSentenceEn}&rdquo;
                    </p>
                  )}
                  {vocab.exampleSentenceBn && (
                    <p className="font-bengali text-[#5f6368] mt-1 leading-relaxed">
                      {vocab.exampleSentenceBn}
                    </p>
                  )}
                </div>
              )}

              {/* Prev / Next Word Controls */}
              {vocabList.length > 1 && onSelectVocab && (
                <div className="pt-3 border-t border-[#e8eaed] flex items-center justify-between">
                  <button
                    onClick={() =>
                      hasPrev && onSelectVocab(vocabList[currentIndex - 1])
                    }
                    disabled={!hasPrev}
                    className={`min-h-[40px] px-2 flex items-center gap-1 text-xs font-medium ${
                      hasPrev
                        ? "text-[#1a73e8] hover:text-[#174ea6]"
                        : "opacity-30 text-[#5f6368]"
                    }`}
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Prev
                  </button>

                  <span className="text-[11px] text-[#5f6368]">
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
                        ? "text-[#1a73e8] hover:text-[#174ea6]"
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
