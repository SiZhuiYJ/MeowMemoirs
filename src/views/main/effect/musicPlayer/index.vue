<script setup lang="ts">
import { computed, ref } from "vue";
import LyricCarousel from "./LyricCarousel.vue";
import { useMusicPlayer } from "./useMusicPlayer";

const audioRef = ref<HTMLAudioElement | null>(null);

const {
  playlist,
  coverUrl,
  coverLoading,
  isPlaying,
  duration,
  progress,
  volume,
  muted,
  playMode,
  lyrics,
  lyricLoading,
  currentTrack,
  currentIndex,
  formattedCurrentTime,
  formattedDuration,
  activeLyricIndex,
  playAt,
  playPrev,
  playNext,
  togglePlay,
  seek,
  changeVolume,
  toggleMute,
  cycleMode,
  formatTime,
} = useMusicPlayer(audioRef);

const modeLabel = computed(() => {
  switch (playMode.value) {
    case "single":
      return "单曲循环";
    case "shuffle":
      return "随机播放";
    default:
      return "顺序循环";
  }
});
</script>

<template>
  <div class="player-page">
    <section class="player-hero" :class="`theme-${(currentIndex % 5) + 1}`">
      <div class="glow"></div>
      <div class="hero-main">
        <div class="vinyl-wrap">
          <div
            class="vinyl"
            :class="{ spinning: isPlaying }"
            :style="coverUrl ? { '--cover-url': `url(${coverUrl})` } : undefined"
          >
            <div v-if="coverLoading" class="cover-loading">封面解析中...</div>
            <!-- <div class="label">
              <p class="label-title">{{ currentTrack?.name || "未选择歌曲" }}</p>
              <p class="label-artist">{{ currentTrack?.artist || "" }}</p>
            </div> -->
          </div>
        </div>
        <div class="hero-text">
          <p class="eyebrow">Meow Memoirs · Music Lab</p>
          <h1 class="title">{{ currentTrack?.name || "选择一首歌吧" }}</h1>
          <p class="subtitle">{{ currentTrack?.artist || "等待播放列表" }}</p>
          <div class="chips">
            <span class="chip">{{ modeLabel }}</span>
            <span class="chip muted" v-if="muted">静音</span>
            <span class="chip" v-if="currentTrack?.duration">
              时长 {{ formatTime(currentTrack.duration || duration) }}
            </span>
          </div>
        </div>
      </div>
    </section>

    <section class="player-panel">
      <div class="controls-card glass">
        <div class="timeline">
          <span class="time">{{ formattedCurrentTime }}</span>
          <input
            class="slider"
            type="range"
            min="0"
            max="100"
            step="0.1"
            :value="progress"
            @input="(e) => seek(Number((e.target as HTMLInputElement).value))"
          />
          <span class="time">{{ formattedDuration }}</span>
        </div>

        <div class="controls">
          <button class="ghost" :title="modeLabel" @click="cycleMode">
            <svg v-if="playMode === 'loop'" viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M17 17H8a3 3 0 0 1 0-6h9"
                fill="none"
                stroke="currentColor"
                stroke-width="1.8"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M16 14l3-3-3-3"
                fill="none"
                stroke="currentColor"
                stroke-width="1.8"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <svg v-else-if="playMode === 'single'" viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M17 17H8a3 3 0 0 1 0-6h9"
                fill="none"
                stroke="currentColor"
                stroke-width="1.8"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M16 14l3-3-3-3"
                fill="none"
                stroke="currentColor"
                stroke-width="1.8"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <text x="9" y="14.5" font-size="6" fill="currentColor" font-family="monospace">1</text>
            </svg>
            <svg v-else viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M4 5l6 6-6 6m10-12l6 6-6 6"
                fill="none"
                stroke="currentColor"
                stroke-width="1.8"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>

          <button class="ghost" title="上一首" @click="playPrev">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M19 5v14l-10-7 10-7Z M5 5v14"
                fill="currentColor"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linejoin="round"
              />
            </svg>
          </button>

          <button class="primary" title="播放/暂停" @click="togglePlay">
            <svg v-if="!isPlaying" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M6 4l14 8-14 8V4Z" fill="currentColor" />
            </svg>
            <svg v-else viewBox="0 0 24 24" aria-hidden="true">
              <path d="M7 5h4v14H7zM13 5h4v14h-4z" fill="currentColor" />
            </svg>
          </button>

          <button class="ghost" title="下一首" @click="playNext">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M5 19V5l10 7-10 7Z M19 19V5"
                fill="currentColor"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linejoin="round"
              />
            </svg>
          </button>

          <div class="volume">
            <button class="ghost" title="静音" @click="toggleMute">
              <svg v-if="muted || volume === 0" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M4 9v6h4l5 4V5L8 9H4Zm12 0 4 6m0-6-4 6"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.8"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              <svg v-else-if="volume < 0.5" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M4 9v6h4l5 4V5L8 9H4Zm10 3a2 2 0 0 0 2-2"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.8"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              <svg v-else viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M4 9v6h4l5 4V5L8 9H4Zm10 3a3 3 0 0 0 3-3m-3 3a5 5 0 0 0 5 5"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.8"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </button>
            <input
              class="slider volume-slider"
              type="range"
              min="0"
              max="1"
              step="0.01"
              :value="muted ? 0 : volume"
              @input="(e) => changeVolume(Number((e.target as HTMLInputElement).value))"
            />
          </div>
        </div>
      </div>

      <div class="grid">
        <div class="panel glass">
          <header class="panel-head">
            <div>
              <p class="eyebrow">歌词</p>
              <h3>Lyric View</h3>
            </div>
            <span class="pill" v-if="lyricLoading">加载中...</span>
          </header>
          <LyricCarousel :lines="lyrics" :active-index="activeLyricIndex" :loading="lyricLoading" />
        </div>

        <div class="panel glass">
          <header class="panel-head">
            <div>
              <p class="eyebrow">播放列表</p>
              <h3>Playlist</h3>
            </div>
            <span class="pill">{{ playlist.length }} 首</span>
          </header>
          <div class="playlist">
            <button
              v-for="(track, index) in playlist"
              :key="track.id"
              class="track"
              :class="{ active: currentIndex === index }"
              @click="playAt(index)"
            >
              <div class="track-meta">
                <p class="name">{{ track.name }}</p>
                <p class="artist">{{ track.artist }}</p>
              </div>
              <div class="track-extra">
                <span class="duration">
                  {{ track.duration ? formatTime(track.duration) : "..." }}
                </span>
                <span class="badge" v-if="currentIndex === index">播放中</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </section>

    <audio ref="audioRef" preload="metadata" />
  </div>
