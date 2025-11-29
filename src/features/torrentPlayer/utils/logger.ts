// src/features/torrentPlayer/utils/logger.ts
import type { ConsoleLevel } from '../types'
import { useTorrentPlayerStore } from '../stores/torrentPlayerStore'

let nextId = 1

export function appendLog(level: ConsoleLevel, message: string) {
  const store = useTorrentPlayerStore()
  const timestamp = new Date().toLocaleTimeString()

  store.pushConsoleLog({
    id: nextId++,
    timestamp,
    level,
    message
  })
}