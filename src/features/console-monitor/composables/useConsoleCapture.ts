// src/features/console-monitor/composables/useConsoleCapture.ts
import { onBeforeUnmount } from 'vue'
import type { ConsoleLevel, ConsoleLogItem } from '../types'

let isPatched = false
let globalId = 1

const originalConsole: Partial<Record<ConsoleLevel, (...args: any[]) => void>> = {}

type Listener = (log: ConsoleLogItem) => void

const listeners = new Set<Listener>()

function formatArgs(args: unknown[]): string {
  return args
    .map((arg) => {
      if (typeof arg === 'string') return arg
      try {
        return JSON.stringify(arg, null, 2)
      } catch {
        return String(arg)
      }
    })
    .join(' ')
}

function emit(level: ConsoleLevel, args: unknown[]) {
  const log: ConsoleLogItem = {
    id: globalId++,
    timestamp: new Date().toLocaleTimeString(),
    level,
    message: formatArgs(args),
    raw: args
  }

  listeners.forEach((cb) => cb(log))
}

function patchConsole() {
  if (isPatched) return
  isPatched = true

  ;(['log', 'info', 'warn', 'error'] as ConsoleLevel[]).forEach((level) => {
    const anyConsole = console as any
    const original = anyConsole[level]?.bind(console)
    originalConsole[level] = original

    anyConsole[level] = (...args: unknown[]) => {
      emit(level, args)
      original?.(...args) // 保留原有行为
    }
  })

  // 运行时错误
  window.addEventListener('error', (event) => {
    emit('runtime', [`Uncaught Error: ${event.message} @ ${event.filename}:${event.lineno}:${event.colno}`])
  })

  window.addEventListener('unhandledrejection', (event) => {
    emit('runtime', ['Unhandled Promise Rejection:', event.reason])
  })
}

/**
 * 在组件中使用，用于接收所有控制台日志
 */
export function useConsoleCapture(onLog: Listener) {
  patchConsole()
  listeners.add(onLog)

  onBeforeUnmount(() => {
    listeners.delete(onLog)
  })
}