import React from "react";
import { backendFetch } from "@/lib/backendClient";
import { BUILTIN_DICTIONARY } from "@/lib/dictionary";
import HomeFeed from "@/components/HomeFeed";
import { PassageListItem } from "@/types/reading";

export const dynamic = "force-dynamic";

interface HomeBackendPayload {
  success: boolean;
  data?: {
    passages: PassageListItem[];
    dbVocabCount: number;
  };
}

export default async function HomePage() {
  const res = await backendFetch<HomeBackendPayload>("/internal/home");
  const passages = res.body?.data?.passages ?? [];
  const dbVocabCount = res.body?.data?.dbVocabCount ?? 0;

  const totalVocabCount =
    dbVocabCount + Object.keys(BUILTIN_DICTIONARY).length;

  return (
    <HomeFeed
      passages={passages}
      totalVocabCount={totalVocabCount}
    />
  );
}
