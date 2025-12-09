<script setup lang="ts">
import { Buffer } from "buffer";
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";

interface Track {
  id: number;
  name: string;
  artist: string;
  url: string;
  lyric: string;
  duration?: number;
}

interface LyricLine {
  time: number;
  text: string;
}

type PlayMode = "loop" | "single" | "shuffle";

const buildAssetUrl = (folder: "Musics" | "Lyrics", fileName: string) =>
  new URL(`../../../../assets/${folder}/${fileName}`, import.meta.url).href;

const playlist = ref<Track[]>([
  {
    id: 1,
    name: "我只能离开",
    artist: "颜人中",
    url: buildAssetUrl("Musics", "我只能离开 - 颜人中.flac"),
    lyric: buildAssetUrl("Lyrics", "我只能离开 - 颜人中.lrc"),
  },
  {
    id: 2,
    name: "Star Crossing Night (feat. GALI)",
    artist: "徐明浩; GALI",
    url: buildAssetUrl("Musics", "Star Crossing Night (feat. GALI) - 徐明浩; GALI.flac"),
    lyric: buildAssetUrl("Lyrics", "Star Crossing Night (feat. GALI) - 徐明浩,GALI.lrc"),
  },
  {
    id: 3,
    name: "Take My Hand",
    artist: "DAISHI DANCE; Cécile Corbel",
    url: buildAssetUrl("Musics", "Take My Hand - DAISHI DANCE; Cécile Corbel.flac"),
    lyric: buildAssetUrl("Lyrics", "Take My Hand - DAISHI DANCE,Cécile Corbel.lrc"),
  },
  {
    id: 4,
    name: "The King",
    artist: "Paper.MAN",
    url: buildAssetUrl("Musics", "The King - Paper.MAN.flac"),
    lyric: buildAssetUrl("Lyrics", "The King - Paper.MAN.lrc"),
  },
  {
    id: 5,
    name: "勾指起誓",
    artist: "洛天依Official",
    url: buildAssetUrl("Musics", "勾指起誓 - 洛天依Official; ilem.flac"),
    lyric: buildAssetUrl("Lyrics", "勾指起誓 - 洛天依Official,ilem.lrc"),
  },
  {
    id: 6,
    name: "江南",
    artist: "林俊杰",
    url: buildAssetUrl("Musics", "江南 - 林俊杰.flac"),
    lyric: buildAssetUrl("Lyrics", "江南 - 林俊杰.lrc"),
  },
  {
    id: 7,
    name: "我害怕",
    artist: "薛之谦",
    url: buildAssetUrl("Musics", "我害怕 - 薛之谦.flac"),
    lyric: buildAssetUrl("Lyrics", "我害怕 - 薛之谦.lrc"),
  },
]);

const audioRef = ref<HTMLAudioElement | null>(null);
const coverUrl = ref<string | null>(null);
const coverLoading = ref(false);
const coverCache = new Map<number, string>();

const currentIndex = ref(0);
const isPlaying = ref(false);
const isReady = ref(false);
const currentTime = ref(0);
const duration = ref(0);
const progress = ref(0);
const volume = ref(0.7);
const muted = ref(false);
const playMode = ref<PlayMode>("loop");
const lyrics = ref<LyricLine[]>([]);
const lyricLoading = ref(false);

function formatTime(value: number) {
  if (!value || Number.isNaN(value)) return "00:00";
  const minutes = Math.floor(value / 60)
    .toString()
    .padStart(2, "0");
  const seconds = Math.floor(value % 60)
    .toString()
    .padStart(2, "0");
  return `${minutes}:${seconds}`;
}

const currentTrack = computed(() => playlist.value[currentIndex.value]);

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

const activeLyricIndex = computed(() => {
  const time = currentTime.value;
  if (!lyrics.value.length) return -1;
  if (time < lyrics.value[0].time) return 0;
  const idx = lyrics.value.findIndex((line, index) => {
    const next = lyrics.value[index + 1];
    return line.time <= time && (!next || time < next.time);
  });
  return idx === -1 ? lyrics.value.length - 1 : idx;
});

const formattedCurrentTime = computed(() => formatTime(currentTime.value));
const formattedDuration = computed(() => formatTime(duration.value));

const VISIBLE_LYRIC_COUNT = 7;
const visibleLyrics = computed(() => {
  if (!lyrics.value.length) return [];
  const half = Math.floor(VISIBLE_LYRIC_COUNT / 2);
  let start = Math.max(activeLyricIndex.value - half, 0);
  if (start + VISIBLE_LYRIC_COUNT > lyrics.value.length) {
    start = Math.max(lyrics.value.length - VISIBLE_LYRIC_COUNT, 0);
  }
  const end = Math.min(start + VISIBLE_LYRIC_COUNT, lyrics.value.length);
  return lyrics.value.slice(start, end).map((line, idx) => ({
    ...line,
    idx: start + idx,
  }));
});

