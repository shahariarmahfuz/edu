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
  SectionType,
  FontSize,
  ReadingMode,
} from "@/types/reading";
import ReaderHeader from "./ReaderHeader";
import VocabularyBottomSheet from "./VocabularyBottomSheet";
import { lookupWord, sanitizeWord } from "@/lib/dictionary";
import { extractSentencesFromSection } from "@/lib/sentenceSplitter";
import {
  Languages,
  Volume2,
  ChevronRight,
  BookOpen,
  UserCheck,
  Lightbulb,
  FileText,
  BookA,
} from "lucide-react";

type StudyTab = SectionType | "notes";

function getSectionType(section: PassageSectionItem): SectionType {
  if (Array.isArray(section.sentences) && section.sentences.length > 0) {
    const first = section.sentences[0] as SentenceItem;
    if (
      first.sectionType === "author" ||
      first.sectionType === "introduction" ||
      first.sectionType === "summary" ||
      first.sectionType === "story"
    ) {
      return first.sectionType;
    }
  }
  return "story";
}

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
        className={`font-english ${fontSizeStyle} text-[#202124] dark:text-[#e8eaed] font-normal`}
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
        <p className="font-bengali text-[15px] text-[#5f6368] dark:text-[#9aa0a6] leading-[1.7] mt-2">
          {section.banglaPronunciation}
        </p>
      )}

      {/* Normal Plain-Text Bengali Translation (no box/border) */}
      {isRevealed && section.bengaliText && (
        <p className="font-bengali text-[16px] text-[#202124] dark:text-[#e8eaed] leading-[1.75] mt-3">
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
  const [activeTab, setActiveTab] = useState<StudyTab>("story");

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

  const groupedSections = useMemo(() => {
    const groups: Record<SectionType, PassageSectionItem[]> = {
      story: [],
      author: [],
      introduction: [],
      summary: [],
    };
    for (const sec of passage.sections || []) {
      const t = getSectionType(sec);
      groups[t].push(sec);
    }
    return groups;
  }, [passage.sections]);

  const availableTabs = useMemo(() => {
    const tabs: Array<{
      id: StudyTab;
      labelBn: string;
      labelEn: string;
      count: number;
      icon: React.ReactNode;
    }> = [
      {
        id: "story",
        labelBn: "মূল গল্প",
        labelEn: "The Story",
        count: groupedSections.story.length,
        icon: <BookOpen className="w-3.5 h-3.5" />,
      },
    ];
    if (groupedSections.author.length > 0) {
      tabs.push({
        id: "author",
        labelBn: "লেখক পরিচিতি",
        labelEn: "About the Author",
        count: groupedSections.author.length,
        icon: <UserCheck className="w-3.5 h-3.5" />,
      });
    }
    if (groupedSections.introduction.length > 0) {
      tabs.push({
        id: "introduction",
        labelBn: "ভূমিকা",
        labelEn: "Introduction",
        count: groupedSections.introduction.length,
        icon: <Lightbulb className="w-3.5 h-3.5" />,
      });
    }
    if (groupedSections.summary.length > 0) {
      tabs.push({
        id: "summary",
        labelBn: "সামারি",
        labelEn: "Critical Summary",
        count: groupedSections.summary.length,
        icon: <FileText className="w-3.5 h-3.5" />,
      });
    }
    if ((passage.vocabularies?.length || 0) > 0) {
      tabs.push({
        id: "notes",
        labelBn: "শব্দার্থ ও টীকা",
        labelEn: "Word Notes & Allusions",
        count: passage.vocabularies.length,
        icon: <BookA className="w-3.5 h-3.5" />,
      });
    }
    return tabs;
  }, [groupedSections, passage.vocabularies]);

  const activeSections = useMemo(() => {
    if (activeTab === "notes") return [];
    const list = groupedSections[activeTab];
    return list.length > 0 ? list : groupedSections.story;
  }, [activeTab, groupedSections]);

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

      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get("tab") as StudyTab | null;
      if (
        tabParam &&
        ["story", "author", "introduction", "summary", "notes"].includes(
          tabParam
        )
      ) {
        setActiveTab(tabParam);
      }
    }
  }, []);

  const handleSelectTab = (tab: StudyTab) => {
    setActiveTab(tab);
    if (typeof window !== "undefined") {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
        setIsPlayingFull(false);
      }
      const url = new URL(window.location.href);
      url.searchParams.set("tab", tab);
      window.history.replaceState({}, "", url.toString());
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

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
    (activeSections.length > 0 &&
      activeSections.every((s) => revealedSectionIds.has(s.id)));

  const handleRevealAll = () => {
    if (readingMode === "parallel") {
      handleReadingModeChange("tap-to-reveal");
      setRevealedSectionIds(new Set());
      return;
    }

    if (
      activeSections.length > 0 &&
      activeSections.every((s) => revealedSectionIds.has(s.id))
    ) {
      setRevealedSectionIds((prev) => {
        const next = new Set(prev);
        for (const s of activeSections) next.delete(s.id);
        return next;
      });
    } else {
      setRevealedSectionIds((prev) => {
        const next = new Set(prev);
        for (const s of activeSections) next.add(s.id);
        return next;
      });
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
      activeSections && activeSections.length > 0
        ? activeSections.map((s) => s.englishText).join(" ")
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

  const currentTabMeta =
    availableTabs.find((t) => t.id === activeTab) || availableTabs[0];
  const currentTabIndex = availableTabs.findIndex((t) => t.id === activeTab);
  const nextTabMeta =
    currentTabIndex >= 0 && currentTabIndex + 1 < availableTabs.length
      ? availableTabs[currentTabIndex + 1]
      : null;

  return (
    <div className="min-h-screen bg-white dark:bg-[#131314] text-[#202124] dark:text-[#e8eaed] pb-20 tap-highlight-transparent font-english transition-colors duration-150">
      {/* Hairline Reading Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 h-[2px] bg-transparent pointer-events-none">
        <div
          ref={progressBarRef}
          className="h-full bg-[#1a73e8] dark:bg-[#8ab4f8] will-change-[width]"
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
          className="flex items-center gap-1 text-[13px] font-medium text-[#1a73e8] dark:text-[#8ab4f8] mb-3.5 flex-wrap"
        >
          <Link href="/" className="hover:underline">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-[#5f6368] dark:text-[#9aa0a6]" />
          <span className="text-[#1a73e8] dark:text-[#8ab4f8] truncate max-w-[200px]">
            {passage.category}
          </span>
          <ChevronRight className="w-3.5 h-3.5 text-[#5f6368] dark:text-[#9aa0a6]" />
          <span className="text-[#5f6368] dark:text-[#9aa0a6] font-normal">
            {difficultyLabel}
          </span>
        </nav>

        {/* Clean Title Section */}
        <header className="pb-5 mb-6 border-b border-[#dadce0] dark:border-[#303134]">
          <h1 className="text-[28px] sm:text-[31px] font-normal tracking-[-0.015em] text-[#202124] dark:text-[#e8eaed] leading-[1.24]">
            {passage.titleEn}
          </h1>

          <h2 className="font-bengali text-[16.5px] font-normal text-[#5f6368] dark:text-[#9aa0a6] mt-2 leading-relaxed">
            {passage.titleBn}
          </h2>

          {/* Strategic Study Navigation Bar */}
          {availableTabs.length > 1 && (
            <div className="mt-4 -mx-5 px-5 overflow-x-auto no-scrollbar">
              <div className="flex items-center gap-1.5 min-w-max pb-1">
                {availableTabs.map((tab) => {
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => handleSelectTab(tab.id)}
                      className={`min-h-[36px] px-3 rounded-full text-[13px] font-medium flex items-center gap-1.5 border transition-colors font-bengali active:scale-95 ${
                        isActive
                          ? "bg-[#1a73e8] dark:bg-[#8ab4f8] text-white dark:text-[#131314] border-[#1a73e8] dark:border-[#8ab4f8]"
                          : "bg-[#f8f9fa] dark:bg-[#1e1f20] text-[#3c4043] dark:text-[#bdc1c6] border-[#dadce0] dark:border-[#3c4043] hover:bg-[#e8f0fe]/60 dark:hover:bg-[#282a2c]"
                      }`}
                    >
                      {tab.icon}
                      <span>{tab.labelBn}</span>
                      <span
                        className={`text-[11px] px-1.5 py-0.2 rounded-full ${
                          isActive
                            ? "bg-white/20 dark:bg-black/15 text-white dark:text-[#131314]"
                            : "bg-[#e8eaed] dark:bg-[#303134] text-[#5f6368] dark:text-[#9aa0a6]"
                        }`}
                      >
                        {tab.count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Meta + Clean Controls Row */}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
            <span className="text-[13px] text-[#5f6368] dark:text-[#9aa0a6] font-bengali">
              {currentTabMeta.labelBn} · {currentTabMeta.labelEn}
            </span>

            {activeTab !== "notes" && (
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleToggleBanglaPronunciation}
                  className={`min-h-[32px] px-2.5 rounded-full text-[12px] font-medium border flex items-center active:scale-95 font-bengali transition-colors ${
                    showBanglaPronunciation
                      ? "bg-[#e8f0fe] dark:bg-[#1e3a5f] text-[#1967d2] dark:text-[#8ab4f8] border-[#d2e3fc] dark:border-[#2c4e7c]"
                      : "bg-white dark:bg-[#1e1f20] text-[#3c4043] dark:text-[#bdc1c6] border-[#dadce0] dark:border-[#3c4043]"
                  }`}
                >
                  <span>উচ্চারণ</span>
                </button>

                <button
                  type="button"
                  onClick={handleRevealAll}
                  className={`min-h-[32px] px-2.5 rounded-full text-[12px] font-medium border flex items-center gap-1 active:scale-95 font-bengali transition-colors ${
                    allRevealed
                      ? "bg-[#e8f0fe] dark:bg-[#1e3a5f] text-[#1967d2] dark:text-[#8ab4f8] border-[#d2e3fc] dark:border-[#2c4e7c]"
                      : "bg-white dark:bg-[#1e1f20] text-[#3c4043] dark:text-[#bdc1c6] border-[#dadce0] dark:border-[#3c4043]"
                  }`}
                >
                  <Languages className="w-3.5 h-3.5" />
                  <span>{allRevealed ? "অনুবাদ লুকান" : "বাংলা অর্থ"}</span>
                </button>

                <button
                  type="button"
                  onClick={toggleFullAudio}
                  className={`min-w-[32px] min-h-[32px] px-2 rounded-full border flex items-center justify-center active:scale-95 transition-colors ${
                    isPlayingFull
                      ? "bg-[#e8f0fe] dark:bg-[#1e3a5f] text-[#1967d2] dark:text-[#8ab4f8] border-[#d2e3fc] dark:border-[#2c4e7c]"
                      : "bg-white dark:bg-[#1e1f20] text-[#3c4043] dark:text-[#bdc1c6] border-[#dadce0] dark:border-[#3c4043]"
                  }`}
                  aria-label={isPlayingFull ? "Stop reading" : "Listen to section"}
                  title={isPlayingFull ? "থামান" : "অডিও শুনুন"}
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Clean Article Body or Word Notes View */}
        {activeTab === "notes" ? (
          <div className="divide-y divide-[#e8eaed] dark:divide-[#303134]">
            {passage.vocabularies?.map((v) => (
              <div
                key={v.id}
                onClick={() => {
                  setActiveVocab(v);
                  setActiveSentence(null);
                  setSheetInitialTab("word");
                }}
                className="py-4 cursor-pointer hover:bg-[#f8f9fa]/60 dark:hover:bg-[#1e1f20]/60 transition-colors"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <div className="flex flex-wrap items-baseline gap-2">
                    <span className="text-[17px] font-medium text-[#1a73e8] dark:text-[#8ab4f8]">
                      {v.word}
                    </span>
                    {v.phonetic && (
                      <span className="text-xs text-[#5f6368] dark:text-[#9aa0a6]">
                        {v.phonetic}
                      </span>
                    )}
                    {v.banglaPronunciation && (
                      <span className="font-bengali text-[13.5px] text-[#5f6368] dark:text-[#9aa0a6]">
                        ({v.banglaPronunciation})
                      </span>
                    )}
                  </div>
                  {v.partOfSpeech && (
                    <span className="text-[11px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#f1f3f4] dark:bg-[#282a2c] text-[#5f6368] dark:text-[#9aa0a6]">
                      {v.partOfSpeech}
                    </span>
                  )}
                </div>

                <p className="font-bengali text-[15.5px] font-medium text-[#202124] dark:text-[#e8eaed] mt-1.5 leading-relaxed">
                  {v.bengaliMeaning}
                </p>

                {v.englishDefinition && (
                  <p className="text-[14.5px] text-[#3c4043] dark:text-[#bdc1c6] mt-1 leading-relaxed">
                    {v.englishDefinition}
                  </p>
                )}

                {v.exampleSentenceEn && (
                  <div className="mt-2 pl-3 border-l-2 border-[#dadce0] dark:border-[#3c4043] space-y-0.5">
                    <p className="text-[13.5px] italic text-[#5f6368] dark:text-[#9aa0a6]">
                      “{v.exampleSentenceEn}”
                    </p>
                    {v.exampleSentenceBn && (
                      <p className="font-bengali text-[13.5px] text-[#5f6368] dark:text-[#9aa0a6]">
                        {v.exampleSentenceBn}
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-8">
            {activeSections && activeSections.length > 0 ? (
              activeSections.map((section: PassageSectionItem) => {
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
              <p
                className={`font-english ${fontSizeStyle} text-[#202124] dark:text-[#e8eaed]`}
              >
                {passage.englishContent}
              </p>
            )}
          </div>
        )}

        {/* Next Study Step CTA */}
        {nextTabMeta && (
          <div className="mt-10 pt-6 border-t border-[#e8eaed] dark:border-[#303134]">
            <button
              type="button"
              onClick={() => handleSelectTab(nextTabMeta.id)}
              className="w-full min-h-[48px] px-4 py-3 rounded-2xl bg-[#f8f9fa] dark:bg-[#1e1f20] hover:bg-[#e8f0fe]/70 dark:hover:bg-[#282a2c] border border-[#dadce0] dark:border-[#3c4043] flex items-center justify-between gap-3 transition-colors font-bengali"
            >
              <div className="text-left">
                <div className="text-[12px] text-[#5f6368] dark:text-[#9aa0a6]">
                  পরবর্তী অধ্যয়ন ধাপ (Next Section)
                </div>
                <div className="text-[15px] font-medium text-[#1a73e8] dark:text-[#8ab4f8] flex items-center gap-1.5 mt-0.5">
                  {nextTabMeta.icon}
                  <span>
                    {nextTabMeta.labelBn} · {nextTabMeta.labelEn} ({nextTabMeta.count})
                  </span>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-[#1a73e8] dark:text-[#8ab4f8] shrink-0" />
            </button>
          </div>
        )}

        {/* Subtle Bottom Tip */}
        <div className="mt-10 pt-5 border-t border-[#e8eaed] dark:border-[#303134] text-center">
          <p className="font-bengali text-[13px] text-[#5f6368] dark:text-[#9aa0a6]">
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
            className="fixed inset-0 bg-[#202124]/40 dark:bg-black/65"
            onClick={() => setShowGlossaryDrawer(false)}
          />
          <div className="relative z-10 w-full max-w-lg mx-auto max-h-[78vh] flex flex-col rounded-t-3xl bg-white dark:bg-[#1e1f20] border-t border-[#e8eaed] dark:border-[#303134] shadow-[0_-4px_24px_rgba(0,0,0,0.08)] dark:shadow-[0_-4px_24px_rgba(0,0,0,0.4)] p-5 animate-slide-up text-[#202124] dark:text-[#e8eaed]">
            <div className="w-9 h-1 bg-[#dadce0] dark:bg-[#3c4043] rounded-full mx-auto mb-3.5" />

            <div className="flex items-center justify-between pb-3 border-b border-[#e8eaed] dark:border-[#303134]">
              <h3 className="font-medium text-base text-[#202124] dark:text-[#e8eaed] font-bengali">
                গল্পের শব্দকোষ ({passage.vocabularies?.length || 0})
              </h3>
              <button
                onClick={() => setShowGlossaryDrawer(false)}
                className="min-w-[38px] min-h-[38px] flex items-center justify-center rounded-full hover:bg-[#f1f3f4] dark:hover:bg-[#282a2c] text-[#5f6368] dark:text-[#9aa0a6] text-sm"
              >
                ✕
              </button>
            </div>

            <div className="overflow-y-auto flex-1 divide-y divide-[#e8eaed] dark:divide-[#303134] pr-1">
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
                      <span className="font-medium text-[15.5px] text-[#202124] dark:text-[#e8eaed] capitalize">
                        {v.word}
                      </span>
                      {v.banglaPronunciation && (
                        <span className="font-bengali text-xs text-[#5f6368] dark:text-[#9aa0a6]">
                          {v.banglaPronunciation}
                        </span>
                      )}
                    </div>
                    <div className="font-bengali text-[14.5px] text-[#3c4043] dark:text-[#bdc1c6] mt-0.5">
                      {v.bengaliMeaning}
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#5f6368] dark:text-[#9aa0a6] shrink-0" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
