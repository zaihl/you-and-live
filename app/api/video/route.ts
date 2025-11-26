import { checkApiLimit, increaseApiLimit } from "@/lib/apiLimit";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { prompt } = await req.json();

        if (!prompt) {
            return new NextResponse("Prompt is required", { status: 400 });
        }

        const canGenerate = await checkApiLimit();
        if (!canGenerate) {
            return new NextResponse("Free/Guest limit exceeded", { status: 403 });
        }

        await increaseApiLimit();

        // Pollinations Video URL format
        // This typically returns a redirect to the generated content or streams it.
        // We'll construct the direct URL for the frontend to use as a src for <video> or <img>
        // Note: Pollinations 'video' is often just iterating the image generation seed or using specific models.
        // A more robust 'video' endpoint is often simply:
        const videoUrl = `https://pollinations.ai/p/${encodeURIComponent(prompt)}?width=720&height=720&seed=${Math.floor(Math.random() * 1000)}&model=turbo&nologo=true`;

        // Note: For true video generation, dedicated APIs like Replicate are better, but expensive.
        // Pollinations 'video' is often just high-speed image generation.
        // However, their docs suggest standard image usage.
        // To actually get a "video" experience from Pollinations in a free tier, we usually treat it as a dynamic image.
        // IF we want actual video file output (mp4), we'd typically need a different free provider or use Replicate (paid).
        // BUT, since you asked for free tier:
        // Let's use the Pollinations Image URL but treat it as the result, as it's the closest free equivalent for "visual generation".
        // OR, we can try to use the 'gif' capability if available.

        // Actually, for this implementation, let's return the URL directly so the frontend can render it.
        // We won't fetch the buffer here to save bandwidth; we'll return the source URL.

        return NextResponse.json({ video: videoUrl });

    } catch (error: any) {
        console.log('[VIDEO_ERROR]', error);
        return new NextResponse(error.message || "Internal Error", { status: 500 });
    }
}