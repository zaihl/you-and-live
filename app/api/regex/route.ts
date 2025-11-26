import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { increaseApiLimit, checkApiLimit } from "@/lib/apiLimit";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
    try {
        const { pattern } = await req.json();

        const canGenerate = await checkApiLimit();
        if (!canGenerate) return new NextResponse("Free/Guest limit exceeded", { status: 403 });

        if (!pattern) return new NextResponse("Pattern description required", { status: 400 });

        const model = genAI.getGenerativeModel({ model: "gemini-flash-lite-latest" });

        const prompt = `Generate a Regular Expression (Regex) for the following requirement: "${pattern}". 
        Provide the Regex code and no explanation`;

        const result = await model.generateContent(prompt);
        await increaseApiLimit();

        return NextResponse.json({ regex: result.response.text() });

    } catch (error: any) {
        console.error("[REGEX_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}