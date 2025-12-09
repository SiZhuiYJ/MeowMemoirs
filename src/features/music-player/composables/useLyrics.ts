import { ref } from "vue";
import { parseLrc } from "../utils/lyrics";
import type { LyricLine } from "../types/musicPlayer.types";

export const useLyrics = () => {
  const lines = ref<LyricLine[]>([]);
  const loading = ref(false);

  const load = async (lyricUrl?: string) => {
    if (!lyricUrl) {
      lines.value = [];
      return;
    }
    loading.value = true;
    try {
      const res = await fetch(lyricUrl);
      const text = await res.text();
      lines.value = parseLrc(text);
    } finally {
      loading.value = false;
    }
  };

  return {
    lines,
    loading,
    load,
  };
};
