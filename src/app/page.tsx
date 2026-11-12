import React from "react";
import Link from "next/link";
import prisma from "@/lib/prisma";
import {
  BookOpen,
  Plus,
  Clock,
  Sparkles,
  ArrowRight,
  GraduationCap,
  Layers,
} from "lucide-react";

export const dynamic = "force-dynamic";

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
    BEGINNER: "bg-emerald-50 text-emerald-700 border-emerald-200",
    INTERMEDIATE: "bg-amber-50 text-amber-700 border-amber-200",
    ADVANCED: "bg-rose-50 text-rose-700 border-rose-200",
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-24 font-sans">
      {/* Mobile Top App Bar (Light Mode) */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/20">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-base font-bold tracking-tight text-slate-900 flex items-center gap-1.5">
                <span>BhashaRead</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200 font-bold">
                  EN / BN
                </span>
              </h1>
              <p className="font-bengali text-[11px] text-slate-500 font-semibold">
                সহজে ইংরেজি রিডিং ও বাংলা অর্থ
              </p>
            </div>
          </div>

          <Link
            href="/upload"
            className="min-h-[44px] min-w-[44px] px-3.5 rounded-2xl bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100 active:scale-95 flex items-center justify-center gap-1.5 text-xs font-bold transition-all"
            aria-label="Upload new passage"
          >
            <Plus className="w-4 h-4" />
            <span>Add</span>
          </Link>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-md mx-auto px-4 pt-5">
        {/* Welcome Hero Card */}
        <section className="mb-6 p-5 rounded-3xl bg-linear-to-br from-indigo-50 via-white to-slate-50 border border-indigo-100 shadow-sm relative overflow-hidden">
          <div className="relative z-10">
            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 mb-1 block">
              Bilingual English Reading
            </span>
            <h2 className="text-xl font-bold text-slate-900 leading-snug">
              প্রতিটি শব্দ স্পর্শ করে বাংলা উচ্চারণ ও অর্থ শিখুন
            </h2>
            <p className="text-xs text-slate-600 mt-1.5 leading-relaxed font-bengali font-medium">
              প্যাসেজ পড়ার সময় যেকোনো শব্দে ট্যাপ করলেই সঠিক উচ্চারণ, বাংলা অর্থ ও উদাহরণ দেখা যাবে।
            </p>

            <div className="flex items-center gap-4 mt-3.5 text-[11px] text-slate-600 font-semibold">
              <span className="flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                {passages.length} Stories
              </span>
              <span className="flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                Interactive Vocab
              </span>
              <span className="flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-emerald-600" />
                বাংলা উচ্চারণ ও অর্থ
              </span>
            </div>
          </div>
        </section>

        {/* Section Heading */}
        <div className="flex items-center justify-between mb-3 px-1">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Reading Library (গল্পের তালিকা)
          </h3>
          <span className="text-xs text-slate-500 font-bold">
            {passages.length} available
          </span>
        </div>

        {/* Passage Cards List */}
        <div className="space-y-3.5">
          {passages.map((passage) => (
            <Link
              key={passage.id}
              href={`/read/${passage.slug}`}
              className="block group p-4 rounded-3xl bg-white border border-slate-200/90 hover:border-indigo-400 hover:shadow-md active:scale-[0.99] transition-all shadow-xs"
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600">
                  {passage.category}
                </span>

                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    difficultyBadge[passage.difficulty]
                  }`}
                >
                  {passage.difficulty.toLowerCase()}
                </span>
              </div>

              <h4 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                {passage.titleEn}
              </h4>

              <p className="font-bengali text-sm text-slate-600 mt-0.5 font-bold">
                {passage.titleBn}
              </p>

              {passage.summaryEn && (
                <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                  {passage.summaryEn}
                </p>
              )}

              {/* Bottom Card Meta */}
              <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 text-[11px] font-medium">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    {passage.readingTimeMinutes} min
                  </span>

                  <span className="flex items-center gap-1 text-[11px] font-bold text-indigo-600">
                    <Sparkles className="w-3.5 h-3.5" />
                    {passage._count.vocabularies} words
                  </span>
                </div>

                <div className="flex items-center gap-1 text-xs font-bold text-indigo-600 group-hover:translate-x-0.5 transition-transform">
                  Read
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>

      {/* Floating Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-md">
        <div className="max-w-md mx-auto px-6 py-2 flex items-center justify-around">
          <Link
            href="/"
            className="min-h-[44px] min-w-[44px] flex flex-col items-center justify-center gap-1 text-indigo-600 active:scale-95"
          >
            <BookOpen className="w-5 h-5" />
            <span className="text-[10px] font-bold">Library</span>
          </Link>

          <Link
            href="/upload"
            className="min-h-[44px] min-w-[44px] flex flex-col items-center justify-center gap-1 text-slate-500 hover:text-slate-800 active:scale-95"
          >
            <Plus className="w-5 h-5" />
            <span className="text-[10px] font-bold">Add Story</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}
