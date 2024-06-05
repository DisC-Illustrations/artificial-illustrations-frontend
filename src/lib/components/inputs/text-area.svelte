<script lang="ts">
    export let style = "";
    export let label = "";
    export let name: string;
    export let required = false;
    export let value: string | undefined | null;
    export let placeholder = "";
    export let error: string[] | undefined = undefined;
    export let rows = 15;
</script>

<div class={style}>
    {#if label.length > 0}
        <label
            for={name}
            class="block text-sm ml-[5px] leading-none mb-2 dark:text-white select-none"
        >
            {label}
            {#if required}
                <span class="text-verdiRed">*</span>
            {/if}</label
        >
    {/if}
    <textarea
        bind:value
        {placeholder}
        {rows}
        class="block w-full bg-bgLight text-sm placeholder:text-border leading-none relative
        border border-border rounded-2xl focus:ring-lightBlue py-3 px-4 focus:border-lightBlue"
    />

    <p class={`${error ? "visible" : "hidden"} text-xs text-red-600 mt-2`}>
        {error?.join(", ")}
    </p>
</div>
