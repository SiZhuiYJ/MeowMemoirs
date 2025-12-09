<!-- src/features/console-monitor/components/ConsoleMonitorWidget.vue -->
<template>
  <div>
    <!-- 浮动按钮 -->
    <button
      class="cm-fab"
      type="button"
      @click="togglePanel"
    >
      <span class="cm-fab-icon">☰</span>
      <span class="cm-fab-text">日志</span>
      <span v-if="unreadCount > 0" class="cm-fab-badge">
        {{ unreadCount > 99 ? '99+' : unreadCount }}
      </span>
    </button>

    <!-- 控制台面板 -->
    <transition name="cm-slide-up">
      <section v-if="isOpen" class="cm-panel">
        <header class="cm-panel-header">
          <div class="cm-panel-title">
            <strong>运行日志</strong>
            <small>（控制台输出 & 报错捕获）</small>
          </div>
          <div class="cm-panel-actions">
            <button type="button" class="cm-chip" @click="filterLevel = 'all'">
              全部
            </button>
            <button type="button" class="cm-chip cm-chip-warn" @click="filterLevel = 'warn'">
              警告
            </button>
            <button type="button" class="cm-chip cm-chip-error" @click="filterLevel = 'error'">
              错误
            </button>
            <button type="button" class="cm-chip cm-chip-error" @click="filterLevel = 'runtime'">
              运行时
            </button>
            <button type="button" class="cm-chip cm-chip-clear" @click="clearLogs">
              清空
            </button>
            <button type="button" class="cm-chip cm-chip-close" @click="togglePanel">
              关闭
            </button>
          </div>
        </header>

        <main ref="scrollRef" class="cm-panel-body">
          <p v-if="filteredLogs.length === 0" class="cm-empty">
            暂无日志输出。
          </p>

          <ul v-else class="cm-log-list">
            <li
              v-for="item in filteredLogs"
              :key="item.id"
              class="cm-log-item"
              :data-level="item.level"
            >
              <div class="cm-log-meta">
                <span class="cm-log-time">{{ item.timestamp }}</span>
                <span class="cm-log-tag" :data-level="item.level">
                  {{ levelText(item.level) }}
                </span>
              </div>
              <pre class="cm-log-message">{{ item.message }}</pre>
            </li>
          </ul>
        </main>
      </section>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import type { ConsoleLogItem, ConsoleLevel } from '../../console-monitor/types'
import { useConsoleCapture } from '../../console-monitor/composables/useConsoleCapture'

const isOpen = ref(false)
const logs = ref<ConsoleLogItem[]>([])
const unreadCount = ref(0)
const filterLevel = ref<'all' | ConsoleLevel>('all')
const scrollRef = ref<HTMLElement | null>(null)

const filteredLogs = computed(() => {
  if (filterLevel.value === 'all') return logs.value
  return logs.value.filter((l) => l.level === filterLevel.value)
})

function togglePanel() {
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    unreadCount.value = 0
    // 打开后自动滚到底部
    requestAnimationFrame(scrollToBottom)
  }
}

function clearLogs() {
  logs.value = []
  unreadCount.value = 0
}

function scrollToBottom() {
  const el = scrollRef.value
  if (!el) return
  el.scrollTop = el.scrollHeight
}

function levelText(level: ConsoleLevel): string {
  switch (level) {
    case 'log':
      return '日志'
    case 'info':
      return '信息'
    case 'warn':
      return '警告'
    case 'error':
      return '错误'
    case 'runtime':
      return '运行时'
    default:
      return level
  }
}

// 绑定捕获
useConsoleCapture((log) => {
  logs.value.push(log)
  // 控制最大条数，避免无限增长
  if (logs.value.length > 500) {
    logs.value = logs.value.slice(-500)
  }

  if (!isOpen.value) {
    unreadCount.value += 1
  } else {
    // 打开状态下自动滚动
    requestAnimationFrame(scrollToBottom)
  }
})

// 面板打开 / 日志变化时保持滚动到底部
watch(
  () => filteredLogs.value.length,
  () => {
    if (isOpen.value) {
      requestAnimationFrame(scrollToBottom)
    }
  }
)

onMounted(() => {
  // 组件初始化时就开始捕获，因此不用额外调用
})
</script>

<style scoped>
/* 浮动按钮 */
.cm-fab {
  position: fixed;
  right: 16px;
  bottom: 16px;
  z-index: 9999;
  border: none;
  border-radius: 999px;
  padding: 8px 14px 8px 12px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(15, 23, 42, 0.96);
  color: #e5e7eb;
  font-size: 14px;
  line-height: 1;
  box-shadow: 0 8px 20px rgba(15, 23, 42, 0.45);
}

