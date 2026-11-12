"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
} from "lucide-react";
import { Difficulty } from "@/types/reading";

interface VocabEntry {
  word: string;
  phonetic: string;
  partOfSpeech: string;
  bengaliMeaning: string;
  englishDefinition: string;
  exampleSentenceEn: string;
  exampleSentenceBn: string;
}

export default function UploadPage() {
  const router = useRouter();
  const [tab, setTab] = useState<"form" | "json">("form");

  // Form State
  const [titleEn, setTitleEn] = useState("");
  const [titleBn, setTitleBn] = useState("");
  const [category, setCategory] = useState("Moral Story");
  const [difficulty, setDifficulty] = useState<Difficulty>("BEGINNER");
  const [readingTimeMinutes, setReadingTimeMinutes] = useState(3);
  const [summaryEn, setSummaryEn] = useState("");
  const [summaryBn, setSummaryBn] = useState("");
  const [englishContent, setEnglishContent] = useState("");
  const [bengaliContent, setBengaliContent] = useState("");

  const [vocabularies, setVocabularies] = useState<VocabEntry[]>([
    {
      word: "",
      phonetic: "",
      partOfSpeech: "noun",
      bengaliMeaning: "",
      englishDefinition: "",
      exampleSentenceEn: "",
      exampleSentenceBn: "",
    },
  ]);

  // JSON Mode State
  const sampleJson = `{
  "titleEn": "The Golden Harvest",
  "titleBn": "সোনার ফসল",
  "category": "Rural Life",
  "difficulty": "BEGINNER",
  "readingTimeMinutes": 3,
  "summaryEn": "A tale about the joy and hard work of Bengali village farmers during the harvest festival.",
  "summaryBn": "নবান্ন উৎসবের সময় বাংলার গ্রামীণ কৃষকদের আনন্দ ও পরিশ্রমের গল্প।",
  "englishContent": "In late autumn, the golden paddy fields of Bengal ripple in the gentle breeze. Farmers awaken before dawn to harvest the crops with traditional sickles.",
  "bengaliContent": "হেমন্তের শেষ ভাগে বাংলার সোনালী ধানক্ষেতগুলো মৃদু বাতাসে দোলে। কৃষকেরা ঐতিহ্যবাহী কাস্তে নিয়ে ফসল কাটার জন্য ভোরের আগেই জেগে ওঠে।",
  "vocabularies": [
    {
      "word": "harvest",
      "phonetic": "/ˈhɑː.vɪst/",
      "partOfSpeech": "noun",
      "bengaliMeaning": "ফসল সংগ্রহ / নবান্ন",
      "englishDefinition": "The process or period of gathering in crops.",
      "exampleSentenceEn": "Farmers awaken early to harvest the crops.",
      "exampleSentenceBn": "ফসল কাটার জন্য কৃষকেরা ভোরে ঘুম থেকে ওঠে।"
    }
  ]
}`;

  const [jsonInput, setJsonInput] = useState(sampleJson);

  // Status
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successSlug, setSuccessSlug] = useState<string | null>(null);

  const handleAddVocabRow = () => {
    setVocabularies((prev) => [
      ...prev,
      {
        word: "",
        phonetic: "",
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
          throw new Error("Invalid JSON format. Please verify syntax.");
        }
      } else {
        // Validate required fields
        if (!titleEn.trim()) throw new Error("English Title is required");
        if (!titleBn.trim()) throw new Error("Bengali Title is required");
        if (!englishContent.trim())
          throw new Error("English Content is required");
        if (!bengaliContent.trim())
          throw new Error("Bengali Content is required");

        // Filter valid vocabulary entries (require at least word + bengaliMeaning)
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
          englishContent,
          bengaliContent,
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
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-20">
      {/* Mobile Top Header */}
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
          <Link
            href="/"
            className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-2xl hover:bg-slate-800 active:scale-95 transition-transform"
          >
            <ArrowLeft className="w-5 h-5 text-slate-300" />
          </Link>
          <div className="text-center">
            <h1 className="text-base font-bold text-white">Content Manager</h1>
            <p className="text-[11px] text-slate-400">
              Upload Bilingual Passages to Neon DB
            </p>
          </div>
          <div className="w-[44px]" />
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 pt-5">
        {/* Success Modal / Banner */}
        {successSlug && (
          <div className="mb-6 p-4 rounded-3xl bg-emerald-950/80 border border-emerald-500/30 text-emerald-200 space-y-3">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-400" />
              <span className="font-bold text-sm">
                Passage Saved Successfully!
              </span>
            </div>
            <p className="text-xs opacity-90">
              Your article and vocabulary were stored into Neon Serverless
              PostgreSQL.
            </p>
            <div className="flex gap-2 pt-1">
              <Link
                href={`/read/${successSlug}`}
                className="min-h-[44px] flex-1 flex items-center justify-center gap-2 px-4 rounded-xl bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-500 active:scale-95"
              >
                <BookOpen className="w-4 h-4" />
                Open in Reader
              </Link>
              <button
                onClick={() => {
                  setSuccessSlug(null);
                  setTitleEn("");
                  setTitleBn("");
                  setEnglishContent("");
                  setBengaliContent("");
                }}
                className="min-h-[44px] px-3 rounded-xl bg-slate-800 text-slate-200 text-xs font-medium hover:bg-slate-700"
              >
                Upload Another
              </button>
            </div>
          </div>
        )}

        {/* Error Alert */}
        {errorMsg && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-950/80 border border-rose-500/30 text-rose-200 flex items-start gap-2.5">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div className="text-xs leading-relaxed">{errorMsg}</div>
          </div>
        )}

        {/* Mode Switcher Tabs */}
        <div className="grid grid-cols-2 p-1 rounded-2xl bg-slate-900 border border-slate-800 mb-5">
          <button
            type="button"
            onClick={() => setTab("form")}
            className={`min-h-[44px] rounded-xl flex items-center justify-center gap-2 text-xs font-semibold transition-all ${
              tab === "form"
                ? "bg-indigo-600 text-white shadow-xs"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <FileText className="w-4 h-4" />
            Guided Form
          </button>
          <button
            type="button"
            onClick={() => setTab("json")}
            className={`min-h-[44px] rounded-xl flex items-center justify-center gap-2 text-xs font-semibold transition-all ${
              tab === "json"
                ? "bg-indigo-600 text-white shadow-xs"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Code className="w-4 h-4" />
            JSON Seeder
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {tab === "json" ? (
            /* JSON Seeder Tab */
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-300">
                  Paste JSON Payload
                </label>
                <button
                  type="button"
                  onClick={() => setJsonInput(sampleJson)}
                  className="text-[11px] text-indigo-400 hover:underline"
                >
                  Reset Template
                </button>
              </div>
              <textarea
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                rows={16}
                className="w-full p-3 rounded-2xl bg-slate-900 border border-slate-800 font-mono text-xs text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                placeholder="Paste valid JSON passage structure..."
              />
            </div>
          ) : (
            /* Guided Form Tab */
            <>
              {/* Titles */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    English Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={titleEn}
                    onChange={(e) => setTitleEn(e.target.value)}
                    placeholder="e.g. The Brave Little Sparrow"
                    className="w-full min-h-[44px] px-3.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Bengali Title (বাংলা শিরোনাম) *
                  </label>
                  <input
                    type="text"
                    required
                    value={titleBn}
                    onChange={(e) => setTitleBn(e.target.value)}
                    placeholder="e.g. সাহসী চড়ুই পাখি"
                    className="w-full min-h-[44px] px-3.5 rounded-xl bg-slate-900 border border-slate-800 font-bengali text-sm text-slate-100 placeholder:text-slate-500 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Category & Difficulty */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full min-h-[44px] px-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Moral Story">Moral Story</option>
                    <option value="Science & Nature">Science & Nature</option>
                    <option value="Daily Life">Daily Life</option>
                    <option value="History & Culture">History & Culture</option>
                    <option value="Personal Growth">Personal Growth</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Difficulty
                  </label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value as Difficulty)}
                    className="w-full min-h-[44px] px-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="BEGINNER">Beginner (সহজ)</option>
                    <option value="INTERMEDIATE">Intermediate (মধ্যম)</option>
                    <option value="ADVANCED">Advanced (অগ্রবর্তী)</option>
                  </select>
                </div>
              </div>

              {/* Summaries */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    English Summary (Optional)
                  </label>
                  <input
                    type="text"
                    value={summaryEn}
                    onChange={(e) => setSummaryEn(e.target.value)}
                    placeholder="Short summary of the story..."
                    className="w-full min-h-[44px] px-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Bengali Summary (বাংলা সারাংশ)
                  </label>
                  <input
                    type="text"
                    value={summaryBn}
                    onChange={(e) => setSummaryBn(e.target.value)}
                    placeholder="গল্পের সংক্ষিপ্ত সারমর্ম..."
                    className="w-full min-h-[44px] px-3.5 rounded-xl bg-slate-900 border border-slate-800 font-bengali text-xs text-slate-100 placeholder:text-slate-500 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* English Passage Content */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  English Reading Passage *
                </label>
                <p className="text-[11px] text-slate-400 mb-1.5">
                  Write the article or story in clear English paragraphs.
                </p>
                <textarea
                  required
                  rows={6}
                  value={englishContent}
                  onChange={(e) => setEnglishContent(e.target.value)}
                  placeholder="Enter English story or article..."
                  className="w-full p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-sm text-slate-100 leading-relaxed placeholder:text-slate-500 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Bengali Translation Content */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Bengali Translation (বাংলা অনুবাদ) *
                </label>
                <p className="text-[11px] text-slate-400 mb-1.5">
                  Provide corresponding Bengali paragraphs matching the English
                  paragraphs above.
                </p>
                <textarea
                  required
                  rows={6}
                  value={bengaliContent}
                  onChange={(e) => setBengaliContent(e.target.value)}
                  placeholder="গল্পের সম্পূর্ণ বাংলা অনুবাদ লিখুন..."
                  className="w-full p-3.5 rounded-2xl bg-slate-900 border border-slate-800 font-bengali text-sm text-slate-100 leading-relaxed placeholder:text-slate-500 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Key Vocabulary Manager */}
              <div className="pt-2 border-t border-slate-800">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-sm font-bold text-slate-200">
                      Key Vocabulary Words
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      Words will be highlighted in the reader with bottom-sheet
                      meanings.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddVocabRow}
                    className="min-h-[44px] px-3 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 text-xs font-semibold flex items-center gap-1 hover:bg-indigo-600/30 active:scale-95"
                  >
                    <Plus className="w-4 h-4" />
                    Add Word
                  </button>
                </div>

                <div className="space-y-4">
                  {vocabularies.map((vocab, index) => (
                    <div
                      key={index}
                      className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2.5 relative"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-indigo-400">
                          Word #{index + 1}
                        </span>
                        {vocabularies.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveVocabRow(index)}
                            className="min-w-[44px] min-h-[44px] flex items-center justify-center text-slate-400 hover:text-rose-400 active:scale-95"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          placeholder="English word *"
                          value={vocab.word}
                          onChange={(e) =>
                            handleVocabChange(index, "word", e.target.value)
                          }
                          className="min-h-[44px] px-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100"
                        />
                        <input
                          type="text"
                          placeholder="বাংলা অর্থ *"
                          value={vocab.bengaliMeaning}
                          onChange={(e) =>
                            handleVocabChange(
                              index,
                              "bengaliMeaning",
                              e.target.value
                            )
                          }
                          className="min-h-[44px] px-3 rounded-xl bg-slate-950 border border-slate-800 font-bengali text-xs text-slate-100"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          placeholder="Phonetic (e.g. /ˈeɪn.ʃənt/)"
                          value={vocab.phonetic}
                          onChange={(e) =>
                            handleVocabChange(index, "phonetic", e.target.value)
                          }
                          className="min-h-[44px] px-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 font-mono"
                        />
                        <select
                          value={vocab.partOfSpeech}
                          onChange={(e) =>
                            handleVocabChange(
                              index,
                              "partOfSpeech",
                              e.target.value
                            )
                          }
                          className="min-h-[44px] px-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100"
                        >
                          <option value="noun">noun (বিশেষ্য)</option>
                          <option value="verb">verb (ক্রিয়া)</option>
                          <option value="adjective">adjective (বিশেষণ)</option>
                          <option value="adverb">adverb (ক্রিয়া বিশেষণ)</option>
                          <option value="idiom">idiom (বাগধারা)</option>
                          <option value="phrase">phrase (শব্দগুচ্ছ)</option>
                        </select>
                      </div>

                      <input
                        type="text"
                        placeholder="English definition (optional)"
                        value={vocab.englishDefinition}
                        onChange={(e) =>
                          handleVocabChange(
                            index,
                            "englishDefinition",
                            e.target.value
                          )
                        }
                        className="w-full min-h-[44px] px-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100"
                      />

                      <div className="grid grid-cols-1 gap-2">
                        <input
                          type="text"
                          placeholder="Context sentence (English)"
                          value={vocab.exampleSentenceEn}
                          onChange={(e) =>
                            handleVocabChange(
                              index,
                              "exampleSentenceEn",
                              e.target.value
                            )
                          }
                          className="min-h-[44px] px-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100"
                        />
                        <input
                          type="text"
                          placeholder="Context sentence (বাংলা অনুবাদ)"
                          value={vocab.exampleSentenceBn}
                          onChange={(e) =>
                            handleVocabChange(
                              index,
                              "exampleSentenceBn",
                              e.target.value
                            )
                          }
                          className="min-h-[44px] px-3 rounded-xl bg-slate-950 border border-slate-800 font-bengali text-xs text-slate-100"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Submit Button (48px touch target) */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full min-h-[48px] rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm flex items-center justify-center gap-2 active:scale-98 transition-all shadow-lg shadow-indigo-600/30 disabled:opacity-50"
          >
            {isSubmitting ? (
              <span>Saving to Neon Postgres...</span>
            ) : (
              <>
                <Upload className="w-5 h-5" />
                <span>Upload & Publish Passage</span>
              </>
            )}
          </button>
        </form>
      </main>
    </div>
  );
}
