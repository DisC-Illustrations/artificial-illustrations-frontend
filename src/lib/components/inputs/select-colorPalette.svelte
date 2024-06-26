<script lang="ts">
  import PrimaryButton from "$lib/components/buttons/primary-button.svelte";
  import SecondaryButton from "$lib/components/buttons/secondary-button.svelte";
  import { writable } from "svelte/store";
  import { onMount } from "svelte";

  export let palettes: Array<{ name: string, colors: Array<string> }> = [];
  export let selectedPalette: string;
  export let onSelect: (palette: string) => void;

  let selectedPaletteId = writable<string | undefined>(undefined);
  let showPopup = false;

  function handleSelect(palette: string) {
      onSelect(palette);
      selectedPaletteId.set(palette);
      selectedPalette = palette;
  }

  selectedPaletteId.subscribe(value => {
      console.log(value);
  });

  onMount(() => {
      if (palettes && palettes.length > 0) {
          handleSelect(palettes[0].name);
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
</script>

<div class="container">
  <div class="grid gap-6 w-full md:grid-cols-4 styling">
      {#if palettes && palettes.length > 0}
          {#each palettes.slice(0, 3) as {name, colors}}
              <div
                      class="palette {selectedPalette === name ? 'selected' : ''}"
                      on:click={() => handleSelect(name)}
              >
                  {#each colors as color}
                      <div class="color" style="background-color: {color}"></div>
                  {/each}
              </div>
          {/each}
      {/if}
      <SecondaryButton on:click={openPopup}>Mehr</SecondaryButton>
      <SecondaryButton on:click={() => handleSelect(undefined)}>Keine Farbpalette auswählen</SecondaryButton>
  </div>

  {#if showPopup}
      <div class="settings-menu-overlay">
          <div class="popup-content">
              <button on:click={closePopup} class="close-button">✕</button>
              <div class="grid grid-cols-4 gap-4 m-6">
                  {#if palettes}
                      {#each palettes as {name, colors}}
                          <div
                                  class="palette {selectedPalette === name ? 'selected' : ''}"
                                  on:click={() => handleSelect(name)}
                          >
                              {#each colors as color}
                                  <div class="color" style="background-color: {color}"></div>
                              {/each}
                          </div>
                      {/each}
                  {/if}
              </div>
              <PrimaryButton on:click={closePopup}>Auswahl Speichern</PrimaryButton>
          </div>
      </div>
  {/if}
</div>

<style>
  .container {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      padding: 2rem;
      background-color: theme('colors.bg');
      color: theme('colors.text');
      font-family: 'Poppins', sans-serif;
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

  .palette {
      display: flex;
      cursor: pointer;
      border: 2px solid transparent;
      border-radius: 8px;
      overflow: hidden;
  }

  .palette.selected {
      border-color: #00FFFF; 
  }

  .color {
      flex: 1;
      height: 50px;
      width: 50px;

  }
</style>
