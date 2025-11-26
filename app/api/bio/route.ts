import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { increaseApiLimit, checkApiLimit } from "@/lib/apiLimit";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
    try {
        const { keywords } = await req.json();

        const canGenerate = await checkApiLimit();
        if (!canGenerate) return new NextResponse("Free/Guest limit exceeded", { status: 403 });

        if (!keywords) return new NextResponse("Keywords required", { status: 400 });

        const model = genAI.getGenerativeModel({ model: "gemini-flash-lite-latest" });

        const prompt = `Generate 5 catchy social media bios based on these keywords/mood: "${keywords}". 
        Include emojis. Keep them under 150 characters each.`;

        const result = await model.generateContent(prompt);
        await increaseApiLimit();

        return NextResponse.json({ bios: result.response.text() });

    } catch (error: any) {
        console.error("[BIO_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}