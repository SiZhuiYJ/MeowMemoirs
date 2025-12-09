// Public API for the music player feature

// Components
export { default as PlayerShell } from "./components/PlayerShell/PlayerShell.vue";

// Composables
export { useMusicPlayer } from "./composables/useMusicPlayer";
export { useLyrics } from "./composables/useLyrics";

// Stores
export { useMusicPlayerStore } from "./stores/musicPlayerStore";

// Constants
export { defaultPlaylist } from "./constants/playlist";

// Types
export type { Track, PlayMode, LyricLine, MusicPlayerState } from "./types/musicPlayer.types";

// Utils
export { parseLrc } from "./utils/lyrics";
