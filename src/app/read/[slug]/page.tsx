import React from "react";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import PassageReader from "@/components/PassageReader";
import { PassageItem, SentenceItem } from "@/types/reading";
import { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const passage = await prisma.passage.findFirst({
    where: {
      OR: [{ slug }, { id: slug }],
      isPublished: true,
    },
    select: {
      titleEn: true,
      titleBn: true,
      summaryEn: true,
    },
  });

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

  const passage = await prisma.passage.findFirst({
    where: {
      OR: [{ slug }, { id: slug }],
      isPublished: true,
    },
    include: {
      sections: {
        orderBy: {
          orderIndex: "asc",
        },
      },
      vocabularies: {
        orderBy: {
          word: "asc",
        },
      },
    },
  });

  if (!passage) {
    notFound();
  }

  // Cast prisma passage to client PassageItem
  const clientPassage: PassageItem = {
    ...passage,
    createdAt: passage.createdAt.toISOString(),
    updatedAt: passage.updatedAt.toISOString(),
    sections: passage.sections.map((sec) => ({
      ...sec,
      sentences: Array.isArray(sec.sentences)
        ? (sec.sentences as unknown as SentenceItem[])
        : null,
    })),
  };

  return <PassageReader passage={clientPassage} />;
}
