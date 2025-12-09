<!--<script setup lang="ts">-->
<!--import { computed, nextTick, ref, watch } from "vue";-->
<!--import type { LyricLine } from "./useMusicPlayer";-->

<!--const props = defineProps<{-->
<!--    lines: LyricLine[];-->
<!--    activeIndex: number;-->
<!--    loading: boolean;-->
<!--}>();-->

<!--const listRef = ref<HTMLDivElement | null>(null);-->

<!--const decoratedLyrics = computed(() =>-->
<!--    props.lines.map((line, idx) => ({-->
<!--        ...line,-->
<!--        offset: idx - props.activeIndex,-->
<!--        key: `${line.time}-${idx}`-->
<!--    }))-->
<!--);-->

<!--const smoothScrollToActive = async () => {-->
<!--    await nextTick();-->
<!--    const container = listRef.value;-->
<!--    if (!container) return;-->

<!--    const active = container.querySelector<HTMLElement>(".lyric-slide.active");-->
<!--    if (!active) return;-->

<!--    const targetTop =-->
<!--        active.offsetTop - container.clientHeight / 2 + active.offsetHeight / 2;-->
<!--    container.scrollTo({ top: targetTop, behavior: "smooth" });-->
<!--};-->

<!--watch(-->
<!--    () => [props.activeIndex, props.lines.length],-->
<!--    () => {-->
<!--        void smoothScrollToActive();-->
<!--    },-->
<!--    { immediate: true }-->
<!--);-->
<!--</script>-->

<!--<template>-->
<!--    <div class="lyric-carousel">-->
<!--        <div class="lyric-gradient top" />-->
<!--        <div class="lyric-gradient bottom" />-->

<!--        <div class="slides-viewport" ref="listRef">-->
<!--            <div class="slides" :data-empty="!lines.length">-->
<!--                <div-->
<!--                    v-for="line in decoratedLyrics"-->
<!--                    :key="line.key"-->
<!--                    class="lyric-slide"-->
<!--                    :class="{ active: line.offset === 0 }"-->
<!--                >-->
<!--                    <span>{{ line.text }}</span>-->
<!--                </div>-->
<!--            </div>-->
<!--        </div>-->

<!--        <div v-if="loading" class="lyric-status">歌词加载中...</div>-->
<!--        <div v-else-if="!lines.length" class="lyric-status">暂无歌词</div>-->
<!--    </div>-->
<!--</template>-->

<!--<style scoped lang="scss">-->
<!--.lyric-carousel {-->
<!--  position: relative;-->
<!--  min-height: 280px;-->
<!--  border-radius: 16px;-->
<!--  background: radial-gradient(circle at 20% 20%, rgba(255, 255, 255, 0.06), transparent 40%),-->
<!--    radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.08), transparent 35%),-->
<!--    rgba(17, 24, 39, 0.6);-->
<!--  overflow: hidden;-->
// padding: 1.5rem 1.25rem;
<!--  backdrop-filter: blur(10px);-->
<!--  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.04), 0 20px 50px rgba(0, 0, 0, 0.35);-->
<!--}-->

<!--.lyric-gradient {-->
<!--  position: absolute;-->
<!--  left: 0;-->
<!--  right: 0;-->
<!--  height: 90px;-->
<!--  pointer-events: none;-->
<!--  z-index: 2;-->

<!--  &.top {-->
<!--    top: 0;-->
<!--    background: linear-gradient(to bottom, rgba(19, 25, 40, 0.9), rgba(19, 25, 40, 0));-->
<!--  }-->

<!--  &.bottom {-->
<!--    bottom: 0;-->
<!--    background: linear-gradient(to top, rgba(19, 25, 40, 0.92), rgba(19, 25, 40, 0));-->
<!--  }-->
<!--}-->

<!--.slides-viewport {-->
<!--  position: relative;-->
<!--  max-height: 320px;-->
<!--  min-height: 220px;-->
<!--  overflow: hidden;-->
<!--  border-radius: 12px;-->
<!--  isolation: isolate;-->
<!--}-->

<!--.slides {-->
<!--  position: relative;-->
<!--  display: flex;-->
<!--  flex-direction: column;-->
<!--  justify-content: flex-start;-->
<!--  gap: 0.75rem;-->
<!--  padding: 0.35rem 0.25rem;-->
<!--  height: 100%;-->
<!--  overflow-y: auto;-->
<!--  scroll-behavior: smooth;-->
<!--  scrollbar-width: none;-->
<!--  -ms-overflow-style: none;-->
<!--}-->

<!--.slides::-webkit-scrollbar {-->
<!--  display: none;-->
<!--}-->

