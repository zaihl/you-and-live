import * as z from "zod"

export const formSchema = z.object({
    prompt: z.string().min(1, {
        message: "Prompt is required"
    }),
    voice: z.string().min(1, {
        message: "Voice is required"
    })
})

export const voiceOptions = [
    {
        value: "alloy",
        label: "Alloy (Neutral)"
    },
    {
        value: "echo",
        label: "Echo (Male)"
    },
    {
        value: "fable",
        label: "Fable (British)"
    },
    {
        value: "onyx",
        label: "Onyx (Deep)"
    },
    {
        value: "nova",
        label: "Nova (Female)"
    },
    {
        value: "shimmer",
        label: "Shimmer (Clear)"
    }
]