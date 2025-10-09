import { createGoogleGenerativeAI } from "@ai-sdk/google";

export const googleAI = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_AI_API_KEY,
});
