<script setup lang="ts">
defineProps({
    delay: {
        type: Number,
        default: 100
    },
    width: {
        type: Number,
        default: 100
    },
    height: {
        type: Number,
        default: 30
    }
});
</script>

<template>
    <!-- :data-delay="delay + '%'" -->
    <div class="loading">
        <div class="power-box" :style="{
            '--delay': -delay / 100 + 's',
            'width': width + 'px',
            'height': height + 'px',
        }">
            <span class="number">{{ delay + '%' }}</span>
        </div>
    </div>
</template>

<style scoped>
.loading {
    position: relative;
    box-sizing: border-box;

    .power-box {
        --delay: 0s;
        position: absolute;
        border: 2px solid #222;
        border-radius: 9px;
        box-sizing: border-box;

        &:before {
            content: "";
            height: calc(100% - 6px);
            position: absolute;
            border-radius: 5px;
            z-index: 5;
            animation: power-eff 1s linear forwards paused;
            animation-delay: var(--delay);
            margin: 3px;
        }

        &:after {
            content: "";
            width: 2px;
            height: 50%;
            background-color: #222;
            position: absolute;
            right: -8px;
            top: 50%;
            transform: translate(-50%, -50%);
        }

        .number {
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9;
            position: absolute;
            transform: translate(-50%, -50%);
            top: 50%;
            left: 50%;
            width: 100%;
            height: calc(100% - 6px);
            color: transparent;
            background: linear-gradient(to right, #000 50%, #FFF 50%) center center/ 200% 100% fixed;
            /*background-clip: text;*/
            background-clip: text;
            animation: loading-vertical 1s linear forwards paused;
            animation-delay: var(--delay);
            margin: 0 3px;
        }
    }


}

@keyframes power-eff {
    0% {
        width: 1px;
        background-color: #f00;
    }

    10% {
        width: calc(10% - 3px);
        background-color: #f00;
    }

    20% {
        width: calc(20% - 3px);
        background-color: #f7b530;
    }

    60% {
        width: calc(60% - 6px);
        background-color: #f7b530;
    }

    70% {
        width: calc(70% - 6px);
        background-color: #00cb00;
    }

    100% {
        width: calc(100% - 6px);
        background-color: #00cb00;
    }
}

@keyframes loading-vertical {
    0% {
        background-position: calc(-0% - 3px) 0;
    }

    20% {
        background-position: calc(-20% - 3px) 0;
    }

    60% {
        background-position: calc(-60% - 6px) 0;
    }

    100% {
        background-position: calc(-100% - 6px) 0;
    }
}
</style>