/* 手机端按钮稍微大一点 */
@media (max-width: 768px) {
  .cm-fab {
    right: 12px;
    bottom: 12px;
    padding: 10px 16px;
  }
}

.cm-fab-icon {
  font-size: 16px;
}

.cm-fab-text {
  white-space: nowrap;
}

.cm-fab-badge {
  min-width: 18px;
  height: 18px;
  padding: 0 4px;
  border-radius: 999px;
  background: #ef4444;
  color: #fff;
  font-size: 11px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

/* 控制台面板 */
.cm-panel {
  position: fixed;
  right: 16px;
  bottom: 64px;
  width: min(420px, 100vw - 24px);
  max-height: min(60vh, 420px);
  background: rgba(15, 23, 42, 0.98);
  color: #e5e7eb;
  border-radius: 12px;
  box-shadow: 0 20px 40px rgba(15, 23, 42, 0.8);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  z-index: 9998;
}

/* 手机适配：改为全宽贴底 */
@media (max-width: 768px) {
  .cm-panel {
    right: 0;
    left: 0;
    bottom: 0;
    width: 100vw;
    max-height: 55vh;
    border-radius: 12px 12px 0 0;
  }
}

.cm-panel-header {
  padding: 10px 12px;
  border-bottom: 1px solid rgba(148, 163, 184, 0.35);
  display: flex;
  align-items: center;
  gap: 8px;
}

.cm-panel-title {
  display: flex;
  flex-direction: column;
  gap: 2px;
  font-size: 12px;
  flex: 1 1 auto;
}

.cm-panel-title strong {
  font-size: 14px;
}

.cm-panel-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 4px;
}

/* 小屏时标题和按钮换行显示更紧凑 */
@media (max-width: 480px) {
  .cm-panel-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .cm-panel-actions {
    width: 100%;
  }
}

.cm-panel-body {
  flex: 1 1 auto;
  padding: 8px 10px;
  overflow-y: auto;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
  font-size: 12px;
}

/* chip 按钮 */
.cm-chip {
  border: none;
  border-radius: 999px;
  padding: 3px 8px;
  font-size: 11px;
  background: rgba(30, 64, 175, 0.15);
  color: #e5e7eb;
}

.cm-chip-warn {
  background: rgba(234, 179, 8, 0.18);
}

.cm-chip-error {
  background: rgba(248, 113, 113, 0.18);
}

.cm-chip-clear {
  background: rgba(148, 163, 184, 0.2);
}

.cm-chip-close {
  background: rgba(15, 23, 42, 0.9);
}

/* 日志列表 */
.cm-log-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.cm-log-item {
  padding: 6px 4px 6px 0;
  border-bottom: 1px dashed rgba(51, 65, 85, 0.9);
}

.cm-log-item:last-child {
  border-bottom: none;
}

.cm-log-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 6px;
  margin-bottom: 2px;
}

.cm-log-time {
  font-size: 11px;
  color: #9ca3af;
}

.cm-log-tag {
  font-size: 11px;
  padding: 1px 6px;
  border-radius: 999px;
  background: rgba(31, 41, 55, 0.9);
}

.cm-log-tag[data-level='warn'] {
  background: rgba(234, 179, 8, 0.2);
  color: #fbbf24;
}

.cm-log-tag[data-level='error'] {
  background: rgba(248, 113, 113, 0.2);
  color: #f87171;
}

.cm-log-tag[data-level="runtime"] {
  background: rgba(248, 113, 113, 0.35);
  color: #fecaca;
}

.cm-log-message {
  margin: 0;
  white-space: pre-wrap;
  word-break: break-word;
  color: #e5e7eb;
}

/* 不同级别的左侧色条 */
.cm-log-item[data-level='warn'] {
  border-left: 3px solid #fbbf24;
  padding-left: 6px;
}

.cm-log-item[data-level='error'],
.cm-log-item[data-level='runtime'] {
  border-left: 3px solid #f87171;
  padding-left: 6px;
}

/* 空状态 */
.cm-empty {
  text-align: center;
  color: #9ca3af;
  margin: 12px 0;
}

/* 进出场动画 */
.cm-slide-up-enter-active,
.cm-slide-up-leave-active {
  transition: transform 0.18s ease-out, opacity 0.18s ease-out;
}
.cm-slide-up-enter-from,
.cm-slide-up-leave-to {
  transform: translateY(16px);
  opacity: 0;
}
</style>