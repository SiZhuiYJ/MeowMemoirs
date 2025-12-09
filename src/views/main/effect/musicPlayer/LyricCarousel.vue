<script setup lang="ts">
import { computed, nextTick, ref, watch } from "vue";
import type { LyricLine } from "./useMusicPlayer";

const props = defineProps<{
  lines: LyricLine[];
  activeIndex: number;
  loading: boolean;
}>();

const listRef = ref<HTMLDivElement | null>(null);

const decoratedLyrics = computed(() =>
  props.lines.map((line, idx) => ({
    ...line,
    offset: idx - props.activeIndex,
    key: `${line.time}-${idx}`,
  }))
);

const smoothScrollToActive = async () => {
  await nextTick();
  const container = listRef.value;
  if (!container) return;

  const active = container.querySelector<HTMLElement>(".lyric-slide.active");
  if (!active) return;

  const targetTop = active.offsetTop - container.clientHeight / 2 + active.offsetHeight / 2;
  container.scrollTo({ top: targetTop, behavior: "smooth" });
};

watch(
  () => [props.activeIndex, props.lines.length],
  () => {
    void smoothScrollToActive();
  },
  { immediate: true }
);
</script>

<template>
  <div class="lyric-carousel">
    <div class="lyric-gradient top" />
    <div class="lyric-gradient bottom" />

    <div class="slides-viewport" ref="listRef">
      <div class="slides" :data-empty="!lines.length">
        <div
          v-for="line in decoratedLyrics"
          :key="line.key"
          class="lyric-slide"
          :class="{ active: line.offset === 0 }"
        >
          <span>{{ line.text }}</span>
        </div>
      </div>
    </div>

    <div v-if="loading" class="lyric-status">歌词加载中...</div>
    <div v-else-if="!lines.length" class="lyric-status">暂无歌词</div>
  </div>
</template>

<style scoped lang="scss">
.lyric-carousel {
  position: relative;
  min-height: 280px;
  border-radius: 16px;
  background: radial-gradient(circle at 20% 20%, rgba(255, 255, 255, 0.06), transparent 40%),
    radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.08), transparent 35%),
    rgba(17, 24, 39, 0.6);
  overflow: hidden;
  padding: 1.5rem 1.25rem;
  backdrop-filter: blur(10px);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.04), 0 20px 50px rgba(0, 0, 0, 0.35);
}

.lyric-gradient {
  position: absolute;
  left: 0;
  right: 0;
  height: 90px;
  pointer-events: none;
  z-index: 2;

  &.top {
    top: 0;
    background: linear-gradient(to bottom, rgba(19, 25, 40, 0.9), rgba(19, 25, 40, 0));
  }

  &.bottom {
    bottom: 0;
    background: linear-gradient(to top, rgba(19, 25, 40, 0.92), rgba(19, 25, 40, 0));
  }
}

.slides-viewport {
  position: relative;
  max-height: 320px;
  min-height: 220px;
  overflow: hidden;
  border-radius: 12px;
  isolation: isolate;
}

.slides {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: 0.75rem;
  padding: 0.35rem 0.25rem;
  height: 100%;
  overflow-y: auto;
  scroll-behavior: smooth;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.slides::-webkit-scrollbar {
  display: none;
}

.lyric-slide {
  position: relative;
  width: 100%;
  text-align: center;
  color: #cbd5e1;
  letter-spacing: 0.02em;
  padding: 0.6rem 0.9rem;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.04);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.18);
  transition: transform 0.35s ease, opacity 0.35s ease, filter 0.35s ease, background 0.35s,
    box-shadow 0.35s ease;
  transform-origin: center;
}

.lyric-slide.active {
  color: #f8fafc;
  background: linear-gradient(120deg, rgba(93, 165, 255, 0.25), rgba(236, 72, 153, 0.22));
  box-shadow: 0 20px 40px rgba(14, 165, 233, 0.28), inset 0 1px 0 rgba(255, 255, 255, 0.08);
  transform: scale(1.03);
  opacity: 1;
  filter: none;
}

.lyric-status {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  font-size: 0.95rem;
  color: #cbd5e1;
  background: rgba(15, 23, 42, 0.7);
  backdrop-filter: blur(4px);
  z-index: 3;
}
</style>
