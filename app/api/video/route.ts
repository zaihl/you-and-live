import { checkApiLimit, increaseApiLimit } from "@/lib/apiLimit";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import Replicate from "replicate"

const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN!,
})

export async function POST(req: Request) {
    try {
        const { prompt } = await req.json();
        const { userId } = auth()

        if (!userId) {
            return NextResponse.json({ error: "user unauthorized" }, { status: 401 })
        }
        if (!prompt) {
            return NextResponse.json({ error: "prompt required" }, { status: 400 })
        }

        const freeTrial = await checkApiLimit();
        if (!freeTrial) {
            return NextResponse.json({ error: "free trial limit exceeded" }, { status: 403 })
        }
        await increaseApiLimit();


        const input = {
            fps: 24,
            width: 1024,
            height: 576,
            prompt: prompt,
            guidance_scale: 17.5,
            negative_prompt: "very blue, dust, noisy, washed out, ugly, distorted, broken"
        };

        const output = await replicate.run("anotherjesse/zeroscope-v2-xl:9f747673945c62801b13b84701c783929c0ee784e4748ec062204894dda1a351", { input });

        return NextResponse.json(output, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: `[video error]: ${error}` })
    }
}
