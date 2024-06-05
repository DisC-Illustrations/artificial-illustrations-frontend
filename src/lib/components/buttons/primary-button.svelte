<script lang="ts">
    export let disabled: boolean = false;
    export let type: "submit" | "reset" | "button" | undefined | null =
        "button";
</script>

<button
    on:click
    class="py-4 px-8 rounded-2xl inline-flex justify-center items-center bg-gradient-to-r to-darkBlue from-lightBlue font-bold text-white transition-all active:scale-95 disabled:active:scale-100 duration-200 disabled:opacity-50"
    {type}
    {disabled}
>
    <slot />
</button>
