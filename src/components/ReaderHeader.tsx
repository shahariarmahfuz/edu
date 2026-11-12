"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, SlidersHorizontal, BookMarked } from "lucide-react";
import { FontSize, ReadingMode, Difficulty } from "@/types/reading";

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

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-[#e8eaed]">
      <div className="max-w-lg mx-auto px-4 h-14 flex items-center justify-between gap-2">
        <Link
          href="/"
          className="min-w-[44px] min-h-[44px] -ml-2 flex items-center justify-center rounded-full hover:bg-[#f1f3f4] text-[#3c4043] active:scale-95 transition-colors"
          aria-label="Back to library"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>

        <div className="flex-1 min-w-0 px-1">
          <span className="block text-[15px] font-medium text-[#202124] truncate">
            {titleEn}
          </span>
        </div>

        <div className="flex items-center gap-0.5 -mr-1.5">
          {vocabCount > 0 && onOpenGlossary && (
            <button
              onClick={onOpenGlossary}
              className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full hover:bg-[#f1f3f4] text-[#5f6368] hover:text-[#202124] active:scale-95 transition-colors"
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
                ? "bg-[#e8f0fe] text-[#1967d2]"
                : "hover:bg-[#f1f3f4] text-[#5f6368] hover:text-[#202124]"
            }`}
            aria-label="Display settings"
          >
            <SlidersHorizontal className="w-[19px] h-[19px]" />
          </button>
        </div>
      </div>

      {/* Clean Minimal Display Settings */}
      {showSettings && (
        <div className="border-t border-[#e8eaed] bg-[#f8f9fa] px-5 py-4 shadow-sm">
          <div className="max-w-lg mx-auto space-y-4">
            {/* Font Size */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-[#5f6368]">
                  Text Size
                </span>
                <span className="text-[11px] font-mono text-[#5f6368]">
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
                        ? "bg-[#e8f0fe] text-[#1967d2] border-[#d2e3fc]"
                        : "bg-white text-[#3c4043] border-[#dadce0] hover:bg-[#f1f3f4]"
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
              <span className="text-xs font-medium text-[#5f6368] block mb-2 font-bengali">
                প্যারা অনুবাদ মোড
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => onReadingModeChange("tap-to-reveal")}
                  className={`min-h-[40px] px-3 rounded-xl text-xs font-medium border transition-colors font-bengali ${
                    readingMode === "tap-to-reveal"
                      ? "bg-[#e8f0fe] text-[#1967d2] border-[#d2e3fc]"
                      : "bg-white text-[#3c4043] border-[#dadce0] hover:bg-[#f1f3f4]"
                  }`}
                >
                  ক্লিন রিডিং (ট্যাপে অর্থ)
                </button>

                <button
                  onClick={() => onReadingModeChange("parallel")}
                  className={`min-h-[40px] px-3 rounded-xl text-xs font-medium border transition-colors font-bengali ${
                    readingMode === "parallel"
                      ? "bg-[#e8f0fe] text-[#1967d2] border-[#d2e3fc]"
                      : "bg-white text-[#3c4043] border-[#dadce0] hover:bg-[#f1f3f4]"
                  }`}
                >
                  সব অনুবাদ একসাথে
                </button>
              </div>
            </div>

            {/* Bangla Pronunciation Toggle */}
            <div className="flex items-center justify-between pt-1">
              <span className="text-xs font-medium text-[#3c4043] font-bengali">
                প্যারা বাংলা উচ্চারণ দেখান
              </span>
              <button
                type="button"
                onClick={onToggleBanglaPronunciation}
                className={`min-h-[34px] px-3.5 rounded-full text-xs font-medium border transition-colors font-bengali ${
                  showBanglaPronunciation
                    ? "bg-[#e8f0fe] text-[#1967d2] border-[#d2e3fc]"
                    : "bg-white text-[#5f6368] border-[#dadce0]"
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
