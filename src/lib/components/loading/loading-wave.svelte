<script lang="ts">

</script>

<div class="loading-animation">
    <div class="wave"></div>
    <div class="wave"></div>
    <div class="wave"></div>
    <div class="wave"></div>
    <div class="wave"></div>
    <div class="wave"></div>
    <div class="wave"></div>
    <div class="wave"></div>
    <div class="wave"></div>
    <div class="wave"></div>
</div>

<style>
    .loading-animation {
        height: fit-content;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .wave {
        width: 5px;
        height: 100px;
        background: linear-gradient(45deg, theme("colors.lightBlue"), theme("colors.darkBlue"));
        /* fidl colors */
        /* background: linear-gradient(45deg, #FFEE0B, #00AB96); */
        margin: 10px;
        animation: wave 1s linear infinite;
        border-radius: 20px;
    }
    .wave:nth-child(2) {
        animation-delay: 0.1s;
    }
    .wave:nth-child(3) {
        animation-delay: 0.2s;
    }
    .wave:nth-child(4) {
        animation-delay: 0.3s;
    }
    .wave:nth-child(5) {
        animation-delay: 0.4s;
    }
    .wave:nth-child(6) {
        animation-delay: 0.5s;
    }
    .wave:nth-child(7) {
        animation-delay: 0.6s;
    }
    .wave:nth-child(8) {
        animation-delay: 0.7s;
    }
    .wave:nth-child(9) {
        animation-delay: 0.8s;
    }
    .wave:nth-child(10) {
        animation-delay: 0.9s;
    }

    @keyframes wave {
        0% {
            transform: scale(0);
        }
        50% {
            transform: scale(1);
        }
        100% {
            transform: scale(0);
        }
    }
</style>
