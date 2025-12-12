<script setup lang="ts">
import { computed, ref } from "vue";
import LyricCarousel from "./LyricCarousel.vue";
import { useMusicPlayer } from "./useMusicPlayer";
import SvgIcon from "@/components/SvgIcons/index.vue";

const audioRef = ref<HTMLAudioElement | null>(null);

const {
    playlist,
    album,
    title,
    artists,
    coverUrl,
    coverLoading,
    dominantColor,
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
    formatTime
} = useMusicPlayer(audioRef);

const heroStyle = computed((): { [key: string]: string } | undefined => {
    const palette = dominantColor.value;
    if (!palette) return undefined;
    return {
        // Primary 和 Secondary 颜色现在经过优化
        "--hero-start": palette.primary,   // 新的深色基础色 (Primary)
        "--hero-end": palette.secondary,   // 新的亮色强调色 (Secondary)
        "--hero-text": palette.text,       // 固定的浅色文本
        "--accent-a": palette.secondary,   // 强调色 A (使用 Secondary)
        "--accent-b": palette.primary      // 强调色 B (使用 Primary)
    };
});

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
        <section class="player-hero" :style="heroStyle">
            <div class="glow"></div>
            <div class="hero-main">
                <div class="vinyl-wrap">
                    <div
                        class="vinyl"
                        :class="{ spinning: isPlaying }"
                        :style="
                            coverUrl
                                ? { '--cover-url': `url(${coverUrl})` }
                                : undefined
                        "
                    >
                        <div v-if="coverLoading" class="cover-loading">
                            封面解析中...
                        </div>
                    </div>
                </div>
                <div class="hero-text">
                    <p class="eyebrow">Meow Memoirs · Music Lab</p>
                    <h1 class="title">
                        {{ title || "--" }}
                    </h1>
                    <p class="subtitle">
                        {{ artists ? artists.join("/") : "--" }}·{{
                            album || "--"
                        }}
                    </p>
                    <div class="chips">
                        <span class="chip">{{ modeLabel }}</span>
                        <span class="chip muted" v-if="muted">静音</span>
                        <span class="chip" v-if="currentTrack?.duration">
                            时长
                            {{ formatTime(currentTrack.duration || duration) }}
                        </span>
                    </div>
                </div>
                <LyricCarousel
                    :lines="lyrics"
                    :active-index="activeLyricIndex"
                    :loading="lyricLoading"
                    style="height: 100%"
                    class="lyric-area"
                />

                <div class="controls-card">
                    <div class="glass">
                        <div class="timeline">
                            <span class="time">{{ formattedCurrentTime }}</span>
                            <input
                                class="slider"
                                type="range"
                                min="0"
                                max="100"
                                step="0.1"
                                :value="progress"
                                :style="{ '--slider-progress': `${progress}%` }"
                                @input="
                                    e =>
                                        seek(
                                            Number(
                                                (e.target as HTMLInputElement)
                                                    .value
                                            )
                                        )
                                "
                            />
                            <span class="time">{{ formattedDuration }}</span>
                        </div>
                        <div class="controls">
                            <div class="settings-btn">
                                <button class="ghost" title="热度">
                                    <svg-icon
                                        icon-class="chart-bar"
                                        size="24px"
                                        style="color: var(--hero-text)"
                                    />
                                </button>
                                <button class="ghost" title="关注">
                                    <svg-icon
                                        icon-class="follow-grayscale"
                                        size="24px"
                                        style="color: var(--hero-text)"
                                    />
                                </button>
                                <button class="ghost" title="下载">
                                    <svg-icon
                                        icon-class="download"
                                        size="24px"
                                        style="color: var(--hero-text)"
                                    />
                                </button>
                            </div>
                            <div class="controls-pyler">
                                <button
                                    class="ghost"
                                    :title="modeLabel"
                                    @click="cycleMode"
                                >
                                    <svg-icon
                                        v-if="playMode === 'loop'"
                                        icon-class="list-loop"
                                        size="24px"
                                        style="color: var(--hero-text)"
                                    />
                                    <svg-icon
                                        v-else-if="playMode === 'single'"
                                        icon-class="repeat-single"
                                        size="24px"
                                        style="color: var(--hero-text)"
                                    />
                                    <svg-icon
                                        v-else
                                        icon-class="random-loop"
                                        size="24px"
                                        style="color: var(--hero-text)"
                                    />
                                </button>

                                <button
                                    class="ghost"
                                    title="上一首"
                                    @click="playPrev"
                                >
                                    <svg-icon
                                        icon-class="previous"
                                        size="24px"
                                        style="color: var(--hero-text)"
                                    />
                                </button>

                                <button
                                    class="primary"
                                    title="播放/暂停"
                                    @click="togglePlay"
                                >
                                    <svg-icon
                                        :icon-class="
                                            !isPlaying ? 'play' : 'pause'
                                        "
                                        size="24px"
                                        style="color: var(--hero-text)"
                                    />
                                </button>

                                <button
                                    class="ghost"
                                    title="下一首"
                                    @click="playNext"
                                >
                                    <svg-icon
                                        icon-class="next"
                                        size="24px"
                                        style="color: var(--hero-text)"
                                    />
                                </button>

                                <button class="ghost" title="播放列表">
                                    <svg-icon
                                        icon-class="playlist-music"
                                        size="24px"
                                        style="color: var(--hero-text)"
                                    />
                                </button>
                            </div>
                            <div class="volume">
                                <button
                                    class="ghost"
                                    title="静音"
                                    @click="toggleMute"
                                >
                                    <svg-icon
                                        v-if="muted || volume === 0"
                                        icon-class="mute"
                                        size="24px"
                                        style="color: var(--hero-text)"
                                    />
                                    <svg-icon
                                        v-else-if="volume < 0.5"
                                        icon-class="alto"
                                        size="24px"
                                        style="color: var(--hero-text)"
                                    />
                                    <svg-icon
                                        v-else
                                        icon-class="great-sound"
                                        size="24px"
                                        style="color: var(--hero-text)"
                                    />
                                </button>
                                <input
                                    class="slider volume-slider"
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.01"
                                    :value="muted ? 0 : volume"
                                    :style="{
                                        '--slider-progress': `${
                                            (muted ? 0 : volume) * 100
                                        }%`
                                    }"
                                    @input="
                                        e =>
                                            changeVolume(
                                                Number(
                                                    (
                                                        e.target as HTMLInputElement
                                                    ).value
                                                )
                                            )
                                    "
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section class="player-panel">
            <div class="grid">
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
                                <p class="name">{{ track.title }}</p>
                                <p class="artist">{{ track.artist }}</p>
                            </div>
                            <div class="track-extra">
                                <span class="duration">
                                    {{
                                        track.duration
                                            ? formatTime(track.duration)
                                            : "..."
                                    }}
                                </span>
                                <span
                                    class="badge"
                                    v-if="currentIndex === index"
                                    >播放中</span
                                >
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
    --hero-start: rgba(99, 102, 241, 0.32);
    --hero-end: rgba(14, 165, 233, 0.32);
    --hero-text: #e8ecf1;
    --accent-a: #7c8bff;
    --accent-b: #ff7a9a;
    color: var(--hero-text);
    min-height: 100vh;
    box-sizing: border-box;
    min-width: 100vw;
    position: relative;
    overflow-x: hidden;
    /* 修复水平滚动条 */
    padding-bottom: 2rem;
    /* 确保 Panel 部分可见 */
}

