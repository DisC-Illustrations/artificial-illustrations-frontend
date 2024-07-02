<!-- ImageHistorySidebar.svelte -->
<script lang="ts">
    import { onMount } from "svelte";
    import { getImageIds, getImage } from "$lib/api";
    import type { GeneratedImage, Style } from "$lib/types";
    import ImagePopup from "$lib/components/image/image-popup.svelte";
    import { writable, type Writable } from "svelte/store";
    import SecondaryButton from "$lib/components/buttons/secondary-button.svelte";

    export let newImageGenerated: Writable<boolean> = writable(false);
    export let styles: Style[] = [];

    $: if ($newImageGenerated) {
        console.log("New image generated, reloading image history");
        newImageGenerated.set(false);
        reloadImages();
    }

    async function reloadImages() {
        try {
            imageIds = await getImageIds();
            await loadImages();
        } catch (err) {
            error = "Error reloading image history";
            console.error(err);
        }
    }

    let imageIds: number[] = [];
    let images: GeneratedImage[] = [];
    let loading = true;
    let error: string | null = null;

    let selectedImage: GeneratedImage | null = null;

    onMount(async () => {
        try {
            imageIds = await getImageIds();
            console.log("Image IDs:", imageIds);
            await loadImages();
        } catch (err) {
            error = "Error loading image history";
            console.error(err);
        } finally {
            loading = false;
        }
    });

    async function loadImages() {
        const promises = imageIds.map((id) => getImage(id));
        images = await Promise.all(promises);
    }

    function openPopup(image: GeneratedImage) {
        selectedImage = image;
    }

    function closePopup() {
        selectedImage = null;
    }

    $: historyOpen = false;
    function toggleHistory() {
        historyOpen = !historyOpen;
    }
</script>

<SecondaryButton on:click={toggleHistory}>Galerie ansehen</SecondaryButton>

{#if historyOpen}
    <div
        class="fixed top-0 left-0 bg-bg/[.7] flex items-center justify-center z-50 w-full h-full"
    >
        <div
            class="bg-bgLight border border-border rounded-2xl relative p-12 flex flex-col w-[90vw] h-[90vh]"
        >
            <button on:click={toggleHistory} class="close-button">✕</button>
            {#if loading}
                <p>Loading image history...</p>
            {:else if error}
                <p>{error}</p>
            {:else if images.length === 0}
                <p>No images in history</p>
            {:else}
                <div class="image-list">
                    {#each images as image (image.id)}
                        <div
                            class="image-item"
                            on:click={() => openPopup(image)}
                        >
                            <img
                                src="data:image/png;base64,{image.image}"
                                alt="Generated image {image.id}"
                            />
                            <div class="image-info">
                                <p class="image-id">ID: {image.id}</p>
                                <p class="image-prompt">
                                    {image.prompt.slice(0, 30)}...
                                </p>
                            </div>
                        </div>
                    {/each}
                </div>
            {/if}
        </div>
    </div>
{/if}

{#if selectedImage}
    <ImagePopup image={selectedImage} {styles} on:close={closePopup} />
{/if}

<style>
    .close-button {
        position: absolute;
        top: 1rem;
        right: 1rem;
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        color: theme("colors.text");
    }
    .image-history-sidebar {
        position: fixed;
        left: 0;
        top: 0;
        bottom: 0;
        width: 100px;
        background-color: theme("colors.bg");
        border-right: 1px solid theme("colors.darkBlue");
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
        border: 1px solid theme("colors.lightBlue");
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
        color: theme("colors.text");
        opacity: 0.7;
    }

    .image-prompt {
        font-size: 0.9rem;
        color: theme("colors.text");
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
</style>
