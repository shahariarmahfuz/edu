"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { ArrowLeft, Search, Volume2, BookOpen, X } from "lucide-react";
import { VocabularyItem } from "@/types/reading";

interface VocabWithPassage extends VocabularyItem {
  passage?: {
    slug: string;
    titleEn: string;
    titleBn: string;
  } | null;
}

interface VocabularyExplorerProps {
  dbVocabularies: VocabWithPassage[];
  builtinDictionary: VocabWithPassage[];
}

export default function VocabularyExplorer({
  dbVocabularies,
  builtinDictionary,
}: VocabularyExplorerProps) {
  const [query, setQuery] = useState("");
  const [sourceFilter, setSourceFilter] = useState<"all" | "stories">("all");
  const [playingWord, setPlayingWord] = useState<string | null>(null);

  const combinedList = useMemo(() => {
    if (sourceFilter === "stories") {
      return dbVocabularies;
    }
    // Deduplicate by lowercase clean word, preferring DB story entries first
    const seen = new Set<string>();
    const merged: VocabWithPassage[] = [];

    for (const item of dbVocabularies) {
      const key = (item.cleanWord || item.word).toLowerCase().trim();
      if (!seen.has(key)) {
        seen.add(key);
        merged.push(item);
      }
    }
    for (const item of builtinDictionary) {
      const key = (item.cleanWord || item.word).toLowerCase().trim();
      if (!seen.has(key)) {
        seen.add(key);
        merged.push(item);
      }
    }
    return merged.sort((a, b) => a.word.localeCompare(b.word));
  }, [dbVocabularies, builtinDictionary, sourceFilter]);

  const filteredList = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return combinedList;
    return combinedList.filter(
      (v) =>
        v.word.toLowerCase().includes(q) ||
        v.bengaliMeaning.toLowerCase().includes(q) ||
        (v.banglaPronunciation &&
          v.banglaPronunciation.toLowerCase().includes(q)) ||
        (v.englishDefinition && v.englishDefinition.toLowerCase().includes(q))
    );
  }, [combinedList, query]);

  const playWord = (word: string) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.lang = "en-US";
      utterance.rate = 0.85;
      setPlayingWord(word);
      utterance.onend = () => setPlayingWord(null);
      utterance.onerror = () => setPlayingWord(null);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f8fa] text-slate-900 pb-16 font-sans">
      {/* Sticky Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <Link
            href="/"
            className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-700 active:scale-95 transition-transform"
            aria-label="Back to Home"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>

          <div className="flex-1 text-center">
            <h1 className="text-base font-bold text-slate-900">
              Vocabulary Dictionary
            </h1>
            <p className="font-bengali text-[11px] text-slate-500">
              ইংরেজি শব্দের বাংলা উচ্চারণ ও অর্থ ({filteredList.length} টি শব্দ)
            </p>
          </div>

          <div className="w-[44px]" />
        </div>

        {/* Search & Filter Strip */}
        <div className="max-w-md mx-auto px-4 pb-3 space-y-2.5">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search English word or বাংলা অর্থ..."
              className="w-full min-h-[42px] pl-10 pr-9 rounded-xl bg-slate-100/80 border border-slate-200/80 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSourceFilter("all")}
              className={`min-h-[34px] px-3.5 rounded-full text-xs font-semibold transition-all ${
                sourceFilter === "all"
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              All Words ({dbVocabularies.length + builtinDictionary.length})
            </button>
            <button
              onClick={() => setSourceFilter("stories")}
              className={`min-h-[34px] px-3.5 rounded-full text-xs font-semibold transition-all font-bengali ${
                sourceFilter === "stories"
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              গল্পের শব্দ ({dbVocabularies.length})
            </button>
          </div>
        </div>
      </header>

      {/* Word Cards List */}
      <main className="max-w-md mx-auto px-4 pt-4 space-y-2.5">
        {filteredList.length === 0 ? (
          <div className="py-12 text-center bg-white rounded-2xl border border-slate-200/80 p-6">
            <p className="text-sm font-medium text-slate-700">
              No matching words found for &ldquo;{query}&rdquo;
            </p>
            <button
              onClick={() => setQuery("")}
              className="mt-3 text-xs font-semibold text-indigo-600 hover:underline"
            >
              Reset Search
            </button>
          </div>
        ) : (
          filteredList.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-[0_1px_2px_rgba(0,0,0,0.03)] space-y-2"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <h2 className="text-base font-bold text-slate-900 capitalize">
                      {item.word}
                    </h2>
                    {item.banglaPronunciation && (
                      <span className="font-bengali text-xs font-semibold text-indigo-600">
                        ({item.banglaPronunciation})
                      </span>
                    )}
                    {item.partOfSpeech && (
                      <span className="text-[11px] text-slate-400 font-medium">
                        {item.partOfSpeech}
                      </span>
                    )}
                  </div>
                  {item.phonetic && (
                    <span className="text-[11px] font-mono text-slate-400">
                      {item.phonetic}
                    </span>
                  )}
                </div>

                <button
                  onClick={() => playWord(item.cleanWord || item.word)}
                  className={`min-w-[38px] min-h-[38px] rounded-full flex items-center justify-center transition-colors active:scale-95 shrink-0 ${
                    playingWord === (item.cleanWord || item.word)
                      ? "bg-indigo-600 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                  aria-label={`Listen to ${item.word}`}
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>

              <div className="font-bengali text-[15px] font-semibold text-slate-800">
                {item.bengaliMeaning}
              </div>

              {item.exampleSentenceEn && (
                <div className="pt-2 border-t border-slate-100 text-xs">
                  <p className="text-slate-600 italic">
                    &ldquo;{item.exampleSentenceEn}&rdquo;
                  </p>
                  {item.exampleSentenceBn && (
                    <p className="font-bengali text-slate-500 mt-0.5">
                      {item.exampleSentenceBn}
                    </p>
                  )}
                </div>
              )}

              {item.passage && (
                <div className="pt-1">
                  <Link
                    href={`/read/${item.passage.slug}`}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-600 hover:underline"
                  >
                    <BookOpen className="w-3 h-3" />
                    <span>From: {item.passage.titleEn}</span>
                  </Link>
                </div>
              )}
            </div>
          ))
        )}
      </main>
    </div>
  );
}
