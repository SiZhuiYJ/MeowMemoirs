import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { defaultPlaylist } from "../constants/playlist";
import type { MusicPlayerState, PlayMode, Track } from "../types/musicPlayer.types";

export const useMusicPlayerStore = defineStore("musicPlayer", () => {
  const playlist = ref<Track[]>([...defaultPlaylist]);
  const currentIndex = ref(0);
  const playMode = ref<PlayMode>("loop");

  const currentTrack = computed(() => playlist.value[currentIndex.value]);

  const setPlaylist = (tracks: Track[]) => {
    playlist.value = [...tracks];
    currentIndex.value = 0;
  };

  const setCurrentIndex = (index: number) => {
    if (index < 0 || index >= playlist.value.length) return;
    currentIndex.value = index;
  };

  const next = () => {
    const nextIndex =
      currentIndex.value + 1 >= playlist.value.length ? 0 : currentIndex.value + 1;
    currentIndex.value = nextIndex;
  };

  const prev = () => {
    const prevIndex =
      currentIndex.value - 1 < 0 ? playlist.value.length - 1 : currentIndex.value - 1;
    currentIndex.value = prevIndex;
  };

  const setPlayMode = (mode: PlayMode) => {
    playMode.value = mode;
  };

  const state = computed<MusicPlayerState>(() => ({
    playlist: playlist.value,
    currentIndex: currentIndex.value,
    playMode: playMode.value,
  }));

  return {
    playlist,
    currentIndex,
    playMode,
    currentTrack,
    state,
    setPlaylist,
    setCurrentIndex,
    next,
    prev,
    setPlayMode,
  };
});
