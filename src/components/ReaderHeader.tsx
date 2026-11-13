"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, SlidersHorizontal, BookMarked, Moon, Sun } from "lucide-react";
import { FontSize, ReadingMode, Difficulty } from "@/types/reading";
import { useTheme } from "./ThemeProvider";

interface ReaderHeaderProps {
  titleEn: string;
  difficulty: Difficulty;
  readingTimeMinutes: number;
  fontSize: FontSize;
  readingMode: ReadingMode;
  showBanglaPronunciation: boolean;
  onFontSizeChange: (size: FontSize) => void;
  onReadingModeChange: (mode: ReadingMode) => void;
  onToggleBanglaPronunciation: () => void;
  onOpenGlossary?: () => void;
  vocabCount?: number;
}

export default function ReaderHeader({
  titleEn,
  fontSize,
  readingMode,
  showBanglaPronunciation,
  onFontSizeChange,
  onReadingModeChange,
  onToggleBanglaPronunciation,
  onOpenGlossary,
  vocabCount = 0,
}: ReaderHeaderProps) {
  const [showSettings, setShowSettings] = useState(false);
  const { theme, setTheme } = useTheme();

  return (
    <header className="sticky top-0 z-40 w-full bg-white dark:bg-[#131314] border-b border-[#e8eaed] dark:border-[#303134] transition-colors duration-150">
      <div className="max-w-lg mx-auto px-4 h-14 flex items-center justify-between gap-2">
        <Link
          href="/"
          className="min-w-[44px] min-h-[44px] -ml-2 flex items-center justify-center rounded-full hover:bg-[#f1f3f4] dark:hover:bg-[#282a2c] text-[#3c4043] dark:text-[#bdc1c6] active:scale-95 transition-colors"
          aria-label="Back to library"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>

        <div className="flex-1 min-w-0 px-1">
          <span className="block text-[15px] font-medium text-[#202124] dark:text-[#e8eaed] truncate">
            {titleEn}
          </span>
        </div>

        <div className="flex items-center gap-0.5 -mr-1.5">
          {vocabCount > 0 && onOpenGlossary && (
            <button
              onClick={onOpenGlossary}
              className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full hover:bg-[#f1f3f4] dark:hover:bg-[#282a2c] text-[#5f6368] dark:text-[#9aa0a6] hover:text-[#202124] dark:hover:text-[#e8eaed] active:scale-95 transition-colors"
              aria-label="Vocabulary glossary"
              title="শব্দকোষ"
            >
              <BookMarked className="w-[19px] h-[19px]" />
            </button>
          )}

          <button
            onClick={() => setShowSettings(!showSettings)}
            className={`min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full active:scale-95 transition-colors ${
              showSettings
                ? "bg-[#e8f0fe] dark:bg-[#1e3a5f] text-[#1967d2] dark:text-[#8ab4f8]"
                : "hover:bg-[#f1f3f4] dark:hover:bg-[#282a2c] text-[#5f6368] dark:text-[#9aa0a6] hover:text-[#202124] dark:hover:text-[#e8eaed]"
            }`}
            aria-label="Display settings"
          >
            <SlidersHorizontal className="w-[19px] h-[19px]" />
          </button>
        </div>
      </div>

      {/* Clean Minimal Display Settings */}
      {showSettings && (
        <div className="border-t border-[#e8eaed] dark:border-[#303134] bg-[#f8f9fa] dark:bg-[#1e1f20] px-5 py-4 shadow-sm">
          <div className="max-w-lg mx-auto space-y-4">
            {/* Theme Selector */}
            <div>
              <span className="text-xs font-medium text-[#5f6368] dark:text-[#9aa0a6] block mb-2 font-bengali">
                থিম (Theme)
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setTheme("light")}
                  className={`min-h-[40px] px-3 rounded-xl text-xs font-medium border flex items-center justify-center gap-1.5 transition-colors font-bengali ${
                    theme === "light"
                      ? "bg-[#e8f0fe] text-[#1967d2] border-[#d2e3fc]"
                      : "bg-white dark:bg-[#282a2c] text-[#3c4043] dark:text-[#bdc1c6] border-[#dadce0] dark:border-[#3c4043] hover:bg-[#f1f3f4] dark:hover:bg-[#303134]"
                  }`}
                >
                  <Sun className="w-3.5 h-3.5" />
                  <span>দিন (Light)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setTheme("dark")}
                  className={`min-h-[40px] px-3 rounded-xl text-xs font-medium border flex items-center justify-center gap-1.5 transition-colors font-bengali ${
                    theme === "dark"
                      ? "bg-[#1e3a5f] text-[#8ab4f8] border-[#2c4e7c]"
                      : "bg-white dark:bg-[#282a2c] text-[#3c4043] dark:text-[#bdc1c6] border-[#dadce0] dark:border-[#3c4043] hover:bg-[#f1f3f4] dark:hover:bg-[#303134]"
                  }`}
                >
                  <Moon className="w-3.5 h-3.5" />
                  <span>রাত (Dark)</span>
                </button>
              </div>
            </div>

            {/* Font Size */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-[#5f6368] dark:text-[#9aa0a6]">
                  Text Size
                </span>
                <span className="text-[11px] font-mono text-[#5f6368] dark:text-[#9aa0a6]">
                  {fontSize.toUpperCase()}
                </span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {(["sm", "md", "lg", "xl"] as FontSize[]).map((size) => (
                  <button
                    key={size}
                    onClick={() => onFontSizeChange(size)}
                    className={`min-h-[40px] flex items-center justify-center rounded-xl text-xs font-medium border transition-colors ${
                      fontSize === size
                        ? "bg-[#e8f0fe] dark:bg-[#1e3a5f] text-[#1967d2] dark:text-[#8ab4f8] border-[#d2e3fc] dark:border-[#2c4e7c]"
                        : "bg-white dark:bg-[#282a2c] text-[#3c4043] dark:text-[#bdc1c6] border-[#dadce0] dark:border-[#3c4043] hover:bg-[#f1f3f4] dark:hover:bg-[#303134]"
                    }`}
                  >
                    <span
                      style={{
                        fontSize:
                          size === "sm"
                            ? "13px"
                            : size === "md"
                            ? "15px"
                            : size === "lg"
                            ? "17px"
                            : "19px",
                      }}
                    >
                      A
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Translation Mode */}
            <div>
              <span className="text-xs font-medium text-[#5f6368] dark:text-[#9aa0a6] block mb-2 font-bengali">
                প্যারা অনুবাদ মোড
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => onReadingModeChange("tap-to-reveal")}
                  className={`min-h-[40px] px-3 rounded-xl text-xs font-medium border transition-colors font-bengali ${
                    readingMode === "tap-to-reveal"
                      ? "bg-[#e8f0fe] dark:bg-[#1e3a5f] text-[#1967d2] dark:text-[#8ab4f8] border-[#d2e3fc] dark:border-[#2c4e7c]"
                      : "bg-white dark:bg-[#282a2c] text-[#3c4043] dark:text-[#bdc1c6] border-[#dadce0] dark:border-[#3c4043] hover:bg-[#f1f3f4] dark:hover:bg-[#303134]"
                  }`}
                >
                  ক্লিন রিডিং (ট্যাপে অর্থ)
                </button>

                <button
                  onClick={() => onReadingModeChange("parallel")}
                  className={`min-h-[40px] px-3 rounded-xl text-xs font-medium border transition-colors font-bengali ${
                    readingMode === "parallel"
                      ? "bg-[#e8f0fe] dark:bg-[#1e3a5f] text-[#1967d2] dark:text-[#8ab4f8] border-[#d2e3fc] dark:border-[#2c4e7c]"
                      : "bg-white dark:bg-[#282a2c] text-[#3c4043] dark:text-[#bdc1c6] border-[#dadce0] dark:border-[#3c4043] hover:bg-[#f1f3f4] dark:hover:bg-[#303134]"
                  }`}
                >
                  সব অনুবাদ একসাথে
                </button>
              </div>
            </div>

            {/* Bangla Pronunciation Toggle */}
            <div className="flex items-center justify-between pt-1">
              <span className="text-xs font-medium text-[#3c4043] dark:text-[#bdc1c6] font-bengali">
                প্যারা বাংলা উচ্চারণ দেখান
              </span>
              <button
                type="button"
                onClick={onToggleBanglaPronunciation}
                className={`min-h-[34px] px-3.5 rounded-full text-xs font-medium border transition-colors font-bengali ${
                  showBanglaPronunciation
                    ? "bg-[#e8f0fe] dark:bg-[#1e3a5f] text-[#1967d2] dark:text-[#8ab4f8] border-[#d2e3fc] dark:border-[#2c4e7c]"
                    : "bg-white dark:bg-[#282a2c] text-[#5f6368] dark:text-[#9aa0a6] border-[#dadce0] dark:border-[#3c4043]"
                }`}
              >
                {showBanglaPronunciation ? "চালু" : "বন্ধ"}
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
