"use server"

import { checkApiLimit, increaseApiLimit } from "@/lib/apiLimit";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function generateImage({prompt, style, resolution}: {prompt: string, style: string, resolution: string}) {
    try {
        const { userId } = auth()
        if (!userId) {
            throw new Error("user unauthorized")
        }
        if (!prompt) {
            throw new Error("prompt required")
        }
        const freeTrial = await checkApiLimit();
        await increaseApiLimit();

        if (!freeTrial) {
            return NextResponse.json({ error: "free trial limit exceeded" }, { status: 403 })
        }
        const size = resolution.slice(0, 4)
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
        const res = await fetch('https://api.getimg.ai/v1/essential/text-to-image', options)
        const { image } = await res.json()
        return `data:image/png;base64,${image}`
    } catch (error: any) {
        throw new Error(error)
    }
}