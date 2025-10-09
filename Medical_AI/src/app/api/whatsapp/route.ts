import { NextRequest, NextResponse } from "next/server";
import { platoTrpc } from "@/lib/plato";

export async function GET(request: NextRequest) {
  try {
    const res = await platoTrpc.viewer.connect.messages.send.mutate({
      content: { en: "TEST" },
      conversationId: "cmgip5no000150fhoiz6doqvl",
    });

    return NextResponse.json({
      success: true,
      result: res,
    });
  } catch (error: any) {
    console.error("Error sending message:", error);
    return NextResponse.json(
      { success: false, error: error.message ?? "Unknown error" },
      { status: 500 }
    );
  }
}
