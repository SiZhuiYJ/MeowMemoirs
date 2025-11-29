// src/features/torrentPlayer/types/index.ts

export type TorrentStatus =
  | 'idle'
  | 'connecting'
  | 'downloading'
  | 'seeding'
  | 'stopped'
  | 'error'

export interface TorrentRuntimeState {
  status: TorrentStatus
  progress: number        // 0-1
  downloadSpeed: number   // bytes/s
  uploadSpeed: number     // bytes/s
  downloaded: number      // bytes
  uploaded: number        // bytes
  numPeers: number
  errorMessage?: string
}

export type ConsoleLevel = 'log' | 'info' | 'warn' | 'error' | 'runtime'

export interface ConsoleLogItem {
  id: number
  timestamp: string
  level: ConsoleLevel
  message: string
}