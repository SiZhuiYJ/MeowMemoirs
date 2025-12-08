<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, shallowRef, watch } from "vue";

type PlayMode = "order" | "loop" | "shuffle";

interface TrackItem {
  id: number;
  name: string;
  artist: string;
  url: string;
  lyric: string;
}

interface LyricLine {
  time: number;
  content: string;
}

const playlist = ref<TrackItem[]>([
  {
    id: 1,
    name: "我只能离开",
    artist: "颜人中",
    url: "我只能离开 - 颜人中.flac",
    lyric: "我只能离开 - 颜人中.lrc",
  },
  {
    id: 2,
    name: "Star Crossing Night (feat. GALI)",
    artist: "徐明浩; GALI",
    url: "Star Crossing Night (feat. GALI) - 徐明浩; GALI.flac",
    lyric: "Star Crossing Night (feat. GALI) - 徐明浩,GALI.lrc",
  },
  {
    id: 3,
    name: "Take My Hand",
    artist: "DAISHI DANCE; Cécile Corbel",
    url: "Take My Hand - DAISHI DANCE; Cécile Corbel.flac",
    lyric: "Take My Hand - DAISHI DANCE,Cécile Corbel.lrc",
  },
  {
    id: 4,
    name: "The King",
    artist: "Paper.MAN",
    url: "The King - Paper.MAN.flac",
    lyric: "The King - Paper.MAN.lrc",
  },
  {
    id: 5,
    name: "勾指起誓",
    artist: "洛天依Official",
    url: "勾指起誓 - 洛天依Official; ilem.flac",
    lyric: "勾指起誓 - 洛天依Official,ilem.lrc",
  },
  {
    id: 6,
    name: "江南",
    artist: "林俊杰",
    url: "江南 - 林俊杰.flac",
    lyric: "江南 - 林俊杰.lrc",
  },
  {
    id: 7,
    name: "我害怕",
    artist: "薛之谦",
    url: "我害怕 - 薛之谦.flac",
    lyric: "我害怕 - 薛之谦.lrc",
  },
]);

const currentIndex = ref(0);
const playMode = ref<PlayMode>("order");
const isPlaying = ref(false);
const isBuffering = ref(false);
const currentTime = ref(0);
const duration = ref(0);
const volume = ref(0.7);
const lyricLines = ref<LyricLine[]>([]);
const activeLyricIndex = ref(0);
const lyricContainerRef = ref<HTMLElement | null>(null);

const audioRef = shallowRef<HTMLAudioElement | null>(null);

const currentTrack = computed(() => playlist.value[currentIndex.value]);

const resolveAssetUrl = (path: string) => new URL(`@/assets/${path}`, import.meta.url).href;

const formatTime = (value: number) => {
  if (!Number.isFinite(value)) return "00:00";
  const minutes = Math.floor(value / 60)
    .toString()
    .padStart(2, "0");
  const seconds = Math.floor(value % 60)
    .toString()
    .padStart(2, "0");
  return `${minutes}:${seconds}`;
};

const parseLyrics = (raw: string): LyricLine[] => {
  const lines = raw.split("\n");
  const result: LyricLine[] = [];
  const timeExp = /\[(\d{2}):(\d{2})(?:\.(\d{1,3}))?]/g;

  lines.forEach((line) => {
    const text = line.replace(timeExp, "").trim();
    let match: RegExpExecArray | null;
    while ((match = timeExp.exec(line))) {
      const [, mm, ss, ms] = match;
      const seconds = Number(mm) * 60 + Number(ss) + Number(ms || 0) / 1000;
      result.push({ time: seconds, content: text });
    }
  });

  return result
    .filter((item) => item.content)
    .sort((a, b) => a.time - b.time);
};

const loadLyrics = async (lyricName: string) => {
  lyricLines.value = [];
  activeLyricIndex.value = 0;
  try {
    const response = await fetch(resolveAssetUrl(`Lyrics/${lyricName}`));
    const content = await response.text();
    lyricLines.value = parseLyrics(content);
  } catch (error) {
    console.error("歌词加载失败", error);
  }
};

