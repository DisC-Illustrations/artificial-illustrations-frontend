<script lang="ts">
    import type {PageServerData} from "./$types";
    import {type Prompt, PromptSchema} from "$lib/types";
    import {superForm} from "sveltekit-superforms";
    import {zod} from "sveltekit-superforms/adapters";
    import {string} from "zod";
    import {onMount} from "svelte";
    import PrimaryButton from "$lib/components/buttons/primary-button.svelte";
    import TextArea from "$lib/components/inputs/text-area.svelte";
    import LoadingWave from "$lib/components/loading/loading-wave.svelte";
    import GradientLoader from "$lib/components/loading/loading-circle-gradient.svelte";


    export let data: PageServerData;

    // fixme: default state is false
    $: loading = true;
    $: images = [];

    const formData: Prompt = data.prompt;

    const {form, enhance} = superForm(formData, {
        SPA: true,
        validators: zod(PromptSchema),
        taintedMessage: false,
        invalidateAll: false,
        onUpdated: async ({form}) => {
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


    let inputText = '';
    let imageElements = '';
    let responseText = '';
    let finalPrompt = '';

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
            name="Text"
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

<!-- show placeholder, loading animation, or images -->
{#if images.length > 0}
    <div>
        {#each images as image}
            <img src={image} alt="Generated image based on {finalPrompt}" />
        {/each}
    </div>
{/if}
{#if loading}
    <LoadingWave />
{/if}
