import { checkApiLimit, increaseApiLimit } from "@/lib/apiLimit";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { prompt, style, aspectRatio, model = "turbo" } = body;

        if (!prompt) {
            return new NextResponse("Prompt is required", { status: 400 });
        }

        const canGenerate = await checkApiLimit();
        if (!canGenerate) {
            return new NextResponse("Free/Guest limit exceeded", { status: 403 });
        }

        await increaseApiLimit();

        const fullPrompt = `A ${style} of ${prompt}`;

        // Map aspect ratios to dimensions supported by Pollinations
        let width = 512;
        let height = 512;

        // Default 1:1 is 1024x1024
        if (aspectRatio === "16:9") {
            width = 1280;
            height = 720;
        } else if (aspectRatio === "9:16") {
            width = 720;
            height = 1280;
        } else if (aspectRatio === "4:3") {
            width = 1024;
            height = 768;
        } else if (aspectRatio === "3:4") {
            width = 768;
            height = 1024;
        }

        // Add a random seed to ensure variety
        const seed = Math.floor(Math.random() * 1000000000);

        // Construct Pollinations URL with model support
        // https://pollinations.ai/p/[prompt]?width=[width]&height=[height]&seed=[seed]&model=[model]&nologo=true
        const imageUrl = `https://pollinations.ai/p/${encodeURIComponent(fullPrompt)}?width=${width}&height=${height}&seed=${seed}&model=${model}&nologo=true`;

        const response = await fetch(imageUrl);

        if (!response.ok) {
            return new NextResponse("Image generation failed", { status: response.status });
        }

        // Pollinations returns the binary image directly. We convert it to base64 for the frontend.
        const buffer = await response.arrayBuffer();
        const base64String = Buffer.from(buffer).toString('base64');
        const src = `data:image/jpeg;base64,${base64String}`;

        return NextResponse.json({ src });

    } catch (error: any) {
        console.log('[IMAGE_ERROR]', error);
        return new NextResponse(error.message || "Internal Error", { status: 500 });
    }
}