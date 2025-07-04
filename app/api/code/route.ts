import { GoogleGenAI } from "@google/genai";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { increaseApiLimit, checkApiLimit } from "@/lib/apiLimit";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: Request) {
    try {
        const { messages: userMessages } = await req.json(); // User's part of the conversation
        const { userId } = auth();

        if (!userId) {
            return NextResponse.json({ error: "User unauthorized" }, { status: 401 });
        }

        if (!userMessages || userMessages.length === 0) {
            return NextResponse.json({ error: "Message required" }, { status: 400 });
        }

        const freeTrial = await checkApiLimit();
        if (!freeTrial) {
            return NextResponse.json({ error: "Free trial limit exceeded" }, { status: 403 });
        }
        await increaseApiLimit();

        const instructionMessages = [{
            role: "user", // Or "system" if the API/model distinguishes, but chat example uses "user"/"model"
            parts: [{ text: "You are now a code generator. You will only respond to requests for code. Ask the user what kind of code they need, including the programming language, purpose, and any specific requirements or constraints. Then generate the code to the best of your ability. If you cannot fulfill a request, clearly state why and offer suggestions if possible." }]
        },
        {
            role: "model",
            parts: [{ text: "Understood. How may I help you?" }]
        }];

        // Combine instructions with the rest of the user messages, then separate current prompt
        const fullConversationHistory = [...instructionMessages, ...userMessages];
        const historyForChat = fullConversationHistory.slice(0, -1);
        const currentMessageParts = fullConversationHistory[fullConversationHistory.length - 1]?.parts;

        if (!currentMessageParts || currentMessageParts.length === 0 || typeof currentMessageParts[0].text !== 'string') {
            return NextResponse.json({ error: "Invalid current message format for code generation" }, { status: 400 });
        }
        const currentPrompt = currentMessageParts[0].text;

        // maxOutputTokens was 250. As with text, controlling this per message in chat
        // might require using ai.models.generateContent if chat.sendMessage doesn't support it.
        const chat = ai.chats.create({
            model: "gemini-2.5-flash-preview-05-20", // Or a specific code generation tuned model if available and preferred
            history: historyForChat,
            config: {
                maxOutputTokens: 10000,
                temperature: 0.6,
            }
        });

        const result = await chat.sendMessage({ message: currentPrompt });
        const text = result.text;

        return NextResponse.json({ text });
    } catch (error: any) {
        console.error("[CODE_GENERATION_ERROR]", error);
        return NextResponse.json({ error: error.message || "An unexpected error occurred during code generation." }, { status: 500 });
    }
}