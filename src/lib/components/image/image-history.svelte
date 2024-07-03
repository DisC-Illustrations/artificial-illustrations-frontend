<script lang="ts">
    import {onMount} from "svelte";
    import {getImageIds, getImage} from "$lib/api";
    import type {GeneratedImage, Style} from "$lib/types";
    import {writable, type Writable} from "svelte/store";
    import SecondaryButton from "$lib/components/buttons/secondary-button.svelte";
    import DownloadButton from "$lib/components/buttons/download-button.svelte";

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
            if (images.length > 0) {
                selectedImage = images[0]; // Select the first image by default
            }
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

    function selectImage(image: GeneratedImage) {
        selectedImage = image;
    }

    function getStyleFromPrompt(prompt: string): Style | undefined {
        return styles.find(style => prompt.includes(style.prompt));
    }

    function handleDownload() {
        if (selectedImage) {
            const link = document.createElement('a');
            link.href = `data:image/png;base64,${selectedImage.image}`;
            link.download = `generated-image-${selectedImage.id}.png`;
            link.click();
        }
    }

    $: historyOpen = false;

    function toggleHistory() {
        historyOpen = !historyOpen;
    }
</script>

<SecondaryButton on:click={toggleHistory}>Galerie ansehen</SecondaryButton>

{#if historyOpen}
    <div class="fixed inset-0 bg-bg/[.7] flex items-center justify-center z-50">
        <div class="bg-bgLight border border-border rounded-2xl relative p-6 flex w-[80vw] h-[80vh]">
            <button on:click={toggleHistory} class="close-button">✕</button>

            <!-- Scrollbare Seitenleiste -->
            <div class="w-1/6 pr-4 overflow-y-auto border-r border-border">
                <h2 class="text-xl font-bold mb-4">Image History</h2>
                {#if loading}
                    <p>Loading image history...</p>
                {:else if error}
                    <p>{error}</p>
                {:else if images.length === 0}
                    <p>No images in history</p>
                {:else}
                    {#each images as image (image.id)}
                        <div
                                class="mb-4 cursor-pointer transition-all duration-200 hover:opacity-80 relative group"
                                on:click={() => selectImage(image)}
                        >
                            <img
                                    src="data:image/png;base64,{image.image}"
                                    alt="Generated image {image.id}"
                                    class="w-full h-auto object-cover rounded-lg"
                                    style="aspect-ratio: 1;"
                                    class:selected={selectedImage && selectedImage.id === image.id}
                            />
                            <div class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg">
                                ID: {image.id}
                            </div>
                        </div>
                    {/each}
                {/if}
            </div>

            <!-- Hauptbereich mit Bildvorschau und Detailinformationen -->
            {#if selectedImage}
                <div class="flex-1 pl-6 flex h-full">
                    <div class="w-2/3 pr-6 flex flex-col">
                        <div class="flex-grow overflow-hidden flex items-center justify-center">
                            <img
                                    src="data:image/png;base64,{selectedImage.image}"
                                    alt="Selected image {selectedImage.id}"
                                    class="max-w-full max-h-full object-contain rounded-lg"
                            />
                        </div>
                    </div>
                    <div class="w-1/3 overflow-y-auto">
                        <h2 class="text-xl font-bold mb-2">Bild {selectedImage.id}</h2>
                        <p class="mb-4">{selectedImage.prompt}</p>

                        {#if getStyleFromPrompt(selectedImage.prompt)}
                            <h3 class="text-lg font-semibold mb-2">Stil</h3>
                            {@const style = getStyleFromPrompt(selectedImage.prompt)}
                            {#if style}
                                <img src={style.preview_src} alt="style"
                                     class="w-16 h-16 object-cover rounded-lg mb-2"/>
                                <p class="italic mb-2">{style.prompt}</p>
                            {/if}
                        {/if}

                        <DownloadButton on:click={handleDownload}>Download</DownloadButton>
                    </div>
                </div>
            {:else}
                <div class="flex-1 pl-6 flex items-center justify-center">
                    <p class="text-lg text-gray-500">Select an image to view details</p>
                </div>
            {/if}
        </div>
    </div>
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

    .selected {
        border: 3px solid theme("colors.lightBlue");
    }
</style>