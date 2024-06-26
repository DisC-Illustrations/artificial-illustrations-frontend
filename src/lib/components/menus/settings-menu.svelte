<script lang="ts">
    import type { AdditionalSettings } from "$lib/types";
    import { writable } from "svelte/store";

    export let close: () => void;
    export let settings: AdditionalSettings;

    let detailInput: HTMLInputElement;

    const selectedVariations = writable(1);
    const selectedFormat = writable("1024x1024");

    function handleVariationChange(value: number) {
        selectedVariations.set(value);
    }

    function handleFormatChange(value: string) {
        selectedFormat.set(value);
    }

    function saveSelection() {
        settings.variations = $selectedVariations;
        settings.resolution = $selectedFormat;

        let detail = parseInt(detailInput.value);
        settings.detail = detail === 3 ? 4 : detail;

        console.log('Variations:', settings.variations);
        console.log('Resolution:', settings.resolution);
        console.log('Detail:', settings.detail);
        close();
    }
</script>

<div class="menu" on:click|stopPropagation role="menu">
    <div class="menu-header">
        <h2>Menü</h2>
        <button class="close-btn" on:click={close}>×</button>
    </div>
    <p>Wie viele Variationen sollen generiert werden?</p>
    <div class="option-group">
        {#each [1, 2, 3, 4] as variation}
            <div
                    class="option"
                    class:selected={$selectedVariations === variation}
                    on:click={() => handleVariationChange(variation)}
            >
                {variation}
            </div>
        {/each}
    </div>

    <p>Format auswählen</p>
    <div class="option-group">
        {#each [
            { value: "1024x1024", label: "Quadrat" },
            { value: "576x1024", label: "Portrait" },
            { value: "1024x576", label: "Landschaft" }
        ] as format}
            <div
                    class="option"
                    class:selected={$selectedFormat === format.value}
                    on:click={() => handleFormatChange(format.value)}
            >
                {format.label}
            </div>
        {/each}
    </div>

    <p>Wie detailliert soll das Bild werden?</p>
    <input type="range" min="1" max="3" value="2" bind:this={detailInput}>

    <button on:click={saveSelection}>Auswahl speichern</button>
</div>

<style>
    .menu {
        background: theme('colors.bgLight');
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
        min-width: 300px;
    }

    .menu-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .close-btn {
        background: none;
        border: none;
        font-size: 1.5em;
        cursor: pointer;
    }

    .option-group {
        display: flex;
        gap: 10px;
        margin-bottom: 20px;
    }

    .option {
        padding: 10px;
        border: 1px solid #ccc;
        border-radius: 4px;
        cursor: pointer;
        transition: all 0.3s ease;
    }

    .option.selected {
        background-color: theme('colors.lightBlue');
        color: white;
        border-color: theme('colors.lightBlue');
    }
</style>