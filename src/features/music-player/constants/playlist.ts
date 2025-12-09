import type { Track } from "../types/musicPlayer.types";

const buildAssetUrl = (folder: "Musics" | "Lyrics", fileName: string) =>
  new URL(`../../assets/${folder}/${fileName}`, import.meta.url).href;

// 基础播放列表清单；可在 store/composable 中复用
export const defaultPlaylist: Track[] = [
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
];
