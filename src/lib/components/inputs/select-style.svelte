<script lang="ts">
    import { Radio } from "flowbite-svelte";
    import type { Style } from "$lib/types";
    import { writable } from "svelte/store";

    export let styles: Style[] | undefined;

    const selectedStyle = writable<Style | undefined>(undefined);

    function handelStyleChange(event: Event) {
        const target = event.target as HTMLInputElement;
        const style = styles?.find((s) => s.name === target.value);
        selectedStyle.set(style);
    }
</script>

<div class="grid gap-6 w-full md:grid-cols-3 styling">
    {#if styles}
        {#each styles as s}
            <Radio name="style" value={s.name} on:change={handelStyleChange} custom>
                <div
                    class="aspect-square h-[120px] rounded-2xl border border-border cursor-pointer peer-checked:border-lightBlue peer-checked:border-[5px] duration-200"
                >
                    <img
                        src={s.src}
                        alt="style"
                        class="w-full h-full object-cover rounded-[10px]"
                    />
                </div>
            </Radio>
        {/each}{/if}
</div>

<style>
    :global(input[type="radio"]) {
        display: none;
    }
</style>