@property --hero-start {
    syntax: "<color>";
    inherits: false;
    initial-value: #9b9c9b;
}

@property --hero-end {
    syntax: "<color>";
    inherits: false;
    initial-value: #e0e0df;
}

.player-hero {
    position: relative;
    // 桌面版尺寸
    height: calc(100vh - clamp(1.25rem, 4vw, 2.5rem) * 2);
    width: calc(100vw - clamp(1.25rem, 4vw, 2.5rem) * 2);
    overflow: hidden;
    padding: clamp(1.25rem, 4vw, 2.5rem);
    backdrop-filter: blur(8px);
    isolation: isolate;
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 25px 80px rgba(0, 0, 0, 0.3);
    background: linear-gradient(135deg, var(--hero-start), var(--hero-end));
    color: var(--hero-text);
    transition:
        --hero-start 0.4s ease-in-out,
        --hero-end 0.4s ease-in-out;

    @media (max-width: 768px) {
        width: 100vw;
        height: auto;
        border-radius: 0;
        padding: clamp(1rem, 4vw, 1.5rem);
    }
}

.player-hero .glow {
    position: absolute;
    inset: 0;
    pointer-events: none;
    background: radial-gradient(
            circle at 60% 20%,
            rgba(255, 255, 255, 0.16),
            transparent 45%
        ),
        radial-gradient(
            circle at 10% 80%,
            rgba(255, 255, 255, 0.12),
            transparent 40%
        );
    mix-blend-mode: screen;
    opacity: 0.9;
    z-index: 0;
}

