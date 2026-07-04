import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

// Counter for ticket numbers (fallback without DB)
let ticketCounter = 1043;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const priority = searchParams.get("priority");
    const search = searchParams.get("search");

    const tickets = await prisma.ticket.findMany({
      where: {
        ...(status && status !== "all" && { status: status.toUpperCase().replace("-", "_") as never }),
        ...(priority && priority !== "all" && { priority: priority.toUpperCase() as never }),
        ...(search && {
          OR: [
            { title: { contains: search, mode: "insensitive" } },
            { ticketNum: { contains: search, mode: "insensitive" } },
          ],
        }),
      },
      include: {
        createdBy: { select: { name: true, email: true } },
        assignee: { select: { name: true } },
        _count: { select: { comments: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 100,
    });

    return Response.json({ tickets });
  } catch {
    // Return mock data if DB not available
    return Response.json({ tickets: [], error: "Database not connected" });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, priority, category, department } = body;

    if (!title?.trim()) {
      return Response.json({ error: "Title is required" }, { status: 400 });
    }

    const ticketNum = `TKT-${ticketCounter++}`;

    const ticket = await prisma.ticket.create({
      data: {
        ticketNum,
        title: title.trim(),
        description: description?.trim() || "",
        priority: (priority?.toUpperCase() || "MEDIUM") as never,
        status: "OPEN",
        category: category || "General",
        department: department || null,
        createdById: "clx000000000000000000000", // placeholder — replace with session user id
        slaDeadline: new Date(Date.now() + 4 * 3600000), // 4h SLA default
      },
    });

    return Response.json({ ticket }, { status: 201 });
  } catch {
    return Response.json(
      { ticket: { id: `temp-${Date.now()}`, ticketNum: `TKT-${ticketCounter++}`, title: "Ticket created (offline)" } },
      { status: 201 }
    );
  }
}
