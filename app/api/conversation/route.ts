import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(req: Request) {
    try {
        const { messages } = await req.json();
        const {userId} = auth()

        if (!userId) {
            return NextResponse.json({error: "user unauthorized"}, {status: 401})
        }
        if (!messages) {
            return NextResponse.json({error: "message required"}, {status: 400})
        }
        
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const chat = model.startChat({
            history: messages,
            generationConfig: {
                maxOutputTokens: 250,
            },
        });

        const prompt = messages[messages.length - 1].parts[0].text;
        const result = await chat.sendMessage(prompt);
        const response = await result.response;
        const text = await response.text();
        console.log(text);
        return NextResponse.json({ text });
    } catch (error) {
        return NextResponse.json({ text: error })
    }
}
