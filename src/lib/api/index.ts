import type { Prompt, GeneratedImage } from '$lib/types';

export async function generate(prompt: Prompt): Promise<GeneratedImage[]> {
    const response = await fetch("http://127.0.0.1:5000/generate", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(prompt),
    });

    if (!response.ok) {
        throw new Error('Network response was not ok');
    }

    return await response.json();
}

export async function getImage(id: number): Promise<GeneratedImage> {
    const response = await fetch(`http://127.0.0.1:5000/images/${id}`);

    if (!response.ok) {
        throw new Error('Network response was not ok');
    }

    return await response.json();
}
