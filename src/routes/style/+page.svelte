<script>
    import DownloadButton from "$lib/components/buttons/download-button.svelte";
    import PrimaryButton from "$lib/components/buttons/primary-button.svelte";
    import SecondaryButton from "$lib/components/buttons/secondary-button.svelte";
    import TertiaryButton from "$lib/components/buttons/tertiary-button.svelte";
    import SelectStyle from "$lib/components/inputs/select-style.svelte";
    import TextArea from "$lib/components/inputs/text-area.svelte";
    import TextInput from "$lib/components/inputs/text-input.svelte";
    import Tooltip from "$lib/components/inputs/tooltip.svelte";

    let styles = [
        {
            name: "1",
            src: "https://thumbs.dreamstime.com/b/dwarf-gray-hamster-sits-his-house-sawdust-pet-care-concepts-237425150.jpg",
            prompt: "1",
        },
        {
            name: "2",
            src: "https://thumbs.dreamstime.com/b/dwarf-gray-hamster-sits-his-house-sawdust-pet-care-concepts-237425150.jpg",
            prompt: "1",
        },
        {
            name: "3",
            src: "https://thumbs.dreamstime.com/b/dwarf-gray-hamster-sits-his-house-sawdust-pet-care-concepts-237425150.jpg",
            prompt: "1",
        },
    ];
</script>

<div>
    Buttons:
    <PrimaryButton>Test</PrimaryButton>
    <SecondaryButton>Test</SecondaryButton>
    <TertiaryButton>Test</TertiaryButton>
    <DownloadButton>Test</DownloadButton>
    <br />
    Inputs:
    <Tooltip tooltipText="Hier steht Text"></Tooltip>
    <TextInput name="text" placeholder="Hier kommt Text hin"></TextInput>
    <TextArea name="textarea" placeholder="Hier kommt der Artikel hin"
    ></TextArea>
    <SelectStyle {styles}></SelectStyle>
</div>