.hero-main {
    display: grid;
    // 桌面布局：[320px 封面] [1fr 信息] [1.5fr 歌词]
    grid-template-columns: 320px 1fr 1.5fr;
    grid-template-rows: repeat(3, auto);
    gap: clamp(1.25rem, 2vw, 2.5rem);
    align-items: center;
    position: relative;
    z-index: 1;
    height: 100%;

    // Grid Area 定义 (默认桌面布局)
    grid-template-areas:
        ".        info   lyrics"
        "vinyl    info   lyrics"
        "controls controls lyrics";

    .vinyl-wrap {
        grid-area: vinyl;
        display: grid;
        place-items: center;
    }

    .hero-text {
        grid-area: info;
    }

    .lyric-area {
        grid-area: lyrics;
        height: 100%;
        overflow: hidden;
    }

    .controls-card {
        grid-area: controls;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        height: 100%;
    }

    // --- 屏幕宽度 < 1200px (平板布局) ---
    @media (max-width: 1200px) {
        // 布局变为 2 列：[封面] [信息], [控制] (全宽), [歌词] (全宽)
        grid-template-columns: 1fr 1fr;
        grid-template-rows: auto auto auto;

        grid-template-areas:
            "vinyl info"
            "controls controls"
            "lyrics lyrics";

        // 调整歌词区域高度，在小屏幕上不占满垂直空间
        .lyric-area {
            height: 300px !important;
            min-height: 200px;
        }
    }

    // --- 屏幕宽度 < 768px (手机布局) ---
    @media (max-width: 768px) {
        // 布局变为 1 列，全部垂直堆叠
        grid-template-columns: 1fr;
        grid-template-rows: auto auto auto auto;

        grid-template-areas:
            "vinyl"
            "info"
            "controls"
            "lyrics";

        text-align: center;
        gap: 1.5rem;

        // 确保封面居中
        .vinyl-wrap {
            display: flex;
            justify-content: center;
        }

        .hero-text {
            text-align: center;
        }

        .chips {
            justify-content: center;
        }

        // 歌词在移动端可以更小
        .lyric-area {
            height: 250px !important;
        }
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
    background: radial-gradient(
            circle,
            #0b0d13 45%,
            rgba(255, 255, 255, 0.08) 46%,
            #0b0d13 65%
        ),
        repeating-conic-gradient(
            from 0deg,
            rgba(255, 255, 255, 0.08) 0deg 2deg,
            transparent 2deg 4deg
        );
    display: grid;
    place-items: center;
    box-shadow:
        0 25px 60px rgba(0, 0, 0, 0.45),
        inset 0 0 35px rgba(0, 0, 0, 0.4);
    transition:
        transform 0.4s ease,
        box-shadow 0.4s ease;
    position: relative;
    overflow: hidden;

    &.spinning {
        animation: spin 14s linear infinite;
        box-shadow:
            0 25px 70px rgba(0, 0, 0, 0.55),
            inset 0 0 40px rgba(0, 0, 0, 0.5);
    }

    &:hover {
        transform: translateY(-4px);
    }

    @media (max-width: 768px) {
        width: min(220px, 70vw);
    }
}

.vinyl::after {
    content: "";
    position: absolute;
    inset: 18%;
    border-radius: 50%;
    background: var(
            --cover-url,
            radial-gradient(
                circle at 30% 30%,
                rgba(255, 255, 255, 0.15),
                rgba(0, 0, 0, 0.65)
            )
        )
        center/cover no-repeat;
    opacity: 0.92;
    mix-blend-mode: screen;
    box-shadow: inset 0 0 30px rgba(0, 0, 0, 0.5);
    transition: opacity 0.4s ease;
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
    background: radial-gradient(
            circle at 30% 30%,
            rgba(255, 255, 255, 0.15),
            rgba(0, 0, 0, 0.55)
        ),
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

    @media (max-width: 768px) {
        font-size: clamp(1.5rem, 8vw, 2.1rem);
    }
}

.hero-text .subtitle {
    margin: 0.4rem 0 0.6rem;
    color: var(--hero-end);
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
    color: var(--hero-text);
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
    padding: 0 clamp(1.25rem, 4vw, 2.5rem);

    @media (max-width: 768px) {
        padding: 0 clamp(1rem, 4vw, 1.5rem);
    }
}

.glass {
    padding: 1.2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 18px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.25);
    backdrop-filter: blur(14px);
}

