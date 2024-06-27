<script lang="ts">
    import "./home.css";
    import {AdditionalSettings, type Prompt, type Style} from "$lib/types";
    import mammoth from "mammoth";
    import LoadingCircleGradient from "\$lib/components/loading/loading-circle-gradient.svelte";
    import SelectStyle from "$lib/components/inputs/select-style.svelte";
    import Tooltip from "$lib/components/inputs/tooltip.svelte";
    import Textarea from "$lib/components/inputs/text-area.svelte";
    import SettingsMenu from "$lib/components/menus/settings-menu.svelte";
    import PrimaryButton from "$lib/components/buttons/primary-button.svelte";
    import {ResourceLoader} from "$lib/utils/resource_loader";
    import GeneratedImages from "$lib/components/image/generated-images.svelte";
    import ColorPaletteSelector from '$lib/components/inputs/select-colorPalette.svelte';
    import ImageHistory from "$lib/components/image/image-history.svelte";
    import {onMount} from "svelte";
    import {writable} from "svelte/store";


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
    let detailSetting: number = 2;
    let imageData = "";

    $: styleSelection.subscribe(value => {
        if (value) {
            stylePrompt = value.prompt;
            console.log("Style changed to: ", stylePrompt);
        }
    });

    $: settings.subscribe(value => {
        variationSetting = value.variations;
        resolutionSetting = value.resolution;
        detailSetting = value.detail;
        console.log("Settings saved in variables: " + variationSetting + " " + resolutionSetting + " " + detailSetting);
    });

    // boolean to show/hide elements
    let loading = false;

    //color palette
    let palettes: { name: string, colors: Array<string> }[] = [];
    let selectedPalette = 'noPalette';


    function handlePaletteSelect(palette: string) {
        selectedPalette = palette;
    }

    function hexToRgb(hex: string): number[] {
        let bigint = parseInt(hex.slice(1), 16);
        return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
    }

    function getSelectedPaletteColors(): number[][] {
        let palette = palettes.find(p => p.name === selectedPalette);
        if (palette) {
            return palette.colors.map(color => ({rgb: hexToRgb(color)}))
                .map(color => [color.rgb[0], color.rgb[1], color.rgb[2]]);
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
            } else if (file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
                reader.onload = function (e) {
                    if (e.target?.result instanceof ArrayBuffer) {
                        mammoth.extractRawText({arrayBuffer: e.target.result})
                            .then(result => {
                                const text = result.value;
                                // Hier setzen wir den Wert von articleText auf den extrahierten Text
                                articleText = text;
                                console.log(articleText);
                            })
                            .catch(err => {
                                console.error("Fehler beim Verarbeiten der DOCX-Datei: ", err);
                            });
                    } else {
                        console.error("Ungültiges Ergebnis vom FileReader. Erwartet wurde ein ArrayBuffer.");
                    }
                };
                reader.readAsArrayBuffer(file);
            } else {
                console.error("Ungültiger Dateityp. Bitte lade eine .txt oder .docx Datei hoch.");
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
        let promptText = specificRequest.length > 0 ? specificRequest + ", " : "";
        // promptText = articlePrompt + ", " + selectedStyle;
        promptText += articlePrompt;
        // add style to prompt
        if (styleSelection) {
            promptText += ", " + stylePrompt;
        }

        // calculate aspect ratio
        let aspectResolution = resolutionSetting.split("x");
        let aspectRatio = (parseInt(aspectResolution[0]) as number) / (parseInt(aspectResolution[1]) as number);

        console.log("Generating image with prompt: " + promptText);

        let prompt: Prompt = {
            prompt: promptText,
            num_images: variationSetting,
            image_size: 1024,
            aspect_ratio: aspectRatio,
            steps: 25,
            upscale: detailSetting,
            color_palette: getSelectedPaletteColors()
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

<!-- margin (ml-28) for history bar, needs refactoring -->
<div class="container bg-bg text-text font-sans p-8 space-y-4 ml-28">
    <div class="image-container">
        <!-- show images here if available -->
        {#if loading}
            <div class="image-wrapper">
                <LoadingCircleGradient/>
            </div>
        {:else}
            <GeneratedImages initialPrompt={formData}/>
        {/if}
    </div>

    <div class="input-group space-y-2">
        <div class="description">
            <label for="articleText">Artikel eingeben</label>
            <Tooltip tooltipText="Hier kommt der Artikel hin, auf dessen Basis die Bilder generiert werden.
                    Du kannst entweder den Text direkt eingeben oder eine Datei hochladen.">
            </Tooltip>
        </div>
        <Textarea
                name="articleText"
                placeholder="Hier kommt der Artikel hin"
                value={articleText}
                rows={15}></Textarea>
        <input type="file" id="fileUpload" class="p-2 rounded border-none bg-bgLight text-text" accept=".txt, .docx"
               on:change={handleFileUpload}/>
    </div>

    <div class="input-group space-y-2">
        <div class="description">
            <label for="specificRequest">Soll etwas bestimmtes zu sehen sein?</label>
            <Tooltip tooltipText="Hier kannst du spezifische Wünsche für Elemente im Bild angeben."></Tooltip>
        </div>
        <input type="text" id="specificRequest" class="p-2 rounded border-none bg-bgLight text-text"
               bind:value={specificRequest}/>
    </div>

    <div class="input-group space-y-2">
        <div class="description">
            <label for="styleSelect">Stil auswählen</label>
            <Tooltip tooltipText="Hier kannst du den Stil auswählen, in dem die Bilder generiert werden."></Tooltip>
        </div>
        <SelectStyle {styles} bind:currentStyle={styleSelection}/>
    </div>

    <div class="input-group space-y-2">
        <div class="description">
            <label for="colorPalette">Farbpalette auswählen</label>
            <Tooltip
                    tooltipText="Hier kannst du die Farbpalette auswählen, die für die Bilder verwendet wird."></Tooltip>
        </div>
        <ColorPaletteSelector {palettes} {selectedPalette} onSelect={handlePaletteSelect}/>
    </div>

    <SettingsMenu settings={settings}/>

    <div class="input-group">
        <PrimaryButton on:click={generateImages}>Bilder generieren</PrimaryButton>
    </div>

    <ImageHistory/>
</div>
