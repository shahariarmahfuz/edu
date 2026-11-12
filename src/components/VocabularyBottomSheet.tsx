"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Volume2,
  Bookmark,
  Check,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  MessageSquareText,
  BookOpen,
} from "lucide-react";
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
  const [copied, setCopied] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Sync tab when popup opens or switches target
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

  const handleCopy = () => {
    if (typeof navigator === "undefined" || !navigator.clipboard) return;
    if (activeTab === "sentence" && sentenceContext) {
      navigator.clipboard.writeText(
        `${sentenceContext.en}\n${sentenceContext.bn}`
      );
    } else if (vocab) {
      navigator.clipboard.writeText(
        `${vocab.word} (${vocab.banglaPronunciation || ""}) - ${vocab.bengaliMeaning}`
      );
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  const showTabSwitcher = Boolean(vocab && sentenceContext);

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Bottom Sheet Container */}
      <div
        className="relative z-10 w-full max-w-md mx-auto rounded-t-3xl bg-white border-t border-slate-200 shadow-2xl p-5 pb-6 transition-all duration-300 animate-slide-up text-slate-900 max-h-[85vh] overflow-y-auto"
        role="dialog"
        aria-modal="true"
      >
        {/* Drag Handle Indicator */}
        <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto mb-3.5" />

        {/* Top Control Bar */}
        <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-100">
          {showTabSwitcher ? (
            /* Fast 1-Tap Switcher between Word & Full Sentence */
            <div className="flex-1 grid grid-cols-2 p-1 rounded-xl bg-slate-100">
              <button
                type="button"
                onClick={() => setActiveTab("word")}
                className={`min-h-[38px] px-2 rounded-lg flex items-center justify-center gap-1.5 text-xs font-bold transition-all ${
                  activeTab === "word"
                    ? "bg-white text-indigo-700 shadow-2xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>শব্দ (Word)</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("sentence")}
                className={`min-h-[38px] px-2 rounded-lg flex items-center justify-center gap-1.5 text-xs font-bold transition-all ${
                  activeTab === "sentence"
                    ? "bg-white text-emerald-700 shadow-2xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <MessageSquareText className="w-3.5 h-3.5" />
                <span>পুরো বাক্য (Sentence)</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              {activeTab === "sentence" ? (
                <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5">
                  <MessageSquareText className="w-3.5 h-3.5" />
                  পুরো বাক্যের অর্থ (Full Sentence)
                </span>
              ) : (
                vocab?.partOfSpeech && (
                  <span className="px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                    {vocab.partOfSpeech}
                  </span>
                )
              )}
            </div>
          )}

          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={handleCopy}
              className="min-w-[40px] min-h-[40px] flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-600 active:scale-95 transition-transform"
              title="Copy"
              aria-label="Copy"
            >
              {copied ? (
                <Check className="w-4 h-4 text-emerald-600" />
              ) : (
                <Bookmark className="w-4 h-4" />
              )}
            </button>

            <button
              onClick={onClose}
              className="min-w-[40px] min-h-[40px] flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-700 active:scale-95 transition-transform"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* TAB 1: FULL SENTENCE VIEW */}
        {activeTab === "sentence" && sentenceContext ? (
          <div className="mt-4 space-y-3.5">
            {/* English Sentence + Audio */}
            <div className="flex items-start justify-between gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <p className="font-english text-[17px] font-semibold text-slate-900 leading-relaxed flex-1">
                {sentenceContext.en}
              </p>
              <button
                onClick={() => playAudio(sentenceContext.en, 0.88)}
                className={`min-w-[44px] min-h-[44px] shrink-0 rounded-2xl flex items-center justify-center shadow-xs transition-all active:scale-95 ${
                  isPlayingAudio
                    ? "bg-indigo-700 text-white animate-pulse"
                    : "bg-indigo-600 text-white hover:bg-indigo-700"
                }`}
                aria-label="Listen to full sentence"
              >
                <Volume2 className="w-5 h-5" />
              </button>
            </div>

            {/* Sentence Bangla Pronunciation */}
            {sentenceContext.bnPronounce && (
              <div className="p-3.5 rounded-2xl bg-violet-50 border border-violet-200">
                <div className="text-[11px] font-bold uppercase tracking-wider text-violet-700 mb-1">
                  পুরো বাক্যের বাংলা উচ্চারণ
                </div>
                <p className="font-bengali text-[15px] font-semibold text-violet-950 leading-relaxed">
                  {sentenceContext.bnPronounce}
                </p>
              </div>
            )}

            {/* Sentence Bengali Translation */}
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
              <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 mb-1 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                পুরো বাক্যের বাংলা অর্থ (Sentence Meaning)
              </div>
              <p className="font-bengali text-lg font-bold text-slate-900 leading-relaxed">
                {sentenceContext.bn}
              </p>
            </div>

            {vocab && (
              <button
                type="button"
                onClick={() => setActiveTab("word")}
                className="w-full min-h-[42px] rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center gap-1.5 transition-all active:scale-98"
              >
                <ChevronLeft className="w-4 h-4" />
                &ldquo;{vocab.cleanWord || vocab.word}&rdquo; শব্দের অর্থে ফিরে যান
              </button>
            )}
          </div>
        ) : (
          /* TAB 2: WORD VIEW */
          vocab && (
            <>
              <div className="mt-4 flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900 capitalize">
                      {vocab.cleanWord || vocab.word}
                    </h2>
                    {showTabSwitcher && vocab.partOfSpeech && (
                      <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                        {vocab.partOfSpeech}
                      </span>
                    )}
                  </div>
                  {vocab.phonetic && (
                    <p className="text-xs font-mono text-slate-500 mt-0.5">
                      {vocab.phonetic}
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

              {/* Bengali Pronunciation Box */}
              {vocab.banglaPronunciation && (
                <div className="mt-3.5 p-3 rounded-2xl bg-violet-50 border border-violet-200 text-violet-950 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-semibold text-violet-700 uppercase tracking-wider block">
                      বাংলা উচ্চারণ (Pronunciation)
                    </span>
                    <span className="font-bengali text-lg font-bold text-violet-900 mt-0.5 block">
                      {vocab.banglaPronunciation}
                    </span>
                  </div>
                  <button
                    onClick={() =>
                      playAudio(
                        vocab.cleanWord || vocab.word.replace(/[^a-zA-Z]/g, ""),
                        0.85
                      )
                    }
                    className="text-xs font-semibold text-violet-700 hover:underline flex items-center gap-1 active:scale-95"
                  >
                    <Volume2 className="w-4 h-4" />
                    শুনুন
                  </button>
                </div>
              )}

              {/* Bengali Meaning Highlight Box */}
              <div className="mt-3.5 p-4 rounded-2xl bg-indigo-50/80 border border-indigo-200 text-indigo-950">
                <div className="text-xs font-semibold uppercase tracking-wider text-indigo-800 mb-1 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  বাংলা অর্থ (Meaning)
                </div>
                <div className="font-bengali text-xl font-bold text-slate-900 leading-snug">
                  {vocab.bengaliMeaning}
                </div>
              </div>

              {/* Quick 1-Tap Full Sentence Context Card */}
              {sentenceContext && (
                <button
                  type="button"
                  onClick={() => setActiveTab("sentence")}
                  className="mt-3.5 w-full text-left p-3.5 rounded-2xl bg-emerald-50/80 hover:bg-emerald-100/70 border border-emerald-200 transition-all active:scale-[0.99] flex items-center justify-between gap-3"
                >
                  <div className="min-w-0 flex-1">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1">
                      <MessageSquareText className="w-3.5 h-3.5" />
                      পুরো বাক্যের অর্থ দেখুন (Full Sentence)
                    </div>
                    <p className="font-bengali text-xs font-semibold text-slate-800 mt-0.5 line-clamp-1">
                      {sentenceContext.bn}
                    </p>
                  </div>
                  <span className="text-xs font-bold text-emerald-700 shrink-0 flex items-center gap-0.5">
                    দেখুন
                    <ChevronRight className="w-4 h-4" />
                  </span>
                </button>
              )}

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
                    ব্যবহার ও উদাহরণ (Example)
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
                    onClick={() =>
                      hasPrev && onSelectVocab(vocabList[currentIndex - 1])
                    }
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
                    {currentIndex >= 0
                      ? `${currentIndex + 1} / ${vocabList.length}`
                      : "Word Lookup"}
                  </span>

                  <button
                    onClick={() =>
                      hasNext && onSelectVocab(vocabList[currentIndex + 1])
                    }
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
            </>
          )
        )}
      </div>
    </div>
  );
}
