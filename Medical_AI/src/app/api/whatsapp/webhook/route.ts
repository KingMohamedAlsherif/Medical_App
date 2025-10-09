import { aiAutoReply } from "@/lib/agents";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // Parse the incoming body
    const data = await request.json();

    // Example: Extract useful fields
    const {
      id,
      status,
      content,
      conversationId,
      channel,
      senderId,
      createdAt,
    } = data;

    // Chat Auto Reply
    await aiAutoReply(content.en, conversationId);

    return NextResponse.json({
      success: true,
      received: true,
      data,
    });
  } catch (error: any) {
    console.error("❌ Webhook Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message ?? "Unknown error",
      },
      { status: 500 }
    );
  }
}
