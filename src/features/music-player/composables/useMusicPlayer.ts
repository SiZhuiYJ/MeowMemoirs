import { computed } from "vue";
import { useMusicPlayerStore } from "../stores/musicPlayerStore";
import type { PlayMode, Track } from "../types/musicPlayer.types";

export const useMusicPlayer = () => {
  const store = useMusicPlayerStore();

  const playlist = computed(() => store.playlist);
  const currentTrack = computed(() => store.currentTrack);
  const currentIndex = computed(() => store.currentIndex);
  const playMode = computed(() => store.playMode);

  const setPlaylist = (tracks: Track[]) => store.setPlaylist(tracks);
  const setCurrentIndex = (index: number) => store.setCurrentIndex(index);
  const next = () => store.next();
  const prev = () => store.prev();
  const setPlayMode = (mode: PlayMode) => store.setPlayMode(mode);

  return {
    playlist,
    currentTrack,
    currentIndex,
    playMode,
    setPlaylist,
    setCurrentIndex,
    next,
    prev,
    setPlayMode,
  };
};
