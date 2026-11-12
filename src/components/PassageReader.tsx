"use client";

import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
  memo,
} from "react";
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

interface ParagraphBlockProps {
  section: PassageSectionItem;
  fontSizeStyle: string;
  showBanglaPronunciation: boolean;
  isRevealed: boolean;
  tapToRevealEnabled: boolean;
  activeWordKeyInSection: string | null;
  onToggleSection: (sectionId: string) => void;
  onWordSelect: (
    rawWord: string,
    sentenceCtx: SentenceItem,
    sectionId: string,
    wordKey: string
  ) => void;
}

const PassageParagraphBlock = memo(function PassageParagraphBlock({
  section,
  fontSizeStyle,
  showBanglaPronunciation,
  isRevealed,
  tapToRevealEnabled,
  activeWordKeyInSection,
  onToggleSection,
  onWordSelect,
}: ParagraphBlockProps) {
  const sentences = useMemo(
    () => extractSentencesFromSection(section),
    [section]
  );

  const tokenizedSentences = useMemo(() => {
    return sentences.map((sentenceObj) =>
      sentenceObj.en.split(/(\s+)/).map((token) => ({
        token,
        clean: /^\s+$/.test(token) ? "" : sanitizeWord(token),
      }))
    );
  }, [sentences]);

  const handleParagraphClick = useCallback(
    (e: React.MouseEvent<HTMLParagraphElement>) => {
      const target = (e.target as HTMLElement).closest(
        "[data-word]"
      ) as HTMLElement | null;
      if (!target) return;

      e.stopPropagation();
      const sIdx = Number(target.dataset.si);
      const rawWord = target.dataset.word || "";
      const wKey = target.dataset.wk || "";
      const sentenceCtx = sentences[sIdx];
      if (sentenceCtx && rawWord) {
        onWordSelect(rawWord, sentenceCtx, section.id, wKey);
      }
    },
    [sentences, section.id, onWordSelect]
  );

  return (
    <article
      onClick={() => tapToRevealEnabled && onToggleSection(section.id)}
      className={tapToRevealEnabled ? "cursor-pointer" : ""}
    >
      {/* Crisp High-Contrast English Paragraph (1 delegated click listener, 0 per-word closures) */}
      <p
        onClick={handleParagraphClick}
        className={`font-english ${fontSizeStyle} text-[#202124] font-normal`}
      >
        {tokenizedSentences.map((tokens, sIdx) => (
          <React.Fragment key={sIdx}>
            {sIdx > 0 ? " " : ""}
            {tokens.map((item, tIdx) => {
              if (!item.clean) {
                return <span key={tIdx}>{item.token}</span>;
              }
              const wordKey = `${sIdx}-${tIdx}`;
              const isSelected = activeWordKeyInSection === wordKey;

              return (
                <span
                  key={tIdx}
                  data-word={item.token}
                  data-si={sIdx}
                  data-wk={wordKey}
                  className={`clickable-word ${isSelected ? "is-active" : ""}`}
                >
                  {item.token}
                </span>
              );
            })}
          </React.Fragment>
        ))}
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
});

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
  const [activeTarget, setActiveTarget] = useState<{
    sectionId: string;
    wordKey: string;
  } | null>(null);
  const [sheetInitialTab, setSheetInitialTab] = useState<"word" | "sentence">(
    "word"
  );

  const [showGlossaryDrawer, setShowGlossaryDrawer] = useState(false);
  const [isPlayingFull, setIsPlayingFull] = useState(false);
  const progressBarRef = useRef<HTMLDivElement>(null);

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

  // Zero-rerender scroll progress bar update
  useEffect(() => {
    let rafId = 0;
    const handleScroll = () => {
      if (rafId) return;
      rafId = window.requestAnimationFrame(() => {
        rafId = 0;
        const bar = progressBarRef.current;
        if (!bar) return;
        const totalHeight =
          document.documentElement.scrollHeight - window.innerHeight;
        if (totalHeight > 0) {
          const progress = Math.min(
            100,
            Math.max(0, (window.scrollY / totalHeight) * 100)
          );
          bar.style.width = `${progress}%`;
        }
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafId) window.cancelAnimationFrame(rafId);
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

  const toggleSectionReveal = useCallback(
    (sectionId: string) => {
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
    },
    [readingMode]
  );

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

  const handleWordSelect = useCallback(
    (
      rawWord: string,
      sentenceCtx: SentenceItem,
      sectionId: string,
      wordKey: string
    ) => {
      const vocabData = lookupWord(rawWord, passage.vocabularies);
      setActiveTarget({ sectionId, wordKey });
      setActiveVocab(vocabData);
      setActiveSentence(sentenceCtx);
      setSheetInitialTab("word");
    },
    [passage.vocabularies]
  );

  const closeBottomSheet = useCallback(() => {
    setActiveVocab(null);
    setActiveSentence(null);
    setActiveTarget(null);
  }, []);

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
      <div className="fixed top-0 left-0 right-0 z-50 h-[2px] bg-transparent pointer-events-none">
        <div
          ref={progressBarRef}
          className="h-full bg-[#1a73e8] will-change-[width]"
          style={{ width: "0%" }}
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

        {/* Clean Title Section */}
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
                className={`min-h-[32px] px-2.5 rounded-full text-[12px] font-medium border flex items-center active:scale-95 font-bengali ${
                  showBanglaPronunciation
                    ? "bg-[#e8f0fe] text-[#1967d2] border-[#d2e3fc]"
                    : "bg-white text-[#3c4043] border-[#dadce0]"
                }`}
              >
                <span>উচ্চারণ</span>
              </button>

              <button
                type="button"
                onClick={handleRevealAll}
                className={`min-h-[32px] px-2.5 rounded-full text-[12px] font-medium border flex items-center gap-1 active:scale-95 font-bengali ${
                  allRevealed
                    ? "bg-[#e8f0fe] text-[#1967d2] border-[#d2e3fc]"
                    : "bg-white text-[#3c4043] border-[#dadce0]"
                }`}
              >
                <Languages className="w-3.5 h-3.5" />
                <span>{allRevealed ? "অনুবাদ লুকান" : "বাংলা অর্থ"}</span>
              </button>

              <button
                type="button"
                onClick={toggleFullAudio}
                className={`min-w-[32px] min-h-[32px] px-2 rounded-full border flex items-center justify-center active:scale-95 ${
                  isPlayingFull
                    ? "bg-[#e8f0fe] text-[#1967d2] border-[#d2e3fc]"
                    : "bg-white text-[#3c4043] border-[#dadce0]"
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
              const activeKeyForSection =
                activeTarget?.sectionId === section.id
                  ? activeTarget.wordKey
                  : null;

              return (
                <PassageParagraphBlock
                  key={section.id}
                  section={section}
                  fontSizeStyle={fontSizeStyle}
                  showBanglaPronunciation={showBanglaPronunciation}
                  isRevealed={isRevealed}
                  tapToRevealEnabled={readingMode === "tap-to-reveal"}
                  activeWordKeyInSection={activeKeyForSection}
                  onToggleSection={toggleSectionReveal}
                  onWordSelect={handleWordSelect}
                />
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

      {/* Lightweight Vocabulary Glossary Sheet (No costly backdrop-blur) */}
      {showGlossaryDrawer && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
          <div
            className="fixed inset-0 bg-[#202124]/40"
            onClick={() => setShowGlossaryDrawer(false)}
          />
          <div className="relative z-10 w-full max-w-lg mx-auto max-h-[78vh] flex flex-col rounded-t-3xl bg-white border-t border-[#e8eaed] shadow-[0_-4px_24px_rgba(0,0,0,0.08)] p-5 animate-slide-up text-[#202124]">
            <div className="w-9 h-1 bg-[#dadce0] rounded-full mx-auto mb-3.5" />

            <div className="flex items-center justify-between pb-3 border-b border-[#e8eaed]">
              <h3 className="font-medium text-base text-[#202124] font-bengali">
                গল্পের শব্দকোষ ({passage.vocabularies?.length || 0})
              </h3>
              <button
                onClick={() => setShowGlossaryDrawer(false)}
                className="min-w-[38px] min-h-[38px] flex items-center justify-center rounded-full hover:bg-[#f1f3f4] text-[#5f6368] text-sm"
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