</template>

<style scoped lang="scss">
.player-page {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: clamp(1rem, 1vw + 0.5rem, 2.5rem);
  color: #e8ecf1;
  background: radial-gradient(circle at 20% 20%, rgba(103, 87, 255, 0.08), transparent 35%),
    radial-gradient(circle at 80% 0%, rgba(255, 142, 180, 0.12), transparent 35%),
    #0f1521;
  min-height: 100vh;
  box-sizing: border-box;
  width: min(1200px, 100%);
  margin: 0 auto;
  position: relative;
  overflow: hidden;
  border-radius: 28px;
  box-shadow: 0 20px 80px rgba(0, 0, 0, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.02);
}

.player-hero {
  position: relative;
  border-radius: 24px;
  overflow: hidden;
  padding: clamp(1.25rem, 4vw, 2.5rem);
  backdrop-filter: blur(8px);
  isolation: isolate;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 25px 80px rgba(0, 0, 0, 0.3);

  &.theme-1 {
    background: linear-gradient(135deg, rgba(99, 102, 241, 0.32), rgba(14, 165, 233, 0.32));
  }
  &.theme-2 {
    background: linear-gradient(135deg, rgba(249, 115, 22, 0.32), rgba(236, 72, 153, 0.32));
  }
  &.theme-3 {
    background: linear-gradient(135deg, rgba(74, 222, 128, 0.28), rgba(59, 130, 246, 0.28));
  }
  &.theme-4 {
    background: linear-gradient(135deg, rgba(250, 204, 21, 0.24), rgba(236, 72, 153, 0.3));
  }
  &.theme-5 {
    background: linear-gradient(135deg, rgba(236, 72, 153, 0.35), rgba(14, 165, 233, 0.28));
  }
}

.player-hero .glow {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: radial-gradient(circle at 60% 20%, rgba(255, 255, 255, 0.16), transparent 45%),
    radial-gradient(circle at 10% 80%, rgba(255, 255, 255, 0.12), transparent 40%);
  mix-blend-mode: screen;
  opacity: 0.9;
  z-index: 0;
}

.hero-main {
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: clamp(1.25rem, 2vw, 2.5rem);
  align-items: center;
  position: relative;
  z-index: 1;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    text-align: center;
  }
}

.vinyl-wrap {
  display: grid;
  place-items: center;
}

.vinyl {
  width: min(260px, 55vw);
  aspect-ratio: 1 / 1;
  border-radius: 50%;
  background: radial-gradient(circle, #0b0d13 45%, rgba(255, 255, 255, 0.08) 46%, #0b0d13 65%),
    repeating-conic-gradient(from 0deg, rgba(255, 255, 255, 0.08) 0deg 2deg, transparent 2deg 4deg);
  display: grid;
  place-items: center;
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.45), inset 0 0 35px rgba(0, 0, 0, 0.4);
  transition: transform 0.6s ease, box-shadow 0.4s ease;
  position: relative;
  overflow: hidden;

  &.spinning {
    animation: spin 14s linear infinite;
    box-shadow: 0 25px 70px rgba(0, 0, 0, 0.55), inset 0 0 40px rgba(0, 0, 0, 0.5);
  }

  &:hover {
    transform: translateY(-4px);
  }
}

.vinyl::after {
  content: "";
  position: absolute;
  inset: 18%;
  border-radius: 50%;
  background: var(--cover-url, radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.15), rgba(0, 0, 0, 0.65)))
    center/cover no-repeat;
  opacity: 0.92;
  mix-blend-mode: screen;
  box-shadow: inset 0 0 30px rgba(0, 0, 0, 0.5);
  transition: opacity 0.3s ease;
  z-index: 0;
}

