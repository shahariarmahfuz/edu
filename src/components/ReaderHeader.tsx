"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  SlidersHorizontal,
  Eye,
  Columns,
  Sparkles,
  Volume2,
} from "lucide-react";
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
  const [showSettingsDrawer, setShowSettingsDrawer] = useState(false);

  const difficultyColors = {
    BEGINNER: "bg-emerald-50 text-emerald-700 border-emerald-200",
    INTERMEDIATE: "bg-amber-50 text-amber-700 border-amber-200",
    ADVANCED: "bg-rose-50 text-rose-700 border-rose-200",
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200 transition-colors">
      <div className="max-w-md mx-auto px-4 py-2.5 flex items-center justify-between gap-2">
        {/* Back Link */}
        <Link
          href="/"
          className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-2xl hover:bg-slate-100 text-slate-800 active:scale-95 transition-transform"
          aria-label="Back to library"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>

        {/* Center Title & Difficulty Meta */}
        <div className="flex-1 min-w-0 text-center px-1">
          <h1 className="text-sm font-bold text-slate-900 truncate tracking-tight">
            {titleEn}
          </h1>
          <div className="flex items-center justify-center gap-2 mt-0.5 text-[11px] text-slate-500">
            <span
              className={`px-1.5 py-0.2 rounded-md font-semibold border text-[10px] ${
                difficultyColors[difficulty] || "border-slate-200"
              }`}
            >
              {difficulty.toLowerCase()}
            </span>
            <span>•</span>
            <span>{readingTimeMinutes} min read</span>
          </div>
        </div>

        {/* Quick Actions (Glossary + Settings Toggle) */}
        <div className="flex items-center gap-1">
          {vocabCount > 0 && onOpenGlossary && (
            <button
              onClick={onOpenGlossary}
              className="min-w-[44px] min-h-[44px] px-2.5 flex items-center justify-center gap-1 rounded-2xl text-xs font-bold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 active:scale-95 transition-transform"
              aria-label="Open vocabulary glossary"
            >
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span className="text-[11px]">{vocabCount}</span>
            </button>
          )}

          <button
            onClick={() => setShowSettingsDrawer(!showSettingsDrawer)}
            className={`min-w-[44px] min-h-[44px] flex items-center justify-center rounded-2xl active:scale-95 transition-transform ${
              showSettingsDrawer
                ? "bg-indigo-600 text-white"
                : "hover:bg-slate-100 text-slate-700"
            }`}
            aria-label="Reading display preferences"
          >
            <SlidersHorizontal className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Slide-down Reading Controls */}
      {showSettingsDrawer && (
        <div className="border-t border-slate-200 bg-slate-50/95 px-4 py-3 shadow-lg transition-all text-slate-900">
          <div className="max-w-md mx-auto space-y-3.5">
            {/* Bengali Pronunciation Toggle (বাংলা উচ্চারণ অন/অফ) */}
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-slate-200">
              <div className="flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-indigo-600" />
                <span className="text-xs font-bold text-slate-800">
                  বাংলা উচ্চারণ (Bangla Pronunciation)
                </span>
              </div>
              <button
                type="button"
                onClick={onToggleBanglaPronunciation}
                className={`min-h-[36px] px-3 rounded-lg text-xs font-bold transition-all ${
                  showBanglaPronunciation
                    ? "bg-indigo-600 text-white"
                    : "bg-slate-200 text-slate-700"
                }`}
              >
                {showBanglaPronunciation ? "চালু (ON)" : "বন্ধ (OFF)"}
              </button>
            </div>

            {/* Font Size Adjuster */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  Font Size (লেখার সাইজ)
                </span>
                <span className="text-xs font-mono font-bold text-indigo-600">
                  {fontSize.toUpperCase()}
                </span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {(["sm", "md", "lg", "xl"] as FontSize[]).map((size) => (
                  <button
                    key={size}
                    onClick={() => onFontSizeChange(size)}
                    className={`min-h-[44px] flex items-center justify-center rounded-xl text-xs font-bold border transition-all ${
                      fontSize === size
                        ? "bg-indigo-600 text-white border-indigo-600 shadow-xs"
                        : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
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

            {/* Bilingual Display Mode */}
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1.5">
                বাংলা অনুবাদ মোড (Translation Mode)
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => onReadingModeChange("tap-to-reveal")}
                  className={`min-h-[44px] p-2 flex items-center justify-center gap-1.5 rounded-xl text-xs font-bold border transition-all ${
                    readingMode === "tap-to-reveal"
                      ? "bg-indigo-600 text-white border-indigo-600 shadow-xs"
                      : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  <Eye className="w-4 h-4" />
                  Tap to Reveal (ট্যাপ করে দেখুন)
                </button>

                <button
                  onClick={() => onReadingModeChange("parallel")}
                  className={`min-h-[44px] p-2 flex items-center justify-center gap-1.5 rounded-xl text-xs font-bold border transition-all ${
                    readingMode === "parallel"
                      ? "bg-indigo-600 text-white border-indigo-600 shadow-xs"
                      : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  <Columns className="w-4 h-4" />
                  Always Visible (সরাসরি দেখুন)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
