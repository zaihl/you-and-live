import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { increaseApiLimit, checkApiLimit } from "@/lib/apiLimit";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
    try {
        const { ingredients } = await req.json();

        const canGenerate = await checkApiLimit();
        if (!canGenerate) return new NextResponse("Free/Guest limit exceeded", { status: 403 });

        if (!ingredients) return new NextResponse("Ingredients required", { status: 400 });

        const model = genAI.getGenerativeModel({ model: "gemini-flash-lite-latest" });

        const prompt = `Suggest a recipe using these ingredients: "${ingredients}". 
        Provide a title, list of ingredients, and step-by-step instructions.`;

        const result = await model.generateContent(prompt);
        await increaseApiLimit();

        return NextResponse.json({ recipe: result.response.text() });

    } catch (error: any) {
        console.error("[RECIPE_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}