.cover-loading {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  background: rgba(0, 0, 0, 0.35);
  backdrop-filter: blur(2px);
  font-size: 0.9rem;
  letter-spacing: 0.04em;
  z-index: 2;
}

.label {
  width: 42%;
  aspect-ratio: 1 / 1;
  border-radius: 50%;
  background: radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.15), rgba(0, 0, 0, 0.55)),
    #ff7a9a;
  display: grid;
  place-items: center;
  text-align: center;
  padding: 0.75rem;
  color: #0f0f14;
  font-weight: 700;
  box-shadow: inset 0 0 0 6px rgba(0, 0, 0, 0.18);
  position: relative;
  z-index: 1;
}

.label-title {
  font-size: clamp(0.8rem, 1vw, 1.05rem);
  line-height: 1.25;
}
.label-artist {
  font-size: 0.8rem;
  opacity: 0.8;
}

.hero-text .eyebrow {
  font-size: 0.85rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  opacity: 0.75;
  margin-bottom: 0.4rem;
}

.hero-text .title {
  font-size: clamp(1.6rem, 4vw, 2.8rem);
  margin: 0;
  line-height: 1.15;
}

.hero-text .subtitle {
  margin: 0.4rem 0 0.6rem;
  color: #d6dce7;
  font-size: clamp(1rem, 2.4vw, 1.25rem);
}

.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
  margin-top: 0.6rem;
}

.chip {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.4rem 0.8rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.14);
  color: #0f1521;
  font-weight: 700;
  backdrop-filter: blur(8px);
}

.chip.muted {
  background: rgba(255, 99, 132, 0.9);
}

.player-panel {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.glass {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 18px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.25);
  backdrop-filter: blur(14px);
}

.controls-card {
  padding: 1.2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.timeline {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 0.75rem;
  align-items: center;
}

.time {
  font-variant-numeric: tabular-nums;
  opacity: 0.8;
  min-width: 46px;
}

.slider {
  appearance: none;
  width: 100%;
  height: 6px;
  border-radius: 999px;
  background: linear-gradient(90deg, #6dd3ff, #ff7a9a);
  outline: none;
}

.slider::-webkit-slider-thumb {
  appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #fff;
  border: 2px solid #0f1521;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
}

.slider::-moz-range-thumb {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #fff;
  border: 2px solid #0f1521;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
}

.controls {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

button {
  border: none;
  cursor: pointer;
  color: #e8ecf1;
  background: transparent;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.22s ease;
}

button svg {
  width: 24px;
  height: 24px;
}

.ghost {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.ghost:hover {
  background: rgba(255, 255, 255, 0.12);
  transform: translateY(-1px);
}

.primary {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ff7a9a, #7c8bff);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35);
}

.primary:hover {
  transform: translateY(-2px) scale(1.02);
}

.volume {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  min-width: 180px;
}

.volume-slider {
  background: linear-gradient(90deg, #7c8bff, #7affc2);
}

.grid {
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: 1rem;
  align-items: stretch;

  @media (max-width: 1100px) {
    grid-template-columns: 1fr;
  }
}

.panel {
  padding: 1rem;
  min-height: 360px;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  background: linear-gradient(160deg, rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0.02));
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.05), 0 16px 30px rgba(0, 0, 0, 0.22);
}

.panel-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.6rem;
}

.panel-head h3 {
  margin: 0.1rem 0 0;
}

.eyebrow {
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 0.8rem;
  opacity: 0.7;
  margin: 0;
}

.pill {
  padding: 0.35rem 0.75rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.08);
  font-size: 0.9rem;
}

.lyrics {
  flex: 1;
}

.playlist {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  padding: 0.25rem 0.1rem 0.1rem;
}

.track {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 0.9rem;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid transparent;
  text-align: left;
  transition: transform 0.2s ease, box-shadow 0.25s ease, border-color 0.2s ease;
}

.track:hover {
  border-color: rgba(255, 255, 255, 0.12);
  transform: translateY(-1px);
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.18);
}

.track.active {
  border-color: rgba(255, 255, 255, 0.18);
  background: rgba(255, 255, 255, 0.08);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
}

.track-meta {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.track-meta .name {
  margin: 0;
  font-weight: 700;
}

.track-meta .artist {
  margin: 0;
  opacity: 0.7;
  font-size: 0.95rem;
}

.track-extra {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-variant-numeric: tabular-nums;
}

.duration {
  opacity: 0.75;
}

.badge {
  padding: 0.2rem 0.65rem;
  background: linear-gradient(135deg, #7c8bff, #ff7a9a);
  color: #0f1521;
  border-radius: 999px;
  font-weight: 700;
}

@media (max-width: 720px) {
  .controls-card {
    padding: 1rem 0.75rem;
  }
  .controls {
    justify-content: space-between;
  }
  .volume {
    width: 100%;
  }
  .hero-text .title {
    font-size: clamp(1.5rem, 8vw, 2.1rem);
  }
  .player-page {
    padding: 1rem;
  }
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
