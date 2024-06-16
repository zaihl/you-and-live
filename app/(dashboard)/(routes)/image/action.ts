"use server"

import { auth } from "@clerk/nextjs/server";

export async function generateImage({prompt, style, resolution}: {prompt: string, style: string, resolution: string}) {
    try {
        const { userId } = auth()
        if (!userId) {
            throw new Error("user unauthorized")
        }
        if (!prompt) {
            throw new Error("prompt required")
        }
        console.log("here in generateImage")
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
        console.log("here before fetch")
        const res = await fetch('https://api.getimg.ai/v1/essential/text-to-image', options)
        const { image } = await res.json()
        console.log("here after fetch")
        return `data:image/png;base64,${image}`
    } catch (error: any) {
        throw new Error(error)
    }
}