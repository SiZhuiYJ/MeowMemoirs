import { Buffer } from "buffer";
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { useStorage } from "@vueuse/core";

export interface Track {
    id: number;
    title: string;
    artist: string;
    album: string;
    artists: string[];
    url: string;
    lyric: string;
    duration?: number;
}

export interface LyricLine {
    time: number;
    text: string;
}

export type PlayMode = "loop" | "single" | "shuffle";

const buildAssetUrl = (folder: "Musics" | "Lyrics", fileName: string) =>
    new URL(`../../assets/${folder}/${fileName}`, import.meta.url).href;

const defaultPlaylist: Track[] = [
    {
        id: 1,
        title: "我只能离开",
        artist: "颜人中",
        artists: ["颜人中"],
        album: "我只能离开",
        url: buildAssetUrl("Musics", "我只能离开 - 颜人中.flac"),
        lyric: buildAssetUrl("Lyrics", "我只能离开 - 颜人中.lrc")
    },
    {
        id: 2,
        title: "Star Crossing Night (feat. GALI)",
        artist: "徐明浩; GALI",
        artists: ["徐明浩", "GALI"],
        album: "Star Crossing Night (feat. GALI)",
        url: buildAssetUrl("Musics", "Star Crossing Night (feat. GALI) - 徐明浩; GALI.flac"),
        lyric: buildAssetUrl("Lyrics", "Star Crossing Night (feat. GALI) - 徐明浩,GALI.lrc")
    },
    {
        id: 3,
        title: "Take My Hand",
        album: "Take My Hand",
        artist: "DAISHI DANCE; Cécile Corbel",
        artists: ["DAISHI DANCE", "Cécile Corbel"],
        url: buildAssetUrl("Musics", "Take My Hand - DAISHI DANCE; Cécile Corbel.flac"),
        lyric: buildAssetUrl("Lyrics", "Take My Hand - DAISHI DANCE,Cécile Corbel.lrc")
    },
    {
        id: 4,
        title: "The King",
        album: "The King",
        artist: "Paper.MAN",
        artists: ["Paper.MAN"],
        url: buildAssetUrl("Musics", "The King - Paper.MAN.flac"),
        lyric: buildAssetUrl("Lyrics", "The King - Paper.MAN.lrc")
    },
    {
        id: 5,
        title: "勾指起誓",
        album: "勾指起誓",
        artist: "洛天依Official; ilem",
        artists: ["洛天依Official", "ilem"],
        url: buildAssetUrl("Musics", "勾指起誓 - 洛天依Official; ilem.flac"),
        lyric: buildAssetUrl("Lyrics", "勾指起誓 - 洛天依Official,ilem.lrc")
    },
    {
        id: 6,
        title: "江南",
        album: "江南",
        artist: "林俊杰",
        artists: ["林俊杰"],
        url: buildAssetUrl("Musics", "江南 - 林俊杰.flac"),
        lyric: buildAssetUrl("Lyrics", "江南 - 林俊杰.lrc")
    },
    {
        id: 7,
        title: "我害怕",
        album: "我害怕",
        artist: "薛之谦",
        artists: ["薛之谦"],
        url: buildAssetUrl("Musics", "我害怕 - 薛之谦.flac"),
        lyric: buildAssetUrl("Lyrics", "我害怕 - 薛之谦.lrc")
    }
];

const formatTime = (value: number) => {
    if (!value || Number.isNaN(value)) return "00:00";
    const minutes = Math.floor(value / 60)
        .toString()
        .padStart(2, "0");
    const seconds = Math.floor(value % 60)
        .toString()
        .padStart(2, "0");
    return `${minutes}:${seconds}`;
};

export const parseLrc = (raw: string): LyricLine[] => {
    const lines = raw.split(/\r?\n/);
    const grouped = new Map<number, string[]>();
    const timeReg = /\[(\d{1,2}):(\d{1,2})(?:\.(\d{1,3}))?]/g;

    lines.forEach(line => {
        const text = line.replace(timeReg, "").trim() || "♪";
        let match: RegExpExecArray | null;
        while ((match = timeReg.exec(line)) !== null) {
            const minutes = Number(match[1]);
            const seconds = Number(match[2]);
            const millis = Number(match[3] || 0);
            const time = Number(
                (minutes * 60 + seconds + millis / 1000).toFixed(2)
            );
            const bucket = grouped.get(time) || [];
            bucket.push(text);
            grouped.set(time, bucket);
        }
    });
    return Array.from(grouped.entries())
        .map(([time, texts]) => ({ time, text: texts.join(" <br> ") }))
        .sort((a, b) => a.time - b.time);
};

