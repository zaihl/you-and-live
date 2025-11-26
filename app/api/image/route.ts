import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { checkApiLimit, increaseApiLimit } from "@/lib/apiLimit";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { prompt, style } = body;

        if (!prompt || typeof prompt !== "string") {
            return new NextResponse("Prompt is required", { status: 400 });
        }

        const canGenerate = await checkApiLimit();
        if (!canGenerate) {
            return new NextResponse("Free/Guest limit exceeded", { status: 403 });
        }

        // Increase limit before call
        await increaseApiLimit();

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return new NextResponse("API Key not configured", { status: 500 });
        }

        // 1. Initialize the new SDK Client
        const ai = new GoogleGenAI({ apiKey });

        const fullPrompt =
            style && typeof style === "string"
                ? `A ${style} of ${prompt}`
                : prompt;

        // 2. call generateContent (Non-streaming is better for a simple HTTP response)
        // We use the same configuration structure as your reference.
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-image",
            config: {
                // Explicitly ask for IMAGE. You can add 'TEXT' if you want captions.
                responseModalities: ["IMAGE"],
            },
            contents: [
                {
                    role: "user",
                    parts: [
                        {
                            text: fullPrompt,
                        },
                    ],
                },
            ],
        });

        // 3. Extract the image data
        // The structure follows the reference: candidates -> content -> parts -> inlineData
        const candidate = response.candidates?.[0];
        const part = candidate?.content?.parts?.[0];

        if (!part || !part.inlineData || !part.inlineData.data) {
            return new NextResponse("Image generation failed", { status: 500 });
        }

        // 4. Format the Base64 string for the frontend
        const mimeType = part.inlineData.mimeType || "image/png";
        const base64Data = part.inlineData.data;

        // Create the Data URL
        const src = `data:${mimeType};base64,${base64Data}`;

        return NextResponse.json({ src });

    } catch (error: any) {
        console.error("[IMAGE_ERROR]", error);
        return new NextResponse(error?.message || "Internal Error", {
            status: 500,
        });
    }
}