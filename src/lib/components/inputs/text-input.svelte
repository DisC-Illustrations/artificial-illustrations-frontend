<script lang="ts">
    export let name: string;
    export let label: string = "";
    export let value: string | undefined | null;
    export let error: string[] | undefined = undefined;
    export let placeholder: string = "";
    export let underlineStyle = false;
    export let required = false;
    export let style = "";
    export let disabled = false;

    const setInput = (
        e: Event & { currentTarget: EventTarget & HTMLInputElement }
    ) => {
        value = e.currentTarget.value;
    };
</script>

<div class={style}>
    {#if label.length > 0}
        <label
            for={name}
            class="block {underlineStyle
                ? 'text-[15px] '
                : 'text-sm ml-[5px]'} leading-none {underlineStyle
                ? 'mb-0'
                : 'mb-2'} dark:text-white select-none"
        >
            {label}
            {#if required}
                <span class="text-primary">*</span>
            {/if}</label
        >
    {/if}
    <div class="relative">
        <input
            on:click
            {placeholder}
            {name}
            {value}
            id={name}
            {required}
            {disabled}
            on:input={setInput}
            class="block w-full bg-bgLight text-sm placeholder:text-border leading-none relative
                border border-border rounded-2xl focus:ring-lightBlue py-3 px-4 focus:border-lightBlue"
        />
    </div>
    <p class={`${error ? "visible" : "hidden"} text-xs text-red-600 mt-2`}>
        {error?.join(", ")}
    </p>
</div>