.controls-card {
    display: flex;
    flex-direction: column;
    height: 100%;
    justify-content: flex-end;
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
    width: calc(100% - 43px);
    height: 6px;
    border-radius: 999px;
    // 默认背景（未填充部分）
    background: color-mix(in srgb, var(--hero-text) 22%, transparent);
    outline: none;
    margin: 0;
    display: block;
}

// ===============================================
// 1. 播放进度条 (timeline slider)
// ===============================================

.timeline .slider {
    // 使用单色 var(--hero-end)
    background:
        linear-gradient(90deg, var(--hero-end), var(--hero-end)) 0 0 /
            var(--slider-progress, 0%) 100% no-repeat,
        color-mix(in srgb, var(--hero-text) 22%, transparent);
    transition: background 0.2s ease;
}

.timeline .slider::-webkit-slider-runnable-track {
    height: 6px;
    border-radius: 999px;
    // 使用单色 var(--hero-end)
    background:
        linear-gradient(90deg, var(--hero-end), var(--hero-end)) 0 0 /
            var(--slider-progress, 0%) 100% no-repeat,
        color-mix(in srgb, var(--hero-text) 22%, transparent);
}

.timeline .slider::-moz-range-track {
    height: 6px;
    border-radius: 999px;
    // 使用单色 var(--hero-end)
    background:
        linear-gradient(90deg, var(--hero-end), var(--hero-end)) 0 0 /
            var(--slider-progress, 0%) 100% no-repeat,
        color-mix(in srgb, var(--hero-text) 22%, transparent);
}

.slider::-webkit-slider-thumb {
    appearance: none;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: #fff;
    border: 2px solid transparent;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
    opacity: 0;
    transform: scale(0.65);
    margin-top: -5px;
    transition:
        opacity 0.18s ease,
        transform 0.18s ease,
        border-color 0.18s ease,
        box-shadow 0.18s ease;
}

.slider::-moz-range-thumb {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: #fff;
    border: 2px solid transparent;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
    opacity: 0;
    transform: scale(0.65);
    margin-top: -5px;
    transition:
        opacity 0.18s ease,
        transform 0.18s ease,
        border-color 0.18s ease,
        box-shadow 0.18s ease;
}

.timeline:hover .slider::-webkit-slider-thumb,
.timeline .slider:active::-webkit-slider-thumb,
.timeline:focus-within .slider::-webkit-slider-thumb {
    opacity: 1;
    transform: scale(1);
    // 统一使用主题色作为边框和阴影
    border-color: var(--hero-end);
    box-shadow:
        0 6px 18px rgba(0, 0, 0, 0.35),
        0 0 0 4px color-mix(in srgb, var(--hero-end) 28%, transparent);
}

.timeline:hover .slider::-moz-range-thumb,
.timeline .slider:active::-moz-range-thumb,
.timeline:focus-within .slider::-moz-range-thumb {
    opacity: 1;
    transform: scale(1);
    // 统一使用主题色作为边框和阴影
    border-color: var(--hero-end);
    box-shadow:
        0 6px 18px rgba(0, 0, 0, 0.35),
        0 0 0 4px color-mix(in srgb, var(--hero-end) 28%, transparent);
}

// ===============================================
// 2. 音量进度条 (volume slider)
// ===============================================
.volume-slider::-webkit-slider-thumb {
    opacity: 0.9;
    transform: scale(0.9);
    // 统一使用主题色作为边框
    border-color: var(--hero-end);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.28);
}

.volume-slider::-moz-range-thumb {
    opacity: 0.9;
    transform: scale(0.9);
    // 统一使用主题色作为边框
    border-color: var(--hero-end);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.28);
}