<!--.lyric-slide {-->
<!--  position: relative;-->
<!--  width: 100%;-->
<!--  text-align: center;-->
<!--  color: #cbd5e1;-->
<!--  letter-spacing: 0.02em;-->
<!--  padding: 0.6rem 0.9rem;-->
<!--  border-radius: 12px;-->
<!--  background: rgba(255, 255, 255, 0.04);-->
<!--  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.18);-->
<!--  transition: transform 0.35s ease, opacity 0.35s ease, filter 0.35s ease, background 0.35s,-->
<!--    box-shadow 0.35s ease;-->
<!--  transform-origin: center;-->
<!--}-->

<!--.lyric-slide.active {-->
<!--  color: #f8fafc;-->
<!--  background: linear-gradient(120deg, rgba(93, 165, 255, 0.25), rgba(236, 72, 153, 0.22));-->
<!--  box-shadow: 0 20px 40px rgba(14, 165, 233, 0.28), inset 0 1px 0 rgba(255, 255, 255, 0.08);-->
<!--  transform: scale(1.03);-->
<!--  opacity: 1;-->
<!--  filter: none;-->
<!--}-->

<!--.lyric-status {-->
<!--  position: absolute;-->
<!--  inset: 0;-->
<!--  display: grid;-->
<!--  place-items: center;-->
<!--  font-size: 0.95rem;-->
<!--  color: #cbd5e1;-->
<!--  background: rgba(15, 23, 42, 0.7);-->
<!--  backdrop-filter: blur(4px);-->
<!--  z-index: 3;-->
<!--}-->
<!--</style>-->
<!--<script setup lang="ts">-->
<!--import { computed } from "vue";-->
<!--import type { LyricLine } from "./useMusicPlayer";-->

<!--const props = defineProps<{-->
<!--    lines: LyricLine[];-->
<!--    activeIndex: number;-->
<!--    loading: boolean;-->
<!--}>();-->

// 核心逻辑：计算每行歌词相对于当前活动行 (activeIndex) 的偏移量
<!--const decoratedLyrics = computed(() =>-->
<!--    props.lines.map((line, idx) => ({-->
<!--        ...line,-->
offset: idx - props.activeIndex, // <--- 关键：计算相对偏移量
<!--        key: `${line.time}-${idx}`-->
<!--    }))-->
<!--);-->

// 移除 smoothScrollToActive 和 watch，因为滚动现在由 CSS Transform 驱动
<!--</script>-->

<!--<template>-->
<!--    <div class="lyric-carousel">-->
<!--        <div class="lyric-gradient top" />-->
<!--        <div class="lyric-gradient bottom" />-->

<!--        <div class="slides-stack">-->
<!--            <div-->
<!--                v-for="line in decoratedLyrics"-->
<!--                :key="line.key"-->
<!--                class="lyric-slide"-->
<!--                :class="{ active: line.offset === 0 }"-->
<!--                :data-offset="line.offset" >-->
<!--                <span>{{ line.text }}</span>-->
<!--            </div>-->
<!--        </div>-->

<!--        <div v-if="loading" class="lyric-status">歌词加载中...</div>-->
<!--        <div v-else-if="!lines.length" class="lyric-status">暂无歌词</div>-->
<!--    </div>-->
<!--</template>-->

<!--<style scoped lang="scss">-->
// --- SCSS 变量定义 --- $row-height: 48px; // 每行歌词的视觉高度和间距
$max-visible-offset: 4; // 可见的最大偏移距离

<!--.lyric-carousel {-->
<!--    position: relative;-->
<!--    min-height: 280px;-->
<!--    border-radius: 16px;-->
<!--    background: radial-gradient(circle at 20% 20%, rgba(255, 255, 255, 0.06), transparent 40%),-->
<!--        radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.08), transparent 35%),-->
<!--        rgba(17, 24, 39, 0.6);-->
<!--    overflow: hidden;-->
<!--    backdrop-filter: blur(10px);-->
<!--    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.04), 0 20px 50px rgba(0, 0, 0, 0.35);-->
<!--}-->

<!--.lyric-gradient {-->
<!--    position: absolute;-->
<!--    left: 0;-->
<!--    right: 0;-->
height: 30%; /* 调整高度以适应新的堆栈布局 */
<!--    pointer-events: none;-->
z-index: 5; /* 确保遮罩在歌词上方 */

<!--    &.top {-->
<!--        top: 0;-->
<!--        background: linear-gradient(to bottom, rgba(19, 25, 40, 0.9), rgba(19, 25, 40, 0));-->
<!--    }-->

<!--    &.bottom {-->
<!--        bottom: 0;-->
<!--        background: linear-gradient(to top, rgba(19, 25, 40, 0.92), rgba(19, 25, 40, 0));-->
<!--    }-->
<!--}-->

