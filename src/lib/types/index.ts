import z from "zod";

export const PromptSchema = z.object({
    prompt: z.string().min(1),
    num_images: z.number(),
    image_size: z.number(),
    aspect_ratio: z.number(),
    steps: z.number(),
    upscale: z.number().int().gte(1).lte(4).refine(value => [1, 2, 4].includes(value), {
        message: "Der Wert muss 1, 2 oder 4 sein."
    })
});

// export type Prompt = z.infer<typeof PromptSchema>;
export interface Prompt {
    prompt: string;
    negative_prompt?: string;
    num_images?: number;
    image_size?: number;
    aspect_ratio?: number;
    steps?: number;
    model?: string;
    upscale?: number;
}

export interface Style {
    name: string;
    preview_src: string;
    prompt: string;
}

export class AdditionalSettings {
    variations: number = 1;
    resolution: string = "1024x1024";
    detail: number = 2;

    constructor(variations: number = 1, resolution: string = "1024x1024", detail: number = 2) {
        this.variations = variations;
        this.resolution = resolution;
        this.detail = detail;
    }
}

export interface GeneratedImage {
    id: number;
    image: string;
    prompt: string;
    negative_prompt?: string;
}
