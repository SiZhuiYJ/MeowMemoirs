<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'

const props = defineProps({
    columnWidth: { type: Number, default: 200 },
    gap: { type: Number, default: 20 }
})

const containerRef = ref(null)
let resizeObserver = null
const childObservers = new Map()
let animationFrameId = null

const calculateLayout = () => {
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
        animationFrameId = null
    }

    animationFrameId = requestAnimationFrame(() => {
        const container = containerRef.value
        if (!container) return

        // 暂停观察避免循环触发
        resizeObserver?.disconnect()
        childObservers.forEach(observer => observer.disconnect())

        // 计算布局参数
        const containerWidth = container.offsetWidth - props.gap
        const gap = props.gap
        const isMobile = window.innerWidth <= 768 // 判断是否为手机端
        const columnCount = isMobile ? 2 : Math.max(1, Math.floor((containerWidth + gap) / (props.columnWidth + gap)))
        const itemWidth = (containerWidth - gap * (columnCount - 1)) / columnCount

        const columnHeights = new Array(columnCount).fill(0)
        const currentChildren = Array.from(container.children)

        currentChildren.forEach(child => {
            child.style.width = `${itemWidth}px`
            child.style.position = 'absolute'
            child.style.transition = 'top 0.3s ease, left 0.3s ease'

            const height = child.offsetHeight + gap
            const minHeight = Math.min(...columnHeights)
            const columnIndex = columnHeights.indexOf(minHeight)

            const left = columnIndex * (itemWidth + gap)
            const top = columnHeights[columnIndex]

            columnHeights[columnIndex] = top + height
            child.style.left = `${left}px`
            child.style.top = `${top}px`
        })

        container.style.height = `${Math.max(...columnHeights)}px`

        // 延迟恢复观察
        nextTick(() => {
            resizeObserver?.observe(container)
            currentChildren.forEach(child => {
                if (!childObservers.has(child)) {
                    const observer = new ResizeObserver(() => {
                        calculateLayout()
                    })
                    observer.observe(child)
                    childObservers.set(child, observer)
                }
            })
        })
    })
}

onMounted(() => {
    resizeObserver = new ResizeObserver(entries => {
        if (!entries.length) return
        calculateLayout()
    })
    calculateLayout()
})

onUnmounted(() => {
    resizeObserver?.disconnect()
    childObservers.forEach(observer => observer.disconnect())
    if (animationFrameId) cancelAnimationFrame(animationFrameId)
})
</script>

<template>
    <div ref="containerRef" class="waterfall-container">
        <slot></slot>
    </div>
</template>

<style scoped lang="scss">
.waterfall-container {
    width: 100%;
    position: relative;
}
</style>