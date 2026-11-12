import React from "react";
import Link from "next/link";
import prisma from "@/lib/prisma";
import {
  BookOpen,
  Plus,
  Clock,
  Sparkles,
  ArrowRight,
  Bookmark,
  GraduationCap,
  Layers,
} from "lucide-react";
import { Difficulty } from "@/types/reading";

export const dynamic = "force-dynamic";

// Server Component fetching dynamically from Neon PostgreSQL
export default async function HomePage() {
  const passages = await prisma.passage.findMany({
    where: { isPublished: true },
    select: {
      id: true,
      slug: true,
      titleEn: true,
      titleBn: true,
      category: true,
      difficulty: true,
      readingTimeMinutes: true,
      summaryEn: true,
      summaryBn: true,
      _count: {
        select: {
          sections: true,
          vocabularies: true,
        },
      },
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  const difficultyBadge = {
    BEGINNER: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    INTERMEDIATE: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    ADVANCED: "bg-rose-500/15 text-rose-400 border-rose-500/30",
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-24">
      {/* Mobile Top App Bar */}
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/30">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-base font-bold tracking-tight text-white flex items-center gap-1.5">
                <span>BhashaRead</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-md bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                  EN / BN
                </span>
              </h1>
              <p className="font-bengali text-[11px] text-slate-400">
                সহজে ইংরেজি রিডিং ও বাংলা অর্থ
              </p>
            </div>
          </div>

          <Link
            href="/upload"
            className="min-h-[44px] min-w-[44px] px-3 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 hover:bg-indigo-600/30 active:scale-95 flex items-center justify-center gap-1.5 text-xs font-semibold transition-all"
            aria-label="Upload new passage"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add</span>
          </Link>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-md mx-auto px-4 pt-5">
        {/* Welcome Hero Card */}
        <section className="mb-6 p-4 rounded-3xl bg-linear-to-br from-indigo-950 via-slate-900 to-slate-900 border border-indigo-500/20 relative overflow-hidden shadow-lg">
          <div className="relative z-10">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-indigo-400 mb-1 block">
              Bilingual Immersion
            </span>
            <h2 className="text-xl font-bold text-white leading-snug">
              Master English Reading with Interactive Bengali Meanings
            </h2>
            <p className="text-xs text-slate-300 mt-1.5 leading-relaxed font-bengali">
              প্রতিটি বাক্য স্পর্শ করে বাংলা অনুবাদ দেখুন এবং নতুন শব্দার্থের সঠিক উচ্চারণ শুনুন।
            </p>

            <div className="flex items-center gap-4 mt-3 text-[11px] text-slate-400 font-medium">
              <span className="flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
                {passages.length} Stories
              </span>
              <span className="flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Interactive Vocab
              </span>
              <span className="flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-emerald-400" />
                Tap-to-Reveal
              </span>
            </div>
          </div>
        </section>

        {/* Section Heading */}
        <div className="flex items-center justify-between mb-3 px-1">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
            Reading Library
          </h3>
          <span className="text-xs text-slate-500 font-medium">
            {passages.length} available
          </span>
        </div>

        {/* Passage Cards List */}
        <div className="space-y-3.5">
          {passages.map((passage) => (
            <Link
              key={passage.id}
              href={`/read/${passage.slug}`}
              className="block group p-4 rounded-3xl bg-slate-900/90 border border-slate-800/80 hover:border-indigo-500/50 hover:bg-slate-900 active:scale-[0.99] transition-all shadow-xs"
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-indigo-400">
                  {passage.category}
                </span>

                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                    difficultyBadge[passage.difficulty]
                  }`}
                >
                  {passage.difficulty.toLowerCase()}
                </span>
              </div>

              <h4 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors">
                {passage.titleEn}
              </h4>

              <p className="font-bengali text-sm text-slate-400 mt-0.5 font-medium">
                {passage.titleBn}
              </p>

              {passage.summaryEn && (
                <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                  {passage.summaryEn}
                </p>
              )}

              {/* Bottom Card Meta (Reading Time & Vocab Count) */}
              <div className="mt-3.5 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 text-[11px]">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    {passage.readingTimeMinutes} min
                  </span>

                  <span className="flex items-center gap-1 text-[11px] text-indigo-400">
                    <Sparkles className="w-3.5 h-3.5" />
                    {passage._count.vocabularies} words
                  </span>
                </div>

                <div className="flex items-center gap-1 text-xs font-semibold text-indigo-400 group-hover:translate-x-0.5 transition-transform">
                  Read
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>

      {/* Floating Bottom Nav for Mobile Ergonomics */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-md border-t border-slate-800">
        <div className="max-w-md mx-auto px-6 py-2 flex items-center justify-around">
          <Link
            href="/"
            className="min-h-[44px] min-w-[44px] flex flex-col items-center justify-center gap-1 text-indigo-400 active:scale-95"
          >
            <BookOpen className="w-5 h-5" />
            <span className="text-[10px] font-semibold">Library</span>
          </Link>

          <Link
            href="/upload"
            className="min-h-[44px] min-w-[44px] flex flex-col items-center justify-center gap-1 text-slate-400 hover:text-slate-200 active:scale-95"
          >
            <Plus className="w-5 h-5" />
            <span className="text-[10px] font-semibold">Add Story</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}
