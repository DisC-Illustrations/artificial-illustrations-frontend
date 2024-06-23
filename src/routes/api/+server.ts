import {generate} from "$lib/api";
import type {RequestEvent} from "@sveltejs/kit";
import type {Prompt} from "$lib/types";

export const POST = async (event: RequestEvent) => {
    const prompt: Prompt = JSON.parse(await event.request.arrayBuffer().then((buffer) => new TextDecoder().decode(buffer)));
    return await generate(prompt);
}
