import { checkApiLimit, increaseApiLimit } from "@/lib/apiLimit";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { userId } = auth();
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const body = await req.json();
        const { prompt, style, resolution } = body;

        if (!prompt) {
            return new NextResponse("Prompt is required", { status: 400 });
        }

        const freeTrial = await checkApiLimit();

        if (!freeTrial) {
            return new NextResponse("Free trial limit exceeded", { status: 403 });
        }

        await increaseApiLimit();

        const size = resolution.slice(0, 4);
        const options = {
            method: 'POST',
            headers: {
                accept: 'application/json',
                'content-type': 'application/json',
                authorization: `Bearer ${process.env.NEXT_PUBLIC_GETIMG_API_KEY}`
            },
            body: JSON.stringify({
                prompt: prompt,
                style: style,
                width: size,
                height: size,
                output_format: 'png'
            })
        };

        const res = await fetch('https://api.getimg.ai/v1/essential/text-to-image', options);
        const { image } = await res.json();
        const src = `data:image/png;base64,${image}`;

        return NextResponse.json({ src });

    } catch (error) {
        console.log('[IMAGE_ERROR]', error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}