.volume:hover .volume-slider::-webkit-slider-thumb,
.volume:focus-within .volume-slider::-webkit-slider-thumb {
    opacity: 1;
    transform: scale(1);
    // 统一使用主题色作为边框
    border-color: var(--hero-end);
}

.volume:hover .volume-slider::-moz-range-thumb,
.volume:focus-within .volume-slider::-moz-range-thumb {
    opacity: 1;
    transform: scale(1);
    // 统一使用主题色作为边框
    border-color: var(--hero-end);
}

.volume-slider {
    // 通用背景 (非伪元素)
    background:
        linear-gradient(90deg, var(--hero-end), var(--hero-end)) 0 0 /
            var(--slider-progress, 0%) 100% no-repeat,
        color-mix(in srgb, var(--hero-end) 22%, transparent);
    transition: background 0.2s ease;

    // Webkit 轨道
    &::-webkit-slider-runnable-track {
        height: 6px;
        border-radius: 999px;
        background:
            linear-gradient(90deg, var(--hero-end), var(--hero-end)) 0 0 /
                var(--slider-progress, 0%) 100% no-repeat,
            color-mix(in srgb, var(--hero-end) 22%, transparent);
    }

    // Moz 轨道
    &::-moz-range-track {
        height: 6px;
        border-radius: 999px;
        background:
            linear-gradient(90deg, var(--hero-end), var(--hero-end)) 0 0 /
                var(--slider-progress, 0%) 100% no-repeat,
            color-mix(in srgb, var(--hero-end) 22%, transparent);
    }
}

.controls {
    display: grid;
    // 桌面默认: 三等分 [设置] [播放器] [音量]
    grid-template-columns: 1fr 2fr 1fr;
    align-items: center;
    gap: 0.75rem;

    .settings-btn {
        grid-area: settings;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        gap: 0.75rem;
        flex-wrap: wrap;
    }

    .controls-pyler {
        grid-area: player;
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 0.75rem;
        flex-wrap: wrap;
    }

    .volume {
        grid-area: volume;
        display: flex;
        align-items: center;
        gap: 0.4rem;
        min-width: 180px;
        justify-content: flex-end;
    }

    // --- 手机布局 (max-width: 768px) ---
    @media (max-width: 768px) {
        // 布局变为 1 列，垂直堆叠
        grid-template-columns: 1fr;
        grid-template-areas:
            "player"
            "volume"
            "settings";
        gap: 1rem; // 增加间距

        .controls-pyler {
            justify-content: center;
            order: 1; // 主要播放控件排第一
        }

        .volume {
            min-width: unset;
            justify-content: center;
            padding: 0 1rem;
            order: 2; // 音量排第二
        }

        .settings-btn {
            justify-content: center;
            order: 3; // 设置按钮排最后
        }
    }

    // --- 手机按钮尺寸调整 (max-width: 480px) ---
    @media (max-width: 480px) {
        .primary {
            width: 54px;
            height: 54px;
        }

        .ghost {
            width: 38px;
            height: 38px;
        }
    }
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
    background: linear-gradient(135deg, var(--accent-a), var(--accent-b));
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35);
}

.primary:hover {
    transform: translateY(-2px) scale(1.02);
}

.grid {
    display: grid;
    // 桌面默认: 1.2fr [Playlist] 0.8fr [Panel Placeholder]
    grid-template-columns: 1.2fr 0.8fr;
    gap: 1rem;
    align-items: stretch;
    width: 100%;

    // --- 屏幕宽度 < 1100px (平板/手机) ---
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
    background: linear-gradient(
        160deg,
        rgba(255, 255, 255, 0.06),
        rgba(255, 255, 255, 0.02)
    );
    border: 1px solid rgba(255, 255, 255, 0.08);
    box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 0.05),
        0 16px 30px rgba(0, 0, 0, 0.22);
}

.panel-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.6rem;
    height: 50px;
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
    transition:
        transform 0.2s ease,
        box-shadow 0.25s ease,
        border-color 0.2s ease;
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
    background: linear-gradient(135deg, var(--accent-a), var(--accent-b));
    color: #0f1521;
    border-radius: 999px;
    font-weight: 700;
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
