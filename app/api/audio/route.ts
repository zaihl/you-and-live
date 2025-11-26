import { NextResponse } from "next/server";
import { checkApiLimit, increaseApiLimit } from "@/lib/apiLimit";
import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";
import { Readable } from "stream";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { prompt } = body;

        if (!prompt) {
            return new NextResponse("Prompt is required", { status: 400 });
        }

        const canGenerate = await checkApiLimit();
        if (!canGenerate) {
            return new NextResponse("Free/Guest limit exceeded", { status: 403 });
        }

        await increaseApiLimit();

        // Initialize client — must have ELEVEN_LABS_API_KEY set
        const elevenlabs = new ElevenLabsClient({
            apiKey: process.env.ELEVEN_LABS_API_KEY
        });

        // Static voice example, exactly like your original code intent
        const voiceId = "4tRn1lSkEn13EVTuqb0g";

        const audio = await elevenlabs.textToSpeech.convert(voiceId, {
            text: prompt,
            modelId: "eleven_multilingual_v2",
            outputFormat: "mp3_44100_128"
        });

        // Convert stream to usable buffer
        const reader = audio.getReader();
        const stream = new Readable({
            async read() {
                const { done, value } = await reader.read();
                if (done) {
                    this.push(null);
                } else {
                    this.push(value);
                }
            },
        });

        const chunks: Buffer[] = [];
        for await (const chunk of stream) {
            chunks.push(Buffer.from(chunk));
        }
        const finalBuffer = Buffer.concat(chunks);

        const base64 = finalBuffer.toString("base64");
        const audioSrc = `data:audio/mpeg;base64,${base64}`;

        return NextResponse.json({ audio: audioSrc });

    } catch (error: any) {
        console.log("[AUDIO_ERROR]", error);
        return new NextResponse(error.message || "Internal Error", { status: 500 });
    }
}
