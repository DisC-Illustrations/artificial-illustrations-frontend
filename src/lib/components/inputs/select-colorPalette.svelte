<script lang="ts">
    export let palettes: Array<{ name: string, colors: Array<string> }> = [];
    export let selectedPalette: string;
    export let onSelect: (palette: string) => void;
  
    function handleSelect(palette: string) {
      onSelect(palette);
    }
  </script>
  
  <style>
    .palette-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr); /* column adjustment */
      gap: 1rem;
      margin-top: 1rem;
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
    }
  </style>
  
  <div class="palette-grid">
    {#each palettes as {name, colors}}
      <div class="palette {selectedPalette === name ? 'selected' : ''}" on:click={() => handleSelect(name)}>
        {#each colors as color}
          <div class="color" style="background-color: {color}"></div>
        {/each}
      </div>
    {/each}
  </div>
  
  