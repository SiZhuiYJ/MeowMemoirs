export type PlayMode = "loop" | "single" | "shuffle";

export interface Track {
  id: number;
  name: string;
  artist: string;
  url: string;
  lyric: string;
  duration?: number;
}

export interface LyricLine {
  time: number;
  text: string;
}

export interface MusicPlayerState {
  playlist: Track[];
  currentIndex: number;
  playMode: PlayMode;
}