const scrollActiveLyricIntoView = async () => {
  await nextTick();
  const container = lyricContainerRef.value;
  if (!container) return;
  const active = container.querySelector<HTMLElement>(".lyric-line.active");
  active?.scrollIntoView({ behavior: "smooth", block: "center" });
};

const updateActiveLyric = (time: number) => {
  if (!lyricLines.value.length) return;
  for (let i = lyricLines.value.length - 1; i >= 0; i -= 1) {
    if (time >= lyricLines.value[i].time) {
      if (activeLyricIndex.value !== i) {
        activeLyricIndex.value = i;
        scrollActiveLyricIntoView();
      }
      break;
    }
  }
};

const handleEnded = () => {
  if (playMode.value === "loop") {
    if (audioRef.value) {
      audioRef.value.currentTime = 0;
      audioRef.value.play();
    }
    return;
  }
  if (playMode.value === "shuffle") {
    const nextIndex = Math.floor(Math.random() * playlist.value.length);
    currentIndex.value = nextIndex;
    loadTrack(true);
    return;
  }
  handleNext();
};

const handleTimeUpdate = () => {
  if (!audioRef.value) return;
  currentTime.value = audioRef.value.currentTime;
  updateActiveLyric(currentTime.value);
};

const handleWaiting = () => {
  isBuffering.value = true;
};

const handlePlaying = () => {
  isBuffering.value = false;
};

const loadTrack = async (shouldAutoPlay = false) => {
  const audio = audioRef.value;
  if (!audio || !currentTrack.value) return;
  isBuffering.value = true;
  audio.src = resolveAssetUrl(`Music/${currentTrack.value.url}`);
  currentTime.value = 0;
  duration.value = 0;
  try {
    await loadLyrics(currentTrack.value.lyric);
    audio.load();
    if (isPlaying.value || shouldAutoPlay) {
      await audio.play();
      isPlaying.value = true;
    }
  } catch (error) {
    console.error("音频加载失败", error);
  } finally {
    isBuffering.value = false;
  }
};

const togglePlay = async () => {
  const audio = audioRef.value;
  if (!audio) return;
  if (isPlaying.value) {
    audio.pause();
    isPlaying.value = false;
    return;
  }
  try {
    await audio.play();
    isPlaying.value = true;
  } catch (error) {
    console.error("播放失败", error);
  }
};

const handleProgressChange = (value: number) => {
  const audio = audioRef.value;
  if (!audio || !duration.value) return;
  const newTime = (value / 100) * duration.value;
  audio.currentTime = newTime;
  currentTime.value = newTime;
  updateActiveLyric(newTime);
};

const handleVolumeChange = (value: number) => {
  volume.value = value;
};

const handleNext = () => {
  if (currentIndex.value === playlist.value.length - 1) {
    currentIndex.value = 0;
  } else {
    currentIndex.value += 1;
  }
  loadTrack(isPlaying.value);
};

const handlePrev = () => {
  if (currentIndex.value === 0) {
    currentIndex.value = playlist.value.length - 1;
  } else {
    currentIndex.value -= 1;
  }
  loadTrack(isPlaying.value);
};

const handleSelectTrack = (index: number) => {
  currentIndex.value = index;
  loadTrack(true);
};

const togglePlayMode = () => {
  if (playMode.value === "order") {
    playMode.value = "loop";
  } else if (playMode.value === "loop") {
    playMode.value = "shuffle";
  } else {
    playMode.value = "order";
  }
};

const modeLabel = computed(() => {
  if (playMode.value === "loop") return "单曲循环";
  if (playMode.value === "shuffle") return "随机播放";
  return "列表循环";
});

const progress = computed(() => {
  if (!duration.value) return 0;
  return (currentTime.value / duration.value) * 100;
});

const accentColor = computed(() => {
  const palette = ["#7C6FF6", "#FF8FB1", "#00C9A7", "#68A8FF", "#FFB347"];
  const index = currentTrack.value ? currentTrack.value.id % palette.length : 0;
  return palette[index];
});

