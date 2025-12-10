<script setup lang="ts">
import { computed } from "vue";
import type { LyricLine } from "./useMusicPlayer";

const props = defineProps<{
    lines: LyricLine[];
    activeIndex: number;
    loading: boolean;
}>();

// Compute offsets relative to the active line for the stacked animation
const decoratedLyrics = computed(() =>
    props.lines.map((line, idx) => ({
        ...line,
        offset: idx - props.activeIndex,
        key: `${line.time}-${idx}`
    }))
);
</script>

<template>
    <div class="lyric-carousel">
        <div class="lyric-gradient top" />
        <div class="lyric-gradient bottom" />

        <div class="slides-stack">
            <div v-for="line in decoratedLyrics" :key="line.key" class="lyric-slide"
                :class="{ active: line.offset === 0 }" :data-offset="line.offset">
                <span v-html="line.text"></span>
            </div>
        </div>

        <div v-if="loading" class="lyric-status">歌词加载中...</div>
        <div v-else-if="!lines.length" class="lyric-status">暂无歌词</div>
    </div>
</template>

<style scoped lang="scss">
$max-visible-offset: 8; // 活动行上方/下方的可见行数

.lyric-carousel {
    position: relative;
    // min-height: calc(100% - 0.75rem - 50px); // account for padding + controls
    border-radius: 16px;
    --row-height: 52px; // baseline row height, adjustable via media query
    background: radial-gradient(circle at 20% 20%, rgba(255, 255, 255, 0.06), transparent 40%), radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.08), transparent 35%), rgba(17, 24, 39, 0.6);
    overflow: hidden;
    backdrop-filter: blur(10px);
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.04), 0 20px 50px rgba(0, 0, 0, 0.35);
}

.lyric-gradient {
    position: absolute;
    left: 0;
    right: 0;
    height: 30%;
    pointer-events: none;
    z-index: 5;

    &.top {
        top: 0;
        background: linear-gradient(to bottom, rgba(15, 21, 33, 0.95), rgba(15, 21, 33, 0));
    }

    &.bottom {
        bottom: 0;
        background: linear-gradient(to top, rgba(15, 21, 33, 0.95), rgba(15, 21, 33, 0));
    }
}

.slides-stack {
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    transform: translateY(-50%);
    height: calc((#{$max-visible-offset * 2 + 1}) * var(--row-height));
    overflow: hidden;
    perspective: 800px;
}

.lyric-slide {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 90%;
    text-align: center;
    color: #cbd5e1;
    letter-spacing: 0.02em;
    padding: 0.6rem 0.9rem;
    border-radius: 12px;
    min-height: var(--row-height);
    max-height: calc(var(--row-height) * 2); // allow up to two lines without overlapping neighbors
    display: flex;
    align-items: center;
    justify-content: center;
    line-height: 1.4;

    background: transparent;
    box-shadow: none;

    transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.4s ease, background 0.4s;

    opacity: 0;
    transform: translate(-50%, -50%) scale(0.6) translateY(0) rotateX(40deg);
    pointer-events: none;
    z-index: 1;

    &>span {
        transition: color 0.4s ease;
        filter: blur(0.5px);

        overflow: hidden;
        word-break: break-word;
        white-space: normal;
    }

    @for $i from 1 through $max-visible-offset {
        // 歌词堆叠效果
        $scale-factor: 1 - $i * 0.04; // 每层缩小6%
        $opacity-factor: 1 - $i * 0.15; // 每层透明度降低15%
        $blur-factor: $i * 0.4px; // 每层模糊增加0.4px
        $rotate-x: 5deg * $i; // 每层旋转增加5度

        &[data-offset="#{-$i}"] {
            opacity: $opacity-factor;
            transform: translate(-50%, -50%) scale($scale-factor) translateY(calc(-1 * #{$i} * var(--row-height))) rotateX($rotate-x);
            z-index: $max-visible-offset - $i + 1;

            &>span {
                filter: blur($blur-factor);
            }
        }

        &[data-offset="#{$i}"] {
            opacity: $opacity-factor;
            transform: translate(-50%, -50%) scale($scale-factor) translateY(calc(#{$i} * var(--row-height))) rotateX(-$rotate-x);
            z-index: $max-visible-offset - $i + 1;

            &>span {
                filter: blur($blur-factor);
            }
        }
    }

    &[data-offset^="-"][data-offset^="-#{$max-visible-offset + 1}"],
    &[data-offset^="#{$max-visible-offset + 1}"] {
        opacity: 0;
        transform: translate(-50%, -50%) scale(0.5) translateY(0) rotateX(40deg);
    }
}

.lyric-slide.active {
    opacity: 1;
    color: #f8fafc;
    transform: translate(-50%, -50%) scale(1.03) translateY(0) rotateX(0deg);
    z-index: $max-visible-offset + 2;
    pointer-events: auto;

    &>span {
        color: #fff;
        filter: none;
    }
}

.lyric-status {
    position: absolute;
    inset: 0;
    display: grid;
    place-items: center;
    font-size: 0.95rem;
    color: #cbd5e1;
    background: rgba(15, 23, 42, 0.85);
    backdrop-filter: blur(4px);
    z-index: 6;
}

@media (max-width: 768px) {
    .lyric-carousel {
        --row-height: 64px; // more breathing room on mobile to prevent overlap
    }

    .lyric-slide {
        font-size: 0.95rem;
        padding: 0.65rem 0.75rem;
    }
}
</style>
