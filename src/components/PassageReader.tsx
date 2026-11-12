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
import { Languages, Volume2 } from "lucide-react";

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

  // Bottom sheet state
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

  // Clean editorial rendering: natural text where every word is tappable
  // and each sentence ends with a subtle minimal link for instant full-sentence meaning
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
                className={`clickable-word ${isHighlighted ? "is-highlighted" : ""}`}
              >
                {token}
              </span>
            );
          })}

          {/* Minimal inline trigger for exact sentence meaning */}
          <button
            type="button"
            onClick={(e) => handleSentenceClick(sentenceObj, e)}
            className="inline-flex items-center px-1.5 py-0.5 ml-1 mr-1.5 align-baseline rounded text-[11px] font-bengali font-medium text-indigo-600/80 hover:text-indigo-700 hover:bg-indigo-50 active:scale-95 transition-colors cursor-pointer"
            title="পুরো বাক্যের অর্থ"
          >
            বাক্য
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
    <div className="min-h-screen bg-white text-slate-900 pb-24 tap-highlight-transparent font-sans">
      {/* Hairline Reading Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 h-[2px] bg-slate-100">
        <div
          className="h-full bg-slate-900 transition-all duration-150"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Minimal Header */}
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

      {/* Clean Editorial Reader Container */}
      <main className="max-w-md mx-auto px-5 pt-7 pb-10">
        {/* Clean Title Section */}
        <div className="pb-6 mb-2 border-b border-slate-100">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
            {passage.category}
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-slate-900 leading-snug">
            {passage.titleEn}
          </h1>

          <h2 className="font-bengali text-lg font-medium text-slate-500 mt-1">
            {passage.titleBn}
          </h2>
        </div>

        {/* Clean Passage Flow */}
        <div className="divide-y divide-slate-100">
          {passage.sections && passage.sections.length > 0 ? (
            passage.sections.map((section: PassageSectionItem) => {
              const isRevealed =
                readingMode === "parallel" || revealedSectionIds.has(section.id);

              return (
                <article
                  key={section.id}
                  onClick={() => toggleSectionReveal(section.id)}
                  className={`py-5 transition-colors ${
                    readingMode === "tap-to-reveal" ? "cursor-pointer" : ""
                  }`}
                >
                  {/* English Sentences */}
                  <div
                    className={`font-english ${fontSizeStyle} text-slate-900`}
                  >
                    {renderSectionSentences(section)}
                  </div>

                  {/* Subtle Bengali Pronunciation */}
                  {showBanglaPronunciation && section.banglaPronunciation && (
                    <div className="mt-3 pl-3 border-l-2 border-slate-200 flex items-start justify-between gap-2">
                      <p className="font-bengali text-[14px] text-slate-500 leading-relaxed">
                        {section.banglaPronunciation}
                      </p>
                      <button
                        type="button"
                        onClick={(e) => playSentenceAudio(section.englishText, e)}
                        className="p-1 text-slate-400 hover:text-slate-700 shrink-0 active:scale-95"
                        aria-label="Listen"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  {/* Clean Bengali Translation */}
                  {isRevealed && section.bengaliText && (
                    <div className="mt-3 pl-3 border-l-2 border-indigo-500/50">
                      <p className="font-bengali text-[15px] text-slate-700 leading-relaxed">
                        {section.bengaliText}
                      </p>
                    </div>
                  )}
                </article>
              );
            })
          ) : (
            <div className="py-5">
              <p className={`font-english ${fontSizeStyle} text-slate-900`}>
                {passage.englishContent}
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Single Minimal Floating Pill for All-Translation Toggle */}
      <div className="fixed bottom-5 right-5 z-30">
        <button
          onClick={handleRevealAll}
          className="min-h-[44px] px-4 rounded-full bg-slate-900/90 backdrop-blur-md text-white shadow-lg flex items-center gap-2 text-xs font-medium active:scale-95 transition-transform"
        >
          <Languages className="w-3.5 h-3.5" />
          <span className="font-bengali">
            {revealedSectionIds.size > 0 ? "অনুবাদ লুকান" : "সব অনুবাদ"}
          </span>
        </button>
      </div>

      {/* Clean Bottom Sheet */}
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

      {/* Minimal Vocabulary Glossary Sheet */}
      {showGlossaryDrawer && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
            onClick={() => setShowGlossaryDrawer(false)}
          />
          <div className="relative z-10 w-full max-w-md mx-auto max-h-[80vh] flex flex-col rounded-t-3xl bg-white border-t border-slate-100 shadow-2xl p-5 animate-slide-up text-slate-900">
            <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto mb-4" />

            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-semibold text-base text-slate-900 font-bengali">
                শব্দকোষ ({passage.vocabularies?.length || 0})
              </h3>
              <button
                onClick={() => setShowGlossaryDrawer(false)}
                className="min-w-[40px] min-h-[40px] flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-500 text-sm"
              >
                ✕
              </button>
            </div>

            <div className="overflow-y-auto flex-1 divide-y divide-slate-100 pr-1">
              {passage.vocabularies?.map((v) => (
                <div
                  key={v.id}
                  onClick={() => {
                    setShowGlossaryDrawer(false);
                    setActiveVocab(v);
                    setActiveSentence(null);
                    setSheetInitialTab("word");
                  }}
                  className="py-3.5 flex items-center justify-between gap-3 cursor-pointer active:opacity-60"
                >
                  <div className="min-w-0">
                    <div className="flex items-baseline gap-2">
                      <span className="font-semibold text-[15px] text-slate-900 capitalize">
                        {v.word}
                      </span>
                      {v.banglaPronunciation && (
                        <span className="font-bengali text-xs text-slate-400">
                          {v.banglaPronunciation}
                        </span>
                      )}
                    </div>
                    <div className="font-bengali text-sm text-slate-600 mt-0.5">
                      {v.bengaliMeaning}
                    </div>
                  </div>
                  <span className="text-xs text-slate-400">→</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
