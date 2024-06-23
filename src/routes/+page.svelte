<script lang="ts">
    import "./home.css";

    import type {PageServerData} from "./$types";
    import {AdditionalSettings, type Prompt} from "$lib/types";
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


    export let data: PageServerData;

    let formData: Prompt | null = null;

    let styles = ResourceLoader.loadStyles();
    let articleText = "";
    let selectedStyle = "style1";
    let colorPalette = "palette1";
    let specificRequest = "";
    let settings = new AdditionalSettings();
    let imageData = "";

    // boolean to show/hide elements
    let loading = false;
    let showSettingsMenu = false;

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

        // calculate aspect ratio
        let aspectResolution = settings.resolution.split("x");
        let aspectRatio = (parseInt(aspectResolution[0]) as number) / (parseInt(aspectResolution[1]) as number);

        let prompt: Prompt = {
            prompt: promptText,
            num_images: settings.variations,
            image_size: 1024,
            aspect_ratio: aspectRatio,
            steps: 30,
            upscale: settings.detail
        };

        imageData = `Generated image with text: ${articleText}, style: ${selectedStyle}, color palette: ${colorPalette}, specific request: ${specificRequest}`;
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
                <LoadingCircleGradient />
            </div>
        {:else}
            <GeneratedImages initialPrompt={formData} />
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
        <SelectStyle {styles}></SelectStyle>
    </div>

    <div class="input-group space-y-2">
        <div class="description">
            <label for="colorPalette">Farbpalette auswählen</label>
            <Tooltip
                    tooltipText="Hier kannst du die Farbpalette auswählen, die für die Bilder verwendet wird."></Tooltip>
        </div>
        <SelectColor></SelectColor>
        <!--
        <select id="colorPalette" class="p-2 rounded border-none bg-bgLight text-text">
            <option value="palette1">Palette 1</option>
            <option value="palette2">Palette 2</option>
            <option value="palette3">Palette 3</option>
        </select>
        -->
    </div>

    <div class="input-group">
        <SecondaryButton on:click={toggleSettingsMenu}>Erweiterte Einstellungen</SecondaryButton>
    </div>

    {#if showSettingsMenu}
        <div class="menu-overlay" on:click={toggleSettingsMenu}>
            <SettingsMenu close={toggleSettingsMenu} settings={settings}/>
        </div>
    {/if}

    <div class="input-group">
        <PrimaryButton on:click={generateImages}>Bilder generieren</PrimaryButton>
    </div>
</div>