const parseLrc = (raw: string): LyricLine[] => {
  const lines = raw.split(/\r?\n/);
  const grouped = new Map<number, string[]>();
  const timeReg = /\[(\d{1,2}):(\d{1,2})(?:\.(\d{1,3}))?]/g;

  lines.forEach((line) => {
    const text = line.replace(timeReg, "").trim() || "♪";
    let match: RegExpExecArray | null;
    while ((match = timeReg.exec(line)) !== null) {
      const minutes = Number(match[1]);
      const seconds = Number(match[2]);
      const millis = Number(match[3] || 0);
      const time = Number((minutes * 60 + seconds + millis / 1000).toFixed(2));
      const bucket = grouped.get(time) || [];
      bucket.push(text);
      grouped.set(time, bucket);
    }
  });

  return Array.from(grouped.entries())
    .map(([time, texts]) => ({ time, text: texts.join(" / ") }))
    .sort((a, b) => a.time - b.time);
};

const loadLyrics = async () => {
  if (!currentTrack.value) return;
  lyricLoading.value = true;
  try {
    const res = await fetch(currentTrack.value.lyric);
    const text = await res.text();
    lyrics.value = parseLrc(text);
  } catch (error) {
    console.error("Lyric load error", error);
    lyrics.value = [];
  } finally {
    lyricLoading.value = false;
  }
};

const setProgressFromAudio = () => {
  const audio = audioRef.value;
  if (!audio) return;
  currentTime.value = audio.currentTime;
  duration.value = audio.duration || duration.value || 0;
  progress.value = duration.value ? (audio.currentTime / duration.value) * 100 : 0;
};

const onLoadedMetadata = () => {
  const audio = audioRef.value;
  if (!audio) return;
  duration.value = audio.duration;
  const track = currentTrack.value;
  if (track) {
    track.duration = audio.duration;
  }
  isReady.value = true;
};

const handleEnded = () => {
  if (playMode.value === "single") {
    restartCurrent();
    return;
  }
  if (playMode.value === "shuffle") {
    playRandom();
    return;
  }
  playNext();
};

const restartCurrent = async () => {
  const audio = audioRef.value;
  if (!audio) return;
  audio.currentTime = 0;
  await audio.play();
  isPlaying.value = true;
};

const playRandom = () => {
  if (playlist.value.length <= 1) {
    restartCurrent();
    return;
  }
  let next = currentIndex.value;
  while (next === currentIndex.value) {
    next = Math.floor(Math.random() * playlist.value.length);
  }
  playAt(next);
};

const handlePlay = () => {
  isPlaying.value = true;
};

const handlePause = () => {
  isPlaying.value = false;
};

const guessMime = (url: string) => {
  const lower = url.toLowerCase();
  if (lower.endsWith(".flac")) return "audio/flac";
  if (lower.endsWith(".mp3")) return "audio/mpeg";
  if (lower.endsWith(".wav")) return "audio/wav";
  return "audio/*";
};

const loadCover = async () => {
  (globalThis as any).Buffer = (globalThis as any).Buffer || Buffer;
  const track = currentTrack.value;
  if (!track) return;
  const cached = coverCache.get(track.id);
  if (cached) {
    coverUrl.value = cached;
    return;
  }
  coverUrl.value = null;
  coverLoading.value = true;
  try {
    const mm = await import("music-metadata-browser");
    const response = await fetch(track.url, {
      headers: { Range: "bytes=0-400000" },
    });
    const arrayBuffer = await response.arrayBuffer();
    const blob = new Blob([new Uint8Array(arrayBuffer)], { type: guessMime(track.url) });
    const metadata = await mm.parseBlob(blob);
    const picture = metadata.common.picture?.[0];
    if (picture) {
      const blob = new Blob([picture.data as any], { type: picture.format || "image/jpeg" });
      const objectUrl = URL.createObjectURL(blob);
      coverCache.set(track.id, objectUrl);
      coverUrl.value = objectUrl;
    }
  } catch (error) {
    console.warn("Cover parse failed", error);
    coverUrl.value = null;
  } finally {
    coverLoading.value = false;
  }
};

const attachAudioEvents = () => {
  const audio = audioRef.value;
  if (!audio) return;
  audio.addEventListener("timeupdate", setProgressFromAudio);
  audio.addEventListener("loadedmetadata", onLoadedMetadata);
  audio.addEventListener("ended", handleEnded);
  audio.addEventListener("play", handlePlay);
  audio.addEventListener("pause", handlePause);
  audio.addEventListener("error", () => {
    console.error("音频加载失败");
  });
};

