// /app/dashboard/image/constants.ts
import * as z from "zod"

// Updated schema to remove resolution
export const formSchema = z.object({
    prompt: z.string().min(1, {
        message: "Image prompt is required"
    }),
    style: z.string().min(1)
})

export const styleOptions = [
    {
        value: "photograph",
        label: "Photography",
    },
    {
        value: "digital art",
        label: "Digital Art",
    },
    {
        value: "sketch",
        label: "Sketch",
    },
    {
        value: "oil painting",
        label: "Painting"
    },
    {
        value: "logo",
        label: "Logo"
    }
]