import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { increaseApiLimit, checkApiLimit } from "@/lib/apiLimit";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
    try {
        const { text, targetLanguage } = await req.json();

        const canGenerate = await checkApiLimit();
        if (!canGenerate) {
            return new NextResponse("Free/Guest limit exceeded", { status: 403 });
        }

        if (!text || !targetLanguage) {
            return new NextResponse("Text and target language are required", { status: 400 });
        }

        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash"
        });

        const prompt = `Translate the following text into ${targetLanguage}. Only return the translated text + english equivalent in that language (i mean something like romaji):\n\n${text}`;

        const result = await model.generateContent(prompt);
        await increaseApiLimit();

        const responseText = result.response.text();

        return NextResponse.json({ translation: responseText });

    } catch (error: any) {
        console.error("[TRANSLATE_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}