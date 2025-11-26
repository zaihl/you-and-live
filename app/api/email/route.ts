import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { increaseApiLimit, checkApiLimit } from "@/lib/apiLimit";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
    try {
        const { description, tone } = await req.json();

        const canGenerate = await checkApiLimit();
        if (!canGenerate) return new NextResponse("Free/Guest limit exceeded", { status: 403 });

        if (!description) return new NextResponse("Description required", { status: 400 });

        // Using standard flash for decent reasoning but speed
        const model = genAI.getGenerativeModel({ model: "gemini-flash-lite-latest" });

        const prompt = `Write a ${tone || "professional"} email based on this description: "${description}". 
        Include a subject line.`;

        const result = await model.generateContent(prompt);
        await increaseApiLimit();

        return NextResponse.json({ email: result.response.text() });

    } catch (error: any) {
        console.error("[EMAIL_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}