const getInitials = computed(() => {
  const text = currentTrack.value?.name || "";
  return text.slice(0, 2) || "♪";
});

watch(volume, (val) => {
  if (audioRef.value) {
    audioRef.value.volume = val;
  }
});

watch(currentTrack, () => {
  loadTrack(false);
});

onMounted(() => {
  const audio = new Audio();
  audio.preload = "metadata";
  audio.volume = volume.value;
  audioRef.value = audio;

  audio.addEventListener("loadedmetadata", () => {
    duration.value = audio.duration;
  });
  audio.addEventListener("timeupdate", handleTimeUpdate);
  audio.addEventListener("ended", handleEnded);
  audio.addEventListener("waiting", handleWaiting);
  audio.addEventListener("playing", handlePlaying);

  loadTrack();
});

onBeforeUnmount(() => {
  const audio = audioRef.value;
  if (!audio) return;
  audio.pause();
  audio.src = "";
  audio.removeEventListener("timeupdate", handleTimeUpdate);
  audio.removeEventListener("ended", handleEnded);
  audio.removeEventListener("waiting", handleWaiting);
  audio.removeEventListener("playing", handlePlaying);
});
</script>

<template>
  <div class="music-player" :style="{ '--accent-color': accentColor }">
    <div class="player-card">
      <div class="player-header">
        <div class="title-group">
          <span class="eyebrow">Meow Memoirs</span>
          <h2>旋律工坊</h2>
          <p>全功能音乐播放器，支持歌词同步与播放模式切换</p>
        </div>
        <div class="mode-chip" @click="togglePlayMode">
          <span class="dot" />
          <span>{{ modeLabel }}</span>
        </div>
      </div>

      <div class="player-body">
        <div class="album-visual">
          <div class="vinyl" :style="{ background: `radial-gradient(circle at 30% 30%, ${accentColor}33, #101018)` }">
            <div class="vinyl-inner">
              <div class="vinyl-label">
                <span>{{ getInitials }}</span>
              </div>
            </div>
          </div>
          <div class="track-info">
            <div class="pill">高保真</div>
            <h3 class="track-title">{{ currentTrack?.name }}</h3>
            <p class="track-artist">{{ currentTrack?.artist }}</p>
            <div class="meta-row">
              <span class="badge">{{ playlist.length }} 首歌曲</span>
              <span class="badge outline">{{ modeLabel }}</span>
            </div>
          </div>
        </div>

        <div class="controls-panel">
          <div class="time-row">
            <span>{{ formatTime(currentTime) }}</span>
            <div class="progress-wrapper">
              <input
                type="range"
                min="0"
                max="100"
                step="0.1"
                :value="progress"
                @input="handleProgressChange(($event.target as HTMLInputElement).valueAsNumber)"
              />
              <div class="buffering" v-if="isBuffering">缓冲中...</div>
            </div>
            <span>{{ formatTime(duration) }}</span>
          </div>

          <div class="playback-row">
            <button class="circle ghost" aria-label="previous" @click="handlePrev">
              ‹
            </button>
            <button class="circle primary" aria-label="toggle play" @click="togglePlay">
              {{ isPlaying ? "暂停" : "播放" }}
            </button>
            <button class="circle ghost" aria-label="next" @click="handleNext">
              ›
            </button>
          </div>

          <div class="bottom-row">
            <div class="volume">
              <span>音量</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                :value="volume"
                @input="handleVolumeChange(($event.target as HTMLInputElement).valueAsNumber)"
              />
            </div>
            <div class="mode" @click="togglePlayMode">
              <span class="mode-title">播放模式</span>
              <strong>{{ modeLabel }}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="lyric-playlist">
      <div class="lyric-card">
        <div class="card-header">
          <h4>歌词</h4>
          <span class="sub">自动同步滚动</span>
        </div>
        <div class="lyric-content" ref="lyricContainerRef">
          <template v-if="lyricLines.length">
            <div
              v-for="(line, index) in lyricLines"
              :key="`${line.time}-${line.content}`"
              class="lyric-line"
              :class="{ active: index === activeLyricIndex }"
            >
              <span>{{ line.content }}</span>
            </div>
          </template>
          <div v-else class="empty">暂无歌词或歌词加载中...</div>
        </div>
      </div>

      <div class="playlist-card">
        <div class="card-header">
          <h4>播放列表</h4>
          <span class="sub">点击切换歌曲</span>
        </div>
        <div class="playlist">
          <div
            v-for="(item, index) in playlist"
            :key="item.id"
            class="playlist-item"
            :class="{ active: index === currentIndex }"
            @click="handleSelectTrack(index)"
          >
            <div class="info">
              <p class="name">{{ item.name }}</p>
              <p class="artist">{{ item.artist }}</p>
            </div>
            <div class="pill small" v-if="index === currentIndex">正在播放</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.music-player {
  display: grid;
  gap: 20px;
  grid-template-columns: 1.4fr 1fr;
  height: calc(100% - 40px);
  padding: 10px;
  color: #f3f4f8;
  background: radial-gradient(circle at 10% 20%, #2b2a3f, #121223 40%, #0b0b14);
  --accent-color: #7c6ff6;

  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
    height: auto;
  }
}

