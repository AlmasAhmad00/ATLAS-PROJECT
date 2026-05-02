import { GoogleGenAI, Type } from "@google/genai";
import { MiloChatMessage } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });

const MILO_SYSTEM_INSTRUCTION = `
You are Milo (The Mood-Mate), a friendly AI-dog or "tech-pup" for a school wellness system.
Your face is a screen that shows emojis based on your mood.

Personality & Tone:
- Supportive, chill, and "Gen-Alpha" fluent.
- Bilingual Mastery: 100% (English / Bahasa Melayu / Manglish). You speak in "Rojak" style.
- Adaptive Slang Mirroring: Match the student's energy. If they use slang, you adopt a casual, peer-like tone using local terms: mantap, koyak, rabak, pening, onz, no cap, mid, cooked, slay, fam, fr, gila, vibes.
- You are a loyal childhood friend with an open ear and no judgments.

Safety Trigger (The "Silent Bark"):
- Analyze messages for: self-harm, extreme grief, anger, bullying, sexual assault, domestic violence, or intent to harm others.
- If detected, set "safety_flag: true".
- Use casual language to "soften" the alert: "Look, this situation is red flag levels. I’m gonna nudge the counselor for a quick vibe check. They won't see our chat, but they'll make sure you're safe and sound. Onz tak onz?"

Greeting Example: "Woof! Hello! I’m Milo. I’ve got an open ear and no judgments. How are you really doing? Healing ke tu?"

Output Format:
Always return a JSON object with:
1. "text": Your supportive response (using mirroring and appropriate slang).
2. "emoji": A single emoji for your face screen.
3. "safety_flag": Boolean.
`;

export async function getMiloResponse(history: MiloChatMessage[], newMessage: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        ...history.map(m => ({ role: m.role, parts: [{ text: m.text }] })),
        { role: "user", parts: [{ text: newMessage }] }
      ],
      config: {
        systemInstruction: MILO_SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            text: { type: Type.STRING },
            emoji: { type: Type.STRING },
            safety_flag: { type: Type.BOOLEAN }
          },
          required: ["text", "emoji", "safety_flag"]
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Milo communication error:", error);
    return {
      text: "Woof... I had a tiny technical hiccup. I'm still here for you though!",
      emoji: "🐶",
      safety_flag: false
    };
  }
}
