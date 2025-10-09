import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { generateObject } from "ai";
import { platoTrpc } from "@/lib/plato";
import { googleAI } from "@/lib/google-ai";

const MedicalReportSchema = z.object({
  patientName: z.string(),
  age: z.number(),
  gender: z.enum(["Male", "Female", "Other"]),
  diagnosis: z.string(),
  symptoms: z.array(z.string()),
  prescribedMedications: z.array(
    z.object({
      name: z.string(),
      dosage: z.string(),
      frequency: z.string(),
    })
  ),
  doctorNotes: z.string(),
  followUpDate: z.string().optional(),
});

export async function GET(request: NextRequest) {
  try {
    // Fetch conversation data
    const res = await platoTrpc.viewer.connect.messages.list.query({
      conversationId: "cmgip5no000150fhoiz6doqvl",
    });

    const messages = res ?? [];

    // Extract readable message text
    const conversationText = messages
      .map((m) => m.content?.en)
      .filter(Boolean)
      .join("\n");

    // Generate structured medical report
    const { object } = await generateObject({
      model: googleAI("gemini-2.5-flash"),
      schema: MedicalReportSchema,
      system: `
        You are an experienced medical assistant that analyzes patient–doctor chat transcripts.

        You will receive a list of messages (conversation between patient and doctor).
        From this text, you must extract relevant medical details and fill the report schema accurately.

        Guidelines:
        - If the patient’s name, age, or gender is mentioned, use it; otherwise infer logically.
        - Analyze symptoms and describe them clearly.
        - Derive diagnosis based on context (e.g., "fever", "headache", "infection", etc.).
        - Suggest reasonable medications if mentioned or implied.
        - Write a concise summary in doctorNotes.
        - followUpDate may be omitted if not mentioned.
      `,
      prompt: `
        Analyze the following chat transcript and fill the schema with inferred medical details:
        ---
        ${conversationText || "No messages available."}
      `,
    });

    return NextResponse.json({
      success: true,
      report: object,
    });
  } catch (error: any) {
    console.error("Error generating medical report:", error);
    return NextResponse.json(
      { success: false, error: error.message ?? "Unknown error" },
      { status: 500 }
    );
  }
}
