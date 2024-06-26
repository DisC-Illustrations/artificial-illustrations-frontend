<script lang="ts">
    import { Radio } from "flowbite-svelte";
    import type { Style } from "$lib/types";
    import PrimaryButton from "$lib/components/buttons/primary-button.svelte";
    import SecondaryButton from "$lib/components/buttons/secondary-button.svelte";
    import { writable } from "svelte/store";
    import { onMount } from "svelte";

    export let styles: Style[] | undefined;
    export let currentStyle: Style | undefined;

    const selectedStyle = writable<Style | undefined>(undefined);
    let showPopup = false;

    function handleStyleChange(event: Event) {
        const target = event.target as HTMLInputElement;
        const style = styles?.find((s) => s.name === target.value);
        selectedStyle.set(style);
    }

    selectedStyle.subscribe((value) => {
        currentStyle = value;
    });

    onMount(() => {
        let firstStyle = styles?.[0];
        if (firstStyle) {
            selectedStyle.set(firstStyle);
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
            {#each styles.slice(0, 3) as s}
                <Radio name="style" value={s.name} on:change={handleStyleChange} custom>
                    <div class="aspect-square rounded-2xl border border-border cursor-pointer peer-checked:border-lightBlue peer-checked:border-[5px] duration-200 w-20">
                        <img src={s.preview_src} alt="style" class="w-full h-full object-cover rounded-[10px]" />
                    </div>
                </Radio>
            {/each}
        {/if}
        <SecondaryButton on:click={openPopup}>Mehr</SecondaryButton>
    </div>


    {#if showPopup}
        <div class="settings-menu-overlay">
            <div class="popup-content">
                <button on:click={closePopup} class="close-button">✕</button>
                <div class="grid grid-cols-4 gap-4">
                    {#if styles}
                        {#each styles as s}
                            <Radio name="style" value={s.name} on:change={handleStyleChange} custom>
                                <div class="aspect-square rounded-2xl border border-border cursor-pointer peer-checked:border-lightBlue peer-checked:border-[5px] duration-200 w-24">
                                    <img src={s.preview_src} alt="style" class="w-full h-full object-cover rounded-[10px]" />
                                </div>
                            </Radio>
                        {/each}
                    {/if}
                </div>
                <PrimaryButton on:click={closePopup}>Auswahl Speichern</PrimaryButton>
            </div>
        </div>
    {/if}
</div>

<style>
    :global(input[type="radio"]) {
        display: none;
    }

    .container {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        padding: 2rem;
        background-color: theme('colors.bg');
        color: theme('colors.text');
        font-family: 'Poppins', sans-serif;
    }

    .mehr-button {
        margin-top: 1rem;
        padding: 0.5rem 1rem;
        background-color: theme('colors.lightBlue');
        color: white;
        border: none;
        border-radius: 0.25rem;
        cursor: pointer;
        align-self: flex-start;
    }

    .mehr-button:hover {
        background-color: theme('colors.darkBlue');
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

    .save-button {
        margin-top: 1rem;
        padding: 0.5rem 1rem;
        background-color: theme('colors.lightBlue');
        color: white;
        border: none;
        border-radius: 0.25rem;
        cursor: pointer;
    }

    .save-button:hover {
        background-color: theme('colors.darkBlue');
    }
</style>