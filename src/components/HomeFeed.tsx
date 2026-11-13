"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  Menu,
  X,
  Plus,
  BookA,
  ArrowRight,
  Play,
  Moon,
  Sun,
} from "lucide-react";
import { PassageListItem, Difficulty } from "@/types/reading";
import { useTheme } from "./ThemeProvider";

interface HomeFeedProps {
  passages: PassageListItem[];
  totalVocabCount: number;
}

export default function HomeFeed({
  passages,
  totalVocabCount,
}: HomeFeedProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { theme, setTheme } = useTheme();

  const filteredPassages = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return passages;
    return passages.filter(
      (p) =>
        p.titleEn.toLowerCase().includes(q) ||
        p.titleBn.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        (p.summaryEn && p.summaryEn.toLowerCase().includes(q))
    );
  }, [passages, searchQuery]);

  const featuredPassage = passages[0];

  const difficultyLabels: Record<Difficulty, string> = {
    BEGINNER: "Beginner",
    INTERMEDIATE: "Intermediate",
    ADVANCED: "Advanced",
  };

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#131314] text-[#202124] dark:text-[#e8eaed] font-english transition-colors duration-150">
      {/* Clean Editorial Google-Style Header */}
      <header className="sticky top-0 z-40 bg-white dark:bg-[#131314] border-b border-[#e8eaed] dark:border-[#303134]">
        <div className="max-w-lg mx-auto px-5 h-14 flex items-center justify-between gap-2">
          {/* Minimal Clean Brand Title */}
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-[19px] font-medium tracking-tight text-[#202124] dark:text-[#e8eaed] leading-none">
              BhashaRead
            </span>
          </Link>

          {/* Clean Header Action Controls */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => {
                setSearchOpen((prev) => !prev);
                setMenuOpen(false);
              }}
              className={`min-w-[40px] min-h-[40px] rounded-full flex items-center justify-center transition-colors active:scale-95 ${
                searchOpen
                  ? "bg-[#e8f0fe] dark:bg-[#1e3a5f] text-[#1967d2] dark:text-[#8ab4f8]"
                  : "text-[#5f6368] dark:text-[#9aa0a6] hover:bg-[#f1f3f4] dark:hover:bg-[#282a2c] hover:text-[#202124] dark:hover:text-[#e8eaed]"
              }`}
              aria-label="Search stories"
              title="Search stories"
            >
              <Search className="w-[19px] h-[19px]" />
            </button>

            <button
              type="button"
              onClick={() => {
                setMenuOpen((prev) => !prev);
                setSearchOpen(false);
              }}
              className={`min-w-[40px] min-h-[40px] rounded-full flex items-center justify-center transition-colors active:scale-95 ${
                menuOpen
                  ? "bg-[#e8f0fe] dark:bg-[#1e3a5f] text-[#1967d2] dark:text-[#8ab4f8]"
                  : "text-[#5f6368] dark:text-[#9aa0a6] hover:bg-[#f1f3f4] dark:hover:bg-[#282a2c] hover:text-[#202124] dark:hover:text-[#e8eaed]"
              }`}
              aria-label="Toggle Menu"
              title="Menu"
            >
              {menuOpen ? (
                <X className="w-[19px] h-[19px]" />
              ) : (
                <Menu className="w-[19px] h-[19px]" />
              )}
            </button>
          </div>
        </div>

        {/* Expandable Search Input */}
        {searchOpen && (
          <div className="border-t border-[#e8eaed] dark:border-[#303134] bg-[#f8f9fa] dark:bg-[#1e1f20] px-5 py-3">
            <div className="max-w-lg mx-auto relative">
              <Search className="w-4 h-4 text-[#5f6368] dark:text-[#9aa0a6] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="গল্পের নাম বা বিষয় খুঁজুন..."
                className="w-full min-h-[42px] pl-10 pr-9 rounded-full bg-white dark:bg-[#131314] border border-[#dadce0] dark:border-[#3c4043] text-sm text-[#202124] dark:text-[#e8eaed] placeholder:text-[#5f6368] dark:placeholder:text-[#9aa0a6] focus:outline-hidden focus:ring-2 focus:ring-[#1a73e8]/25 dark:focus:ring-[#8ab4f8]/25 focus:border-[#1a73e8] dark:focus:border-[#8ab4f8]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#5f6368] dark:text-[#9aa0a6] hover:text-[#202124] dark:hover:text-[#e8eaed]"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Slide-Down Menu Drawer */}
        {menuOpen && (
          <div className="border-t border-[#e8eaed] dark:border-[#303134] bg-white dark:bg-[#1e1f20] px-5 py-4 shadow-lg">
            <div className="max-w-lg mx-auto space-y-2.5">
              {/* Menu Item 1: Dictionary */}
              <Link
                href="/vocabulary"
                onClick={() => setMenuOpen(false)}
                className="min-h-[52px] px-3.5 py-2.5 rounded-2xl bg-[#f8f9fa] dark:bg-[#282a2c] hover:bg-[#e8f0fe]/60 dark:hover:bg-[#1e3a5f]/50 border border-[#e8eaed] dark:border-[#3c4043] flex items-center justify-between gap-3 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-full bg-[#e8f0fe] dark:bg-[#1e3a5f] text-[#1967d2] dark:text-[#8ab4f8] flex items-center justify-center shrink-0">
                    <BookA className="w-[18px] h-[18px]" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[13.5px] font-medium text-[#202124] dark:text-[#e8eaed]">
                      Dictionary
                    </div>
                    <div className="font-bengali text-[12px] text-[#5f6368] dark:text-[#9aa0a6] truncate">
                      শব্দকোষ ({totalVocabCount}+ শব্দ)
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-[#5f6368] dark:text-[#9aa0a6] shrink-0" />
              </Link>

              {/* Menu Item 2: Add Story */}
              <Link
                href="/upload"
                onClick={() => setMenuOpen(false)}
                className="min-h-[52px] px-3.5 py-2.5 rounded-2xl bg-[#f8f9fa] dark:bg-[#282a2c] hover:bg-[#e8f0fe]/60 dark:hover:bg-[#1e3a5f]/50 border border-[#e8eaed] dark:border-[#3c4043] flex items-center justify-between gap-3 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-full bg-[#e8f0fe] dark:bg-[#1e3a5f] text-[#1967d2] dark:text-[#8ab4f8] flex items-center justify-center shrink-0">
                    <Plus className="w-[18px] h-[18px]" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[13.5px] font-medium text-[#202124] dark:text-[#e8eaed]">
                      Add Story
                    </div>
                    <div className="font-bengali text-[12px] text-[#5f6368] dark:text-[#9aa0a6] truncate">
                      নতুন গল্প যোগ করুন
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-[#5f6368] dark:text-[#9aa0a6] shrink-0" />
              </Link>

              {/* Menu Item 3: Appearance / Theme Switcher */}
              <div className="px-3.5 py-2.5 rounded-2xl bg-[#f8f9fa] dark:bg-[#282a2c] border border-[#e8eaed] dark:border-[#3c4043] flex items-center justify-between gap-3">
                <span className="text-[13px] font-medium text-[#202124] dark:text-[#e8eaed] font-bengali">
                  Appearance · থিম
                </span>
                <div className="grid grid-cols-2 p-0.5 rounded-xl bg-[#e8eaed]/80 dark:bg-[#131314] gap-1">
                  <button
                    type="button"
                    onClick={() => setTheme("light")}
                    className={`min-h-[34px] px-3 rounded-[10px] text-xs font-medium flex items-center justify-center gap-1.5 transition-colors font-bengali ${
                      theme === "light"
                        ? "bg-white text-[#1967d2] shadow-2xs"
                        : "text-[#5f6368] dark:text-[#9aa0a6] hover:text-[#202124] dark:hover:text-[#e8eaed]"
                    }`}
                  >
                    <Sun className="w-3.5 h-3.5" />
                    <span>দিন</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setTheme("dark")}
                    className={`min-h-[34px] px-3 rounded-[10px] text-xs font-medium flex items-center justify-center gap-1.5 transition-colors font-bengali ${
                      theme === "dark"
                        ? "bg-[#1e3a5f] text-[#8ab4f8] shadow-2xs"
                        : "text-[#5f6368] dark:text-[#9aa0a6] hover:text-[#202124] dark:hover:text-[#e8eaed]"
                    }`}
                  >
                    <Moon className="w-3.5 h-3.5" />
                    <span>রাত</span>
                  </button>
                </div>
              </div>

              {/* Menu Item 4: Quick Start Reading CTA */}
              {featuredPassage && (
                <Link
                  href={`/read/${featuredPassage.slug}`}
                  onClick={() => setMenuOpen(false)}
                  className="min-h-[44px] w-full px-4 py-2.5 rounded-full bg-[#1a73e8] dark:bg-[#8ab4f8] hover:bg-[#174ea6] dark:hover:bg-[#aecbfa] text-white dark:text-[#131314] flex items-center justify-between transition-colors"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <Play className="w-3.5 h-3.5 fill-current shrink-0" />
                    <span className="text-[13px] font-medium font-bengali truncate">
                      পড়া শুরু করুন: {featuredPassage.titleEn}
                    </span>
                  </div>
                  <ArrowRight className="w-4 h-4 shrink-0" />
                </Link>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-lg w-full mx-auto px-5 pt-5 pb-12">
        <div className="pb-2">
          <h1 className="text-xs font-medium uppercase tracking-wider text-[#5f6368] dark:text-[#9aa0a6]">
            Stories ({filteredPassages.length})
          </h1>
        </div>

        {/* Crisp Editorial Story Feed (No clutter cards) */}
        <section className="divide-y divide-[#e8eaed] dark:divide-[#303134]">
          {filteredPassages.length === 0 ? (
            <div className="py-12 text-center space-y-2.5">
              <p className="font-bengali text-[15px] text-[#3c4043] dark:text-[#bdc1c6]">
                কোনো গল্প খুঁজে পাওয়া যায়নি
              </p>
              <button
                onClick={() => setSearchQuery("")}
                className="text-[13px] font-medium text-[#1a73e8] dark:text-[#8ab4f8] hover:underline"
              >
                সব গল্প দেখুন (Reset Search)
              </button>
            </div>
          ) : (
            filteredPassages.map((passage) => {
              return (
                <Link
                  key={passage.id}
                  href={`/read/${passage.slug}`}
                  className="group block py-6 transition-colors active:opacity-75"
                >
                  {/* Clean Meta Eyebrow */}
                  <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-[12.5px] text-[#5f6368] dark:text-[#9aa0a6] mb-2">
                    <span className="font-medium text-[#1a73e8] dark:text-[#8ab4f8]">
                      {passage.category}
                    </span>
                    <span>·</span>
                    <span>{difficultyLabels[passage.difficulty]}</span>
                    <span>·</span>
                    <span>{passage.readingTimeMinutes} min read</span>
                  </div>

                  {/* Clean Readable English Headline */}
                  <h2 className="text-[21px] font-normal tracking-[-0.01em] text-[#202124] dark:text-[#e8eaed] group-hover:text-[#1a73e8] dark:group-hover:text-[#8ab4f8] leading-[1.3] transition-colors">
                    {passage.titleEn}
                  </h2>

                  {/* Clear Bengali Title */}
                  <p className="font-bengali text-[15.5px] font-normal text-[#3c4043] dark:text-[#bdc1c6] mt-1 leading-relaxed">
                    {passage.titleBn}
                  </p>

                  {/* Crisp High-Contrast Summary */}
                  {passage.summaryEn && (
                    <p className="text-[15px] text-[#5f6368] dark:text-[#9aa0a6] mt-2.5 line-clamp-2 leading-[1.6]">
                      {passage.summaryEn}
                    </p>
                  )}
                </Link>
              );
            })
          )}
        </section>
      </main>

      {/* Minimal Calm Footer */}
      <footer className="bg-[#f8f9fa] dark:bg-[#1e1f20] border-t border-[#e8eaed] dark:border-[#303134] mt-auto">
        <div className="max-w-lg mx-auto px-5 py-6 space-y-3">
          <div className="flex items-center justify-between gap-4">
            <span className="text-sm font-medium text-[#202124] dark:text-[#e8eaed]">
              BhashaRead
            </span>

            <div className="flex items-center gap-5 text-[13px] text-[#5f6368] dark:text-[#9aa0a6]">
              <Link
                href="/"
                className="hover:text-[#1a73e8] dark:hover:text-[#8ab4f8] transition-colors"
              >
                Stories
              </Link>
              <Link
                href="/vocabulary"
                className="hover:text-[#1a73e8] dark:hover:text-[#8ab4f8] transition-colors"
              >
                Dictionary
              </Link>
              <Link
                href="/upload"
                className="hover:text-[#1a73e8] dark:hover:text-[#8ab4f8] transition-colors"
              >
                Add Story
              </Link>
            </div>
          </div>

          <p className="font-bengali text-[12.5px] text-[#5f6368] dark:text-[#9aa0a6] leading-relaxed">
            প্রতিদিন সহজ ইংরেজি গল্প ও বাংলা অর্থ অনুশীলন · {totalVocabCount}+ সংরক্ষিত শব্দ
          </p>
        </div>
      </footer>
    </div>
  );
}
