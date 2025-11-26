import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { increaseApiLimit, checkApiLimit } from "@/lib/apiLimit";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
    try {
        const { messages } = await req.json();

        const canGenerate = await checkApiLimit();
        if (!canGenerate) {
            return new NextResponse("Free/Guest limit exceeded", { status: 403 });
        }

        if (!messages || messages.length === 0) {
            return new NextResponse("Messages are required", { status: 400 });
        }

        // System instruction for code (simulated via history for consistency with library version)
        const systemInstruction = {
            role: "user",
            parts: [{ text: "You are a code generator. You must answer only in Markdown code snippets. Use comments for explanations." }]
        };
        const modelResponse = {
            role: "model",
            parts: [{ text: "Understood. I will generate code." }]
        };

        const history = [systemInstruction, modelResponse, ...messages.slice(0, -1)];
        const currentMessage = messages[messages.length - 1]?.parts[0]?.text;

        // Use a specific version of the flash model
        const model = genAI.getGenerativeModel({
            model: "gemini-2.0-flash",
            generationConfig: {
                maxOutputTokens: 8192,
                temperature: 0.2,
            }
        });

        const chat = model.startChat({
            history: history,
        });

        // Non-streaming response
        const result = await chat.sendMessage(currentMessage);
        await increaseApiLimit();

        const responseText = result.response.text();

        return NextResponse.json({ text: responseText });

    } catch (error: any) {
        console.error("[CODE_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}