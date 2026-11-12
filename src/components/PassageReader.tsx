"use client";

import React, { useState, useEffect } from "react";
import {
  PassageItem,
  VocabularyItem,
  PassageSectionItem,
  SentenceItem,
  FontSize,
  ReadingMode,
} from "@/types/reading";
import ReaderHeader from "./ReaderHeader";
import VocabularyBottomSheet from "./VocabularyBottomSheet";
import { lookupWord, sanitizeWord } from "@/lib/dictionary";
import { extractSentencesFromSection } from "@/lib/sentenceSplitter";
import {
  Sparkles,
  BookMarked,
  Languages,
  CheckCircle2,
  Volume2,
  ChevronDown,
  MessageSquareText,
} from "lucide-react";

interface PassageReaderProps {
  passage: PassageItem;
}

export default function PassageReader({ passage }: PassageReaderProps) {
  const [fontSize, setFontSize] = useState<FontSize>("md");
  const [readingMode, setReadingMode] = useState<ReadingMode>("tap-to-reveal");
  const [showBanglaPronunciation, setShowBanglaPronunciation] =
    useState<boolean>(true);

  const [revealedSectionIds, setRevealedSectionIds] = useState<Set<string>>(
    new Set()
  );

  // Bottom sheet state: active word + active sentence context + initial tab
  const [activeVocab, setActiveVocab] = useState<VocabularyItem | null>(null);
  const [activeSentence, setActiveSentence] = useState<SentenceItem | null>(
    null
  );
  const [sheetInitialTab, setSheetInitialTab] = useState<"word" | "sentence">(
    "word"
  );

  const [showGlossaryDrawer, setShowGlossaryDrawer] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedFontSize = localStorage.getItem(
        "bhasha_fontsize"
      ) as FontSize | null;
      const savedMode = localStorage.getItem(
        "bhasha_mode"
      ) as ReadingMode | null;
      const savedPronounce = localStorage.getItem("bhasha_show_pronounce");

      if (savedFontSize) setFontSize(savedFontSize);
      if (savedMode) setReadingMode(savedMode);
      if (savedPronounce !== null)
        setShowBanglaPronunciation(savedPronounce === "true");
    }
  }, []);

  const handleFontSizeChange = (newSize: FontSize) => {
    setFontSize(newSize);
    if (typeof window !== "undefined") {
      localStorage.setItem("bhasha_fontsize", newSize);
    }
  };

  const handleReadingModeChange = (newMode: ReadingMode) => {
    setReadingMode(newMode);
    if (typeof window !== "undefined") {
      localStorage.setItem("bhasha_mode", newMode);
    }
  };

  const handleToggleBanglaPronunciation = () => {
    setShowBanglaPronunciation((prev) => {
      const next = !prev;
      if (typeof window !== "undefined") {
        localStorage.setItem("bhasha_show_pronounce", String(next));
      }
      return next;
    });
  };

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = Math.min(
          100,
          Math.max(0, Math.round((window.scrollY / totalHeight) * 100))
        );
        setScrollProgress(progress);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleSectionReveal = (sectionId: string) => {
    if (readingMode !== "tap-to-reveal") return;
    setRevealedSectionIds((prev) => {
      const next = new Set(prev);
      if (next.has(sectionId)) {
        next.delete(sectionId);
      } else {
        next.add(sectionId);
      }
      return next;
    });
  };

  const handleRevealAll = () => {
    if (revealedSectionIds.size === passage.sections.length) {
      setRevealedSectionIds(new Set());
    } else {
      setRevealedSectionIds(new Set(passage.sections.map((s) => s.id)));
    }
  };

  const playSentenceAudio = (sentence: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(sentence);
      utterance.lang = "en-US";
      utterance.rate = 0.88;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Tapping any word opens Word tab WITH its exact sentence context ready in 1 tap
  const handleWordClick = (
    rawWord: string,
    sentenceCtx: SentenceItem,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    const vocabData = lookupWord(rawWord, passage.vocabularies);
    setActiveVocab(vocabData);
    setActiveSentence(sentenceCtx);
    setSheetInitialTab("word");
  };

  // Tapping the inline sentence pill opens the exact sentence's meaning immediately
  const handleSentenceClick = (
    sentenceCtx: SentenceItem,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    setActiveVocab(null);
    setActiveSentence(sentenceCtx);
    setSheetInitialTab("sentence");
  };

  const closeBottomSheet = () => {
    setActiveVocab(null);
    setActiveSentence(null);
  };

  const highlightedWordsSet = new Set(
    (passage.vocabularies || []).map((v) => sanitizeWord(v.word))
  );

  // Render a phrase split into sentences, where every word is clickable AND every sentence has an instant meaning pill
  const renderSectionSentences = (section: PassageSectionItem) => {
    const sentences = extractSentencesFromSection(section);

    return sentences.map((sentenceObj, sIdx) => {
      const tokens = sentenceObj.en.split(/(\s+)/);

      return (
        <span key={sIdx} className="inline">
          {tokens.map((token, tIdx) => {
            if (/^\s+$/.test(token)) {
              return <span key={tIdx}>{token}</span>;
            }

            const clean = sanitizeWord(token);
            if (!clean) {
              return <span key={tIdx}>{token}</span>;
            }

            const isHighlighted = highlightedWordsSet.has(clean);

            return (
              <span
                key={tIdx}
                onClick={(e) => handleWordClick(token, sentenceObj, e)}
                className={`clickable-word ${
                  isHighlighted
                    ? "is-highlighted px-1.5 py-0.5 rounded-md shadow-2xs font-semibold"
                    : "hover:bg-indigo-100/70"
                }`}
                title={`Tap "${clean}" for meaning`}
              >
                {token}
                {isHighlighted && (
                  <span className="text-[10px] ml-0.5 opacity-80">✦</span>
                )}
              </span>
            );
          })}

          {/* Instant 1-tap Sentence Meaning Pill */}
          <button
            type="button"
            onClick={(e) => handleSentenceClick(sentenceObj, e)}
            className="inline-flex items-center gap-0.5 px-1.5 py-0.5 ml-1 mr-1.5 align-middle rounded-md bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-[11px] font-bengali font-bold leading-none active:scale-95 transition-transform cursor-pointer"
            title="এই বাক্যটির পুরো বাংলা অর্থ দেখুন"
            aria-label="See full sentence meaning"
          >
            <MessageSquareText className="w-3 h-3" />
            <span>অর্থ</span>
          </button>
        </span>
      );
    });
  };

  const fontSizeStyle = {
    sm: "text-[16px] leading-[1.75]",
    md: "text-[18px] leading-[1.8]",
    lg: "text-[20px] leading-[1.85]",
    xl: "text-[22px] leading-[1.9]",
  }[fontSize];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-28 tap-highlight-transparent font-sans">
      {/* Sticky Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-slate-200">
        <div
          className="h-full bg-indigo-600 transition-all duration-150"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Reader Navigation Header */}
      <ReaderHeader
        titleEn={passage.titleEn}
        difficulty={passage.difficulty}
        readingTimeMinutes={passage.readingTimeMinutes}
        fontSize={fontSize}
        readingMode={readingMode}
        showBanglaPronunciation={showBanglaPronunciation}
        onFontSizeChange={handleFontSizeChange}
        onReadingModeChange={handleReadingModeChange}
        onToggleBanglaPronunciation={handleToggleBanglaPronunciation}
        onOpenGlossary={() => setShowGlossaryDrawer(true)}
        vocabCount={passage.vocabularies?.length || 0}
      />

      {/* Centered Mobile Container */}
      <main className="max-w-md mx-auto px-4 pt-5 pb-12">
        {/* Article Title & Info Header */}
        <div className="mb-6 pb-4 border-b border-slate-200 bg-white p-5 rounded-3xl shadow-xs border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
              {passage.category}
            </span>
            <span className="text-xs font-semibold text-slate-500">
              {passage.readingTimeMinutes} min read
            </span>
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-slate-900 mb-1 leading-snug">
            {passage.titleEn}
          </h1>

          <h2 className="font-bengali text-lg font-bold text-slate-700 leading-normal">
            {passage.titleBn}
          </h2>

          {passage.summaryEn && (
            <p className="mt-2.5 text-xs leading-relaxed text-slate-600 italic">
              {passage.summaryEn}
            </p>
          )}

          {/* Quick Tip Banner */}
          <div className="mt-3.5 pt-3 border-t border-slate-100 text-[11px] text-slate-600 font-bengali leading-relaxed">
            💡 যেকোনো <strong className="text-indigo-700">শব্দে</strong> ট্যাপ
            করলে শব্দের অর্থ, আর বাক্যের শেষে{" "}
            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">
              অর্থ
            </span>{" "}
            চাপলে ওই নির্দিষ্ট বাক্যের পুরো অর্থ পাবেন।
          </div>
        </div>

        {/* Reading Controls Bar */}
        <div className="mb-5 p-3 rounded-2xl bg-white border border-slate-200 shadow-2xs flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-slate-700">
            <Languages className="w-4 h-4 text-indigo-600" />
            <span className="font-semibold text-[11px]">
              {readingMode === "tap-to-reveal"
                ? "কার্ডে ট্যাপ করে পুরো অংশের বাংলা দেখুন"
                : "সমান্তরাল বাংলা অনুবাদ সক্রিয়"}
            </span>
          </div>

          {readingMode === "tap-to-reveal" && (
            <button
              onClick={handleRevealAll}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-700 active:scale-95"
            >
              {revealedSectionIds.size === passage.sections.length
                ? "সব লুকান"
                : "সব দেখুন"}
            </button>
          )}
        </div>

        {/* Main Bilingual Passage Body */}
        <div className="space-y-4">
          {passage.sections && passage.sections.length > 0 ? (
            passage.sections.map((section: PassageSectionItem, index: number) => {
              const isRevealed =
                readingMode === "parallel" || revealedSectionIds.has(section.id);

              return (
                <article
                  key={section.id}
                  onClick={() => toggleSectionReveal(section.id)}
                  className={`relative p-4 rounded-3xl bg-white border border-slate-200 shadow-xs transition-all duration-200 ${
                    readingMode === "tap-to-reveal"
                      ? "cursor-pointer hover:border-indigo-300"
                      : ""
                  }`}
                >
                  {/* Section Number & Audio Button */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold text-slate-400 font-mono">
                      #{index + 1}
                    </span>

                    <button
                      onClick={(e) => playSentenceAudio(section.englishText, e)}
                      className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-500 hover:text-indigo-600 active:scale-95 transition-all"
                      title="Listen to full section"
                      aria-label="Play section"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* LAYER 1: English Sentences with Clickable Words + Instant Sentence Meaning Pills */}
                  <div
                    className={`font-english ${fontSizeStyle} font-medium tracking-normal text-slate-900`}
                  >
                    {renderSectionSentences(section)}
                  </div>

                  {/* LAYER 2: বাংলা উচ্চারণ */}
                  {showBanglaPronunciation && section.banglaPronunciation && (
                    <div className="mt-3 p-3 rounded-2xl bg-violet-50/80 border border-violet-100">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-violet-700 mb-0.5">
                        বাংলা উচ্চারণ
                      </div>
                      <p className="font-bengali text-[15px] font-semibold text-violet-950 leading-relaxed">
                        {section.banglaPronunciation}
                      </p>
                    </div>
                  )}

                  {/* LAYER 3: বাংলা অনুবাদ */}
                  {isRevealed && section.bengaliText && (
                    <div className="mt-3 p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-100 animate-fadeIn">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 mb-0.5">
                        পুরো অংশের বাংলা অনুবাদ
                      </div>
                      <p className="font-bengali text-[16px] font-medium text-slate-900 leading-relaxed">
                        {section.bengaliText}
                      </p>
                    </div>
                  )}

                  {/* Tap prompt if unrevealed */}
                  {readingMode === "tap-to-reveal" && !isRevealed && (
                    <div className="mt-2.5 flex items-center gap-1 text-[11px] font-semibold text-indigo-600/70 select-none">
                      <span>পুরো অংশের অনুবাদ দেখতে স্পর্শ করুন</span>
                      <ChevronDown className="w-3.5 h-3.5" />
                    </div>
                  )}
                </article>
              );
            })
          ) : (
            <div className="p-4 bg-white rounded-3xl border border-slate-200">
              <p className="text-slate-900 font-english">
                {passage.englishContent}
              </p>
            </div>
          )}
        </div>

        {/* Completion Card */}
        <div className="mt-10 p-6 rounded-3xl bg-white border border-slate-200 shadow-sm text-center space-y-3">
          <div className="w-12 h-12 mx-auto rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">
            চমৎকার! আপনি গল্পটি সম্পন্ন করেছেন 🎉
          </h3>
          <p className="text-xs text-slate-600 max-w-xs mx-auto leading-relaxed">
            প্যাসেজটির প্রতিটি শব্দ এবং অর্থ পুনরায় পর্যালোচনা করতে নিচের বোতামে চাপ দিন।
          </p>

          <button
            onClick={() => setShowGlossaryDrawer(true)}
            className="min-h-[44px] px-5 py-2.5 rounded-2xl bg-indigo-600 text-white font-bold text-xs flex items-center justify-center gap-2 mx-auto active:scale-95 shadow-md shadow-indigo-600/20"
          >
            <Sparkles className="w-4 h-4" />
            গুরুত্বপূর্ণ শব্দার্থ দেখুন ({passage.vocabularies?.length || 0})
          </button>
        </div>
      </main>

      {/* Persistent Bottom Floating Action Bar */}
      <div className="fixed bottom-4 left-0 right-0 z-30 pointer-events-none">
        <div className="max-w-md mx-auto px-4 flex items-center justify-between pointer-events-auto">
          <button
            onClick={handleRevealAll}
            className="min-h-[48px] px-4 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200 shadow-lg flex items-center gap-2 text-xs font-bold text-slate-800 active:scale-95 transition-transform"
          >
            <Languages className="w-4 h-4 text-indigo-600" />
            <span>
              {revealedSectionIds.size > 0 ? "অনুবাদ লুকান" : "সব অনুবাদ দেখুন"}
            </span>
          </button>

          {passage.vocabularies && passage.vocabularies.length > 0 && (
            <button
              onClick={() => setShowGlossaryDrawer(true)}
              className="min-h-[48px] px-4 rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 flex items-center gap-2 text-xs font-bold active:scale-95 transition-transform"
            >
              <BookMarked className="w-4 h-4" />
              <span>শব্দকোষ ({passage.vocabularies.length})</span>
            </button>
          )}
        </div>
      </div>

      {/* Interactive Bottom Sheet (Word + Full Sentence Fast Switcher) */}
      <VocabularyBottomSheet
        vocab={activeVocab}
        sentenceContext={activeSentence}
        initialTab={sheetInitialTab}
        vocabList={passage.vocabularies}
        onClose={closeBottomSheet}
        onSelectVocab={(v) => {
          setActiveVocab(v);
          setActiveSentence(null);
          setSheetInitialTab("word");
        }}
      />

      {/* Full Vocabulary Glossary Bottom Drawer */}
      {showGlossaryDrawer && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
            onClick={() => setShowGlossaryDrawer(false)}
          />
          <div className="relative z-10 w-full max-w-md mx-auto max-h-[85vh] flex flex-col rounded-t-3xl bg-white border-t border-slate-200 shadow-2xl p-5 animate-slide-up text-slate-900">
            <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto mb-3" />

            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-lg text-slate-900">
                  প্যাসেজের শব্দকোষ (Vocabulary)
                </h3>
                <p className="text-xs text-slate-500">
                  {passage.vocabularies?.length || 0} টি গুরুত্বপূর্ণ শব্দার্থ
                </p>
              </div>
              <button
                onClick={() => setShowGlossaryDrawer(false)}
                className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-700"
              >
                ✕
              </button>
            </div>

            <div className="overflow-y-auto flex-1 mt-3 space-y-2.5 pr-1">
              {passage.vocabularies?.map((v) => (
                <div
                  key={v.id}
                  onClick={() => {
                    setShowGlossaryDrawer(false);
                    setActiveVocab(v);
                    setActiveSentence(null);
                    setSheetInitialTab("word");
                  }}
                  className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3 cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/30 transition-all active:scale-[0.99]"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-base text-slate-900 capitalize truncate">
                        {v.word}
                      </span>
                      {v.banglaPronunciation && (
                        <span className="font-bengali text-xs font-semibold text-violet-700">
                          ({v.banglaPronunciation})
                        </span>
                      )}
                      {v.partOfSpeech && (
                        <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-indigo-100 text-indigo-700 font-semibold">
                          {v.partOfSpeech}
                        </span>
                      )}
                    </div>
                    <div className="font-bengali text-sm font-bold text-slate-800 mt-0.5">
                      {v.bengaliMeaning}
                    </div>
                  </div>

                  <div className="text-xs font-bold text-indigo-600 flex items-center gap-1">
                    বিস্তারিত →
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
