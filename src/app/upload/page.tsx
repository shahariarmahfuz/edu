"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Upload,
  CheckCircle,
  AlertCircle,
  FileText,
  Code,
  BookOpen,
  Volume2,
  Moon,
  Sun,
} from "lucide-react";
import { Difficulty, SectionType } from "@/types/reading";
import { useTheme } from "@/components/ThemeProvider";

interface SectionEntry {
  sectionType: SectionType;
  englishText: string;
  banglaPronunciation: string;
  bengaliText: string;
}

interface VocabEntry {
  word: string;
  cleanWord: string;
  phonetic: string;
  banglaPronunciation: string;
  partOfSpeech: string;
  bengaliMeaning: string;
  englishDefinition: string;
  exampleSentenceEn: string;
  exampleSentenceBn: string;
}

export default function UploadPage() {
  const [tab, setTab] = useState<"json" | "form">("json");
  const { theme, toggleTheme } = useTheme();

  // Form State
  const [titleEn, setTitleEn] = useState("");
  const [titleBn, setTitleBn] = useState("");
  const [category, setCategory] = useState("Moral Story");
  const [difficulty, setDifficulty] = useState<Difficulty>("BEGINNER");
  const [readingTimeMinutes, setReadingTimeMinutes] = useState(3);
  const [summaryEn, setSummaryEn] = useState("");
  const [summaryBn, setSummaryBn] = useState("");

  const [sections, setSections] = useState<SectionEntry[]>([
    {
      sectionType: "story",
      englishText: "",
      banglaPronunciation: "",
      bengaliText: "",
    },
  ]);

  const [vocabularies, setVocabularies] = useState<VocabEntry[]>([
    {
      word: "",
      cleanWord: "",
      phonetic: "",
      banglaPronunciation: "",
      partOfSpeech: "noun",
      bengaliMeaning: "",
      englishDefinition: "",
      exampleSentenceEn: "",
      exampleSentenceBn: "",
    },
  ]);

  // Clean, intuitive JSON template that the user requested
  const sampleJson = JSON.stringify(
    {
      titleEn: "The Honest Woodcutter",
      titleBn: "সৎ কাঠুরিয়া",
      category: "Moral Story",
      difficulty: "BEGINNER",
      readingTimeMinutes: 3,
      summaryEn: "A story about a humble woodcutter whose honesty was rewarded by a river spirit.",
      summaryBn: "এক দরিদ্র কাঠুরিয়ার গল্প যার সততা নদীর দেবী দ্বারা পুরস্কৃত হয়েছিল।",
      sections: [
        {
          orderIndex: 0,
          englishText: "A poor woodcutter was cutting wood near a deep river.",
          banglaPronunciation: "আ পুওর উডকাটার ওয়াজ কাটিং উড নিয়ার আ ডিপ রিভার।",
          bengaliText: "এক দরিদ্র কাঠুরিয়া গভীর নদীর ধারে কাঠ কাটছিল।"
        },
        {
          orderIndex: 1,
          englishText: "Suddenly, his iron axe slipped from his hands and fell into the water. He began to weep because he had no money to buy another axe.",
          banglaPronunciation: "সাডেনলি, হিজ আয়রন অ্যাক্স স্লিপড ফ্রম হিজ হ্যান্ডস অ্যান্ড ফেল ইনটু দ্য ওয়াটার। হি বিগান টু উইপ বিকজ হি হ্যাড নো মানি টু বাই অ্যানাদার অ্যাক্স।",
          bengaliText: "হঠাৎ তার লোহার কুড়ালটি হাত থেকে পিছলে পানিতে পড়ে গেল। সে কাঁদতে লাগল কারণ আরেকটি কুড়াল কেনার মতো টাকা তার কাছে ছিল না।",
          sentences: [
            {
              en: "Suddenly, his iron axe slipped from his hands and fell into the water.",
              bnPronounce: "সাডেনলি, হিজ আয়রন অ্যাক্স স্লিপড ফ্রম হিজ হ্যান্ডস অ্যান্ড ফেল ইনটু দ্য ওয়াটার।",
              bn: "হঠাৎ তার লোহার কুড়ালটি হাত থেকে পিছলে পানিতে পড়ে গেল।"
            },
            {
              en: "He began to weep because he had no money to buy another axe.",
              bnPronounce: "হি বিগান টু উইপ বিকজ হি হ্যাড নো মানি টু বাই অ্যানাদার অ্যাক্স।",
              bn: "সে কাঁদতে লাগল কারণ আরেকটি কুড়াল কেনার মতো টাকা তার কাছে ছিল না।"
            }
          ]
        }
      ],
      vocabularies: [
        {
          word: "woodcutter",
          cleanWord: "woodcutter",
          phonetic: "/ˈwʊdˌkʌt.ər/",
          banglaPronunciation: "উডকাটার",
          partOfSpeech: "noun",
          bengaliMeaning: "কাঠুরিয়া",
          englishDefinition: "A person who cuts down trees or chops wood.",
          exampleSentenceEn: "The honest woodcutter worked hard every day.",
          exampleSentenceBn: "সৎ কাঠুরিয়া প্রতিদিন কঠোর পরিশ্রম করত।"
        },
        {
          word: "slipped",
          cleanWord: "slipped",
          phonetic: "/slɪpt/",
          banglaPronunciation: "স্লিপড",
          partOfSpeech: "verb",
          bengaliMeaning: "পিছলে গেল / হাত ফসকে গেল",
          englishDefinition: "Lost footing or dropped accidentally.",
          exampleSentenceEn: "The axe slipped from his wet hands.",
          exampleSentenceBn: "ভেজা হাত থেকে কুড়ালটি পিছলে গেল।"
        },
        {
          word: "weep",
          cleanWord: "weep",
          phonetic: "/wiːp/",
          banglaPronunciation: "উইপ",
          partOfSpeech: "verb",
          bengaliMeaning: "কান্নাকাটি করা / অশ্রুপাত করা",
          englishDefinition: "Shed tears; cry deeply.",
          exampleSentenceEn: "He began to weep in despair.",
          exampleSentenceBn: "সে হতাশায় কাঁদতে লাগল।"
        }
      ]
    },
    null,
    2
  );

  const [jsonInput, setJsonInput] = useState(sampleJson);

  // Status
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successSlug, setSuccessSlug] = useState<string | null>(null);

  const handleAddSection = () => {
    setSections((prev) => [
      ...prev,
      {
        sectionType: "story",
        englishText: "",
        banglaPronunciation: "",
        bengaliText: "",
      },
    ]);
  };

  const handleRemoveSection = (index: number) => {
    setSections((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSectionChange = (
    index: number,
    field: keyof SectionEntry,
    value: string
  ) => {
    setSections((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleAddVocabRow = () => {
    setVocabularies((prev) => [
      ...prev,
      {
        word: "",
        cleanWord: "",
        phonetic: "",
        banglaPronunciation: "",
        partOfSpeech: "noun",
        bengaliMeaning: "",
        englishDefinition: "",
        exampleSentenceEn: "",
        exampleSentenceBn: "",
      },
    ]);
  };

  const handleRemoveVocabRow = (index: number) => {
    setVocabularies((prev) => prev.filter((_, i) => i !== index));
  };

  const handleVocabChange = (
    index: number,
    field: keyof VocabEntry,
    value: string
  ) => {
    setVocabularies((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(null);
    setSuccessSlug(null);

    try {
      let payload: any = {};

      if (tab === "json") {
        try {
          payload = JSON.parse(jsonInput);
        } catch (err: any) {
          throw new Error("Invalid JSON format. Please verify commas and quotes.");
        }
      } else {
        if (!titleEn.trim()) throw new Error("English Title is required");
        if (!titleBn.trim()) throw new Error("Bengali Title is required");

        const validSections = sections.filter(
          (s) => s.englishText.trim() && s.bengaliText.trim()
        );
        if (validSections.length === 0) {
          throw new Error("At least one sentence section is required");
        }

        const validVocabs = vocabularies.filter(
          (v) => v.word.trim() && v.bengaliMeaning.trim()
        );

        payload = {
          titleEn,
          titleBn,
          category,
          difficulty,
          readingTimeMinutes: Number(readingTimeMinutes) || 3,
          summaryEn,
          summaryBn,
          sections: validSections.map((s, idx) => ({
            orderIndex: idx,
            sectionType: s.sectionType || "story",
            englishText: s.englishText.trim(),
            banglaPronunciation: s.banglaPronunciation.trim(),
            bengaliText: s.bengaliText.trim(),
          })),
          vocabularies: validVocabs,
        };
      }

      const res = await fetch("/api/passages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to create passage");
      }

      setSuccessSlug(data.data.slug);
    } catch (err: any) {
      setErrorMsg(err.message || "An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#131314] text-slate-900 dark:text-[#e8eaed] pb-20 font-sans transition-colors duration-150">
      {/* Mobile Top Header */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#1e1f20]/95 backdrop-blur-md border-b border-slate-200 dark:border-[#303134]">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
          <Link
            href="/"
            className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-2xl hover:bg-slate-100 dark:hover:bg-[#282a2c] active:scale-95 transition-transform"
          >
            <ArrowLeft className="w-5 h-5 text-slate-700 dark:text-[#bdc1c6]" />
          </Link>
          <div className="text-center">
            <h1 className="text-base font-bold text-slate-900 dark:text-[#e8eaed]">
              নতুন প্যাসেজ যুক্ত করুন
            </h1>
            <p className="text-[11px] text-slate-500 dark:text-[#9aa0a6] font-bengali">
              বাংলা উচ্চারণ ও অর্থ সহ JSON আপলোড
            </p>
          </div>
          <button
            type="button"
            onClick={toggleTheme}
            className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-2xl hover:bg-slate-100 dark:hover:bg-[#282a2c] text-slate-600 dark:text-[#9aa0a6] active:scale-95 transition-colors"
            aria-label={
              theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
            }
            title={theme === "dark" ? "Light Mode" : "Dark Mode"}
          >
            {theme === "dark" ? (
              <Sun className="w-[19px] h-[19px]" />
            ) : (
              <Moon className="w-[19px] h-[19px]" />
            )}
          </button>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 pt-5">
        {/* Success Modal / Banner */}
        {successSlug && (
          <div className="mb-6 p-4 rounded-3xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-emerald-950 dark:text-emerald-100 space-y-3 shadow-xs">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <span className="font-bold text-sm">
                প্যাসেজটি সফলভাবে ডাটাবেজে সংরক্ষণ হয়েছে!
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-emerald-200/80">
              প্যাসেজের বাক্য, বাংলা উচ্চারণ ও শব্দার্থ Neon PostgreSQL ডাটাবেজে যুক্ত হয়েছে।
            </p>
            <div className="flex gap-2 pt-1">
              <Link
                href={`/read/${successSlug}`}
                className="min-h-[44px] flex-1 flex items-center justify-center gap-2 px-4 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 active:scale-95 shadow-md shadow-indigo-600/20"
              >
                <BookOpen className="w-4 h-4" />
                পড়া শুরু করুন (Open Reader)
              </Link>
              <button
                onClick={() => {
                  setSuccessSlug(null);
                  setTitleEn("");
                  setTitleBn("");
                }}
                className="min-h-[44px] px-3.5 rounded-xl bg-white dark:bg-[#1e1f20] border border-slate-200 dark:border-[#3c4043] text-slate-700 dark:text-[#e8eaed] text-xs font-semibold hover:bg-slate-100 dark:hover:bg-[#282a2c]"
              >
                আরেকটি যোগ করুন
              </button>
            </div>
          </div>
        )}

        {/* Error Alert */}
        {errorMsg && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 text-rose-900 dark:text-rose-200 flex items-start gap-2.5">
            <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
            <div className="text-xs leading-relaxed font-medium">{errorMsg}</div>
          </div>
        )}

        {/* Mode Switcher Tabs */}
        <div className="grid grid-cols-2 p-1 rounded-2xl bg-slate-200/80 dark:bg-[#1e1f20] mb-5">
          <button
            type="button"
            onClick={() => setTab("json")}
            className={`min-h-[44px] rounded-xl flex items-center justify-center gap-2 text-xs font-bold transition-all ${
              tab === "json"
                ? "bg-white dark:bg-[#282a2c] text-indigo-700 dark:text-[#8ab4f8] shadow-xs"
                : "text-slate-600 dark:text-[#9aa0a6] hover:text-slate-900 dark:hover:text-[#e8eaed]"
            }`}
          >
            <Code className="w-4 h-4" />
            JSON Seeder (সুপার ফাস্ট)
          </button>
          <button
            type="button"
            onClick={() => setTab("form")}
            className={`min-h-[44px] rounded-xl flex items-center justify-center gap-2 text-xs font-bold transition-all ${
              tab === "form"
                ? "bg-white dark:bg-[#282a2c] text-indigo-700 dark:text-[#8ab4f8] shadow-xs"
                : "text-slate-600 dark:text-[#9aa0a6] hover:text-slate-900 dark:hover:text-[#e8eaed]"
            }`}
          >
            <FileText className="w-4 h-4" />
            ম্যানুয়াল ফর্ম
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {tab === "json" ? (
            /* JSON Seeder Tab */
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-xs font-bold text-slate-800 dark:text-[#e8eaed]">
                    JSON পেস্ট করুন
                  </label>
                  <p className="text-[11px] text-slate-500 dark:text-[#9aa0a6] font-bengali">
                    নিচের টেমপ্লেটটি এডিট করে সহজেই নতুন গল্প আপলোড করুন
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setJsonInput(sampleJson)}
                  className="text-xs font-semibold text-indigo-600 dark:text-[#8ab4f8] hover:underline"
                >
                  টেমপ্লেট রিসেট
                </button>
              </div>

              <textarea
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                rows={18}
                className="w-full p-3.5 rounded-2xl bg-white dark:bg-[#1e1f20] border border-slate-300 dark:border-[#3c4043] font-mono text-xs text-slate-800 dark:text-[#e8eaed] focus:outline-hidden focus:ring-2 focus:ring-indigo-500 dark:focus:ring-[#8ab4f8] shadow-xs"
                placeholder="Paste valid JSON..."
              />
            </div>
          ) : (
            /* Guided Form Tab */
            <>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-[#bdc1c6] mb-1">
                    English Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={titleEn}
                    onChange={(e) => setTitleEn(e.target.value)}
                    placeholder="e.g. The Honest Woodcutter"
                    className="w-full min-h-[44px] px-3.5 rounded-xl bg-white dark:bg-[#1e1f20] border border-slate-300 dark:border-[#3c4043] text-sm text-slate-900 dark:text-[#e8eaed] placeholder:text-slate-400 dark:placeholder:text-[#9aa0a6] focus:outline-hidden focus:ring-2 focus:ring-indigo-500 dark:focus:ring-[#8ab4f8]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-[#bdc1c6] mb-1">
                    বাংলা শিরোনাম *
                  </label>
                  <input
                    type="text"
                    required
                    value={titleBn}
                    onChange={(e) => setTitleBn(e.target.value)}
                    placeholder="যেমন: সৎ কাঠুরিয়া"
                    className="w-full min-h-[44px] px-3.5 rounded-xl bg-white dark:bg-[#1e1f20] border border-slate-300 dark:border-[#3c4043] font-bengali text-sm text-slate-900 dark:text-[#e8eaed] placeholder:text-slate-400 dark:placeholder:text-[#9aa0a6] focus:outline-hidden focus:ring-2 focus:ring-indigo-500 dark:focus:ring-[#8ab4f8]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-[#bdc1c6] mb-1">
                    ক্যাটাগরি
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full min-h-[44px] px-3 rounded-xl bg-white dark:bg-[#1e1f20] border border-slate-300 dark:border-[#3c4043] text-xs text-slate-800 dark:text-[#e8eaed] focus:outline-hidden focus:ring-2 focus:ring-indigo-500 dark:focus:ring-[#8ab4f8]"
                  >
                    <option value="Moral Story">Moral Story</option>
                    <option value="Science & Nature">Science & Nature</option>
                    <option value="Daily Life">Daily Life</option>
                    <option value="History & Culture">History & Culture</option>
                    <option value="Personal Growth">Personal Growth</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-[#bdc1c6] mb-1">
                    লেভেল
                  </label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value as Difficulty)}
                    className="w-full min-h-[44px] px-3 rounded-xl bg-white dark:bg-[#1e1f20] border border-slate-300 dark:border-[#3c4043] text-xs text-slate-800 dark:text-[#e8eaed] focus:outline-hidden focus:ring-2 focus:ring-indigo-500 dark:focus:ring-[#8ab4f8]"
                  >
                    <option value="BEGINNER">Beginner (সহজ)</option>
                    <option value="INTERMEDIATE">Intermediate (মধ্যম)</option>
                    <option value="ADVANCED">Advanced (অগ্রবর্তী)</option>
                  </select>
                </div>
              </div>

              {/* Sections (Phrases with English + Bangla Pronunciation + Bengali Meaning) */}
              <div className="pt-2 border-t border-slate-200 dark:border-[#303134]">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-[#e8eaed]">
                      প্যাসেজের বাক্যসমূহ (Phrases & Sentences)
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-[#9aa0a6]">
                      প্রতিটি বাক্যের ইংরেজি, বাংলা উচ্চারণ ও বাংলা অর্থ দিন
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddSection}
                    className="min-h-[40px] px-3 rounded-xl bg-indigo-50 dark:bg-[#1e3a5f] text-indigo-700 dark:text-[#8ab4f8] border border-indigo-200 dark:border-[#2c4e7c] text-xs font-bold flex items-center gap-1 active:scale-95"
                  >
                    <Plus className="w-4 h-4" />
                    বাক্য যোগ করুন
                  </button>
                </div>

                <div className="space-y-4">
                  {sections.map((sec, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-white dark:bg-[#1e1f20] border border-slate-200 dark:border-[#303134] space-y-2.5 shadow-2xs relative"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-indigo-600 dark:text-[#8ab4f8] font-mono">
                          প্যারাগ্রাফ #{idx + 1}
                        </span>
                        <div className="flex items-center gap-2">
                          <select
                            value={sec.sectionType}
                            onChange={(e) =>
                              handleSectionChange(
                                idx,
                                "sectionType",
                                e.target.value
                              )
                            }
                            className="h-7 px-2 rounded-lg bg-slate-100 dark:bg-[#282a2c] border border-slate-200 dark:border-[#3c4043] text-[11px] font-bengali text-slate-700 dark:text-[#bdc1c6]"
                          >
                            <option value="story">📖 মূল গল্প (Story)</option>
                            <option value="author">✍️ লেখক পরিচিতি (Author)</option>
                            <option value="introduction">💡 ভূমিকা (Intro)</option>
                            <option value="summary">📝 সামারি (Summary)</option>
                          </select>
                          {sections.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveSection(idx)}
                              className="text-slate-400 dark:text-[#9aa0a6] hover:text-rose-500 dark:hover:text-rose-400"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>

                      <input
                        type="text"
                        placeholder="English sentence *"
                        value={sec.englishText}
                        onChange={(e) =>
                          handleSectionChange(idx, "englishText", e.target.value)
                        }
                        className="w-full min-h-[44px] px-3.5 rounded-xl bg-slate-50 dark:bg-[#131314] border border-slate-200 dark:border-[#3c4043] text-xs text-slate-900 dark:text-[#e8eaed] placeholder:text-slate-400 dark:placeholder:text-[#9aa0a6]"
                      />

                      <input
                        type="text"
                        placeholder="বাংলা উচ্চারণ (যেমন: ওয়ান্স আপন আ টাইম...)"
                        value={sec.banglaPronunciation}
                        onChange={(e) =>
                          handleSectionChange(
                            idx,
                            "banglaPronunciation",
                            e.target.value
                          )
                        }
                        className="w-full min-h-[44px] px-3.5 rounded-xl bg-violet-50/50 dark:bg-violet-950/25 border border-violet-200 dark:border-violet-800/50 font-bengali text-xs text-violet-950 dark:text-violet-200 placeholder:text-slate-400 dark:placeholder:text-[#9aa0a6]"
                      />

                      <input
                        type="text"
                        placeholder="সম্পূর্ণ বাংলা অনুবাদ *"
                        value={sec.bengaliText}
                        onChange={(e) =>
                          handleSectionChange(idx, "bengaliText", e.target.value)
                        }
                        className="w-full min-h-[44px] px-3.5 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/25 border border-emerald-200 dark:border-emerald-800/50 font-bengali text-xs text-emerald-950 dark:text-emerald-200 placeholder:text-slate-400 dark:placeholder:text-[#9aa0a6]"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full min-h-[48px] rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm flex items-center justify-center gap-2 active:scale-98 transition-all shadow-lg shadow-indigo-600/30 disabled:opacity-50"
          >
            {isSubmitting ? (
              <span>ডাটাবেজে সংরক্ষণ করা হচ্ছে...</span>
            ) : (
              <>
                <Upload className="w-5 h-5" />
                <span>প্যাসেজ সেভ করুন (Save to Neon DB)</span>
              </>
            )}
          </button>
        </form>
      </main>
    </div>
  );
}
