<script lang="ts">
    import PrimaryButton from "$lib/components/buttons/primary-button.svelte";
    import SecondaryButton from "$lib/components/buttons/secondary-button.svelte";
    import { writable } from "svelte/store";
    import { onMount } from "svelte";
    import TertiaryButton from "../buttons/tertiary-button.svelte";

    export let palettes: Array<{ name: string; colors: Array<string> }> = [];
    export let selectedPalette: string;
    export let onSelect: (palette: string) => void;
    export let onStrategySelect: (strategy: string) => void;

    let selectedPaletteId = writable<string | undefined>(undefined);
    let showPopup = false;
    let selectedStrategy = writable<string>("");

    const strategies = [
        { value: "DirectPaletteStrategy", label: "Direkte Methode" },
        { value: "InterpolatedPaletteStrategy", label: "Interpolations Methode" },
        { value: "PosterizationStrategy", label: "Posterization Methode" },
    ];

    function handleSelect(palette: string) {
        onSelect(palette);
        selectedPaletteId.set(palette);
        selectedPalette = palette;
        
        if (palette === undefined) {
            selectedStrategy.set("");
            onStrategySelect("");
        } else if ($selectedStrategy === "") {
            selectedStrategy.set(strategies[0].value);
            onStrategySelect(strategies[0].value);
        }
    }

    function handleStrategySelect() {
        if (selectedPalette !== undefined) {
            onStrategySelect($selectedStrategy);
        }
    }

    selectedPaletteId.subscribe((value) => {
        console.log(value);
    });

    onMount(() => {
        if (palettes && palettes.length > 0) {
            console.log("Palettes:", palettes);
            handleSelect(undefined); // Default to "Zufällige Farben"
        } else {
            console.error("No palettes found");
        }
    });

    function openPopup() {
        showPopup = true;
    }

    function closePopup() {
        showPopup = false;
    }

    $: isStrategyDisabled = selectedPalette === undefined;
</script>

<div class="">
    <div class="grid gap-6 w-full md:grid-cols-4 styling">
        {#if palettes && palettes.length > 0}
            {#each palettes.slice(0, 3) as { name, colors }}
                <div
                    class="palette {selectedPalette === name ? 'selected' : ''}"
                    on:click={() => handleSelect(name)}
                >
                    {#each colors as color}
                        <div
                            class="color"
                            style="background-color: {color}"
                        ></div>
                    {/each}
                </div>
            {/each}
        {/if}
        <TertiaryButton on:click={openPopup}>Mehr</TertiaryButton>
        <div class="flex items-center gap-4 w-full">
            oder
            <button
                on:click={() => handleSelect(undefined)}
                class="{selectedPalette === undefined
                    ? 'bg-lightBlue'
                    : ''} py-4 px-8 rounded-2xl justify-center whitespace-nowrap items-center font-bold border border-lightBlue text-white transition-all active:scale-95 disabled:active:scale-100 duration-200 disabled:opacity-50"
                >Keine Farbpalette</button
            >
        </div>
    </div>

    {#if showPopup}
        <div
            class="fixed top-0 left-0 w-full h-full bg-bg/[.7] flex items-center justify-center"
        >
            <div
                class="bg-bgLight border border-border rounded-2xl relative p-12 flex flex-col"
            >
                <button on:click={closePopup} class="close-button">✕</button>
                <span class="font-bold mb-8">Farbpalette auswählen</span>
                <div class="grid grid-cols-3 gap-4">
                    {#if palettes}
                        {#each palettes as { name, colors }}
                            <div
                                class="palette {selectedPalette === name
                                    ? 'selected'
                                    : ''}"
                                on:click={() => handleSelect(name)}
                            >
                                {#each colors as color}
                                    <div
                                        class="color"
                                        style="background-color: {color}"
                                    ></div>
                                {/each}
                            </div>
                        {/each}
                    {/if}
                </div>
                
                <div class="dropdown-container mt-8">
                    <label for="strategySelect" class="strategy-label">Methode zur Anwendung der Farbpalette</label>
                    <select id="strategySelect" bind:value={$selectedStrategy} on:change={handleStrategySelect} disabled={isStrategyDisabled}>
                        {#if isStrategyDisabled}
                            <option value="">Keine Methode</option>
                        {:else}
                            {#each strategies as strategy}
                                <option value={strategy.value}>{strategy.label}</option>
                            {/each}
                        {/if}
                    </select>
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

    .palette {
        display: flex;
        cursor: pointer;
        border: 2px solid white;
        border-radius: 15px;
        overflow: hidden;
        max-height: 45px;
    }

    .palette.selected {
        border-color: #0ebcb5;
        border-width: 5px;
    }

    .color {
        flex: 1;
        height: 45px;
        width: 40px;
    }

    .dropdown-container {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .strategy-label {
        font-size: 1rem;
        color: theme('colors.text');
    }

    select {
        width: 100%;
        padding: 0.5rem;
        border-radius: 0.25rem;
        background-color: theme('colors.bg');
        color: theme('colors.text');
        border: 1px solid theme('colors.text');
    }
</style>