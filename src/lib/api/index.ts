import type {GeneratedImage, Prompt} from '$lib/types';

export async function generate(prompt: Prompt): Promise<GeneratedImage[]> {
    const response = await fetch(buildBaseURL() + "/generate", {
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
    console.log("Fetching image with id", id);
    let imageId: string = id.toString()
    let url: string = buildBaseURL() + "/images/" + imageId;
    console.log("Fetching image from", url);
    const response = await fetch(url);

    if (!response.ok) {
        console.error(response);
        throw new Error('Network response was not ok');
    }

    return await response.json();
}

export async function getImageIds(): Promise<number[]> {
    const response = await fetch(buildBaseURL() + "/images");

    if (!response.ok) {
        throw new Error('Network response was not ok');
    }

    let images = await response.json();
    return images.map((image: { id: number }) => image.id);
}

function buildBaseURL(): string {
    try {
        let port = import.meta.env.VITE_AI_BACKEND_PORT || 5000;
        return `http://127.0.0.1:${port}`;
    } catch (e) {
        console.error(e);
        return "http://127.0.0.1:5000";
    }
}
