<script lang="ts">
    import {createEventDispatcher, onMount} from 'svelte';
    import DownloadButton from '$lib/components/buttons/download-button.svelte';
    import type {GeneratedImage} from '$lib/types';
    import {ResourceLoader} from '$lib/utils/resource_loader';
    import type {Style} from "$lib/types";

    export let image: GeneratedImage;
    export let styles: Style[] = [];

    function getStyleFromPrompt(prompt: string): Style | undefined {
        console.log(styles);
        return styles.find(style => prompt.includes(style.prompt));
    }

    const dispatch = createEventDispatcher();

    function closePopup() {
        dispatch('close');
    }

    function handleDownload() {
        const link = document.createElement('a');
        link.href = `data:image/png;base64,${image.image}`;
        link.download = `generated-image-${image.id}.png`;
        link.click();
    }
</script>

<div class="popup-overlay">
    <div class="popup-content">
        <button on:click={closePopup} class="close-button">✕</button>

        <div class="image-container">
            <img src="data:image/png;base64,{image.image}" alt="Image generated from prompt: {image.prompt}">
        </div>

        <div class="info-container">
            <h2>Prompt</h2>
            <p>{image.prompt}</p>

            {#if image.negative_prompt}
                <h3>Negative Prompt</h3>
                <p>{image.negative_prompt}</p>
            {/if}

            {#if getStyleFromPrompt(image.prompt) !== undefined}
                <div class="my-3">
                    <h2>Style</h2>
                    <img src={getStyleFromPrompt(image.prompt)?.preview_src} alt="style"
                         class="object-cover rounded-[10px] aspect-square w-20"/>
                    <p class="italic">{getStyleFromPrompt(image.prompt)?.prompt}</p>
                </div>
            {/if}

            <DownloadButton on:click={handleDownload}>Download</DownloadButton>
        </div>
    </div>
</div>

<style>
    h2 {
        font-size: 1.5rem;
        font-weight: bold;
        margin-bottom: 0.5rem;
    }

    .popup-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    }

    .popup-content {
        background-color: theme('colors.bg');
        padding: 2rem;
        border-radius: 0.5rem;
        max-width: 90%;
        max-height: 90%;
        overflow-y: auto;
        position: relative;
        display: flex;
        gap: 2rem;
    }

    .close-button {
        position: absolute;
        top: 1rem;
        right: 1rem;
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        color: theme('colors.text');
    }

    .image-container {
        flex: 1;
    }

    .image-container img {
        width: 100%;
        height: auto;
        border-radius: 0.5rem;
    }

    .info-container {
        flex: 0 0 300px;
    }
</style>