export const useMusicPlayer = (audioRef: {
    value: HTMLAudioElement | null;
}) => {
    const playlist = useStorage<Track[]>("mm-player-playlist", defaultPlaylist);
    const playerState = useStorage("mm-player-state", {
        currentIndex: 0,
        time: 0,
        progress: 0,
        mode: "loop" as PlayMode,
        volume: 0.7,
        muted: false
    });
    const album = ref<string | null>(null);
    const title = ref<string | null>(null);
    const artist = ref<string | null>(null);
    const artists = ref<string[] | null>(null);

    const coverUrl = ref<string | null>(null);
    const coverLoading = ref(false);
    const coverCache = new Map<number, string>();
    const paletteCache = new Map<
        number,
        { primary: string; secondary: string; text: string }
    >();
    const dominantColor = ref<{
        primary: string;
        secondary: string;
        text: string;
    } | null>(null);

    const isPlaying = ref(false);
    const isReady = ref(false);
    const duration = ref(0);
    const currentTime = ref(playerState.value.time || 0);
    const lyrics = ref<LyricLine[]>([]);
    const lyricLoading = ref(false);

    const currentIndex = computed({
        get: () =>
            Math.min(
                playerState.value.currentIndex,
                Math.max(playlist.value.length - 1, 0)
            ),
        set: (value: number) => {
            playerState.value.currentIndex = value;
            playerState.value.time = 0;
            playerState.value.progress = 0;
            currentTime.value = 0;
        }
    });

    const playMode = computed({
        get: () => playerState.value.mode,
        set: (value: PlayMode) => {
            playerState.value.mode = value;
        }
    });

    const volume = computed({
        get: () => playerState.value.volume,
        set: (value: number) => {
            playerState.value.volume = value;
        }
    });

    const muted = computed({
        get: () => playerState.value.muted,
        set: (value: boolean) => {
            playerState.value.muted = value;
        }
    });

    const progress = computed({
        get: () => playerState.value.progress,
        set: (value: number) => {
            playerState.value.progress = value;
        }
    });

    const currentTrack = computed(() => playlist.value[currentIndex.value]);
    const formattedCurrentTime = computed(() => formatTime(currentTime.value));
    const formattedDuration = computed(() => formatTime(duration.value));

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

    const guessMime = (url: string) => {
        const lower = url.toLowerCase();
        if (lower.endsWith(".flac")) return "audio/flac";
        if (lower.endsWith(".mp3")) return "audio/mpeg";
        if (lower.endsWith(".wav")) return "audio/wav";
        return "audio/*";
    };

    const rgbToHex = (r: number, g: number, b: number) => {
        const toHex = (n: number) =>
            Math.max(0, Math.min(255, Math.round(n)))
                .toString(16)
                .padStart(2, "0");
        return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
    };

    const mixChannel = (value: number, target: number, weight: number) =>
        value * weight + target * (1 - weight);

    const extractPalette = async (url: string) => {
        const img = await new Promise<HTMLImageElement>((resolve, reject) => {
            const image = new Image();
            image.crossOrigin = "anonymous";
            image.onload = () => resolve(image);
            image.onerror = reject;
            image.src = url;
        });
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        if (!ctx) return null;
        const sampleSize = 64;
        const width = (canvas.width = Math.min(
            sampleSize,
            img.naturalWidth || img.width
        ));
        const height = (canvas.height = Math.min(
            sampleSize,
            img.naturalHeight || img.height
        ));
        ctx.drawImage(img, 0, 0, width, height);
        const data = ctx.getImageData(0, 0, width, height).data;
        let r = 0;
        let g = 0;
        let b = 0;
        let count = 0;
        for (let i = 0; i < data.length; i += 4) {
            const alpha = data[i + 3];
            if (alpha < 10) continue;
            r += data[i];
            g += data[i + 1];
            b += data[i + 2];
            count++;
        }
        if (!count) return null;
        const base = [r / count, g / count, b / count];

        const darkBaseRgb = [18, 36, 62];
        const mixWeight = 0.6;

        const primaryRgb = base.map((channel, i) =>
            mixChannel(
                mixChannel(channel, darkBaseRgb[i], mixWeight),
                0,
                0.9
            )
        );

        const secondaryRgb = base.map(channel =>
            mixChannel(channel, 255, 0.4)
        );

        const textHex = "#f8fafc";

        return {
            primary: rgbToHex(primaryRgb[0], primaryRgb[1], primaryRgb[2]),
            secondary: rgbToHex(
                secondaryRgb[0],
                secondaryRgb[1],
                secondaryRgb[2]
            ),
            text: textHex
        };
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

    const loadCover = async () => {
        (globalThis as any).Buffer = (globalThis as any).Buffer || Buffer;
        const track = currentTrack.value;
        if (!track) return;
        const cached = coverCache.get(track.id);
        if (cached) {
            coverUrl.value = cached;
            dominantColor.value = paletteCache.get(track.id) || null;
            return;
        }
        album.value = null;
        title.value = null;
        artist.value = null;
        artists.value = null;
        coverUrl.value = null;
        dominantColor.value = null;
        coverLoading.value = true;
        try {
            const mm = await import("music-metadata-browser");
            const response = await fetch(track.url, {
                headers: { Range: "bytes=0-400000" }
            });
            const arrayBuffer = await response.arrayBuffer();
            const blob = new Blob([new Uint8Array(arrayBuffer)], {
                type: guessMime(track.url)
            });
            const metadata = await mm.parseBlob(blob);
            const picture = metadata.common.picture?.[0];
            const data = metadata.common;

            if (data.title) title.value = data.title;
            if (data.artist) artist.value = data.artist;
            if (data.album) album.value = data.album;
            if (data.artists) artists.value = data.artists;
            if (picture) {
                const coverBlob = new Blob([picture.data as any], {
                    type: picture.format || "image/jpeg"
                });
                const objectUrl = URL.createObjectURL(coverBlob);
                coverCache.set(track.id, objectUrl);
                coverUrl.value = objectUrl;
                try {
                    const palette =
                        paletteCache.get(track.id) ||
                        (await extractPalette(objectUrl));
                    if (palette) {
                        paletteCache.set(track.id, palette);
                        dominantColor.value = palette;
                    }
                } catch (error) {
                    console.warn("Palette extract failed", error);
                }
            }
        } catch (error) {
            console.warn("Cover parse failed", error);
            album.value = null;
            title.value = null;
            artist.value = null;
            artists.value = null;
            coverUrl.value = null;
            dominantColor.value = null;
        } finally {
            coverLoading.value = false;
        }
    };

    const setProgressFromAudio = () => {
        const audio = audioRef.value;
        if (!audio) return;
        currentTime.value = audio.currentTime;
        duration.value = audio.duration || duration.value || 0;
        const nextProgress = duration.value
            ? (audio.currentTime / duration.value) * 100
            : 0;
        progress.value = nextProgress;
        playerState.value.time = audio.currentTime;
    };

    const onLoadedMetadata = () => {
        const audio = audioRef.value;
        if (!audio) return;
        duration.value = audio.duration;
        const track = currentTrack.value;
        if (track) {
            track.duration = audio.duration;
        }
        if (playerState.value.time && !Number.isNaN(playerState.value.time)) {
            audio.currentTime = playerState.value.time;
        }
        isReady.value = true;
    };

    const restartCurrent = async () => {
        const audio = audioRef.value;
        if (!audio) return;
        audio.currentTime = 0;
        playerState.value.time = 0;
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

    const handlePlay = () => {
        isPlaying.value = true;
    };

    const handlePause = () => {
        isPlaying.value = false;
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
        currentTime.value = playerState.value.time || 0;
        progress.value = playerState.value.progress || 0;
        duration.value = 0;
        audio.currentTime = currentTime.value || 0;
        audio.src = currentTrack.value.url;
        audio.load();
        title.value = currentTrack.value.title;
        artist.value = currentTrack.value.artist;
        album.value = currentTrack.value.album;
        artists.value = currentTrack.value.artists;
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
        playerState.value.time = 0;
        playerState.value.progress = 0;
        await loadTrack(true);
    };

    const playPrev = () => {
        const prev =
            currentIndex.value - 1 < 0
                ? playlist.value.length - 1
                : currentIndex.value - 1;
        playAt(prev);
    };

    const playNext = () => {
        const next =
            currentIndex.value + 1 >= playlist.value.length
                ? 0
                : currentIndex.value + 1;
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
        playerState.value.time = nextTime;
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
            shuffle: "loop"
        };
        playMode.value = next[playMode.value];
    };

    onMounted(() => {
        const audio = audioRef.value;
        if (!audio) return;
        audio.volume = volume.value;
        audio.muted = muted.value;
        attachAudioEvents();
        loadTrack();
    });

    onBeforeUnmount(() => {
        detachAudioEvents();
        coverCache.forEach(url => URL.revokeObjectURL(url));
    });

    return {
        playlist,
        album,
        title,
        artist,
        artists,
        coverUrl,
        coverLoading,
        dominantColor,
        isPlaying,
        isReady,
        currentTime,
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
        loadTrack,
        playAt,
        playPrev,
        playNext,
        togglePlay,
        seek,
        changeVolume,
        toggleMute,
        cycleMode,
        formatTime
    };
};
