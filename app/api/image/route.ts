// app/api/image/route.ts
import { checkApiLimit, increaseApiLimit } from "@/lib/apiLimit";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { GoogleGenAI, Modality } from "@google/genai";

export async function POST(req: Request) {
    try {
        const { userId } = auth();
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const ai = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY!});

        const body = await req.json();
        // The 'resolution' field is no longer used with this model
        const { prompt, style } = body;

        if (!prompt) {
            return new NextResponse("Prompt is required", { status: 400 });
        }

        const freeTrial = await checkApiLimit();

        if (!freeTrial) {
            return new NextResponse("Free trial limit exceeded", { status: 403 });
        }

        await increaseApiLimit();

        // Combine the user's prompt with the selected style
        const fullPrompt = `A ${style} of ${prompt}`;

        // Generate content using the Gemini model for image generation
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-image", // Supported model for conversational image generation
            contents: [{
                role: "user",
                parts: [{ text: fullPrompt }]
            }],
            config: {
                // You must specify IMAGE as a response modality
                responseModalities: [Modality.TEXT, Modality.IMAGE],
            },
        });

        // Find the first image part in the response
        let src = "";
        if (
            response.candidates &&
            response.candidates[0] &&
            response.candidates[0].content &&
            Array.isArray(response.candidates[0].content.parts)
        ) {
            for (const part of response.candidates[0].content.parts) {
                if (part.inlineData) { // Check for image data
                    const imageData = part.inlineData.data; // Extract base64 data
                    src = `data:image/png;base64,${imageData}`;
                    break; // Stop after finding the first image
                }
            }
        }

        if (!src) {
            return new NextResponse("Image could not be generated.", { status: 500 });
        }

        return NextResponse.json({ src });

    } catch (error) {
        console.log('[IMAGE_ERROR]', error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
