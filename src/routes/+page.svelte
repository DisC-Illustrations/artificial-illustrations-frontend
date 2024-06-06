<script lang="ts">
    import type { PageServerData } from "./$types";
    import { type Prompt, PromptSchema } from "$lib/types";
    import { superForm } from "sveltekit-superforms";
    import { zod } from "sveltekit-superforms/adapters";
    import { string } from "zod";
    import { onMount } from "svelte";
    import PrimaryButton from "$lib/components/buttons/primary-button.svelte";
    import TextArea from "$lib/components/inputs/text-area.svelte";


    export let data: PageServerData;

    $: images = [];

    const formData: Prompt = data.prompt;

    const { form, enhance } = superForm(formData, {
        SPA: true,
        validators: zod(PromptSchema),
        taintedMessage: false,
        invalidateAll: false,
        onUpdated: async ({ form }) => {
            if (form.valid) {
                const response = await fetch("/api/generate", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        prompt: inputText,
                    }),
                });

                const data = await response.json();
                responseText = data.text;
                // images = data;
            }
        },
    });


    let inputText = '';
    let responseText = '';

    const handleSubmit = async (event) => {
        event.preventDefault();
        await fetchResponse();
    };

    const fetchResponse = async () => {
        try {
            const response = await fetch("/api/generate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    prompt: inputText,
                }),
            });
            const data = await response.json();
            responseText = data.text;
        } catch (error) {
            console.error('Error fetching response:', error);
        }
    };
</script>


<form on:submit={handleSubmit}>
    <TextArea 
        bind:value={inputText} 
        placeholder="Enter your prompt" 
        label="Prompt"
        rows={5}
        required={true}
    />
    <button type="submit">Submit</button>
</form>

{#if responseText}
    <div>
        <h3>Response:</h3>
        <p>{responseText}</p>
    </div>
{/if}
