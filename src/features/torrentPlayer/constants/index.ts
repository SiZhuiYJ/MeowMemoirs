// src/features/torrentPlayer/constants/index.ts

// 浏览器可用的 WebRTC tracker 列表
export const DEFAULT_ANNOUNCE_LIST = [
  'wss://tracker.openwebtorrent.com',
  'wss://tracker.btorrent.xyz',
  'wss://tracker.fastcast.nz'
]

// 控制台最多保留日志条数
export const MAX_CONSOLE_LOGS = 500