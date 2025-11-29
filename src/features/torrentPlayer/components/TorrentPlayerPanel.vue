<!-- src/features/torrentPlayer/components/TorrentPlayerPanel.vue -->
<template>
  <section class="tp-root">
    <header class="tp-header">
      <div class="tp-title">
        <span class="tp-dot" />
        <span>种子播放器</span>
      </div>
      <div class="tp-status">
        <span class="tp-badge" :class="`tp-badge-${runtime.status}`">
          状态：{{ statusLabel }}
        </span>
        <span class="tp-badge">
          进度：{{ (runtime.progress * 100).toFixed(1) }}%
        </span>
        <span class="tp-badge">
          Peers：{{ runtime.numPeers }}
        </span>
      </div>
    </header>

    <div class="tp-input-row">
      <input
        v-model="magnet"
        class="tp-input"
        placeholder="粘贴 magnet:?xt=... 链接"
      />
      <button class="tp-btn tp-btn-main" @click="handleLoad">加载</button>
      <button class="tp-btn tp-btn-ghost" @click="handleStop">停止</button>
    </div>

    <div class="tp-video-wrapper">
      <video
        id="torrent-video"
        class="tp-video"
        controls
        playsinline
      />
      <div
        v-if="runtime.status === 'idle'"
        class="tp-video-overlay"
      >
        <p>等待加载种子...</p>
      </div>
    </div>

    <footer class="tp-metrics">
      <div class="tp-metric">
        <span class="tp-metric-label">下载速度</span>
        <span>{{ formatSpeed(runtime.downloadSpeed) }}</span>
      </div>
      <div class="tp-metric">
        <span class="tp-metric-label">上传速度</span>
        <span>{{ formatSpeed(runtime.uploadSpeed) }}</span>
      </div>
      <div class="tp-metric">
        <span class="tp-metric-label">已下载</span>
        <span>{{ formatBytes(runtime.downloaded) }}</span>
      </div>
      <div class="tp-metric">
        <span class="tp-metric-label">已上传</span>
        <span>{{ formatBytes(runtime.uploaded) }}</span>
      </div>
    </footer>

    <p
      v-if="runtime.errorMessage"
      class="tp-error"
    >
      ⚠ {{ runtime.errorMessage }}
    </p>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { storeToRefs } from "pinia";
import { useTorrentPlayerStore } from "../stores/torrentPlayerStore";
import { useTorrentClient } from "../composables/useTorrentClient";

const store = useTorrentPlayerStore();
const { runtime, magnetUrl } = storeToRefs(store);

// ✅ 一定要接收的是 loadMagnet 和 stop
const { loadMagnet, stop } = useTorrentClient();

const magnet = ref(magnetUrl.value);

const statusLabel = computed(() => {
  switch (runtime.value.status) {
    case "idle":
      return "空闲";
    case "connecting":
      return "连接中";
    case "downloading":
      return "下载中";
    case "seeding":
      return "做种中";
    case "stopped":
      return "已停止";
    case "error":
      return "错误";
    default:
      return runtime.value.status;
  }
});

const handleLoad = () => {
  store.setMagnet(magnet.value);
  loadMagnet(magnet.value);
};

const handleStop = () => {
  stop();
};

const formatSpeed = (bytesPerSec: number) => {
  if (!bytesPerSec) return "0 KB/s";
  const kb = bytesPerSec / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB/s`;
  return `${(kb / 1024).toFixed(2)} MB/s`;
};

const formatBytes = (bytes: number) => {
  if (!bytes) return "0 B";
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  const mb = kb / 1024;
  if (mb < 1024) return `${mb.toFixed(2)} MB`;
  const gb = mb / 1024;
  return `${gb.toFixed(2)} GB`;
};
</script>

<style scoped>
.tp-root {
  border-radius: 20px;
  padding: 16px;
  background: radial-gradient(circle at top left, rgba(248, 250, 252, 0.04), rgba(15, 23, 42, 0.95));
  border: 1px solid rgba(148, 163, 184, 0.4);
  box-shadow: 0 20px 50px rgba(15, 23, 42, 0.85);
  display: flex;
  flex-direction: column;
  gap: 10px;
  color: #e5e7eb;
}

.tp-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
}

.tp-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
}
.tp-dot {
  width: 10px;
  height: 10px;
  border-radius: 999px;
  background: conic-gradient(from 180deg at 50% 50%, #38bdf8, #a855f7, #f97316, #38bdf8);
  box-shadow: 0 0 18px rgba(56, 189, 248, 0.9);
}

.tp-status {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.tp-badge {
  border-radius: 999px;
  padding: 3px 9px;
  font-size: 11px;
  background: rgba(15, 23, 42, 0.9);
  border: 1px solid rgba(148, 163, 184, 0.6);
}
.tp-badge-connecting {
  border-color: #38bdf8;
}
.tp-badge-downloading {
  border-color: #22c55e;
}
.tp-badge-seeding {
  border-color: #a855f7;
}
.tp-badge-error {
  border-color: #f97373;
}
.tp-badge-stopped {
  border-color: #9ca3af;
}

.tp-input-row {
  display: flex;
  gap: 8px;
}
.tp-input {
  flex: 1;
  border-radius: 999px;
  padding: 8px 14px;
  border: 1px solid rgba(148, 163, 184, 0.6);
  background: rgba(15, 23, 42, 0.7);
  color: #e5e7eb;
  font-size: 13px;
}
.tp-input::placeholder {
  color: #6b7280;
}
.tp-btn {
  border-radius: 999px;
  padding: 8px 14px;
  border: none;
  cursor: pointer;
  font-size: 13px;
}
.tp-btn-main {
  background: linear-gradient(135deg, #38bdf8, #6366f1);
  color: white;
}
.tp-btn-ghost {
  background: rgba(15, 23, 42, 0.7);
  color: #e5e7eb;
}

.tp-video-wrapper {
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid rgba(30, 64, 175, 0.7);
  background: radial-gradient(circle at top, #0f172a, #020617);
}
.tp-video {
  width: 100%;
  display: block;
  max-height: 340px;
}

.tp-video-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #9ca3af;
  font-size: 14px;
  pointer-events: none;
}

.tp-metrics {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 8px;
}
.tp-metric {
  background: rgba(15, 23, 42, 0.9);
  border-radius: 12px;
  padding: 6px 10px;
  border: 1px solid rgba(51, 65, 85, 0.9);
  font-size: 11px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.tp-metric-label {
  color: #9ca3af;
  font-size: 10px;
}

.tp-error {
  margin-top: 6px;
  font-size: 12px;
  color: #fecaca;
}

@media (max-width: 768px) {
  .tp-metrics {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>