import { onMounted, onUnmounted } from "vue";
import { useTorrentPlayerStore } from "../stores/torrentPlayerStore";
import { DEFAULT_ANNOUNCE_LIST } from "../constants";
import { appendLog } from "../utils/logger";

// ✅ 使用浏览器构建版本，避免 Node 依赖（events、net 等）
import WebTorrent from "webtorrent/dist/webtorrent.min.js";

// 模块级变量：保证全局只创建一个客户端
let client: any | null = null;
let currentTorrent: any | null = null;
let statsTimer: number | null = null;

function ensureClient() {
  if (!client) {
    client = new (WebTorrent as any)();
    appendLog("info", "WebTorrent 客户端已创建。");

    client.on("error", (err: Error) => {
      appendLog("error", `WebTorrent Client Error: ${err.message}`);
    });
  }
  return client;
}

function stopStatsLoop() {
  if (statsTimer != null) {
    clearInterval(statsTimer);
    statsTimer = null;
  }
}

function startStatsLoop(store: ReturnType<typeof useTorrentPlayerStore>) {
  stopStatsLoop();
  statsTimer = window.setInterval(() => {
    if (!currentTorrent) return;
    const t = currentTorrent;
    store.setRuntime({
      progress: t.progress || 0,
      downloadSpeed: t.downloadSpeed || 0,
      uploadSpeed: t.uploadSpeed || 0,
      downloaded: t.downloaded || 0,
      uploaded: t.uploaded || 0,
      numPeers: t.numPeers || 0,
    });
  }, 1000);
}

export function useTorrentClient() {
  const store = useTorrentPlayerStore();

  function stop() {
    stopStatsLoop();
    if (currentTorrent) {
      try {
        currentTorrent.destroy();
        appendLog("info", "当前种子已停止。");
      } catch (e) {
        appendLog("error", `停止种子时出错：${String(e)}`);
      }
      currentTorrent = null;
    }
    store.setRuntime({ status: "stopped" });
  }

  function loadMagnet(magnet: string) {
    const url = magnet.trim();
    if (!url) {
      appendLog("warn", "magnet 链接为空，请先输入。");
      return;
    }

    const c = ensureClient();
    if (!c) return;

    // 清理旧 torrent
    if (currentTorrent) {
      try {
        currentTorrent.destroy();
      } catch {
        /* ignore */
      }
      currentTorrent = null;
    }

    store.setMagnet(url);
    store.setRuntime({ status: "connecting", errorMessage: undefined });
    appendLog("info", `开始添加种子：${url}`);

    c.add(
      url,
      { announce: DEFAULT_ANNOUNCE_LIST },
      (torrent: any) => {
        currentTorrent = torrent;
        appendLog("info", `已获取种子信息：${torrent.infoHash}`);

        torrent.on("warning", (err: Error) => {
          appendLog("warn", `Torrent warning: ${err.message}`);
        });

        torrent.on("error", (err: Error) => {
          appendLog("error", `Torrent error: ${err.message}`);
          store.setRuntime({ status: "error", errorMessage: err.message });
        });

        torrent.on("noPeers", (type: string) => {
          appendLog("warn", `当前无 peers（announce: ${type}）`);
        });

        torrent.on("done", () => {
          appendLog("info", "下载完成，进入做种状态。");
          store.setRuntime({ status: "seeding", progress: 1 });
        });

        torrent.on("ready", () => {
          appendLog("info", `Metadata ready，文件数：${torrent.files.length}`);

          const file = torrent.files.find((f: any) =>
            /\.(mp4|mkv|webm|avi|mov)$/i.test(f.name)
          );

          if (!file) {
            appendLog("warn", "未在种子内找到视频文件。");
            store.setRuntime({
              status: "error",
              errorMessage: "种子内未找到视频文件",
            });
            return;
          }

          appendLog("info", `选择文件播放：${file.name}`);

          // 渲染到 <video id="torrent-video">
          file.renderTo("#torrent-video", { autoplay: true }, (err: unknown) => {
            if (err) {
              appendLog("error", "渲染视频失败：" + String(err));
              store.setRuntime({
                status: "error",
                errorMessage: String(err),
              });
            } else {
              appendLog("info", "视频已挂载到播放器。");
              store.setRuntime({ status: "downloading" });
            }
          });
        });

        startStatsLoop(store);
      }
    );
  }

  onMounted(() => {
    appendLog("info", "种子播放器已初始化，等待 magnet 链接。");
  });

  onUnmounted(() => {
    stop();
    stopStatsLoop();
    if (client) {
      try {
        client.destroy();
        appendLog("info", "WebTorrent 客户端已销毁。");
      } catch {
        /* ignore */
      }
      client = null;
    }
  });

  // ✅ 关键：这里确实返回 loadMagnet 和 stop，组件才能用
  return {
    loadMagnet,
    stop,
  };
}