.player-card {
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0.02));
  border-radius: 24px;
  padding: 24px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.35);
  backdrop-filter: blur(12px);
}

.player-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.title-group h2 {
  margin: 4px 0 8px;
  font-size: 26px;
  letter-spacing: 0.5px;
}

.title-group p {
  margin: 0;
  color: #d7d9e0;
  opacity: 0.8;
}

.eyebrow {
  font-size: 12px;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: var(--accent-color);
}

.mode-chip {
  display: inline-flex;
  gap: 8px;
  align-items: center;
  background: rgba(255, 255, 255, 0.08);
  padding: 8px 14px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    background: rgba(255, 255, 255, 0.12);
  }
}

.mode-chip .dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--accent-color);
  box-shadow: 0 0 0 6px color-mix(in srgb, var(--accent-color) 25%, transparent);
}

.player-body {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 24px;
  margin-top: 20px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
}

.album-visual {
  display: flex;
  gap: 20px;
  align-items: center;
  background: linear-gradient(160deg, rgba(255, 255, 255, 0.04), rgba(255, 255, 255, 0.01));
  padding: 16px;
  border-radius: 18px;
  border: 1px solid rgba(255, 255, 255, 0.06);
}

.vinyl {
  width: 180px;
  height: 180px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: #101018;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.45), inset 0 0 0 12px rgba(255, 255, 255, 0.02);
  position: relative;
  overflow: hidden;

  &::after {
    content: "";
    position: absolute;
    inset: 12px;
    border-radius: 50%;
    border: 1px dashed rgba(255, 255, 255, 0.1);
  }
}

