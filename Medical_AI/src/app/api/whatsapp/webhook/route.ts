import { platoTrpc } from "@/lib/plato";
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

    // await platoTrpc.viewer.connect.messages.autoAiReply.mutate({
    //     content: { en: `YOU SENT: ${content.en}` },
    //     conversationId,
    //   });
    // await platoTrpc.viewer.connect.messages.send.mutate({
    //   content: { en: `YOU SENT: ${content.en}` },
    //   conversationId,
    // });

    console.log("📩 Incoming WhatsApp Webhook:", {
      id,
      status,
      content,
      conversationId,
      senderId,
      channelIdentifier: channel?.identifier,
      createdAt,
    });

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
