import { NextRequest, NextResponse } from "next/server";
import { platoTrpc } from "@/lib/plato";

export async function GET(request: NextRequest) {
  try {
    // Optionally get conversationId from query
    const { searchParams } = new URL(request.url);
    const conversationId =
      searchParams.get("conversationId") ?? "cmgip5no000150fhoiz6doqvl";

    console.log("📨 Fetching messages for:", conversationId);

    const messages = await platoTrpc.viewer.connect.messages.list.query({
      conversationId,
    });

    return NextResponse.json({
      success: true,
      data: messages,
    });
  } catch (error: any) {
    console.error("❌ Error fetching messages:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message ?? "Unknown error",
      },
      { status: 500 }
    );
  }
}
