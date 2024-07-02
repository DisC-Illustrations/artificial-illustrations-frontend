<script lang="ts">
    import "./home.css";
    import { AdditionalSettings, type Prompt, type Style } from "$lib/types";
    import mammoth from "mammoth";
    import LoadingCircleGradient from "$lib/components/loading/loading-circle-gradient.svelte";
    import SelectStyle from "$lib/components/inputs/select-style.svelte";
    import Tooltip from "$lib/components/inputs/tooltip.svelte";
    import Textarea from "$lib/components/inputs/text-area.svelte";
    import SettingsMenu from "$lib/components/menus/settings-menu.svelte";
    import PrimaryButton from "$lib/components/buttons/primary-button.svelte";
    import { ResourceLoader } from "$lib/utils/resource_loader";
    import GeneratedImages from "$lib/components/image/generated-images.svelte";
    import ColorPaletteSelector from "$lib/components/inputs/select-colorPalette.svelte";
    import ImageHistory from "$lib/components/image/image-history.svelte";
    import { onMount } from "svelte";
    import { writable } from "svelte/store";
    import TextInput from "$lib/components/inputs/text-input.svelte";
    import SecondaryButton from "$lib/components/buttons/secondary-button.svelte";

    const newImageGenerated: Writable<boolean> = writable(false);

    let formData: Prompt | null = null;

    let styles: Style[] = [];
    let styleSelection = writable<Style | undefined>(undefined);
    let stylePrompt = "";

    let articleText = "";
    let colorPalette = "palette1";
    let specificRequest = "";

    let settings = writable<AdditionalSettings>(new AdditionalSettings());
    let variationSetting: number = 1;
    let resolutionSetting: string = "1024x1024";
    let detailSetting: number = 1;
    let imageData = "";

    $: styleSelection.subscribe((value) => {
        if (value) {
            stylePrompt = value.prompt;
            console.log("Style changed to: ", stylePrompt);
        }
    });

    $: settings.subscribe((value) => {
        variationSetting = value.variations;
        resolutionSetting = value.resolution;
        detailSetting = value.detail;
        console.log(
            "Settings saved in variables: " +
                variationSetting +
                " " +
                resolutionSetting +
                " " +
                detailSetting
        );
    });

    // boolean to show/hide elements
    let loading = false;

    //color palette
    let palettes: { name: string; colors: Array<string> }[] = [];
    let selectedPalette = "noPalette";

    function handlePaletteSelect(palette: string) {
        selectedPalette = palette;
    }

    function hexToRgb(hex: string): number[] {
        let bigint = parseInt(hex.slice(1), 16);
        return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
    }

    function getSelectedPaletteColors(): number[][] {
        let palette = palettes.find((p) => p.name === selectedPalette);
        if (palette) {
            return palette.colors
                .map((color) => ({ rgb: hexToRgb(color) }))
                .map((color) => [color.rgb[0], color.rgb[1], color.rgb[2]]);
        }
        return [];
    }

    function handleFileUpload(event: any) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e: any) {
                articleText = e.target.result;
                console.log(articleText);
            };

            if (file.type === "text/plain") {
                reader.readAsText(file);
            } else if (
                file.type ===
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            ) {
                reader.onload = function (e) {
                    if (e.target?.result instanceof ArrayBuffer) {
                        mammoth
                            .extractRawText({ arrayBuffer: e.target.result })
                            .then((result) => {
                                const text = result.value;
                                // Hier setzen wir den Wert von articleText auf den extrahierten Text
                                articleText = text;
                                console.log(articleText);
                            })
                            .catch((err) => {
                                console.error(
                                    "Fehler beim Verarbeiten der DOCX-Datei: ",
                                    err
                                );
                            });
                    } else {
                        console.error(
                            "Ungültiges Ergebnis vom FileReader. Erwartet wurde ein ArrayBuffer."
                        );
                    }
                };
                reader.readAsArrayBuffer(file);
            } else {
                console.error(
                    "Ungültiger Dateityp. Bitte lade eine .txt oder .docx Datei hoch."
                );
            }
        }
    }

    // Function to generate images (mockup)
    async function generateImages() {
        loading = true;

        let articlePrompt = "";
        // transform article text into prompt
        if (articleText.length > 0) {
            articlePrompt = await ResourceLoader.getLlmResponse(articleText);
        }

        // fetch images
        let promptText =
            specificRequest.length > 0 ? specificRequest + ", " : "";
        // promptText = articlePrompt + ", " + selectedStyle;
        promptText += articlePrompt;
        // add style to prompt
        if (styleSelection) {
            promptText += ", " + stylePrompt;
        }

        // calculate aspect ratio
        let aspectResolution = resolutionSetting.split("x");
        let aspectRatio =
            (parseInt(aspectResolution[0]) as number) /
            (parseInt(aspectResolution[1]) as number);

        console.log("Generating image with prompt: " + promptText);

        let prompt: Prompt = {
            prompt: promptText,
            num_images: variationSetting,
            image_size: 1024,
            aspect_ratio: aspectRatio,
            steps: 30,
            upscale: detailSetting,
            color_palette: getSelectedPaletteColors(),
        };

        imageData = `Generated image with text: ${articleText}, style: ${stylePrompt}, color palette: ${colorPalette}, specific request: ${specificRequest}`;
        formData = prompt;

        // now generated-images.svelte will handle image retrieval
        loading = false;
    }

    onMount(async () => {
        const response = ResourceLoader.loadStyles();
        styles = await response;
        const palettesResponse = ResourceLoader.loadPalettes();
        palettes = await palettesResponse;
    });
