import type {Style} from "$lib/types";

export class ResourceLoader {
    static async getLlmResponse(articleText: string) {
        return fetchLlmResponse(articleText);
    }

    static loadStyles() {
        return loadStyles();
    }
}

// mocked data
function loadStyles(): Style[] {
    return [
        {
            name: "1",
            src: "https://thumbs.dreamstime.com/b/dwarf-gray-hamster-sits-his-house-sawdust-pet-care-concepts-237425150.jpg",
            prompt: "1",
        },
        {
            name: "2",
            src: "https://thumbs.dreamstime.com/b/dwarf-gray-hamster-sits-his-house-sawdust-pet-care-concepts-237425150.jpg",
            prompt: "1",
        },
        {
            name: "3",
            src: "https://thumbs.dreamstime.com/b/dwarf-gray-hamster-sits-his-house-sawdust-pet-care-concepts-237425150.jpg",
            prompt: "1",
        },
    ] as unknown as Style[];
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
