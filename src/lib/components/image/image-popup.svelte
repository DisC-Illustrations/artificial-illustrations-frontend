<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import DownloadButton from '$lib/components/buttons/download-button.svelte';
    import type { GeneratedImage } from '$lib/types';

    export let image: GeneratedImage;

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

            <DownloadButton on:click={handleDownload}>Download</DownloadButton>
        </div>
    </div>
</div>

<style>
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