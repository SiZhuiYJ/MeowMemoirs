// src/features/torrentPlayer/composables/useConsoleCapture.ts
import { onBeforeUnmount } from 'vue'
import type { ConsoleLevel } from '../types'
import { appendLog } from '../utils/logger'

type ConsoleListener = (level: ConsoleLevel, args: unknown[]) => void

const listeners = new Set<ConsoleListener>()
const originalConsole: Partial<Record<ConsoleLevel, (...args: unknown[]) => void>> = {}
let patched = false

// function formatArgs(args: unknown[]): string {
//   return args
//     .map(arg => {
//       if (typeof arg === 'string') return arg
//       try {
//         return JSON.stringify(arg)
//       } catch {
//         return String(arg)
//       }
//     })
//     .join(' ')
// }
// src/features/torrentPlayer/composables/useConsoleCapture.ts

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return Object.prototype.toString.call(value) === '[object Object]'
}

function formatArgs(args: unknown[]): string {
  return args
    .map((arg) => {
      if (arg == null) return String(arg) // null / undefined
      if (typeof arg === 'string' || typeof arg === 'number' || typeof arg === 'boolean') {
        return String(arg)
      }

      // Error 单独处理，方便看堆栈
      if (arg instanceof Error) {
        return arg.stack || arg.message
      }

      // 只对“纯对象”尝试 JSON.stringify，避免把 Vue 组件实例、Proxy、函数等搞进去
      if (isPlainObject(arg)) {
        try {
          return JSON.stringify(arg, null, 2)
        } catch {
          return '[object Object]'
        }
      }

      // 非纯对象（组件实例、函数、Map 等），统统走 toString，就不会触发枚举警告了
      return String(arg)
    })
    .join(' ')
}

function emit(level: ConsoleLevel, args: unknown[]) {
  const msg = formatArgs(args)
  appendLog(level, msg)
  listeners.forEach(fn => fn(level, args))
}

function patchConsoleOnce() {
  if (patched) return
  patched = true

  ;(['log', 'info', 'warn', 'error'] as ConsoleLevel[]).forEach(level => {
    const anyConsole = console as any
    const original = anyConsole[level]?.bind(console)
    originalConsole[level] = original

    anyConsole[level] = (...args: unknown[]) => {
      emit(level, args)
      original?.(...args)
    }
  })

  // 全局错误
  window.addEventListener('error', event => {
    emit('runtime', [`Uncaught Error: ${event.message} @ ${event.filename}:${event.lineno}:${event.colno}`])
  })

  window.addEventListener('unhandledrejection', event => {
    emit('runtime', ['Unhandled Rejection:', (event as PromiseRejectionEvent).reason])
  })

  appendLog('info', '控制台捕获已启用（console + 全局错误）。')
}

/**
 * 在任意组件里调用一次即可激活捕获逻辑
 */
export function useConsoleCapture(onLog?: ConsoleListener) {
  patchConsoleOnce()
  if (onLog) {
    listeners.add(onLog)
  }

  onBeforeUnmount(() => {
    if (onLog) listeners.delete(onLog)
  })
}