import type {Style} from "$lib/types";

export class ResourceLoader {
    static async getLlmResponse(articleText: string) {
        return fetchLlmResponse(articleText);
    }

    static async loadStyles() {
        return loadStyles();
    }
}

// mocked data
async function loadStyles(): Promise<Style[]> {
    // read from static directory
    try {
        const response = await fetch("/values/styles.json");
        if (!response.ok) {
            throw new Error("Failed to load styles");
        }
        const jsonData: Style[] = await response.json();
        return jsonData;
    } catch (error) {
        console.error('Error loading styles:', error);
        throw error;
    }
}

const fetchLlmResponse = async (articleText: string): Promise<string> => {
    try {
        const response = await fetch("/api/generate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                prompt: articleText,
            }),
        });
        const data = await response.json();
        return data.text;
    } catch (error) {
        console.error('Error fetching response:', error);
        throw error;
    }
};
