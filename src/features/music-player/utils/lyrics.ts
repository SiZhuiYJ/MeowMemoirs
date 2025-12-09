import type { LyricLine } from "../types/musicPlayer.types";

export const parseLrc = (raw: string): LyricLine[] => {
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