const detachAudioEvents = () => {
  const audio = audioRef.value;
  if (!audio) return;
  audio.removeEventListener("timeupdate", setProgressFromAudio);
  audio.removeEventListener("loadedmetadata", onLoadedMetadata);
  audio.removeEventListener("ended", handleEnded);
  audio.removeEventListener("play", handlePlay);
  audio.removeEventListener("pause", handlePause);
};

const loadTrack = async (autoplay = false) => {
  const audio = audioRef.value;
  if (!audio || !currentTrack.value) return;
  isReady.value = false;
  isPlaying.value = false;
  currentTime.value = 0;
  progress.value = 0;
  duration.value = 0;
  audio.currentTime = 0;
  audio.src = currentTrack.value.url;
  audio.load();
  await loadLyrics();
  await loadCover();
  if (autoplay) {
    try {
      await audio.play();
      isPlaying.value = true;
    } catch (error) {
      isPlaying.value = false;
      console.error("音频播放被阻止", error);
    }
  }
};

const playAt = async (index: number) => {
  if (index < 0 || index >= playlist.value.length) return;
  currentIndex.value = index;
  await loadTrack(true);
};

const playPrev = () => {
  const prev = currentIndex.value - 1 < 0 ? playlist.value.length - 1 : currentIndex.value - 1;
  playAt(prev);
};

const playNext = () => {
  const next = currentIndex.value + 1 >= playlist.value.length ? 0 : currentIndex.value + 1;
  playAt(next);
};

const togglePlay = async () => {
  const audio = audioRef.value;
  if (!audio) return;
  if (!isReady.value) {
    await loadTrack(true);
    return;
  }
  if (isPlaying.value) {
    audio.pause();
    isPlaying.value = false;
  } else {
    try {
      await audio.play();
      isPlaying.value = true;
    } catch (error) {
      console.error("播放失败", error);
    }
  }
};

const seek = (value: number) => {
  const audio = audioRef.value;
  if (!audio || !duration.value) return;
  const nextTime = (value / 100) * duration.value;
  audio.currentTime = nextTime;
  currentTime.value = nextTime;
  progress.value = value;
};

const changeVolume = (value: number) => {
  const audio = audioRef.value;
  volume.value = value;
  if (!audio) return;
  audio.volume = value;
  if (muted.value && value > 0) {
    audio.muted = false;
    muted.value = false;
  }
};

const toggleMute = () => {
  const audio = audioRef.value;
  if (!audio) return;
  audio.muted = !audio.muted;
  muted.value = audio.muted;
};

const cycleMode = () => {
  const next: Record<PlayMode, PlayMode> = {
    loop: "single",
    single: "shuffle",
    shuffle: "loop",
  };
  playMode.value = next[playMode.value];
};

watch(activeLyricIndex, () => {
  // Only need to update reactive slice, no manual scroll required.
});

onMounted(() => {
  const audio = audioRef.value;
  if (!audio) return;
  audio.volume = volume.value;
  attachAudioEvents();
  loadTrack();
});

onBeforeUnmount(() => {
  detachAudioEvents();
  coverCache.forEach((url) => URL.revokeObjectURL(url));
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
          <div class="lyrics">
            <p v-if="!lyrics.length && !lyricLoading" class="empty">暂无歌词</p>
            <TransitionGroup name="lyric-fade" tag="div" class="lyrics-body">
              <p
                v-for="line in visibleLyrics"
                :key="`${line.time}-${line.idx}`"
                class="lyric-line"
                :data-active="activeLyricIndex === line.idx"
              >
                {{ line.text }}
              </p>
            </TransitionGroup>
          </div>
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
}

.player-hero {
  position: relative;
  border-radius: 24px;
  overflow: hidden;
  padding: clamp(1.25rem, 4vw, 2.5rem);
  backdrop-filter: blur(8px);
  isolation: isolate;

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

  @media (max-width: 1100px) {
    grid-template-columns: 1fr;
  }
}

.panel {
  padding: 1rem;
  min-height: 340px;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
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
  overflow: hidden;
  padding: 0.25rem 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.lyrics-body {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  max-height: 260px;
  overflow: hidden;
}

.lyric-line {
  margin: 0;
  padding: 0.5rem 0.75rem;
  border-radius: 12px;
  opacity: 0.7;
  transition: all 0.2s ease;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.lyric-line[data-active="true"] {
  background: rgba(255, 255, 255, 0.08);
  opacity: 1;
  color: #fff;
  font-weight: 700;
  transform: translateX(4px);
}

.lyric-fade-enter-active,
.lyric-fade-leave-active {
  transition: all 0.28s ease;
}
.lyric-fade-enter-from,
.lyric-fade-leave-to {
  opacity: 0;
  transform: translateY(8px) scale(0.98);
}

.empty {
  opacity: 0.6;
}

.playlist {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
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
}

.track:hover {
  border-color: rgba(255, 255, 255, 0.12);
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
