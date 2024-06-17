import type {Prompt} from "$lib/types";

export interface ApiResponse {
    images: [string];
}

export async function generate(prompt: Prompt): Promise<ApiResponse> {
    const response = await fetch("http://127.0.0.1:5000/generate", {
        method: "POST",
        body: JSON.stringify(prompt),
    });

    return await response.json();
}
