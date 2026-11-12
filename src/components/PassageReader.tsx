"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  PassageItem,
  VocabularyItem,
  PassageSectionItem,
  ThemeMode,
  FontSize,
  ReadingMode,
} from "@/types/reading";
import ReaderHeader from "./ReaderHeader";
import VocabularyBottomSheet from "./VocabularyBottomSheet";
import {
  Sparkles,
  BookMarked,
  Languages,
  CheckCircle2,
  Volume2,
  RotateCcw,
} from "lucide-react";

interface PassageReaderProps {
  passage: PassageItem;
}

export default function PassageReader({ passage }: PassageReaderProps) {
  // Theme & Reading Ergonomics State (persisted in localStorage if available)
  const [theme, setTheme] = useState<ThemeMode>("sepia");
  const [fontSize, setFontSize] = useState<FontSize>("md");
  const [readingMode, setReadingMode] = useState<ReadingMode>("tap-to-reveal");

  // Interactive sentence reveal state: Set of section IDs that are revealed
  const [revealedSectionIds, setRevealedSectionIds] = useState<Set<string>>(
    new Set()
  );

  // Vocabulary Bottom Sheet Modal State
  const [activeVocab, setActiveVocab] = useState<VocabularyItem | null>(null);
  const [showGlossaryDrawer, setShowGlossaryDrawer] = useState(false);

  // Scroll Progress Tracking
  const [scrollProgress, setScrollProgress] = useState(0);

  // Read preferences from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("bhasha_theme") as ThemeMode | null;
      const savedFontSize = localStorage.getItem("bhasha_fontsize") as FontSize | null;
      const savedMode = localStorage.getItem("bhasha_mode") as ReadingMode | null;

      if (savedTheme) setTheme(savedTheme);
      if (savedFontSize) setFontSize(savedFontSize);
      if (savedMode) setReadingMode(savedMode);
    }
  }, []);

  // Save changes to localStorage
  const handleThemeChange = (newTheme: ThemeMode) => {
    setTheme(newTheme);
    if (typeof window !== "undefined") {
      localStorage.setItem("bhasha_theme", newTheme);
    }
  };

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

  // Scroll Progress listener
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

  // Toggle reveal for a specific section
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

  // Reveal all or Hide all sentences
  const handleRevealAll = () => {
    if (revealedSectionIds.size === passage.sections.length) {
      setRevealedSectionIds(new Set());
    } else {
      setRevealedSectionIds(new Set(passage.sections.map((s) => s.id)));
    }
  };

  // Map of vocabulary word lowercased -> VocabularyItem
  const vocabMap = useMemo(() => {
    const map = new Map<string, VocabularyItem>();
    (passage.vocabularies || []).forEach((v) => {
      map.set(v.word.toLowerCase().trim(), v);
    });
    return map;
  }, [passage.vocabularies]);

  // Regex pattern to match vocabulary words with word boundary
  const vocabRegex = useMemo(() => {
    if (vocabMap.size === 0) return null;
    const escapedWords = Array.from(vocabMap.keys())
      .map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
      .sort((a, b) => b.length - a.length); // longest matches first
    return new RegExp(`\\b(${escapedWords.join("|")})\\b`, "gi");
  }, [vocabMap]);

  // Helper to render text with interactive vocabulary pills
  const renderInteractiveEnglishText = (text: string) => {
    if (!vocabRegex) {
      return text;
    }

    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    // Reset regex index
    vocabRegex.lastIndex = 0;

    while ((match = vocabRegex.exec(text)) !== null) {
      const matchIndex = match.index;
      const matchedWord = match[0];

      // Push text before the match
      if (matchIndex > lastIndex) {
        parts.push(text.slice(lastIndex, matchIndex));
      }

      const vocabItem = vocabMap.get(matchedWord.toLowerCase());

      // Push interactive clickable vocabulary badge
      parts.push(
        <button
          key={`${matchIndex}-${matchedWord}`}
          onClick={(e) => {
            e.stopPropagation();
            if (vocabItem) setActiveVocab(vocabItem);
          }}
          className="inline-flex items-baseline px-1.5 py-0.5 mx-0.5 rounded-md font-medium transition-all active:scale-95 cursor-pointer border shadow-2xs hover:underline decoration-indigo-400 decoration-2"
          style={{
            backgroundColor: "var(--highlight-vocab)",
            color: "var(--highlight-vocab-text)",
            borderColor: "var(--highlight-vocab-border)",
          }}
          title={`Bengali: ${vocabItem?.bengaliMeaning || "Click for meaning"}`}
          aria-label={`Vocabulary word: ${matchedWord}`}
        >
          {matchedWord}
          <span className="text-[10px] ml-0.5 opacity-70">✦</span>
        </button>
      );

      lastIndex = vocabRegex.lastIndex;
    }

    // Push remaining text
    if (lastIndex < text.length) {
      parts.push(text.slice(lastIndex));
    }

    return parts;
  };

  // Font size mapping classes
  const fontSizeStyle = {
    sm: "text-[15px] leading-[1.65]",
    md: "text-[17px] leading-[1.75]",
    lg: "text-[19px] leading-[1.8]",
    xl: "text-[21px] leading-[1.85]",
  }[fontSize];

  return (
    <div
      className={`min-h-screen theme-${theme} transition-colors duration-300 pb-28 tap-highlight-transparent`}
      style={{
        backgroundColor: "var(--bg-primary)",
        color: "var(--text-primary)",
      }}
    >
      {/* Sticky Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-black/10 dark:bg-white/10">
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
        theme={theme}
        fontSize={fontSize}
        readingMode={readingMode}
        onThemeChange={handleThemeChange}
        onFontSizeChange={handleFontSizeChange}
        onReadingModeChange={handleReadingModeChange}
        onOpenGlossary={() => setShowGlossaryDrawer(true)}
        vocabCount={passage.vocabularies?.length || 0}
      />

      {/* Mobile-first centered reading container (360px - 430px on mobile, centered max-w-lg on desktop) */}
      <main className="max-w-md mx-auto px-4 pt-6 pb-12">
        {/* Article Title Header */}
        <div className="mb-6 pb-4 border-b border-black/10 dark:border-white/10">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              {passage.category}
            </span>
          </div>

          <h1 className="text-2xl font-bold tracking-tight mb-1.5 leading-snug">
            {passage.titleEn}
          </h1>

          <h2 className="font-bengali text-lg font-medium opacity-80 leading-normal">
            {passage.titleBn}
          </h2>

          {passage.summaryEn && (
            <p className="mt-3 text-xs leading-relaxed opacity-75 italic">
              {passage.summaryEn}
            </p>
          )}
        </div>

        {/* Reading Ergonomics & Quick Instructions Bar */}
        <div
          className="mb-6 p-3 rounded-2xl border flex items-center justify-between text-xs"
          style={{
            backgroundColor: "var(--bg-surface)",
            borderColor: "var(--border-color)",
          }}
        >
          <div className="flex items-center gap-2">
            <Languages className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span className="font-medium opacity-85">
              {readingMode === "tap-to-reveal" &&
                "Tap any sentence to reveal Bengali meaning"}
              {readingMode === "parallel" && "Dual parallel English & Bengali"}
              {readingMode === "english-only" && "Immersion English mode"}
            </span>
          </div>

          {readingMode === "tap-to-reveal" && (
            <button
              onClick={handleRevealAll}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline active:scale-95"
            >
              {revealedSectionIds.size === passage.sections.length
                ? "Hide All"
                : "Reveal All"}
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
                  className={`group relative p-3.5 rounded-2xl border transition-all duration-200 ${
                    readingMode === "tap-to-reveal"
                      ? "cursor-pointer hover:border-indigo-400/50 active:scale-[0.99]"
                      : ""
                  }`}
                  style={{
                    backgroundColor: isRevealed
                      ? "var(--bg-secondary)"
                      : "transparent",
                    borderColor: isRevealed
                      ? "var(--border-color)"
                      : "transparent",
                  }}
                >
                  {/* Sentence Number Badge */}
                  <div className="absolute top-2 right-2 text-[10px] font-mono opacity-30 select-none">
                    #{index + 1}
                  </div>

                  {/* English Text with Interactive Vocabulary Pills */}
                  <p
                    className={`font-english ${fontSizeStyle} tracking-normal text-slate-900 dark:text-slate-100 pr-5`}
                  >
                    {renderInteractiveEnglishText(section.englishText)}
                  </p>

                  {/* Bengali Translation Section */}
                  {isRevealed && section.bengaliText && (
                    <div className="mt-3 pt-2.5 border-t border-black/10 dark:border-white/10 animate-fadeIn">
                      <div className="flex items-center gap-1.5 text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 mb-1 select-none">
                        <span>বাংলা অনুবাদ</span>
                      </div>
                      <p className="font-bengali text-[16px] leading-[1.7] opacity-90 text-slate-800 dark:text-slate-200">
                        {section.bengaliText}
                      </p>
                    </div>
                  )}

                  {/* Subtle prompt indicator for tap-to-reveal mode */}
                  {readingMode === "tap-to-reveal" && !isRevealed && (
                    <div className="mt-1 flex items-center gap-1 text-[11px] opacity-40 select-none group-hover:opacity-75 transition-opacity">
                      <span>Tap to reveal translation</span>
                      <span>↓</span>
                    </div>
                  )}
                </article>
              );
            })
          ) : (
            // Fallback if sections were not populated
            <div className={`font-english ${fontSizeStyle} space-y-4`}>
              <p>{passage.englishContent}</p>
              <div className="mt-6 p-4 rounded-2xl border bg-black/5 dark:bg-white/5">
                <h3 className="font-bengali text-lg font-bold mb-2">
                  সম্পূর্ণ বাংলা অনুবাদ:
                </h3>
                <p className="font-bengali text-base leading-relaxed opacity-90">
                  {passage.bengaliContent}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Completion Card at the end of article */}
        <div
          className="mt-10 p-5 rounded-3xl border text-center space-y-3"
          style={{
            backgroundColor: "var(--bg-secondary)",
            borderColor: "var(--border-color)",
          }}
        >
          <div className="w-12 h-12 mx-auto rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold">Great Job Reading!</h3>
          <p className="text-xs opacity-75 max-w-xs mx-auto">
            You completed this article. Review the {passage.vocabularies?.length || 0} key vocabulary words below to reinforce your memory.
          </p>

          <button
            onClick={() => setShowGlossaryDrawer(true)}
            className="min-h-[44px] px-4 py-2 rounded-2xl bg-indigo-600 text-white font-medium text-xs flex items-center justify-center gap-2 mx-auto active:scale-95 shadow-md shadow-indigo-600/20"
          >
            <Sparkles className="w-4 h-4" />
            Review Key Vocabulary ({passage.vocabularies?.length || 0})
          </button>
        </div>
      </main>

      {/* Persistent Bottom Floating Action Bar (Thumb Zone) */}
      <div className="fixed bottom-4 left-0 right-0 z-30 pointer-events-none">
        <div className="max-w-md mx-auto px-4 flex items-center justify-between pointer-events-auto">
          {/* Quick Translation Toggle Button */}
          <button
            onClick={handleRevealAll}
            className="min-h-[48px] px-4 rounded-2xl backdrop-blur-md border shadow-lg flex items-center gap-2 text-xs font-semibold active:scale-95 transition-transform"
            style={{
              backgroundColor: "var(--bg-secondary)",
              borderColor: "var(--border-color)",
              color: "var(--text-primary)",
            }}
          >
            <Languages className="w-4 h-4 text-indigo-500" />
            <span>
              {revealedSectionIds.size > 0 ? "Hide Translations" : "Show All Bangla"}
            </span>
          </button>

          {/* Key Vocabulary Drawer Trigger Button */}
          {passage.vocabularies && passage.vocabularies.length > 0 && (
            <button
              onClick={() => setShowGlossaryDrawer(true)}
              className="min-h-[48px] px-4 rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 flex items-center gap-2 text-xs font-semibold active:scale-95 transition-transform"
            >
              <BookMarked className="w-4 h-4" />
              <span>Vocab ({passage.vocabularies.length})</span>
            </button>
          )}
        </div>
      </div>

      {/* Interactive Bottom Sheet for single vocabulary word tapped in passage */}
      <VocabularyBottomSheet
        vocab={activeVocab}
        vocabList={passage.vocabularies}
        theme={theme}
        onClose={() => setActiveVocab(null)}
        onSelectVocab={(v) => setActiveVocab(v)}
      />

      {/* Full Vocabulary Glossary Bottom Drawer */}
      {showGlossaryDrawer && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setShowGlossaryDrawer(false)}
          />
          <div
            className="relative z-10 w-full max-w-md mx-auto max-h-[85vh] flex flex-col rounded-t-3xl border-t shadow-2xl p-5 animate-slide-up"
            style={{
              backgroundColor: "var(--bg-secondary)",
              borderColor: "var(--border-color)",
              color: "var(--text-primary)",
            }}
          >
            <div className="w-12 h-1.5 bg-slate-400/40 rounded-full mx-auto mb-3" />

            <div className="flex items-center justify-between pb-3 border-b border-black/10 dark:border-white/10">
              <div>
                <h3 className="font-bold text-lg">Article Vocabulary</h3>
                <p className="text-xs opacity-60">
                  {passage.vocabularies?.length || 0} important words to master
                </p>
              </div>
              <button
                onClick={() => setShowGlossaryDrawer(false)}
                className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10"
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
                  }}
                  className="p-3 rounded-2xl border flex items-center justify-between gap-3 cursor-pointer hover:border-indigo-500 transition-all active:scale-[0.99]"
                  style={{
                    backgroundColor: "var(--bg-surface)",
                    borderColor: "var(--border-color)",
                  }}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-base capitalize truncate">
                        {v.word}
                      </span>
                      {v.partOfSpeech && (
                        <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-indigo-500/10 text-indigo-500 font-medium">
                          {v.partOfSpeech}
                        </span>
                      )}
                    </div>
                    <div className="font-bengali text-sm font-semibold text-indigo-600 dark:text-indigo-400 mt-0.5">
                      {v.bengaliMeaning}
                    </div>
                  </div>

                  <div className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                    Details →
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
