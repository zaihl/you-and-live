import * as z from "zod"

export const formSchema = z.object({
    prompt: z.string().min(1, {
        message: "Image prompt is required"
    }),
    style: z.string().min(1),
    resolution: z.string().min(1)
})

export const styleOptions = [
    {
        value: "anime",
        label: "anime",
    },
    {
        value: "photorealism",
        label: "photorealism",
    },
    {
        value: "art",
        label: "art",
    },
]

export const resolutionOptions = [
    {
        value: "1024x1024",
        label: "1024x1024",
    },
    {
        value: "1280x1280",
        label: "1280x1280",
    },
    {
        value: "1536x1536",
        label: "1536x1536",
    },
]