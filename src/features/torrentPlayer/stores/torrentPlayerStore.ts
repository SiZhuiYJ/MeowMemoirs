// src/features/torrentPlayer/stores/torrentPlayerStore.ts
import { defineStore } from 'pinia'
import type { TorrentRuntimeState, ConsoleLogItem } from '../types'
import { MAX_CONSOLE_LOGS } from '../constants'

export const useTorrentPlayerStore = defineStore('torrentPlayer', {
  state: () => ({
    magnetUrl: '',
    runtime: {
      status: 'idle',
      progress: 0,
      downloadSpeed: 0,
      uploadSpeed: 0,
      downloaded: 0,
      uploaded: 0,
      numPeers: 0,
      errorMessage: undefined
    } as TorrentRuntimeState,
    consoleLogs: [] as ConsoleLogItem[]
  }),
  actions: {
    setMagnet(url: string) {
      this.magnetUrl = url.trim()
    },
    setRuntime(patch: Partial<TorrentRuntimeState>) {
      this.runtime = { ...this.runtime, ...patch }
    },
    resetRuntime() {
      this.runtime = {
        status: 'idle',
        progress: 0,
        downloadSpeed: 0,
        uploadSpeed: 0,
        downloaded: 0,
        uploaded: 0,
        numPeers: 0,
        errorMessage: undefined
      }
    },
    pushConsoleLog(log: ConsoleLogItem) {
      this.consoleLogs.push(log)
      if (this.consoleLogs.length > MAX_CONSOLE_LOGS) {
        this.consoleLogs.splice(0, this.consoleLogs.length - MAX_CONSOLE_LOGS)
      }
    },
    clearConsoleLogs() {
      this.consoleLogs = []
    }
  }
})