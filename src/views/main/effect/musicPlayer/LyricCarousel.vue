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
$max-visible-offset: 10; // 活动行上方/下方的可见行数
$max-text-offset: 3; // 活动行上方/下方的最大文本偏移行数

.lyric-carousel {
    position: relative;
    --row-height: 52px; // baseline row height, adjustable via media query
    overflow: hidden;
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
    color: var(--hero-text);
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

    transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.4s ease;

    opacity: 0;
    transform: translate(-50%, -50%) scale(0.6) translateY(0) rotateX(40deg);
    pointer-events: none;
    z-index: 1;

    &>span {
        transition: text-shadow 0.4s ease;
        filter: blur(0.5px);

        overflow: hidden;
        word-break: break-word;
        white-space: normal;
    }

    @for $i from 1 through $max-visible-offset {
        // 歌词堆叠效果
        $scale-factor: 1 - $i * 0.02; // 每层缩小6%
        $opacity-factor: 1 - $i * 0.10; // 每层透明度降低15%
        $blur-factor: $i * 0.4px; // 每层模糊增加0.4px
        $rotate-x: 2deg * $i; // 每层旋转增加5度

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
    color: var(--hero-text);
    transform: translate(-50%, -50%) scale(1.3) translateY(0) rotateX(0deg);
    z-index: $max-visible-offset + 2;
    pointer-events: auto;

    &>span {
        color: var(--hero-text);
        text-shadow:
            0 0 1px var(--hero-text),
            /* 内层发光 */
            0 0 2px var(--hero-text),
            /* 中层发光 */
            0 0 3px var(--hero-text);
        /* 外层发光 */

        filter: none;
    }
}

.lyric-status {
    position: absolute;
    inset: 0;
    display: grid;
    place-items: center;
    font-size: 0.95rem;
    color: var(--hero-text);
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
