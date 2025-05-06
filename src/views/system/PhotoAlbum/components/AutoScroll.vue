<template>
    <div class="scroll-container">
        <div class="scroll-wrapper" ref="container">
            <div class="scroll-content" ref="content" :style="{ transform: `translateY(-${position}px)` }">
                <slot></slot>
            </div>
        </div>

        <div class="controls">
            <label>滚动速度：</label>
            <input type="range" v-model="speed" min="1" max="1000" @input="handleSpeedChange">
            <span>{{ speed }} px/s</span>
            <button @click="isAnimating ? stopAnimation() : startAnimation()">{{ isAnimating ? '停止' : '开始' }}</button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'

const container = ref<HTMLElement>()
const content = ref<HTMLElement>()
const speed = ref(200)
const position = ref(0)
const maxScroll = ref(0)
let animationFrameId = 0
let startTime = 0
let isAnimating = true

const calculateMaxScroll = () => {
    if (!container.value || !content.value) return 0
    return Math.max(0, content.value.offsetHeight - container.value.offsetHeight)
}

const animate = (timestamp: number) => {
    if (!startTime) startTime = timestamp
    const elapsed = timestamp - startTime

    let newPosition = (speed.value * elapsed) / 1000

    if (newPosition >= maxScroll.value) {
        startTime = timestamp
        newPosition = 0
    }

    position.value = newPosition

    if (isAnimating) {
        animationFrameId = requestAnimationFrame(animate)
    }
}

const startAnimation = () => {
    isAnimating = true
    startTime = 0
    animationFrameId = requestAnimationFrame(animate)
}

const stopAnimation = () => {
    isAnimating = false
    cancelAnimationFrame(animationFrameId)
}

const handleSpeedChange = () => {
    stopAnimation()
    startAnimation()
}

onMounted(async () => {
    await nextTick()
    maxScroll.value = calculateMaxScroll()

    const resizeObserver = new ResizeObserver(() => {
        maxScroll.value = calculateMaxScroll()
    })

    if (container.value && content.value) {
        resizeObserver.observe(container.value)
        resizeObserver.observe(content.value)
    }

    startAnimation()
})

onBeforeUnmount(() => {
    stopAnimation()
})
</script>

<style scoped>
.scroll-container {
    position: relative;
    margin: 20px;
}

.scroll-wrapper {
    height: 600px;
    /* overflow: hidden; */
    position: relative;
    border: 1px solid #ccc;
    border-radius: 4px;
}

.scroll-content {
    position: absolute;
    width: 100%;
    will-change: transform;
    transition: transform 0.1s linear;
}

.controls {
    margin-top: 10px;
    display: flex;
    align-items: center;
    gap: 10px;
    position: fixed;
    bottom: 40px;
}

input[type="range"] {
    width: 200px;
}
</style>