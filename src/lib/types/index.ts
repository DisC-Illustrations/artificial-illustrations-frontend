import z from "zod";

export const PromptSchema = z.object({
    prompt: z.string(),
    num_images: z.number(),
    image_size: z.number(),
    aspect_ratio: z.number(),
    steps: z.number(),
});

export type Prompt = z.infer<typeof PromptSchema>;
