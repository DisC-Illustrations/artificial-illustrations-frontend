<script lang="ts">
    import type {AdditionalSettings} from "$lib/types";
    import PrimaryButton from "$lib/components/buttons/primary-button.svelte";
    import SecondaryButton from "$lib/components/buttons/secondary-button.svelte";
    import {type Writable, writable} from "svelte/store";

    let showPopup = false;
    export let settings: Writable<AdditionalSettings>;

    let detailInput: HTMLInputElement;

    const selectedVariations = writable(1);
    const selectedFormat = writable("1024x1024");

    function handleVariationChange(value: number) {
        selectedVariations.set(value);
        console.log("Variation:", value);
    }

    function handleFormatChange(value: string) {
        selectedFormat.set(value);
        console.log("Format:", value);
    }

    function saveSelection() {
        settings.update(($settings) => {
            $settings.variations = $selectedVariations;
            $settings.resolution = $selectedFormat;
            let detail = parseInt(detailInput.value);
            $settings.detail = detail === 3 ? 4 : detail;

            console.log("Settings saved:", $settings);

            return $settings;
        });
        closePopup();
    }

    function openPopup() {
        showPopup = true;
    }

    function closePopup() {
        showPopup = false;
    }
</script>

<SecondaryButton on:click={openPopup}>Erweiterte Einstellungen</SecondaryButton>

{#if showPopup}
    <div
            class="fixed top-0 left-0 w-full h-full bg-bg/[.7] flex items-center justify-center"
    >
        <div
                class="bg-bgLight border border-border rounded-2xl relative p-12 flex flex-col"
        >
            <button on:click={closePopup} class="close-button">✕</button>
            <div class="option-group flex flex-col">
                <label class="settings-label">Variationen</label>
                <div class="options-row">
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
            </div>
            <div class="option-group flex flex-col">
                <label class="settings-label">Format</label>
                <div class="options-row">
                    {#each [{value: "1024x1024", label: "Quadrat"}, {
                        value: "576x1024",
                        label: "Portrait"
                    }, {value: "1024x576", label: "Landschaft"}] as format}
                        <div
                                class="option"
                                class:selected={$selectedFormat === format.value}
                                on:click={() => handleFormatChange(format.value)}
                        >
                            {format.label}
                        </div>
                    {/each}
                </div>
            </div>
            <div class="option-group flex flex-col">
                <label class="settings-label">Detail</label>
                <input
                        type="range"
                        min="1"
                        max="3"
                        value="1"
                        bind:this={detailInput}
                />
            </div>
            <div class="self-end mt-8">
                <PrimaryButton on:click={saveSelection}
                >Auswahl speichern
                </PrimaryButton
                >
            </div>
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

    .settings-label {
        font-size: 1.2rem;
        font-weight: bold;
        margin: 1rem 0 1rem;
    }

    .option-group {
        margin-bottom: 20px;
    }

    .options-row {
        display: flex;
        gap: 10px;
    }

    .option {
        padding: 10px;
        border: 1px solid theme("colors.lightBlue");
        border-radius: 4px;
        cursor: pointer;
        transition: all 0.3s ease;
    }

    .option.selected {
        background-color: theme("colors.lightBlue");
        color: white;
        border-color: theme("colors.lightBlue");
    }
</style>
