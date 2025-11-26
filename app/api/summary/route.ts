import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { increaseApiLimit, checkApiLimit } from "@/lib/apiLimit";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
    try {
        const { text } = await req.json();

        const canGenerate = await checkApiLimit();
        if (!canGenerate) {
            return new NextResponse("Free/Guest limit exceeded", { status: 403 });
        }

        if (!text) {
            return new NextResponse("Text to summarize is required", { status: 400 });
        }

        const model = genAI.getGenerativeModel({
            model: "gemini-flash-lite-latest",
            generationConfig: { maxOutputTokens: 512 }
        });

        const prompt = `Please provide a concise and bulleted summary of the following text, BE VERY SHORT:\n\n${text}`;

        const result = await model.generateContent(prompt);
        await increaseApiLimit();

        const responseText = result.response.text();

        return NextResponse.json({ summary: responseText });

    } catch (error: any) {
        console.error("[SUMMARY_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}