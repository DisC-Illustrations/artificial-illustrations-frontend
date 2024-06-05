<script lang="ts">
    import { Tooltip } from "bits-ui";
    import { fly } from "svelte/transition";

    export let tooltipText: string | undefined;
    export let sideOffset: number = 8;
</script>

<Tooltip.Root openDelay={0} closeOnPointerDown={false} closeOnEscape={false}>
    <Tooltip.Trigger data-state="open">
        <img src="images/info.svg" alt="info icon" />
    </Tooltip.Trigger>
    {#if tooltipText}
        <Tooltip.Content
            transition={fly}
            transitionConfig={{ y: 8, duration: 150 }}
            {sideOffset}
            class="border border-border bg-bgLight px-3 py-[5px] outline-none rounded-md min-w-[90px]"
        >
            <Tooltip.Arrow
                class="rounded-[2px] !bg-bgLight border-l-[1px] border-t-[1px] border-border"
            />
            <p class="text-center text-white">{tooltipText}</p>
        </Tooltip.Content>
    {/if}
</Tooltip.Root>
