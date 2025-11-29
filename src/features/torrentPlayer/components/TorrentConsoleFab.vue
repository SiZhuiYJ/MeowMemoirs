<!-- src/features/torrentPlayer/components/TorrentConsoleFab.vue -->
<template>
    <div>
        <!-- 浮动按钮 -->
        <button class="tcf-fab" type="button" @click="toggle">
            <span class="tcf-icon">☰</span>
            <span class="tcf-text">日志</span>
            <span v-if="unreadCount > 0" class="tcf-badge">
                {{ unreadCount > 99 ? "99+" : unreadCount }}
            </span>
        </button>

        <!-- 控制台面板 -->
        <transition name="tcf-slide">
            <div v-if="open" class="tcf-panel">
                <TorrentConsolePanel />
            </div>
        </transition>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { storeToRefs } from "pinia";
import { useTorrentPlayerStore } from "../stores/torrentPlayerStore";
import { useConsoleCapture } from "../composables/useConsoleCapture";
import TorrentConsolePanel from "./TorrentConsolePanel.vue";

const store = useTorrentPlayerStore();
const { consoleLogs } = storeToRefs(store);

const open = ref(false);
const lastSeenId = ref<number>(0);

// 使用控制台捕获（不需要回调，日志已经通过 appendLog 进 store 了）
useConsoleCapture();

const unreadCount = computed(() => {
    if (consoleLogs.value.length === 0) return 0;
    const latestId = consoleLogs.value[consoleLogs.value.length - 1]?.id ?? 0;
    if (open.value) {
        lastSeenId.value = latestId;
        return 0;
    }
    return consoleLogs.value.filter(l => l.id > lastSeenId.value).length;
});

const toggle = () => {
    open.value = !open.value;
    if (open.value && consoleLogs.value.length > 0) {
        lastSeenId.value = consoleLogs.value[consoleLogs.value.length - 1].id;
    }
};
</script>

<style scoped>
.tcf-fab {
    position: fixed;
    right: 16px;
    bottom: 16px;
    z-index: 9999;
    border-radius: 999px;
    border: none;
    padding: 8px 14px 8px 12px;
    background: rgba(15, 23, 42, 0.96);
    color: #e5e7eb;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 14px;
    box-shadow: 0 8px 20px rgba(15, 23, 42, 0.6);
}

.tcf-icon {
    font-size: 16px;
}
.tcf-text {
    white-space: nowrap;
}
.tcf-badge {
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

.tcf-panel {
    position: fixed;
    right: 16px;
    bottom: 56px;
    width: min(420px, 100vw - 24px);
    max-height: min(60vh, 420px);
    z-index: 9998;
}

/* 手机端：改为全宽贴底 */
@media (max-width: 768px) {
    .tcf-fab {
        right: 12px;
        bottom: 12px;
        padding: 10px 16px;
    }

    .tcf-panel {
        left: 0;
        right: 0;
        bottom: 0;
        width: 100vw;
        max-height: 55vh;
    }
}

/* 弹出动画 */
.tcf-slide-enter-active,
.tcf-slide-leave-active {
    transition:
        transform 0.18s ease-out,
        opacity 0.18s ease-out;
}
.tcf-slide-enter-from,
.tcf-slide-leave-to {
    transform: translateY(12px);
    opacity: 0;
}
</style>
