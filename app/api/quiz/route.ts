import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { increaseApiLimit, checkApiLimit } from "@/lib/apiLimit";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
    try {
        const { topic } = await req.json();

        const canGenerate = await checkApiLimit();
        if (!canGenerate) return new NextResponse("Free/Guest limit exceeded", { status: 403 });

        if (!topic) return new NextResponse("Topic is required", { status: 400 });

        const model = genAI.getGenerativeModel({ model: "gemini-flash-lite-latest" }); // Fast model

        const prompt = `Generate a multiple-choice quiz about "${topic}". 
        Provide 3 questions. For each question, list 4 options and indicate the correct answer. 
        Format the output as a clean JSON object with an array of questions.`;

        const result = await model.generateContent(prompt);
        await increaseApiLimit();

        return NextResponse.json({ quiz: result.response.text() });

    } catch (error: any) {
        console.error("[QUIZ_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}