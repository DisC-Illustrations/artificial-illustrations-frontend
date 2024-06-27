<!-- ImageHistorySidebar.svelte -->
<script lang="ts">
    import { onMount } from 'svelte';
    import { getImageIds, getImage } from '$lib/api';
    import type { GeneratedImage } from '$lib/types';

    let imageIds: number[] = [];
    let images: GeneratedImage[] = [];
    let loading = true;
    let error: string | null = null;

    onMount(async () => {
        try {
            imageIds = await getImageIds();
            console.log('Image IDs:', imageIds);
            await loadImages();
        } catch (err) {
            error = 'Error loading image history';
            console.error(err);
        } finally {
            loading = false;
        }
    });

    async function loadImages() {
        const promises = imageIds.map(id => getImage(id));
        images = await Promise.all(promises);
    }

    function handleImageClick(image: GeneratedImage) {
        // Dispatch an event or use a store to communicate with the parent component
        // For example:
        // dispatch('selectImage', image);
        console.log('Selected image:', image);
    }
</script>

<aside class="image-history-sidebar">
    {#if loading}
        <p>Loading image history...</p>
    {:else if error}
        <p>{error}</p>
    {:else if images.length === 0}
        <p>No images in history</p>
    {:else}
        <div class="image-list">
            {#each images as image (image.id)}
                <div class="image-item" on:click={() => handleImageClick(image)}>
                    <img src="data:image/png;base64,{image.image}" alt="Generated image {image.id}" />
                    <div class="image-info">
                        <p class="image-id">ID: {image.id}</p>
                        <p class="image-prompt">{image.prompt.slice(0, 30)}...</p>
                    </div>
                </div>
            {/each}
        </div>
    {/if}
</aside>

<style>
    .image-history-sidebar {
        position: fixed;
        left: 0;
        top: 0;
        bottom: 0;
        width: 100px;
        background-color: theme('colors.bg');
        border-right: 1px solid theme('colors.darkBlue');
        overflow-y: auto;
        padding: 1rem;
    }

    .image-list {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .image-item {
        cursor: pointer;
        border: 1px solid theme('colors.lightBlue');
        border-radius: 0.5rem;
        overflow: hidden;
        transition: all 0.2s ease-in-out;
    }

    .image-item:hover {
        transform: scale(1.05);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .image-item img {
        width: 100%;
        height: auto;
        object-fit: cover;
    }

    .image-info {
        padding: 0.5rem;
    }

    .image-id {
        font-size: 0.8rem;
        color: theme('colors.text');
        opacity: 0.7;
    }

    .image-prompt {
        font-size: 0.9rem;
        color: theme('colors.text');
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
</style>