</script>

<div class="grid grid-cols-3 gap-12 h-full">
    <div
        class="bg-bgLight rounded-2xl overflow-hidden relative flex items-center justify-center flex-col p-8"
    >
        <img
            src="/images/bg.png"
            alt="background pattern"
            class="object-cover absolute h-[90vh]"
        />
        <span
            class="font-bold text-[30px] text-transparent bg-gradient-to-r to-darkBlue from-lightBlue bg-clip-text z-20"
            >Artificial Illustrations</span
        >
        <span class="text-center mt-2"
            >Die Software nutzt künstliche Intelligenz, um aus
            wissenschaftlichen Artikeln Titelbilder zu generieren und Forschung
            zu visualisieren.</span
        >
    </div>
    <div class="flex flex-col h-full">
        <div class="flex items-center gap-2 mb-2">
            <label for="articleText">Artikel eingeben</label>
            <Tooltip
                tooltipText="Hier kommt der Artikel hin, auf dessen Basis die Bilder generiert werden.
                Du kannst entweder den Text direkt eingeben oder eine Datei hochladen."
            ></Tooltip>
        </div>
        <Textarea
            name="articleText"
            placeholder="Artikel einfügen oder Datei hochladen"
            value={articleText}
        ></Textarea>
        <input
            type="file"
            id="fileUpload"
            class="p-2 rounded border-none bg-bgLight text-text"
            accept=".txt, .docx"
            on:change={handleFileUpload}
        />
        <div class="flex items-center gap-2 mb-2 mt-12">
            <label for="specificRequest"
                >Soll etwas bestimmtes zu sehen sein?</label
            >
            <Tooltip
                tooltipText="Hier kannst du spezifische Wünsche für Elemente im Bild angeben."
            ></Tooltip>
        </div>
        <TextInput
            name="specificRequest"
            bind:value={specificRequest}
            placeholder="z.B. ein Apfel"
        />
    </div>

    <div class="flex flex-col relative">
        <div class="flex items-center gap-2 mb-2">
            <label for="styleSelect">Stil auswählen</label>
            <Tooltip
                tooltipText="Hier kannst du den Stil auswählen, in dem die Bilder generiert werden."
            ></Tooltip>
        </div>
        <SelectStyle {styles} bind:currentStyle={styleSelection} />

        <div class="flex items-center gap-2 mb-2 mt-12">
            <label for="colorPalette">Farbpalette auswählen</label>
            <Tooltip
                tooltipText="Hier kannst du die Farbpalette auswählen, die für die Bilder verwendet wird."
            ></Tooltip>
        </div>
        <ColorPaletteSelector
            {palettes}
            {selectedPalette}
            onSelect={handlePaletteSelect}
        />
        <div class="self-start mt-4">
            <SettingsMenu {settings} />
        </div>

        <div class="self-end mt-auto">
            <ImageHistory {newImageGenerated} {styles} />
            {#if loading}
                <div class="image-wrapper">
                    <LoadingCircleGradient />
                </div>
            {:else}
                <PrimaryButton on:click={generateImages}
                    >Bilder generieren</PrimaryButton
                >
            {/if}
        </div>
    </div>
</div>
