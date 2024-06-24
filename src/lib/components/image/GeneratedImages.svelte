<script lang="ts">
    import { generate, getImage } from '$lib/api';
    import LoadingWave from '../loading/loading-wave.svelte';
    import type { Prompt, GeneratedImage } from '$lib/types';

    export let initialPrompt: Prompt | null = null;

    let generatedImages: GeneratedImage[] = [];
    let error: string | null = null;
    
    $: loading = false;

    async function handleGenerate(requestPrompt: Prompt | null = initialPrompt) {
        // todo: refactoring for this to be in a not async function
        loading = true;
        if (!requestPrompt) {
            return;
        }

        try {
            let results = await generate(requestPrompt);

            for (let image of results) {
                console.log("Image: ", image.image);
                image.prompt = requestPrompt.prompt;
                image.negative_prompt = requestPrompt.negative_prompt;
            }

            generatedImages = results;
            loading = false;
        } catch (err) {
            loading = false;
            error = 'Error generating images';
            console.error(err);
        }
    }

    async function loadImage(id: number) {
        try {
            loading = true;
            const image = await getImage(id);
            const index = generatedImages.findIndex(img => img.id === id);
            if (index !== -1) {
                generatedImages[index] = image;
                loading = false;
            } else {
                generatedImages = [...generatedImages, image];
                loading = false;
            }
        } catch (err) {
            loading = false;
            error = 'Error loading image';
            console.error(err);
        }
    }

    $: {
        if (initialPrompt) {
            handleGenerate(initialPrompt);
        }
    }
</script>

{#if error}
    <p>{error}</p>
{/if}

{#if generatedImages.length === 0}
    <div class="image-wrapper">
        <p>Keine Bilder vorhanden</p>
    </div>
{:else if loading}
    <div class="image-wrapper">
        <LoadingWave />
    </div>
{:else}
    <div class="image-grid">
        {#each generatedImages as image (image.id)}
            <div class="image-container">
                <img src="data:image/png;base64,{image.image}" alt="Prompt: {image.prompt}">
                <p>ID: {image.id}</p>
                <p>Prompt: {image.prompt}</p>
            </div>
        {/each}
    </div>
{/if}

<style>
    .image-wrapper {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
    }

    .image-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 1rem;
    }

    .image-container {
        border: 1px solid theme('colors.lightBlue');
        padding: 1rem;
    }

    .image-container img {
        width: 100%;
        height: auto;
    }
</style>