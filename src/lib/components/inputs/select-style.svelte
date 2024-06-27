<!-- SelectStyle.svelte -->
<script lang="ts">
    import type { Style } from "$lib/types";
    import PrimaryButton from "$lib/components/buttons/primary-button.svelte";
    import SecondaryButton from "$lib/components/buttons/secondary-button.svelte";
    import { writable, type Writable } from "svelte/store";
    import { onMount } from "svelte";
    import TertiaryButton from "../buttons/tertiary-button.svelte";

    export let styles: Style[] | undefined;
    export let currentStyle: Writable<Style | undefined>;

    let selectedStyleId = writable<string | undefined>(undefined);
    let showPopup = false;

    function handleStyleChange(styleId: string) {
        selectedStyleId.set(styleId);
        const style = styles?.find((s) => s.name === styleId);
        console.log(style);
        if (style) {
            currentStyle.set(style);
            console.log("Style changed to: ", style);
        }
    }

    selectedStyleId.subscribe((value) => {
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

<div class="">
    <div class="grid gap-6 w-full md:grid-cols-4 styling">
        {#if styles && styles.length > 0}
            {#each styles.slice(0, 3) as style}
                <div
                    class="aspect-square rounded-2xl border border-transparent cursor-pointer duration-200"
                    class:selected={$selectedStyleId === style.name}
                    on:click={() => handleStyleChange(style.name)}
                >
                    <img
                        src={style.preview_src}
                        alt="style"
                        class="w-full h-full object-cover rounded-[10px]"
                    />
                </div>
            {/each}
        {/if}
        <TertiaryButton on:click={openPopup}>Mehr</TertiaryButton>
    </div>

    {#if showPopup}
        <div
            class="fixed top-0 left-0 w-full h-full bg-bg/[.7] flex items-center justify-center"
        >
            <div
                class="bg-bgLight border border-border rounded-2xl relative p-12 flex flex-col"
            >
                <button on:click={closePopup} class="close-button">✕</button>
                <span class="font-bold mb-8">Stil auswählen</span>
                <div class="grid grid-cols-3 gap-4">
                    {#if styles}
                        {#each styles as style}
                            <div
                                class="aspect-square rounded-2xl border border-transparent cursor-pointer duration-200 w-24"
                                class:selected={$selectedStyleId === style.name}
                                on:click={() => handleStyleChange(style.name)}
                            >
                                <img
                                    src={style.preview_src}
                                    alt="style"
                                    class="w-full h-full object-cover rounded-[10px]"
                                />
                            </div>
                        {/each}
                    {/if}
                </div>
                <div class="self-end mt-8">
                    <PrimaryButton on:click={closePopup}
                        >Auswahl Speichern</PrimaryButton
                    >
                </div>
            </div>
        </div>
    {/if}
</div>

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
        border-color: theme("colors.lightBlue");
        border-width: 5px;
    }
</style>
