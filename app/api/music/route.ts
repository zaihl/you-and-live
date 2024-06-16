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

        const input = {
            prompt_b: prompt
        };

        const output = await replicate.run("riffusion/riffusion:8cf61ea6c56afd61d8f5b9ffd14d7c216c0a93844ce2d82ac1c9ecc9c7f24e05", { input });

        return NextResponse.json(output, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: `[music error]: ${error}` })
    }
}