.vinyl-inner {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: radial-gradient(circle at 50% 45%, #fff 0%, #dcdce0 40%, #3c3c3e 75%);
  display: grid;
  place-items: center;
  box-shadow: inset 0 10px 20px rgba(0, 0, 0, 0.25);
}

.vinyl-label {
  width: 78px;
  height: 78px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--accent-color), color-mix(in srgb, var(--accent-color) 60%, #ffffff));
  display: grid;
  place-items: center;
  color: #0c0c16;
  font-weight: 700;
  letter-spacing: 1px;
  box-shadow: inset 0 0 0 8px rgba(255, 255, 255, 0.3);
}

.track-info {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.track-title {
  margin: 0;
  font-size: 22px;
  font-weight: 700;
}

.track-artist {
  margin: 0;
  color: #cdd1db;
}

.meta-row {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
  background: rgba(255, 255, 255, 0.12);
  color: #f3f4f8;
}

.pill.small {
  padding: 2px 8px;
  font-size: 11px;
}

.badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.badge.outline {
  background: rgba(255, 255, 255, 0.04);
  border-color: rgba(255, 255, 255, 0.12);
}

.controls-panel {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 16px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.time-row,
.playback-row,
.bottom-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.time-row {
  color: #d5d7df;
}

.progress-wrapper {
  flex: 1;
  position: relative;
}

input[type="range"] {
  width: 100%;
  -webkit-appearance: none;
  appearance: none;
  height: 6px;
  border-radius: 10px;
  background: linear-gradient(90deg, var(--accent-color), color-mix(in srgb, var(--accent-color) 70%, #ffffff));
  outline: none;
  cursor: pointer;
}

input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #fff;
  border: 3px solid var(--accent-color);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.25);
}

.buffering {
  position: absolute;
  top: -22px;
  right: 0;
  font-size: 12px;
  color: #ffb347;
}

.playback-row {
  justify-content: center;
}

.circle {
  width: 54px;
  height: 54px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.25);
  background: rgba(255, 255, 255, 0.06);
  color: #fff;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 16px;
  font-weight: 700;
  display: grid;
  place-items: center;

  &:hover {
    transform: translateY(-2px);
    border-color: rgba(255, 255, 255, 0.5);
  }
}

.circle.primary {
  width: 74px;
  height: 74px;
  background: linear-gradient(135deg, var(--accent-color), color-mix(in srgb, var(--accent-color) 70%, #ffffff));
  color: #0d0d16;
  border: none;
  box-shadow: 0 12px 35px color-mix(in srgb, var(--accent-color) 60%, transparent);
}

.circle.ghost {
  background: transparent;
}

.bottom-row {
  justify-content: space-between;
  flex-wrap: wrap;
}

.volume {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 220px;
}

.volume span {
  width: 36px;
  color: #d6dae6;
}

.mode {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
  cursor: pointer;
  padding: 10px 12px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.04);
}

.mode-title {
  color: #cfd3dd;
  font-size: 12px;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

.lyric-playlist {
  display: grid;
  gap: 16px;
  grid-template-rows: 1fr 1fr;

  @media (max-width: 1200px) {
    grid-template-rows: auto auto;
  }
}

.lyric-card,
.playlist-card {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 18px;
  padding: 16px;
  box-shadow: 0 18px 44px rgba(0, 0, 0, 0.28);
  backdrop-filter: blur(8px);
  min-height: 260px;
}

.card-header {
  display: flex;
  align-items: baseline;
  gap: 10px;
  margin-bottom: 12px;
}

.card-header h4 {
  margin: 0;
  font-size: 18px;
}

.card-header .sub {
  color: #cdd0d8;
  font-size: 12px;
}

.lyric-content {
  max-height: 360px;
  overflow: auto;
  padding-right: 6px;
  scrollbar-width: thin;
}

.lyric-line {
  padding: 8px 10px;
  color: #cdd0d8;
  border-radius: 12px;
  transition: all 0.2s ease;
}

.lyric-line.active {
  background: rgba(255, 255, 255, 0.08);
  color: #fff;
  font-weight: 600;
  transform: scale(1.01);
  border: 1px solid color-mix(in srgb, var(--accent-color) 60%, transparent);
}

.empty {
  color: #aeb3c1;
  text-align: center;
  padding: 20px 0;
}

.playlist {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.playlist-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.04);
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: rgba(255, 255, 255, 0.1);
    transform: translateY(-1px);
  }
}

.playlist-item.active {
  border-color: color-mix(in srgb, var(--accent-color) 60%, transparent);
  background: rgba(255, 255, 255, 0.06);
}

.playlist-item .name {
  margin: 0 0 4px;
  color: #fff;
  font-weight: 600;
}

.playlist-item .artist {
  margin: 0;
  color: #cdd0d8;
  font-size: 13px;
}

@media (max-width: 768px) {
  .player-card {
    padding: 18px;
  }

  .album-visual {
    flex-direction: column;
    text-align: center;
  }

  .track-info {
    align-items: center;
  }

  .controls-panel {
    gap: 12px;
  }

  .bottom-row {
    flex-direction: column;
    align-items: flex-start;
  }

  .mode {
    align-self: stretch;
    align-items: center;
  }

  .lyric-content {
    max-height: 240px;
  }
}
</style>
