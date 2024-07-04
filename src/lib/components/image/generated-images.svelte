<script lang="ts">
    import {generate, getImage} from '$lib/api';
    import LoadingWave from '../loading/loading-wave.svelte';
    import type {Prompt, GeneratedImage, Style} from '$lib/types';
    import ImagePopup from '$lib/components/image/image-popup.svelte';
    import {type Writable, writable} from "svelte/store";
    import DownloadButton from "$lib/components/buttons/download-button.svelte";

    export let initialPrompt: Prompt | null = null;
    export let newImageGenerated: Writable<boolean> = writable(false);
    export let styles: Style[] = [];

    let generatedImages: GeneratedImage[] = [];
    let error: string | null = null;
    let loading = false;
    let selectedImage: GeneratedImage | null = null;

    async function handleGenerate(requestPrompt: Prompt | null = initialPrompt) {
        error = null;
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
            newImageGenerated.set(true);
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

    function openPopup(image: GeneratedImage) {
        selectedImage = image;
    }

    function closePopup() {
        selectedImage = null;
    }

    function handleDownload() {
        if (selectedImage) {
            const link = document.createElement('a');
            link.href = `data:image/png;base64,${selectedImage.image}`;
            link.download = `generated-image-${selectedImage.id}.png`;
            link.click();
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

{#if loading}
    <div class="image-wrapper">
        <LoadingWave/>
    </div>
{:else if generatedImages.length === 0}
    <div class="image-wrapper">
        <p>Keine Bilder vorhanden</p>
    </div>
{:else}
    <div class="image-grid">
        {#each generatedImages as image (image.id)}
            <div class="image-container" on:click={() => openPopup(image)}>
                <img src="data:image/png;base64,{image.image}" alt="Prompt: {image.prompt}">
                <DownloadButton on:click={handleDownload}>Download</DownloadButton>
            </div>
        {/each}
    </div>
{/if}

{#if selectedImage}
    <ImagePopup image={selectedImage} styles={styles} on:close={closePopup}/>
{/if}

<style>
    .image-wrapper {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
    }

    .image-grid {
        display: flex;
        flex-direction: column;
        gap: 20px;
    }

    .image-container {
        cursor: pointer;
        padding: 10px;
        border: solid #9ca3af 1px;
        background-color: #323232;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 20px;
        border-radius: 25px;
    }

    .image-container img {
        height: max-content;
        border-radius: 16px;
    }
</style>