// src/features/console-monitor/types/index.ts
export type ConsoleLevel = 'log' | 'info' | 'warn' | 'error' | 'runtime'

export interface ConsoleLogItem {
  id: number
  timestamp: string
  level: ConsoleLevel
  message: string
  raw?: unknown[]
}