"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Sun,
  Moon,
  BookOpen,
  Type,
  SlidersHorizontal,
  Eye,
  Columns,
  Sparkles,
} from "lucide-react";
import { ThemeMode, FontSize, ReadingMode, Difficulty } from "@/types/reading";

interface ReaderHeaderProps {
  titleEn: string;
  difficulty: Difficulty;
  readingTimeMinutes: number;
  theme: ThemeMode;
  fontSize: FontSize;
  readingMode: ReadingMode;
  onThemeChange: (theme: ThemeMode) => void;
  onFontSizeChange: (size: FontSize) => void;
  onReadingModeChange: (mode: ReadingMode) => void;
  onOpenGlossary?: () => void;
  vocabCount?: number;
}

export default function ReaderHeader({
  titleEn,
  difficulty,
  readingTimeMinutes,
  theme,
  fontSize,
  readingMode,
  onThemeChange,
  onFontSizeChange,
  onReadingModeChange,
  onOpenGlossary,
  vocabCount = 0,
}: ReaderHeaderProps) {
  const [showSettingsDrawer, setShowSettingsDrawer] = useState(false);

  const difficultyColors = {
    BEGINNER: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
    INTERMEDIATE: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30",
    ADVANCED: "bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30",
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md transition-colors border-b duration-300">
      <div className="max-w-md mx-auto px-4 py-2.5 flex items-center justify-between gap-2">
        {/* Back Link with minimum 44px touch target */}
        <Link
          href="/"
          className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-2xl hover:bg-black/5 dark:hover:bg-white/10 active:scale-95 transition-transform"
          aria-label="Back to library"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>

        {/* Center Title & Difficulty Meta */}
        <div className="flex-1 min-w-0 text-center px-1">
          <h1 className="text-sm font-semibold truncate tracking-tight">
            {titleEn}
          </h1>
          <div className="flex items-center justify-center gap-2 mt-0.5 text-[11px] opacity-75">
            <span
              className={`px-1.5 py-0.2 rounded-md font-medium border text-[10px] ${
                difficultyColors[difficulty] || "border-slate-500/20"
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
              className="min-w-[44px] min-h-[44px] px-2 flex items-center justify-center gap-1 rounded-2xl text-xs font-medium bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500/20 active:scale-95 transition-transform"
              aria-label="Open vocabulary glossary"
            >
              <Sparkles className="w-4 h-4" />
              <span className="text-[11px] font-bold">{vocabCount}</span>
            </button>
          )}

          <button
            onClick={() => setShowSettingsDrawer(!showSettingsDrawer)}
            className={`min-w-[44px] min-h-[44px] flex items-center justify-center rounded-2xl active:scale-95 transition-transform ${
              showSettingsDrawer
                ? "bg-indigo-600 text-white"
                : "hover:bg-black/5 dark:hover:bg-white/10"
            }`}
            aria-label="Reading display preferences"
          >
            <SlidersHorizontal className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Slide-down Typography & Theme Control Drawer */}
      {showSettingsDrawer && (
        <div
          className="border-t px-4 py-3 shadow-lg transition-all"
          style={{
            backgroundColor: "var(--bg-secondary)",
            borderColor: "var(--border-color)",
          }}
        >
          <div className="max-w-md mx-auto space-y-3.5">
            {/* Theme Selector: Light, Sepia, Dark */}
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider opacity-60 block mb-1.5">
                Reading Theme
              </span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => onThemeChange("light")}
                  className={`min-h-[44px] flex items-center justify-center gap-2 rounded-xl text-xs font-medium border transition-all ${
                    theme === "light"
                      ? "bg-white text-slate-900 border-indigo-500 ring-2 ring-indigo-500/30 font-semibold shadow-xs"
                      : "bg-white/50 text-slate-700 hover:bg-white border-slate-200"
                  }`}
                >
                  <Sun className="w-4 h-4 text-amber-500" />
                  Day
                </button>

                <button
                  onClick={() => onThemeChange("sepia")}
                  className={`min-h-[44px] flex items-center justify-center gap-2 rounded-xl text-xs font-medium border transition-all ${
                    theme === "sepia"
                      ? "bg-[#f4ecd8] text-[#3d2b1f] border-[#8b5e3c] ring-2 ring-[#8b5e3c]/30 font-semibold shadow-xs"
                      : "bg-[#fbf0d9]/60 text-[#5c4331] hover:bg-[#fbf0d9] border-[#dec89c]"
                  }`}
                >
                  <BookOpen className="w-4 h-4 text-[#8b5e3c]" />
                  Sepia
                </button>

                <button
                  onClick={() => onThemeChange("dark")}
                  className={`min-h-[44px] flex items-center justify-center gap-2 rounded-xl text-xs font-medium border transition-all ${
                    theme === "dark"
                      ? "bg-slate-900 text-white border-indigo-500 ring-2 ring-indigo-500/30 font-semibold shadow-xs"
                      : "bg-slate-800/60 text-slate-300 hover:bg-slate-800 border-slate-700"
                  }`}
                >
                  <Moon className="w-4 h-4 text-indigo-400" />
                  Night
                </button>
              </div>
            </div>

            {/* Font Size Adjuster */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-semibold uppercase tracking-wider opacity-60">
                  Font Size
                </span>
                <span className="text-xs font-mono font-medium opacity-80">
                  {fontSize.toUpperCase()}
                </span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {(["sm", "md", "lg", "xl"] as FontSize[]).map((size) => (
                  <button
                    key={size}
                    onClick={() => onFontSizeChange(size)}
                    className={`min-h-[44px] flex items-center justify-center rounded-xl text-xs font-medium border transition-all ${
                      fontSize === size
                        ? "bg-indigo-600 text-white border-indigo-600 shadow-xs"
                        : "border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5"
                    }`}
                  >
                    <span
                      style={{
                        fontSize:
                          size === "sm"
                            ? "12px"
                            : size === "md"
                            ? "14px"
                            : size === "lg"
                            ? "16px"
                            : "18px",
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
              <span className="text-xs font-semibold uppercase tracking-wider opacity-60 block mb-1.5">
                Bilingual Translation Mode
              </span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => onReadingModeChange("tap-to-reveal")}
                  className={`min-h-[44px] p-2 flex flex-col items-center justify-center gap-1 rounded-xl text-[11px] font-medium border text-center transition-all ${
                    readingMode === "tap-to-reveal"
                      ? "bg-indigo-600 text-white border-indigo-600 shadow-xs"
                      : "border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 opacity-80"
                  }`}
                >
                  <Eye className="w-4 h-4" />
                  Tap to Reveal
                </button>

                <button
                  onClick={() => onReadingModeChange("parallel")}
                  className={`min-h-[44px] p-2 flex flex-col items-center justify-center gap-1 rounded-xl text-[11px] font-medium border text-center transition-all ${
                    readingMode === "parallel"
                      ? "bg-indigo-600 text-white border-indigo-600 shadow-xs"
                      : "border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 opacity-80"
                  }`}
                >
                  <Columns className="w-4 h-4" />
                  Dual Parallel
                </button>

                <button
                  onClick={() => onReadingModeChange("english-only")}
                  className={`min-h-[44px] p-2 flex flex-col items-center justify-center gap-1 rounded-xl text-[11px] font-medium border text-center transition-all ${
                    readingMode === "english-only"
                      ? "bg-indigo-600 text-white border-indigo-600 shadow-xs"
                      : "border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 opacity-80"
                  }`}
                >
                  <Type className="w-4 h-4" />
                  English Only
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
