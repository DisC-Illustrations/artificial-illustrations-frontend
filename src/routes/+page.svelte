<script lang="ts">
    import "./home.css";

    import type {PageServerData} from "./$types";
    import {AdditionalSettings, type Style, type Prompt} from "$lib/types";
    import mammoth from "mammoth";
    import LoadingCircleGradient from "\$lib/components/loading/loading-circle-gradient.svelte";
    import SelectStyle from "$lib/components/inputs/select-style.svelte";
    import SelectColor from "$lib/components/inputs/select-color.svelte";
    import Tooltip from "$lib/components/inputs/tooltip.svelte";
    import Textarea from "$lib/components/inputs/text-area.svelte";
    import SettingsMenu from "$lib/components/menus/settings-menu.svelte";
    import PrimaryButton from "$lib/components/buttons/primary-button.svelte";
    import SecondaryButton from "$lib/components/buttons/secondary-button.svelte";
    import {ResourceLoader} from "$lib/utils/resource_loader";
    import GeneratedImages from "$lib/components/image/GeneratedImages.svelte";
    import ColorPaletteSelector from '$lib/components/inputs/select-colorPalette.svelte';
    import {onMount} from "svelte";


    let formData: Prompt | null = null;

    let styles: Style[] = [];
    let articleText = "";
    let styleSelection: Style | undefined = undefined;
    let colorPalette = "palette1";
    let specificRequest = "";
    let settings = new AdditionalSettings();
    let imageData = "";

    // boolean to show/hide elements
    let loading = false;
    let showSettingsMenu = false;

    //color palette
    let palettes = [
    { name: 'palette1', colors: ['#FFFF00', '#FFA500', '#008000'] },
    { name: 'palette2', colors: ['#87CEEB', '#FFFFFF', '#4682B4'] },
    { name: 'palette3', colors: ['#98FB98', '#2E8B57', '#8B4513'] },
    { name: 'palette4', colors: ['#FFD700', '#FF8C00', '#FF6347'] },
    { name: 'palette5', colors: ['#FFE4B5', '#D2B48C', '#8B4513'] },
    { name: 'palette6', colors: ['#DDA0DD', '#9370DB', '#BA55D3'] },
    { name: 'palette7', colors: ['#FFFFE0', '#FFD700', '#FFA07A'] },
    { name: 'palette8', colors: ['#2F4F4F', '#708090', '#778899'] },
    { name: 'palette9', colors: ['#00008B', '#8A2BE2', '#5F9EA0'] }
  ];

    let selectedPalette = 'palette1';

    function handlePaletteSelect(palette: string) {
        selectedPalette = palette;
    }

    function hexToRgb(hex) {
    let bigint = parseInt(hex.slice(1), 16);
    return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
  }

  function getSelectedPaletteColors() {
    let palette = palettes.find(p => p.name === selectedPalette);
    if (palette) {
      return palette.colors.map(color => ({ rgb: hexToRgb(color) }));
    }
    return [];
  }


    function toggleSettingsMenu() {
        showSettingsMenu = !showSettingsMenu;
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
            promptText += ", " + styleSelection.prompt;
        }

        // calculate aspect ratio
        let aspectResolution = settings.resolution.split("x");
        let aspectRatio = (parseInt(aspectResolution[0]) as number) / (parseInt(aspectResolution[1]) as number);

        console.log("Generating image with prompt: " + promptText);

        let prompt: Prompt = {
            prompt: promptText,
            num_images: settings.variations,
            image_size: 1024,
            aspect_ratio: aspectRatio,
            steps: 25,
            upscale: settings.detail,
            color_palette: getSelectedPaletteColors()
        };

        imageData = `Generated image with text: ${articleText}, style: ${styleSelection?.prompt}, color palette: ${colorPalette}, specific request: ${specificRequest}`;
        formData = prompt;

        // now GeneratedImages.svelte will handle image retrieval
        loading = false;
    }
</script>

<div class="container bg-bg text-text font-sans p-8 space-y-4">
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
        <SelectStyle {styles} currentStyle={styleSelection}></SelectStyle>
    </div>

    <div class="input-group space-y-2">
        <div class="description">
          <label for="colorPalette">Farbpalette auswählen</label>
          <Tooltip tooltipText="Hier kannst du die Farbpalette auswählen, die für die Bilder verwendet wird."></Tooltip>
        </div>
        <ColorPaletteSelector {palettes} {selectedPalette} onSelect={handlePaletteSelect} />
      </div>

    <div class="input-group">
        <SecondaryButton on:click={toggleSettingsMenu}>Erweiterte Einstellungen</SecondaryButton>
    </div>

    {#if showSettingsMenu}
        <button class="menu-overlay" on:click={toggleSettingsMenu}>
            <SettingsMenu close={toggleSettingsMenu} settings={settings}/>
        </button>
    {/if}

    <div class="input-group">
        <PrimaryButton on:click={generateImages}>Bilder generieren</PrimaryButton>
    </div>
</div>
