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
  difficulty,
  readingTimeMinutes,
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
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-100">
      <div className="max-w-md mx-auto px-4 py-2.5 flex items-center justify-between gap-2">
        <Link
          href="/"
          className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-700 active:scale-95 transition-transform"
          aria-label="Back to library"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>

        <div className="flex-1 min-w-0 text-center px-2">
          <h1 className="text-sm font-semibold text-slate-900 truncate">
            {titleEn}
          </h1>
          <p className="text-[11px] text-slate-400">
            {difficulty.toLowerCase()} · {readingTimeMinutes} min
          </p>
        </div>

        <div className="flex items-center gap-0.5">
          {vocabCount > 0 && onOpenGlossary && (
            <button
              onClick={onOpenGlossary}
              className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-600 active:scale-95 transition-transform"
              aria-label="Vocabulary glossary"
              title="শব্দকোষ"
            >
              <BookMarked className="w-[18px] h-[18px]" />
            </button>
          )}

          <button
            onClick={() => setShowSettings(!showSettings)}
            className={`min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full active:scale-95 transition-colors ${
              showSettings
                ? "bg-slate-900 text-white"
                : "hover:bg-slate-100 text-slate-700"
            }`}
            aria-label="Display settings"
          >
            <SlidersHorizontal className="w-[18px] h-[18px]" />
          </button>
        </div>
      </div>

      {/* Clean Minimal Display Settings */}
      {showSettings && (
        <div className="border-t border-slate-100 bg-white px-5 py-4 shadow-md">
          <div className="max-w-md mx-auto space-y-4">
            {/* Bangla Pronunciation Toggle */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-700 font-bengali">
                বাংলা উচ্চারণ দেখান
              </span>
              <button
                type="button"
                onClick={onToggleBanglaPronunciation}
                className={`min-h-[34px] px-3 rounded-full text-xs font-semibold transition-colors ${
                  showBanglaPronunciation
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                {showBanglaPronunciation ? "চালু" : "বন্ধ"}
              </button>
            </div>

            {/* Font Size */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-slate-500">
                  Font Size
                </span>
                <span className="text-[11px] font-mono text-slate-400">
                  {fontSize.toUpperCase()}
                </span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {(["sm", "md", "lg", "xl"] as FontSize[]).map((size) => (
                  <button
                    key={size}
                    onClick={() => onFontSizeChange(size)}
                    className={`min-h-[40px] flex items-center justify-center rounded-xl text-xs font-semibold border transition-colors ${
                      fontSize === size
                        ? "bg-slate-900 text-white border-slate-900"
                        : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
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
              <span className="text-xs font-medium text-slate-500 block mb-2 font-bengali">
                বাংলা অনুবাদ
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => onReadingModeChange("tap-to-reveal")}
                  className={`min-h-[40px] px-3 rounded-xl text-xs font-medium border transition-colors font-bengali ${
                    readingMode === "tap-to-reveal"
                      ? "bg-slate-900 text-white border-slate-900"
                      : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  ট্যাপ করে দেখুন
                </button>

                <button
                  onClick={() => onReadingModeChange("parallel")}
                  className={`min-h-[40px] px-3 rounded-xl text-xs font-medium border transition-colors font-bengali ${
                    readingMode === "parallel"
                      ? "bg-slate-900 text-white border-slate-900"
                      : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  সরাসরি দেখুন
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
