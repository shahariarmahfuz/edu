import React from "react";
import { notFound } from "next/navigation";
import { backendFetch } from "@/lib/backendClient";
import PassageReader from "@/components/PassageReader";
import { PassageItem, SentenceItem } from "@/types/reading";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ slug: string }>;
}

interface PassageBackendPayload {
  success: boolean;
  data?: PassageItem;
}

async function fetchPassage(slug: string): Promise<PassageItem | null> {
  const res = await backendFetch<PassageBackendPayload>(
    `/internal/passages/${encodeURIComponent(slug)}`
  );
  if (!res.ok || !res.body?.success || !res.body.data) {
    return null;
  }
  return res.body.data;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const passage = await fetchPassage(slug);

  if (!passage) {
    return {
      title: "Passage Not Found - BhashaRead",
    };
  }

  return {
    title: `${passage.titleEn} (${passage.titleBn}) - BhashaRead`,
    description:
      passage.summaryEn ||
      `Read ${passage.titleEn} with interactive Bengali translations and vocabulary.`,
  };
}

export default async function ReadPage({ params }: PageProps) {
  const { slug } = await params;
  const passage = await fetchPassage(slug);

  if (!passage) {
    notFound();
  }

  const clientPassage: PassageItem = {
    ...passage,
    sections: passage.sections.map((sec) => ({
      ...sec,
      sentences: Array.isArray(sec.sentences)
        ? (sec.sentences as unknown as SentenceItem[])
        : null,
    })),
  };

  return <PassageReader passage={clientPassage} />;
}
