"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  BookOpen,
  Search,
  Menu,
  X,
  Plus,
  BookA,
  ArrowRight,
  Clock,
  Sparkles,
  Play,
  SlidersHorizontal,
} from "lucide-react";
import { PassageListItem, Difficulty } from "@/types/reading";

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
  const [selectedDifficulty, setSelectedDifficulty] = useState<
    "ALL" | Difficulty
  >("ALL");

  const filteredPassages = useMemo(() => {
    return passages.filter((p) => {
      const matchesDifficulty =
        selectedDifficulty === "ALL" || p.difficulty === selectedDifficulty;

      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        p.titleEn.toLowerCase().includes(q) ||
        p.titleBn.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        (p.summaryEn && p.summaryEn.toLowerCase().includes(q));

      return matchesDifficulty && matchesSearch;
    });
  }, [passages, selectedDifficulty, searchQuery]);

  const featuredPassage = passages[0];

  const difficultyStyles: Record<
    Difficulty,
    { label: string; dot: string; text: string; bg: string }
  > = {
    BEGINNER: {
      label: "Beginner",
      dot: "bg-emerald-500",
      text: "text-emerald-700",
      bg: "bg-emerald-50 border-emerald-200/70",
    },
    INTERMEDIATE: {
      label: "Intermediate",
      dot: "bg-amber-500",
      text: "text-amber-700",
      bg: "bg-amber-50 border-amber-200/70",
    },
    ADVANCED: {
      label: "Advanced",
      dot: "bg-rose-500",
      text: "text-rose-700",
      bg: "bg-rose-50 border-rose-200/70",
    },
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f5f6f8] text-slate-900 font-sans">
      {/* Stylish Sticky Header with Menu */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-[0_1px_2px_rgba(15,23,42,0.03)]">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between gap-2">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-sm shadow-indigo-600/20 group-active:scale-95 transition-transform">
              <BookOpen className="w-[18px] h-[18px]" />
            </div>
            <div>
              <span className="text-[16px] font-bold tracking-tight text-slate-900 block leading-none">
                BhashaRead
              </span>
              <span className="font-bengali text-[11px] font-medium text-slate-500 mt-0.5 block leading-none">
                ইংরেজি থেকে বাংলা রিডার
              </span>
            </div>
          </Link>

          {/* Header Useful Action Buttons */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => {
                setSearchOpen((prev) => !prev);
                setMenuOpen(false);
              }}
              className={`min-w-[40px] min-h-[40px] rounded-xl flex items-center justify-center transition-colors active:scale-95 ${
                searchOpen
                  ? "bg-indigo-50 text-indigo-600"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
              aria-label="Search stories"
              title="Search stories"
            >
              <Search className="w-[18px] h-[18px]" />
            </button>

            <Link
              href="/vocabulary"
              className="min-w-[40px] min-h-[40px] rounded-xl flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors active:scale-95"
              aria-label="Vocabulary Dictionary"
              title="Dictionary"
            >
              <BookA className="w-[18px] h-[18px]" />
            </Link>

            <button
              type="button"
              onClick={() => {
                setMenuOpen((prev) => !prev);
                setSearchOpen(false);
              }}
              className={`min-w-[40px] min-h-[40px] rounded-xl flex items-center justify-center transition-colors active:scale-95 ${
                menuOpen
                  ? "bg-slate-900 text-white"
                  : "text-slate-700 hover:bg-slate-100"
              }`}
              aria-label="Toggle Menu"
              title="Menu"
            >
              {menuOpen ? (
                <X className="w-[18px] h-[18px]" />
              ) : (
                <Menu className="w-[18px] h-[18px]" />
              )}
            </button>
          </div>
        </div>

        {/* Expandable Search Input */}
        {searchOpen && (
          <div className="border-t border-slate-100 bg-white px-4 py-3">
            <div className="max-w-md mx-auto relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="গল্পের নাম বা বিষয় লিখুন (Search)..."
                className="w-full min-h-[42px] pl-10 pr-9 rounded-xl bg-slate-100/90 border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/25 focus:border-indigo-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-700"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Stylish Slide-Down Header Menu */}
        {menuOpen && (
          <div className="border-t border-slate-100 bg-white px-4 py-3.5 shadow-lg">
            <div className="max-w-md mx-auto space-y-2">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-1 mb-1">
                Navigation Menu
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/vocabulary"
                  onClick={() => setMenuOpen(false)}
                  className="min-h-[48px] p-3 rounded-2xl bg-slate-50 hover:bg-indigo-50/70 border border-slate-200/80 flex items-center gap-2.5 transition-colors active:scale-98"
                >
                  <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
                    <BookA className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-slate-900">
                      Dictionary
                    </div>
                    <div className="font-bengali text-[11px] text-slate-500 truncate">
                      শব্দকোষ ({totalVocabCount}+)
                    </div>
                  </div>
                </Link>

                <Link
                  href="/upload"
                  onClick={() => setMenuOpen(false)}
                  className="min-h-[48px] p-3 rounded-2xl bg-slate-50 hover:bg-emerald-50/70 border border-slate-200/80 flex items-center gap-2.5 transition-colors active:scale-98"
                >
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <Plus className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-slate-900">
                      Add Story
                    </div>
                    <div className="font-bengali text-[11px] text-slate-500 truncate">
                      নতুন JSON যোগ করুন
                    </div>
                  </div>
                </Link>
              </div>

              {featuredPassage && (
                <Link
                  href={`/read/${featuredPassage.slug}`}
                  onClick={() => setMenuOpen(false)}
                  className="min-h-[46px] w-full px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-between transition-colors active:scale-98"
                >
                  <div className="flex items-center gap-2">
                    <Play className="w-4 h-4 fill-current" />
                    <span className="text-xs font-bold font-bengali">
                      পড়া শুরু করুন: {featuredPassage.titleEn}
                    </span>
                  </div>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-md w-full mx-auto px-4 pt-5 pb-10 space-y-5">
        {/* Stylish Compact Overview & Quick Actions Card */}
        <section className="p-5 rounded-3xl bg-gradient-to-br from-indigo-600 via-indigo-600 to-violet-700 text-white shadow-md shadow-indigo-600/15 relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-indigo-100/90">
                Daily English Practice
              </span>
              <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-white/15 text-white">
                {passages.length} Stories · {totalVocabCount}+ Words
              </span>
            </div>

            <h1 className="font-bengali text-xl font-bold mt-2 leading-snug">
              গল্প পড়ে ইংরেজি শিখুন, প্রতিটি শব্দের উচ্চারণ ও বাংলা অর্থসহ
            </h1>

            {/* Useful Quick-Action Buttons */}
            <div className="mt-4 flex items-center gap-2">
              {featuredPassage && (
                <Link
                  href={`/read/${featuredPassage.slug}`}
                  className="min-h-[42px] px-4 rounded-xl bg-white text-indigo-700 hover:bg-indigo-50 font-bold text-xs flex items-center gap-1.5 shadow-xs active:scale-95 transition-all"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span className="font-bengali">পড়া শুরু করুন</span>
                </Link>
              )}

              <Link
                href="/vocabulary"
                className="min-h-[42px] px-3.5 rounded-xl bg-white/15 hover:bg-white/25 text-white font-semibold text-xs flex items-center gap-1.5 backdrop-blur-xs active:scale-95 transition-all"
              >
                <BookA className="w-3.5 h-3.5" />
                <span className="font-bengali">শব্দকোষ</span>
              </Link>

              <Link
                href="/upload"
                className="min-h-[42px] px-3 rounded-xl bg-white/15 hover:bg-white/25 text-white font-semibold text-xs flex items-center gap-1 active:scale-95 transition-all ml-auto"
                title="Add new story"
              >
                <Plus className="w-4 h-4" />
                <span>Add</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Interactive Level Filter Bar */}
        <section>
          <div className="flex items-center justify-between mb-2.5 px-0.5">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
              <span>Reading Library</span>
            </h2>
            <span className="text-xs font-semibold text-slate-400">
              {filteredPassages.length} shown
            </span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {(["ALL", "BEGINNER", "INTERMEDIATE", "ADVANCED"] as const).map(
              (level) => {
                const isActive = selectedDifficulty === level;
                const label =
                  level === "ALL"
                    ? "All"
                    : level.charAt(0) + level.slice(1).toLowerCase();

                return (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setSelectedDifficulty(level)}
                    className={`min-h-[36px] px-3.5 rounded-full text-xs font-semibold whitespace-nowrap border transition-all active:scale-95 ${
                      isActive
                        ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                        : "bg-white text-slate-600 border-slate-200/90 hover:border-slate-300"
                    }`}
                  >
                    {label}
                  </button>
                );
              }
            )}
          </div>
        </section>

        {/* Elevated Story Cards */}
        <section className="space-y-3">
          {filteredPassages.length === 0 ? (
            <div className="p-8 rounded-2xl bg-white border border-slate-200/80 text-center space-y-2">
              <p className="text-sm font-semibold text-slate-700">
                কোনো গল্প খুঁজে পাওয়া যায়নি
              </p>
              <button
                onClick={() => {
                  setSelectedDifficulty("ALL");
                  setSearchQuery("");
                }}
                className="text-xs font-bold text-indigo-600 hover:underline"
              >
                সব গল্প দেখুন (Reset Filters)
              </button>
            </div>
          ) : (
            filteredPassages.map((passage) => {
              const style = difficultyStyles[passage.difficulty];

              return (
                <Link
                  key={passage.id}
                  href={`/read/${passage.slug}`}
                  className="group block p-4 rounded-2xl bg-white border border-slate-200/80 shadow-[0_2px_6px_rgba(15,23,42,0.03)] hover:border-indigo-300 hover:shadow-[0_6px_16px_rgba(79,70,229,0.08)] active:scale-[0.99] transition-all"
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600">
                      {passage.category}
                    </span>

                    <span
                      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${style.bg} ${style.text}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
                      {style.label}
                    </span>
                  </div>

                  <h3 className="text-[17px] font-bold text-slate-900 group-hover:text-indigo-700 leading-snug transition-colors">
                    {passage.titleEn}
                  </h3>

                  <p className="font-bengali text-[14.5px] font-semibold text-slate-600 mt-0.5">
                    {passage.titleBn}
                  </p>

                  {passage.summaryEn && (
                    <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                      {passage.summaryEn}
                    </p>
                  )}

                  <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                    <div className="flex items-center gap-3 font-medium">
                      <span className="inline-flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {passage.readingTimeMinutes} min
                      </span>

                      <span className="inline-flex items-center gap-1 text-slate-600">
                        <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                        {passage._count.vocabularies} key words
                      </span>
                    </div>

                    <span className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 group-hover:translate-x-0.5 transition-transform">
                      পড়ুন
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </Link>
              );
            })
          )}
        </section>
      </main>

      {/* Clean, Well-Structured Footer */}
      <footer className="bg-white border-t border-slate-200/80 mt-auto">
        <div className="max-w-md mx-auto px-5 py-6 space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
                  <BookOpen className="w-3.5 h-3.5" />
                </div>
                <span className="text-sm font-bold text-slate-900">
                  BhashaRead
                </span>
              </div>
              <p className="font-bengali text-xs text-slate-500 mt-1.5 leading-relaxed">
                প্রতিদিন অল্প অল্প করে ইংরেজি পড়ার অভ্যাস গড়ে তুলুন, বাংলা উচ্চারণ ও অর্থের সহায়তায়।
              </p>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-4 font-semibold text-slate-600">
              <Link href="/" className="hover:text-indigo-600 transition-colors">
                Stories
              </Link>
              <Link
                href="/vocabulary"
                className="hover:text-indigo-600 transition-colors"
              >
                Dictionary
              </Link>
              <Link
                href="/upload"
                className="hover:text-indigo-600 transition-colors"
              >
                Add Story
              </Link>
            </div>

            <span className="text-[11px] text-slate-400 font-medium">
              © {new Date().getFullYear()} BhashaRead
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
