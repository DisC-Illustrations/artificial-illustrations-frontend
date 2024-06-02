import { generate } from "$lib/api";
import type { RequestEvent } from "@sveltejs/kit";

export async function POST(event: RequestEvent) {
    const { prompt } = await event.request.json();

    const images = await generate(prompt);

    return new Response(JSON.stringify(images), { status: 200 });
}
