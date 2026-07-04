import { NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY || "" });

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const prompt = formData.get("prompt") as string || "Analyze this image and identify any IT issues, errors, or problems visible. Provide detailed technical analysis.";

    if (!file) {
      return Response.json({ error: "No file provided" }, { status: 400 });
    }

    const allowedTypes = ["image/png", "image/jpeg", "image/gif", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      return Response.json({ error: "Only image files are supported (PNG, JPEG, GIF, WebP)" }, { status: 400 });
    }

    const MAX_SIZE = 5 * 1024 * 1024; // 5MB
    if (file.size > MAX_SIZE) {
      return Response.json({ error: "File too large. Maximum size is 5MB." }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");
    const mediaType = file.type as "image/png" | "image/jpeg" | "image/gif" | "image/webp";

    const response = await client.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 2048,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: { type: "base64", media_type: mediaType, data: base64 },
            },
            {
              type: "text",
              text: `You are a Senior IT Support Engineer analyzing a screenshot or image. ${prompt}

Please provide:
1. **What you see** — describe the error/issue/screen
2. **Identified problems** — list any errors, warnings, or issues
3. **Root cause analysis** — likely reason for the issue
4. **Resolution steps** — step-by-step fix
5. **Commands** — relevant PowerShell/CMD commands if applicable

Be specific and technical. Reference exact error codes, event IDs, or messages you see.`,
            },
          ],
        },
      ],
    });

    const analysisText = response.content[0].type === "text" ? response.content[0].text : "Unable to analyze image";

    return Response.json({
      analysis: analysisText,
      filename: file.name,
      size: file.size,
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Upload/analysis error";
    return Response.json({ error: msg }, { status: 500 });
  }
}
