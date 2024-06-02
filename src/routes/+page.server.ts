import { generate } from "$lib/api";
import { type Prompt } from "$lib/types";

export async function load() {
    const prompt: Prompt = {
        prompt: "1",
        num_images: 1,
        image_size: 1,
        aspect_ratio: 1,
        steps: 1,
    };

    // const images = await generate(prompt);
    return {
        prompt,
        //     images,
    };
}
