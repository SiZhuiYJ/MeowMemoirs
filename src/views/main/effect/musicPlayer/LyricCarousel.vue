<script setup lang="ts">
import { computed } from "vue";
import type { LyricLine } from "./useMusicPlayer";

const props = defineProps<{
  lines: LyricLine[];
  activeIndex: number;
  loading: boolean;
}>();

const visibleLyrics = computed(() =>
  props.lines
    .map((line, idx) => {
      const distance = idx - props.activeIndex;
      return {
        ...line,
        distance,
        isActive: distance === 0,
        key: `${line.time}-${idx}`,
      };
    })
    .filter((line) => Math.abs(line.distance) <= 8)
);
</script>

<template>
  <div class="lyric-shell">
    <div class="mesh"></div>
    <div class="halo"></div>
    <div class="halo secondary"></div>

    <div class="lyric-track" :data-empty="!lines.length">
      <div
        v-for="line in visibleLyrics"
        :key="line.key"
        class="lyric-line"
        :class="{ active: line.isActive }"
        :style="{
          '--distance': line.distance,
          '--abs-distance': Math.abs(line.distance),
        }"
      >
        <span class="bullet" aria-hidden="true"></span>
        <p class="text">{{ line.text }}</p>
      </div>
    </div>

    <div v-if="loading" class="lyric-status">歌词加载中...</div>
    <div v-else-if="!lines.length" class="lyric-status">暂无歌词</div>
  </div>
</template>

<style scoped lang="scss">
.lyric-shell {
  position: relative;
  min-height: 280px;
  border-radius: 18px;
  background: radial-gradient(circle at 20% 20%, rgba(255, 255, 255, 0.1), transparent 36%),
    radial-gradient(circle at 80% 82%, rgba(255, 255, 255, 0.08), transparent 38%),
    linear-gradient(135deg, rgba(28, 42, 61, 0.92), rgba(19, 26, 41, 0.94));
  overflow: hidden;
  padding: 1.75rem 1.25rem;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.04);
  backdrop-filter: blur(8px);
}

.mesh::before,
.mesh::after {
  content: "";
  position: absolute;
  inset: -10%;
  background-image: linear-gradient(rgba(255, 255, 255, 0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.04) 1px, transparent 1px);
  background-size: 20px 20px;
  opacity: 0.35;
  mix-blend-mode: soft-light;
  transform: rotate(2deg);
}

.mesh::after {
  transform: rotate(-2deg);
  opacity: 0.2;
}

.halo {
  position: absolute;
  inset: 10% 12%;
  background: radial-gradient(circle at 50% 40%, rgba(80, 140, 255, 0.4), rgba(255, 255, 255, 0) 55%);
  filter: blur(26px);
  opacity: 0.75;
  animation: pulse 8s ease-in-out infinite;
  pointer-events: none;
}

.halo.secondary {
  inset: 18% 20%;
  background: radial-gradient(circle at 60% 60%, rgba(255, 156, 245, 0.35), rgba(255, 255, 255, 0) 60%);
  animation-delay: -2.5s;
  opacity: 0.55;
}

.lyric-track {
  position: relative;
  display: grid;
  gap: 0.85rem;
  justify-items: center;
  transform-style: preserve-3d;
  perspective: 1000px;
  z-index: 1;
}

.lyric-track[data-empty="true"] {
  min-height: 220px;
}

.lyric-line {
  --distance: 0;
  --abs-distance: 0;
  width: min(100%, 720px);
  padding: 0.65rem 0.85rem 0.65rem 1.75rem;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.05);
  color: #d6e3ff;
  letter-spacing: 0.01em;
  backdrop-filter: blur(2px);
  display: flex;
  align-items: center;
  gap: 0.75rem;
  transform: translateY(calc(var(--distance) * 28px)) translateZ(calc((6 - var(--abs-distance)) * 6px))
    rotateX(calc(var(--distance) * 2deg));
  opacity: calc(1 - var(--abs-distance) * 0.12);
  filter: blur(calc(var(--abs-distance) * 0.35px));
  transition: transform 480ms cubic-bezier(0.33, 1, 0.68, 1), opacity 420ms ease, filter 420ms ease,
    background 320ms ease;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.18), inset 0 1px 0 rgba(255, 255, 255, 0.05);
}

.lyric-line .text {
  margin: 0;
  font-size: 0.98rem;
  line-height: 1.5;
}

.lyric-line .bullet {
  position: relative;
  display: inline-flex;
  width: 9px;
  height: 9px;
  border-radius: 999px;
  background: linear-gradient(135deg, #7dd3fc, #c084fc);
  box-shadow: 0 0 0 8px rgba(125, 211, 252, 0.08);
  opacity: 0.45;
  transition: all 280ms ease;
}

.lyric-line.active {
  color: #f8fbff;
  background: linear-gradient(120deg, rgba(94, 234, 212, 0.16), rgba(94, 234, 212, 0.08)),
    rgba(255, 255, 255, 0.06);
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(94, 234, 212, 0.15);
  transform: translateY(0) translateZ(46px) scale(1.03);
  opacity: 1;
  filter: none;
}

.lyric-line.active .bullet {
  width: 12px;
  height: 12px;
  background: linear-gradient(135deg, #34d399, #60a5fa);
  box-shadow: 0 0 0 10px rgba(52, 211, 153, 0.12), 0 0 24px rgba(96, 165, 250, 0.55);
  opacity: 1;
}

.lyric-status {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  font-size: 0.95rem;
  color: #dfe7ff;
  background: rgba(12, 19, 33, 0.7);
  backdrop-filter: blur(4px);
  z-index: 2;
}

@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
    opacity: 0.65;
  }
  50% {
    transform: scale(1.08);
    opacity: 0.9;
  }
}
</style>