// 新的歌词堆栈容器
<!--.slides-stack {-->
<!--    position: absolute;-->
top: 50%; /* 堆栈中心垂直居中 */
<!--    left: 0;-->
<!--    right: 0;-->
transform: translateY(-50%); /* 调整自身以实现精确居中 */ height:
($max-visible-offset * 2 + 1) * $row-height; /* 根据可见行数设置高度 */
overflow: hidden; /* 仅隐藏溢出部分 */
<!--}-->

<!--.lyric-slide {-->
<!--    position: absolute;-->
top: 50%; /* 定位所有歌词行的起始点到中心 */
<!--    left: 50%;-->
<!--    width: 90%;-->
<!--    text-align: center;-->
<!--    color: #cbd5e1;-->
<!--    letter-spacing: 0.02em;-->
<!--    padding: 0.6rem 0.9rem;-->
<!--    border-radius: 12px;-->
// background: rgba(255, 255, 255, 0.04);
<!--    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.18);-->
// 使用 Cubic-bezier 曲线实现更流畅的移动动画
<!--    transition: transform 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.35s ease, background 0.35s;-->

// 默认样式：隐藏且不在中心
<!--    opacity: 0; -->
<!--    transform: translate(-50%, -50%) scale(0.6) translateY(0); -->
<!--    pointer-events: none;-->
<!--    z-index: 1;-->

// --- 使用 SCSS 循环为可见歌词行应用 Transform ---
<!--    @for $i from 1 through $max-visible-offset {-->
// 向上偏移的行 (data-offset 值为负)
<!--        &[data-offset="#{-$i}"] {-->
opacity: 1 - $i * 0.18; // 越远越透明
<!--            transform: translate(-50%, -50%) scale(1 - $i * 0.04) translateY(-$i * $row-height);-->
<!--            z-index: $max-visible-offset - $i + 1;-->
<!--        }-->

// 向下偏移的行 (data-offset 值为正)
<!--        &[data-offset="#{$i}"] {-->
<!--            opacity: 1 - $i * 0.18;-->
<!--            transform: translate(-50%, -50%) scale(1 - $i * 0.04) translateY($i * $row-height);-->
<!--            z-index: $max-visible-offset - $i + 1;-->
<!--        }-->
<!--    }-->
<!--}-->

<!--.lyric-slide.active {-->
<!--    opacity: 1;-->
<!--    color: #f8fafc;-->
<!--    background: linear-gradient(120deg, rgba(93, 165, 255, 0.25), rgba(236, 72, 153, 0.22));-->
<!--    box-shadow: 0 20px 40px rgba(14, 165, 233, 0.28), inset 0 1px 0 rgba(255, 255, 255, 0.08);-->
// 激活行居中并放大
<!--    transform: translate(-50%, -50%) scale(1.03) translateY(0); -->
<!--    z-index: $max-visible-offset + 2; -->
<!--    pointer-events: auto;-->
<!--}-->

<!--.lyric-status {-->
<!--    position: absolute;-->
<!--    inset: 0;-->
<!--    display: grid;-->
<!--    place-items: center;-->
<!--    font-size: 0.95rem;-->
<!--    color: #cbd5e1;-->
<!--    background: rgba(15, 23, 42, 0.7);-->
<!--    backdrop-filter: blur(4px);-->
<!--    z-index: 6;-->
<!--}-->
<!--</style>-->
<script setup lang="ts">
import { computed } from "vue";
import type { LyricLine } from "./useMusicPlayer";

const props = defineProps<{
    lines: LyricLine[];
    activeIndex: number;
    loading: boolean;
}>();

// 核心逻辑：计算每行歌词相对于当前活动行 (activeIndex) 的偏移量
const decoratedLyrics = computed(() =>
    props.lines.map((line, idx) => ({
        ...line,
        offset: idx - props.activeIndex, // <--- 关键：计算相对偏移量
        key: `${line.time}-${idx}`
    }))
);
// 注意：该方案移除了对 listRef 的引用，也移除了 smoothScrollToActive 函数。
</script>

<template>
    <div class="lyric-carousel">
        <div class="lyric-gradient top" />
        <div class="lyric-gradient bottom" />

        <div class="slides-stack">
            <div
                v-for="line in decoratedLyrics"
                :key="line.key"
                class="lyric-slide"
                :class="{ active: line.offset === 0 }"
                :data-offset="line.offset"
            >
            	<span v-html="line.text"></span>
                <!--<span>{{ line.text }}</span>-->
            </div>
        </div>

        <div v-if="loading" class="lyric-status">歌词加载中...</div>
        <div v-else-if="!lines.length" class="lyric-status">暂无歌词</div>
    </div>
