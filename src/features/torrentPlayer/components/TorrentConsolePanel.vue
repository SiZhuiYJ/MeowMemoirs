
<!-- src/features/torrentPlayer/components/TorrentConsolePanel.vue -->
<template>
  <section class="tcp-root">
    <header class="tcp-header">
      <span class="tcp-title">运行日志</span>
      <div class="tcp-actions">
        <button class="tcp-chip" @click="filter = 'all'">全部</button>
        <button class="tcp-chip tcp-chip-warn" @click="filter = 'warn'">警告</button>
        <button class="tcp-chip tcp-chip-err" @click="filter = 'error'">错误</button>
        <button class="tcp-chip tcp-chip-err" @click="filter = 'runtime'">运行时</button>
        <button class="tcp-chip tcp-chip-clear" @click="clear">清空</button>
      </div>
    </header>

    <main ref="scrollRef" class="tcp-body">
      <p v-if="filteredLogs.length === 0" class="tcp-empty">
        暂无日志输出。
      </p>
      <ul v-else class="tcp-list">
        <li
          v-for="log in filteredLogs"
          :key="log.id"
          class="tcp-item"
          :data-level="log.level"
        >
          <div class="tcp-meta">
            <span class="tcp-time">{{ log.timestamp }}</span>
            <span class="tcp-tag" :data-level="log.level">
              {{ levelLabel(log.level) }}
            </span>
          </div>
          <pre class="tcp-msg">{{ log.message }}</pre>
        </li>
      </ul>
    </main>
  </section>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useTorrentPlayerStore } from '../stores/torrentPlayerStore'
import type { ConsoleLevel } from '../types'

const store = useTorrentPlayerStore()
const { consoleLogs } = storeToRefs(store)
const filter = ref<'all' | ConsoleLevel>('all')
const scrollRef = ref<HTMLElement | null>(null)

const filteredLogs = computed(() => {
  if (filter.value === 'all') return consoleLogs.value
  return consoleLogs.value.filter(l => l.level === filter.value)
})

const clear = () => {
  store.clearConsoleLogs()
}

const scrollToBottom = () => {
  const el = scrollRef.value
  if (!el) return
  el.scrollTop = el.scrollHeight
}

watch(
  () => filteredLogs.value.length,
  () => {
    scrollToBottom()
  }
)

const levelLabel = (level: ConsoleLevel) => {
  switch (level) {
    case 'log': return '日志'
    case 'info': return '信息'
    case 'warn': return '警告'
    case 'error': return '错误'
    case 'runtime': return '运行时'
  }
}
</script>

<style scoped>
.tcp-root {
  border-radius: 16px;
  background: rgba(15, 23, 42, 0.98);
  border: 1px solid rgba(148, 163, 184, 0.4);
  color: #e5e7eb;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  max-height: 60vh;
}

.tcp-header {
  padding: 8px 10px;
  border-bottom: 1px solid rgba(148, 163, 184, 0.3);
  display: flex;
  align-items: center;
  gap: 8px;
}

.tcp-title {
  font-size: 13px;
  font-weight: 600;
  flex: 1;
}

.tcp-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.tcp-chip {
  border: none;
  border-radius: 999px;
  padding: 2px 7px;
  font-size: 11px;
  background: rgba(30, 64, 175, 0.3);
  color: #e5e7eb;
}
.tcp-chip-warn {
  background: rgba(234, 179, 8, 0.25);
}
.tcp-chip-err {
  background: rgba(248, 113, 113, 0.25);
}
.tcp-chip-clear {
  background: rgba(148, 163, 184, 0.3);
}

.tcp-body {
  flex: 1;
  padding: 8px 10px 10px;
  overflow-y: auto;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Courier New', monospace;
  font-size: 12px;
}

.tcp-empty {
  color: #9ca3af;
  text-align: center;
}

.tcp-list {
  list-style: none;
  margin: 0;
  padding: 0;
}
.tcp-item {
  padding: 4px 0;
  border-bottom: 1px dashed rgba(51, 65, 85, 0.9);
}
.tcp-item:last-child {
  border-bottom: none;
}
.tcp-item[data-level='warn'] {
  border-left: 3px solid #fbbf24;
  padding-left: 6px;
}
.tcp-item[data-level='error'],
.tcp-item[data-level='runtime'] {
  border-left: 3px solid #f87171;
  padding-left: 6px;
}

.tcp-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2px;
}
.tcp-time {
  font-size: 11px;
  color: #9ca3af;
}
.tcp-tag {
  font-size: 11px;
  padding: 1px 6px;
  border-radius: 999px;
  background: rgba(31, 41, 55, 0.9);
}
.tcp-tag[data-level='warn'] {
  background: rgba(250, 204, 21, 0.3);
  color: #facc15;
}
.tcp-tag[data-level='error'] {
  background: rgba(248, 113, 113, 0.3);
  color: #f87171;
}
.tcp-tag[data-level='runtime'] {
  background: rgba(248, 113, 113, 0.4);
  color: #fecaca;
}

.tcp-msg {
  margin: 0;
  white-space: pre-wrap;
  word-break: break-word;
}
</style>