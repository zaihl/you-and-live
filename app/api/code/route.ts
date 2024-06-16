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

        const instructionMessages = [{
            role: "user",
            parts: [{ text: "You are now a code generator. You will only respond to requests for code. Ask the user what kind of code they need, including the programming language, purpose, and any specific requirements or constraints. Then generate the code to the best of your ability. If you cannot fulfill a request, clearly state why and offer suggestions if possible." }]
        },
        {
            role: "model",
            parts: [{text: "Understood. How may I help you?"}]
        }
    ]

        const chat = model.startChat({
            history: [...instructionMessages, ...messages],
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