</template>

<style scoped lang="scss">
// --- SCSS 变量定义 ---
$row-height: 48px; // 每行歌词的视觉高度和间距
$max-visible-offset: 4; // 可见的最大偏移距离（即从中心向上或向下的行数）

.lyric-carousel {
    position: relative;
    min-height: 280px;
    border-radius: 16px;
    // 继承 Glassmorphism 风格
    background: radial-gradient(
            circle at 20% 20%,
            rgba(255, 255, 255, 0.06),
            transparent 40%
        ),
        radial-gradient(
            circle at 80% 80%,
            rgba(255, 255, 255, 0.08),
            transparent 35%
        ),
        rgba(17, 24, 39, 0.6);
    overflow: hidden;
    backdrop-filter: blur(10px);
    box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 0.04),
        0 20px 50px rgba(0, 0, 0, 0.35);
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
        // 调整颜色以更好地匹配主界面背景
        background: linear-gradient(
            to bottom,
            rgba(15, 21, 33, 0.95),
            rgba(15, 21, 33, 0)
        );
    }

    &.bottom {
        bottom: 0;
        background: linear-gradient(
            to top,
            rgba(15, 21, 33, 0.95),
            rgba(15, 21, 33, 0)
        );
    }
}

.slides-stack {
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    transform: translateY(-50%);
    // 高度设置：保证活动行上下 $max-visible-offset 行可见
    height: ($max-visible-offset * 2 + 1) * $row-height;
    overflow: hidden;
    perspective: 800px; // 添加透视效果以增强 3D 深度感
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

    // 移除默认背景，只在激活时添加
    background: transparent;
    box-shadow: none;

    // 关键：使用 transform 过渡，实现流畅的歌词移动
    transition:
        transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94),
        opacity 0.4s ease,
        background 0.4s;

    // 默认样式（超出可见范围）：完全隐藏和缩小
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.6) translateY(0) rotateX(40deg); // 增加 X 轴旋转，模拟深度
    pointer-events: none;
    z-index: 1;

    // 歌词文本的默认颜色
    & > span {
        transition: color 0.4s ease;
        filter: blur(0.5px); // 远处的歌词轻微模糊
    }

    // --- 使用 SCSS 循环根据 data-offset 应用变换效果 ---
    @for $i from 1 through $max-visible-offset {
        $scale-factor: 1 - $i * 0.06; // 越远缩放越多
        $opacity-factor: 1 - $i * 0.2; // 越远透明度越低
        $blur-factor: $i * 0.8px; // 越远越模糊
        $translate-y: $i * $row-height;
        $rotate-x: 5deg * $i;

        // 向上偏移的行 (data-offset 值为负)
        &[data-offset="#{-$i}"] {
            opacity: $opacity-factor;
            transform: translate(-50%, -50%)
                scale($scale-factor)
                translateY(-$translate-y)
                rotateX($rotate-x);
            z-index: $max-visible-offset - $i + 1;
            & > span {
                filter: blur($blur-factor);
            }
        }

        // 向下偏移的行 (data-offset 值为正)
        &[data-offset="#{$i}"] {
            opacity: $opacity-factor;
            transform: translate(-50%, -50%)
                scale($scale-factor)
                translateY($translate-y)
                rotateX(-$rotate-x);
            z-index: $max-visible-offset - $i + 1;
            & > span {
                filter: blur($blur-factor);
            }
        }
    }

    // 隐藏超出最大可见范围的歌词
    &[data-offset^="-"][data-offset^="-#{$max-visible-offset + 1}"],
    &[data-offset^="#{$max-visible-offset + 1}"] {
        opacity: 0;
        transform: translate(-50%, -50%) scale(0.5) translateY(0) rotateX(40deg);
    }
}

.lyric-slide.active {
    opacity: 1;
    color: #f8fafc; // 激活行颜色
    // 激活行居中，轻微放大，无旋转
    transform: translate(-50%, -50%) scale(1.03) translateY(0) rotateX(0deg);
    z-index: $max-visible-offset + 2;
    pointer-events: auto;

    & > span {
        color: #fff; // 激活行文本颜色
        filter: none; // 移除模糊
    }
}

.lyric-status {
    position: absolute;
    inset: 0;
    display: grid;
    place-items: center;
    font-size: 0.95rem;
    color: #cbd5e1;
    background: rgba(15, 23, 42, 0.85); // 稍微更深的背景，确保状态信息清晰
    backdrop-filter: blur(4px);
    z-index: 6;
}
</style>
