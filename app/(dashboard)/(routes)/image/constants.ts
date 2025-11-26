import * as z from "zod"

export const formSchema = z.object({
    prompt: z.string().min(1, {
        message: "Image prompt is required"
    }),
    style: z.string().min(1),
    aspectRatio: z.string().min(1)
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
    },
    {
        value: "anime",
        label: "Anime"
    },
    {
        value: "3d render",
        label: "3D Render"
    }
]

export const aspectRatioOptions = [
    {
        value: "1:1",
        label: "1:1 (Square)",
    },
    {
        value: "16:9",
        label: "16:9 (Widescreen)",
    },
    {
        value: "9:16",
        label: "9:16 (Portrait)",
    },
    {
        value: "4:3",
        label: "4:3 (Standard)",
    },
    {
        value: "3:4",
        label: "3:4 (Tall)",
    },
]