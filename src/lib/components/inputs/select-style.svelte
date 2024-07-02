<script lang="ts">
    import type { Style } from "$lib/types";
    import PrimaryButton from "$lib/components/buttons/primary-button.svelte";
    import SecondaryButton from "$lib/components/buttons/secondary-button.svelte";
    import { writable, type Writable } from "svelte/store";
    import { onMount } from "svelte";

    export let styles: Style[] | undefined;
    export let currentStyle: Writable<Style | undefined>;

    let selectedStyleId = writable<string | undefined>(undefined);
    let showPopup = false;
    let hoveredStyle: Style | null = null;

    function handleStyleChange(styleId: string) {
        selectedStyleId.set(styleId);
        const style = styles?.find(s => s.name === styleId);
        console.log(style);
        if (style) {
            currentStyle.set(style);
            console.log("Style changed to: ", style);
        }
    }

    function handleMouseEnter(style: Style) {
        hoveredStyle = style;
    }

    function handleMouseLeave() {
        hoveredStyle = null;
    }

    selectedStyleId.subscribe(value => {
        console.log(value);
    });

    onMount(() => {
        if (styles && styles.length > 0) {
            handleStyleChange(styles[0].name);
        } else {
            console.error("No styles found");
        }
    });

    function openPopup() {
        showPopup = true;
    }

    function closePopup() {
        showPopup = false;
    }
</script>

<div class="container">
    <div class="grid gap-6 w-full md:grid-cols-4 styling">
        {#if styles && styles.length > 0}
            {#each styles.slice(0, 3) as style}
                <div
                        class="aspect-square rounded-2xl border cursor-pointer duration-200 w-20 relative"
                        class:selected={$selectedStyleId === style.name}
                        on:click={() => handleStyleChange(style.name)}
                        on:mouseenter={() => handleMouseEnter(style)}
                        on:mouseleave={handleMouseLeave}
                >
                    <img src={style.preview_src} alt="style" class="w-full h-full object-cover rounded-[10px]" />
                    {#if hoveredStyle === style && !showPopup}
                        <div class="tooltip">{style.prompt}</div>
                    {/if}
                </div>
            {/each}
        {/if}
        <SecondaryButton on:click={openPopup}>Mehr</SecondaryButton>
    </div>

    {#if showPopup}
        <div class="settings-menu-overlay">
            <div class="popup-content">
                <button on:click={closePopup} class="close-button">✕</button>
                <div class="grid grid-cols-4 gap-4 m-6">
                    {#if styles}
                        {#each styles as style}
                            <div
                                    class="aspect-square rounded-2xl border cursor-pointer duration-200 w-24 relative"
                                    class:selected={$selectedStyleId === style.name}
                                    on:click={() => handleStyleChange(style.name)}
                                    on:mouseenter={() => handleMouseEnter(style)}
                                    on:mouseleave={handleMouseLeave}
                            >
                                <img src={style.preview_src} alt="style" class="w-full h-full object-cover rounded-[10px]" />
                                {#if hoveredStyle === style && showPopup}
                                    <div class="tooltip">{style.prompt}</div>
                                {/if}
                            </div>
                        {/each}
                    {/if}
                </div>
                <PrimaryButton on:click={closePopup}>Auswahl Speichern</PrimaryButton>
            </div>
        </div>
    {/if}
</div>

<style>
    .container {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        padding: 2rem;
        background-color: theme('colors.bg');
        color: theme('colors.text');
        font-family: 'Poppins', sans-serif;
    }

    .settings-menu-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .popup-content {
        background-color: theme('colors.bg');
        padding: 2rem;
        border-radius: 0.5rem;
        max-width: 90%;
        max-height: 90%;
        overflow-y: auto;
        position: relative;
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

    .selected {
        border-color: theme('colors.lightBlue');
        border-width: 5px;
    }

    .tooltip {
        position: absolute;
        bottom: 100%;
        left: 50%;
        transform: translateX(-50%);
        background-color: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 0.5rem;
        border-radius: 0.25rem;
        font-size: 0.8rem;
        max-width: 200px;
        width: max-content;
        word-wrap: break-word;
        white-space: normal;
        text-align: center;
        z-index: 10;
    }
</style>