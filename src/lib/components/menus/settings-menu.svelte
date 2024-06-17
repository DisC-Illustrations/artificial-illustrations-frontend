<script lang="ts">
    import type {AdditionalSettings} from "$lib/types";

    export let close: () => void;

    export let settings: AdditionalSettings;

    let variationInputs: HTMLDivElement;
    let resolutionInputs: HTMLDivElement;
    let detailInput: HTMLInputElement;

    function saveSelection() {
        let variationsSelected = variationInputs.querySelector('input[name="variations"]:checked')!! as HTMLInputElement;
        settings.variations = parseInt(variationsSelected.value);

        let resolutionSelected = resolutionInputs.querySelector('input[name="format"]:checked')!! as HTMLInputElement;
        settings.resolution = resolutionSelected.value;

        let detail = parseInt(detailInput.value);
        if (detail == 3) {
            settings.detail = 4;
        } else {
            settings.detail = detail;
        }

        console.log('Variations:', settings.variations);
        console.log('Resolution:', settings.resolution);
        console.log('Detail:', settings.detail);
        close();
    }
</script>

<style>
    .menu {
        background: white;
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
</style>

<div class="menu" on:click|stopPropagation role="menu">
    <div class="menu-header">
        <h2>Menü</h2>
        <button class="close-btn" on:click={close}>×</button>
    </div>
    <p>Wie viele Variationen sollen generiert werden?</p>
    <div bind:this={variationInputs}>
        <input type="radio" id="var1" name="variations" value="1" checked>
        <label for="var1">1</label>
        <input type="radio" id="var2" name="variations" value="2">
        <label for="var2">2</label>
        <input type="radio" id="var3" name="variations" value="3">
        <label for="var3">3</label>
        <input type="radio" id="var4" name="variations" value="4">
        <label for="var4">4</label>
    </div>

    <p>Format auswählen</p>
    <div bind:this={resolutionInputs}>
        <input type="radio" id="format1" name="format" value="1024x1024" checked>
        <label for="format1">Quadrat</label>
        <input type="radio" id="format2" name="format" value="576x1024">
        <label for="format2">Portrait</label>
        <input type="radio" id="format3" name="format" value="1024x576">
        <label for="format3">Landschaft</label>
    </div>

    <p>Wie detailliert soll das Bild werden?</p>
    <input type="range" min="1" max="3" value="2" bind:this={detailInput}>

    <button on:click={saveSelection}>Auswahl speichern</button>
</div>
