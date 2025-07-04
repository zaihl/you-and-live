import {
    GoogleGenAI // Removed ChatSession as it is not exported
} from "@google/genai";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { increaseApiLimit, checkApiLimit } from "@/lib/apiLimit";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: Request) {
    try {
        const { messages } = await req.json(); // `messages` includes the full history + current prompt
        const { userId } = auth();

        if (!userId) {
            return NextResponse.json({ error: "User unauthorized" }, { status: 401 });
        }

        if (!messages || messages.length === 0) {
            return NextResponse.json({ error: "Messages are required" }, { status: 400 });
        }

        const freeTrial = await checkApiLimit();
        if (!freeTrial) {
            return NextResponse.json({ error: "Free trial limit exceeded" }, { status: 403 });
        }
        await increaseApiLimit();

        // Separate history from the current message
        const history = messages.slice(0, -1);
        const currentMessageParts = messages[messages.length - 1]?.parts;

        if (!currentMessageParts || currentMessageParts.length === 0 || !currentMessageParts[0].text) {
            return NextResponse.json({ error: "Invalid current message format" }, { status: 400 });
        }
        const currentPrompt = currentMessageParts[0].text;

        const chat = ai.chats.create({
            model: "gemini-2.5-flash-preview-05-20", // Or a specific code generation tuned model if available and preferred
            history: history,
            config: {
                maxOutputTokens: 10000,
                temperature: 1.0,
            }
        });

        const result = await chat.sendMessage({
            message: currentPrompt,
        });

        // const result = await chat.sendMessage(currentPrompt); // Simpler call if config in sendMessage is not supported

        const text = result.text; // Accessing .text directly as per new documentation

        return NextResponse.json({ text });
    } catch (error: any) {
        console.error("[TEXT_GENERATION_ERROR]", error);
        return NextResponse.json({ error: error.message || "An unexpected error occurred during text generation." }, { status: 500 });
    }
}