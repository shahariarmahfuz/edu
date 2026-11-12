"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
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
import { Languages, Volume2, ChevronRight } from "lucide-react";

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
  const [activeWordKey, setActiveWordKey] = useState<string | null>(null);
  const [sheetInitialTab, setSheetInitialTab] = useState<"word" | "sentence">(
    "word"
  );

  const [showGlossaryDrawer, setShowGlossaryDrawer] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isPlayingFull, setIsPlayingFull] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedFontSize = localStorage.getItem(
        "bhasha_fontsize"
      ) as FontSize | null;
      const savedMode = localStorage.getItem(
        "bhasha_mode_v2"
      ) as ReadingMode | null;
      const savedPronounce = localStorage.getItem("bhasha_show_pronounce_v3");

      if (savedFontSize) setFontSize(savedFontSize);
      if (savedMode) setReadingMode(savedMode);
      if (savedPronounce !== null) {
        setShowBanglaPronunciation(savedPronounce === "true");
      }
    }
  }, []);

  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
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
      localStorage.setItem("bhasha_mode_v2", newMode);
    }
  };

  const handleToggleBanglaPronunciation = () => {
    setShowBanglaPronunciation((prev) => {
      const next = !prev;
      if (typeof window !== "undefined") {
        localStorage.setItem("bhasha_show_pronounce_v3", String(next));
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

  const allRevealed =
    readingMode === "parallel" ||
    (passage.sections.length > 0 &&
      revealedSectionIds.size === passage.sections.length);

  const handleRevealAll = () => {
    if (readingMode === "parallel") {
      handleReadingModeChange("tap-to-reveal");
      setRevealedSectionIds(new Set());
      return;
    }

    if (revealedSectionIds.size === passage.sections.length) {
      setRevealedSectionIds(new Set());
    } else {
      setRevealedSectionIds(new Set(passage.sections.map((s) => s.id)));
    }
  };

  const toggleFullAudio = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    if (isPlayingFull) {
      window.speechSynthesis.cancel();
      setIsPlayingFull(false);
      return;
    }
    const textToRead =
      passage.sections && passage.sections.length > 0
        ? passage.sections.map((s) => s.englishText).join(" ")
        : passage.englishContent;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.lang = "en-US";
    utterance.rate = 0.9;
    setIsPlayingFull(true);
    utterance.onend = () => setIsPlayingFull(false);
    utterance.onerror = () => setIsPlayingFull(false);
    window.speechSynthesis.speak(utterance);
  };

  const handleWordClick = (
    rawWord: string,
    sentenceCtx: SentenceItem,
    wordKey: string,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    const vocabData = lookupWord(rawWord, passage.vocabularies);
    setActiveWordKey(wordKey);
    setActiveVocab(vocabData);
    setActiveSentence(sentenceCtx);
    setSheetInitialTab("word");
  };

  const closeBottomSheet = () => {
    setActiveVocab(null);
    setActiveSentence(null);
    setActiveWordKey(null);
  };

  // Pure, clean Google-editorial prose: zero inline clutter, uninterrupted flow
  const renderSectionSentences = (section: PassageSectionItem) => {
    const sentences = extractSentencesFromSection(section);

    return sentences.map((sentenceObj, sIdx) => {
      const tokens = sentenceObj.en.split(/(\s+)/);

      return (
        <React.Fragment key={sIdx}>
          {sIdx > 0 ? " " : ""}
          {tokens.map((token, tIdx) => {
            if (/^\s+$/.test(token)) {
              return <span key={tIdx}>{token}</span>;
            }

            const clean = sanitizeWord(token);
            if (!clean) {
              return <span key={tIdx}>{token}</span>;
            }

            const wordKey = `${section.id}-${sIdx}-${tIdx}`;
            const isSelected = activeWordKey === wordKey;

            return (
              <span
                key={tIdx}
                onClick={(e) => handleWordClick(token, sentenceObj, wordKey, e)}
                className={`clickable-word ${isSelected ? "is-active" : ""}`}
              >
                {token}
              </span>
            );
          })}
        </React.Fragment>
      );
    });
  };

  const fontSizeStyle = {
    sm: "text-[16px] leading-[1.68]",
    md: "text-[17.5px] leading-[1.72]",
    lg: "text-[19px] leading-[1.75]",
    xl: "text-[21px] leading-[1.78]",
  }[fontSize];

  const difficultyLabel =
    passage.difficulty.charAt(0) + passage.difficulty.slice(1).toLowerCase();

  return (
    <div className="min-h-screen bg-white text-[#202124] pb-20 tap-highlight-transparent font-english">
      {/* Hairline Reading Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 h-[2px] bg-transparent">
        <div
          className="h-full bg-[#1a73e8] transition-all duration-150"
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
      <main className="max-w-lg mx-auto px-5 pt-6 pb-12">
        {/* Google-Style Editorial Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-1 text-[13px] font-medium text-[#1a73e8] mb-3.5 flex-wrap"
        >
          <Link href="/" className="hover:underline">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-[#5f6368]" />
          <span className="text-[#1a73e8] truncate max-w-[200px]">
            {passage.category}
          </span>
          <ChevronRight className="w-3.5 h-3.5 text-[#5f6368]" />
          <span className="text-[#5f6368] font-normal">{difficultyLabel}</span>
        </nav>

        {/* Clean Title Section (Regular editorial weight like blog.google) */}
        <header className="pb-5 mb-7 border-b border-[#dadce0]">
          <h1 className="text-[28px] sm:text-[31px] font-normal tracking-[-0.015em] text-[#202124] leading-[1.24]">
            {passage.titleEn}
          </h1>

          <h2 className="font-bengali text-[16.5px] font-normal text-[#5f6368] mt-2 leading-relaxed">
            {passage.titleBn}
          </h2>

          {/* Meta + Clean Controls Row */}
          <div className="mt-5 flex flex-wrap items-center justify-between gap-2">
            <span className="text-[13px] text-[#5f6368]">
              {passage.readingTimeMinutes} min read
            </span>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleToggleBanglaPronunciation}
                className={`min-h-[32px] px-2.5 rounded-full text-[12px] font-medium border flex items-center transition-colors active:scale-95 font-bengali ${
                  showBanglaPronunciation
                    ? "bg-[#e8f0fe] text-[#1967d2] border-[#d2e3fc]"
                    : "bg-white text-[#3c4043] border-[#dadce0] hover:bg-[#f8f9fa]"
                }`}
              >
                <span>উচ্চারণ</span>
              </button>

              <button
                type="button"
                onClick={handleRevealAll}
                className={`min-h-[32px] px-2.5 rounded-full text-[12px] font-medium border flex items-center gap-1 transition-colors active:scale-95 font-bengali ${
                  allRevealed
                    ? "bg-[#e8f0fe] text-[#1967d2] border-[#d2e3fc]"
                    : "bg-white text-[#3c4043] border-[#dadce0] hover:bg-[#f8f9fa]"
                }`}
              >
                <Languages className="w-3.5 h-3.5" />
                <span>{allRevealed ? "অনুবাদ লুকান" : "বাংলা অর্থ"}</span>
              </button>

              <button
                type="button"
                onClick={toggleFullAudio}
                className={`min-w-[32px] min-h-[32px] px-2 rounded-full border flex items-center justify-center transition-colors active:scale-95 ${
                  isPlayingFull
                    ? "bg-[#e8f0fe] text-[#1967d2] border-[#d2e3fc]"
                    : "bg-white text-[#3c4043] border-[#dadce0] hover:bg-[#f8f9fa]"
                }`}
                aria-label={isPlayingFull ? "Stop reading" : "Listen to story"}
                title={isPlayingFull ? "থামান" : "পুরো গল্প শুনুন"}
              >
                <Volume2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </header>

        {/* Clean Article Body — Uninterrupted Editorial Prose */}
        <div className="space-y-8">
          {passage.sections && passage.sections.length > 0 ? (
            passage.sections.map((section: PassageSectionItem) => {
              const isRevealed =
                readingMode === "parallel" || revealedSectionIds.has(section.id);

              return (
                <article
                  key={section.id}
                  onClick={() => toggleSectionReveal(section.id)}
                  className={
                    readingMode === "tap-to-reveal" ? "cursor-pointer" : ""
                  }
                >
                  {/* Crisp High-Contrast English Paragraph */}
                  <p className={`font-english ${fontSizeStyle} text-[#202124] font-normal`}>
                    {renderSectionSentences(section)}
                  </p>

                  {/* Clean Editorial Bengali Pronunciation right below English */}
                  {showBanglaPronunciation && section.banglaPronunciation && (
                    <p className="font-bengali text-[15px] text-[#5f6368] leading-[1.7] mt-2">
                      {section.banglaPronunciation}
                    </p>
                  )}

                  {/* Normal Plain-Text Bengali Translation (no box/border) */}
                  {isRevealed && section.bengaliText && (
                    <p className="font-bengali text-[16px] text-[#202124] leading-[1.75] mt-3">
                      {section.bengaliText}
                    </p>
                  )}
                </article>
              );
            })
          ) : (
            <p className={`font-english ${fontSizeStyle} text-[#202124]`}>
              {passage.englishContent}
            </p>
          )}
        </div>

        {/* Subtle Bottom Tip */}
        <div className="mt-10 pt-5 border-t border-[#e8eaed] text-center">
          <p className="font-bengali text-[13px] text-[#5f6368]">
            যেকোনো শব্দে ট্যাপ করে অর্থ ও পুরো বাক্যের অনুবাদ দেখুন · প্যারাগ্রাফে ট্যাপ করলে অনুবাদ খুলবে
          </p>
        </div>
      </main>

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
            className="fixed inset-0 bg-[#202124]/35 backdrop-blur-[1px]"
            onClick={() => setShowGlossaryDrawer(false)}
          />
          <div className="relative z-10 w-full max-w-lg mx-auto max-h-[80vh] flex flex-col rounded-t-3xl bg-white border-t border-[#e8eaed] shadow-2xl p-5 animate-slide-up text-[#202124]">
            <div className="w-10 h-1 bg-[#dadce0] rounded-full mx-auto mb-4" />

            <div className="flex items-center justify-between pb-3 border-b border-[#e8eaed]">
              <h3 className="font-medium text-base text-[#202124] font-bengali">
                গল্পের শব্দকোষ ({passage.vocabularies?.length || 0})
              </h3>
              <button
                onClick={() => setShowGlossaryDrawer(false)}
                className="min-w-[40px] min-h-[40px] flex items-center justify-center rounded-full hover:bg-[#f1f3f4] text-[#5f6368] text-sm"
              >
                ✕
              </button>
            </div>

            <div className="overflow-y-auto flex-1 divide-y divide-[#e8eaed] pr-1">
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
                      <span className="font-medium text-[15.5px] text-[#202124] capitalize">
                        {v.word}
                      </span>
                      {v.banglaPronunciation && (
                        <span className="font-bengali text-xs text-[#5f6368]">
                          {v.banglaPronunciation}
                        </span>
                      )}
                    </div>
                    <div className="font-bengali text-[14.5px] text-[#3c4043] mt-0.5">
                      {v.bengaliMeaning}
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#5f6368] shrink-0" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
