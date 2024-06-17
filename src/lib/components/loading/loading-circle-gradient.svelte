<script lang="ts">

</script>

<div class="gradient-loader">
    <span></span>
    <span></span>
    <span></span>
    <span></span>
</div>

<style>
    .gradient-loader {
        position: relative;
        width: 350px;
        height: 350px;
        border-radius: 50%;
        /* background: linear-gradient(#f07e6e, #84cdfa, #5ad1cd); */
        /* fidl colors */
        background: linear-gradient(#FFEE0B, #00AB96, #FF2570);
        animation: animate 1.2s linear infinite;
    }

    @keyframes animate {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }

    .gradient-loader span {
        position: absolute;
        width: 100%;
        height: 100%;
        border-radius: 50%;
        /* background: linear-gradient(#f07e6e, #84cdfa, #5ad1cd); */
        /* fidl colors */
        background: linear-gradient(#FFEE0B, #00AB96, #FF2570);    }

    .gradient-loader span:nth-child(1) {
        filter: blur(5px);
    }

    .gradient-loader span:nth-child(2) {
        filter: blur(10px);
    }

    .gradient-loader span:nth-child(3) {
        filter: blur(25px);
    }

    .gradient-loader span:nth-child(4) {
        filter: blur(50px);
    }

    .gradient-loader:after {
        content: '';
        position: absolute;
        top: 10px;
        left: 10px;
        right: 10px;
        bottom: 10px;
        background: #f1f1f1;
        border: solid white 10px;
        border-radius: 50%;
    }
</style>
