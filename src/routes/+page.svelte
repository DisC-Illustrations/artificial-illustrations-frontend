<script lang="ts">
    import type { PageServerData } from "./$types";
    import { type Prompt, PromptSchema } from "$lib/types";
    import { superForm } from "sveltekit-superforms";
    import { zod } from "sveltekit-superforms/adapters";
    import {string} from "zod";
    import {onMount} from "svelte";

    export let data: PageServerData;

    $: images = []

    const formData: Prompt = data.prompt;

    const { form, enhance } = superForm(formData, {
        SPA: true,
        validators: zod(PromptSchema),
        taintedMessage: false,
        invalidateAll: false,
        onUpdated: async ({ form }) => {
            if (form.valid) {
                const response = await fetch("/api/", {
                    method: "POST",
                    body: JSON.stringify({
                        formData,
                    }),
                });

                // const data = await response.json();

                // images = data;
            }
        },
    });
</script>

<div>
    <h1 class="font-sans font-medium">{data.prompt.prompt}</h1>
    <form method="POST" use:enhance>
        <input type="text" value={$form.prompt} placeholder={$form.prompt} />
        <button type="submit">test</button>
    </form>

</div>
