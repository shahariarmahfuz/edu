import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    if (!slug) {
      return NextResponse.json(
        { success: false, error: "Slug parameter is required" },
        { status: 400 }
      );
    }

    // Try finding by slug, or fallback to finding by id
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
      return NextResponse.json(
        {
          success: false,
          error: `Passage not found with identifier '${slug}'`,
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: passage,
    });
  } catch (error) {
    console.error("Error fetching single passage:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch passage from database",
      },
      { status: 500 }
    );
  }
}
