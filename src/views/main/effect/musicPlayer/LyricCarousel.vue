<script setup lang="ts">
import { computed } from "vue";
import type { LyricLine } from "./useMusicPlayer";

const props = defineProps<{
  lines: LyricLine[];
  activeIndex: number;
  loading: boolean;
}>();

const decoratedLyrics = computed(() =>
  props.lines.map((line, idx) => ({
    ...line,
    offset: idx - props.activeIndex,
    key: `${line.time}-${idx}`,
  }))
);
</script>

<template>
  <div class="lyric-carousel">
    <div class="lyric-gradient top" />
    <div class="lyric-gradient bottom" />

    <div class="slides" :data-empty="!lines.length">
      <div
        v-for="line in decoratedLyrics"
        :key="line.key"
        class="lyric-slide"
        :class="{ active: line.offset === 0 }"
        :style="{ '--offset': line.offset }"
      >
        <span>{{ line.text }}</span>
      </div>
    </div>

    <div v-if="loading" class="lyric-status">歌词加载中...</div>
    <div v-else-if="!lines.length" class="lyric-status">暂无歌词</div>
  </div>
</template>

<style scoped lang="scss">
.lyric-carousel {
  position: relative;
  min-height: 260px;
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

.slides {
  position: relative;
  display: grid;
  justify-items: center;
  gap: 0.75rem;
  transform-style: preserve-3d;
  transition: transform 0.6s ease;
  min-height: 220px;
}

.lyric-slide {
  --offset: 0;
  position: relative;
  width: 100%;
  text-align: center;
  color: #cbd5e1;
  letter-spacing: 0.02em;
  padding: 0.35rem 0.75rem;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.04);
  transform: translateY(calc(var(--offset) * 16px)) scale(calc(1 - (min(abs(var(--offset)), 5) * 0.05)));
  opacity: calc(1 - min(abs(var(--offset)) * 0.18, 0.82));
  filter: blur(calc(min(abs(var(--offset)), 2) * 0.8px));
  transition: transform 0.55s ease, opacity 0.55s ease, filter 0.55s ease, background 0.3s;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}

.lyric-slide.active {
  color: #f8fafc;
  background: linear-gradient(120deg, rgba(93, 165, 255, 0.25), rgba(236, 72, 153, 0.22));
  box-shadow: 0 20px 40px rgba(14, 165, 233, 0.28), inset 0 1px 0 rgba(255, 255, 255, 0.08);
  transform: translateY(0) scale(1.04);
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
