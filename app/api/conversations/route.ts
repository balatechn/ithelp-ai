import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId") || "demo";

    const conversations = await prisma.conversation.findMany({
      where: { userId },
      include: {
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
        _count: { select: { messages: true } },
      },
      orderBy: [{ pinned: "desc" }, { updatedAt: "desc" }],
      take: 50,
    });

    return Response.json({ conversations });
  } catch {
    return Response.json({ conversations: [] });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, userId = "demo" } = body;

    const conversation = await prisma.conversation.create({
      data: {
        title: title || "New Conversation",
        userId,
      },
    });

    return Response.json({ conversation }, { status: 201 });
  } catch {
    return Response.json(
      { conversation: { id: `temp-${Date.now()}`, title: "New Conversation" } },
      { status: 201 }
    );
  }
}
