import React from "react";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { Plus, ChevronRight } from "lucide-react";

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
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  const formatDifficulty = (diff: string) =>
    diff.charAt(0) + diff.slice(1).toLowerCase();

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      {/* Clean Minimal Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-md mx-auto px-5 py-3.5 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold tracking-tight text-slate-900">
              BhashaRead
            </h1>
          </div>

          <Link
            href="/upload"
            className="min-h-[40px] px-3 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 active:scale-95 flex items-center gap-1 text-xs font-semibold transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add</span>
          </Link>
        </div>
      </header>

      {/* Clean Story List */}
      <main className="max-w-md mx-auto px-5 py-4">
        <div className="mb-2">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Stories ({passages.length})
          </h2>
        </div>

        <div className="divide-y divide-slate-100">
          {passages.map((passage) => (
            <Link
              key={passage.id}
              href={`/read/${passage.slug}`}
              className="group block py-5 transition-colors active:opacity-70"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="text-[11px] font-medium text-slate-400 mb-1">
                    {passage.category} · {formatDifficulty(passage.difficulty)} ·{" "}
                    {passage.readingTimeMinutes} min
                  </div>

                  <h3 className="text-[18px] font-semibold text-slate-900 group-hover:text-slate-700 leading-snug">
                    {passage.titleEn}
                  </h3>

                  <p className="font-bengali text-[15px] text-slate-600 mt-0.5">
                    {passage.titleBn}
                  </p>

                  {passage.summaryEn && (
                    <p className="text-[13px] text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                      {passage.summaryEn}
                    </p>
                  )}
                </div>

                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500 shrink-0 transition-colors" />
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
