import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const passageId = searchParams.get("passageId");
    const query = searchParams.get("q");

    const whereClause: any = {};

    if (passageId) {
      whereClause.passageId = passageId;
    }

    if (query && query.trim()) {
      const q = query.trim();
      whereClause.OR = [
        { word: { contains: q, mode: "insensitive" } },
        { bengaliMeaning: { contains: q } },
        { englishDefinition: { contains: q, mode: "insensitive" } },
      ];
    }

    const vocabularies = await prisma.vocabulary.findMany({
      where: whereClause,
      include: {
        passage: {
          select: {
            id: true,
            slug: true,
            titleEn: true,
            titleBn: true,
          },
        },
      },
      orderBy: {
        word: "asc",
      },
      take: 50,
    });

    return NextResponse.json({
      success: true,
      data: vocabularies,
    });
  } catch (error) {
    console.error("Error fetching vocabulary:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch vocabulary from database",
      },
      { status: 500 }
    );
  }
}
