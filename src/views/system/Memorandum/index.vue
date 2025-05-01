<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue'
import TimeStatus from '@/components/Layout/TimeStatus.vue'
import screenfull from 'screenfull'
import { ElButton } from 'element-plus'


// 全屏状态
const isFullscreen = ref(false)
// 目标元素引用（默认整个页面）
const targetRef = ref<HTMLElement | null>(null)

// 切换全屏
const toggleFullscreen = (target?: HTMLElement | null) => {
    if (!screenfull.isEnabled) {
        alert('您的浏览器不支持全屏功能！')
        return
    }

    try {
        // 如果有指定目标且未全屏，则全屏指定元素
        if (target && !screenfull.isFullscreen) {
            screenfull.request(target)
        } else {
            screenfull.toggle()
        }
    } catch (error) {
        console.error('全屏操作失败:', error)
    }
}

// 监听全屏变化
const handleFullscreenChange = () => {
    isFullscreen.value = screenfull.isFullscreen
}

// 生命周期钩子
onMounted(() => {
    if (screenfull.isEnabled) {
        screenfull.on('change', handleFullscreenChange)
    }
})

onUnmounted(() => {
    if (screenfull.isEnabled) {
        screenfull.off('change', handleFullscreenChange)
        if (screenfull.isFullscreen) screenfull.exit()
    }
})
</script>

<template>
    <!-- <div> -->
    <!-- 全屏控制按钮 -->
    <!-- <el-button @click="toggleFullscreen()" :icon="isFullscreen ? 'CircleClose' : 'FullScreen'"
            :title="isFullscreen ? '退出全屏' : '全屏'" /> -->
    <!-- 指定组件全屏示例 -->
    <div ref="targetRef" class="custom-component">
        <!-- 你的组件内容 -->
        <TimeStatus />
        <!-- <slot /> -->
        <h1>需要全屏的区域</h1>
        <el-button @click="toggleFullscreen(targetRef)">
            切换该区域全屏
        </el-button>
    </div>
    <!-- </div> -->
</template>


<style scoped>
.custom-component {
    margin: 2px;
    padding: 2px;
    border: 1px solid #ebeef5;
}
</style>