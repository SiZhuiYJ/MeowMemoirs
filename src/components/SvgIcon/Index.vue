<script lang="ts" setup>
import { ref, watch, onMounted, computed } from 'vue'

const props = defineProps({
  name: {
    type: String,
    required: true
  },
  color: {
    type: String,
    default: 'currentColor'
  },
  size: {
    type: [String, Number],
    default: 18
  }
})

// 动态加载 SVG 内容
const svgContent = ref('')
const isLoading = ref(true)
const svgClass = computed(() => `svg-icon ${props.name}-icon`)

const loadSvg = async () => {
  try {
    const svgModule = await import(
      /* @vite-ignore */
      `../assets/svgs/${props.name}.svg?raw`
    )
    svgContent.value = svgModule.default
  } catch (e) {
    console.error(`SVG load failed: ${props.name}`, e)
    svgContent.value = ''
  } finally {
    isLoading.value = false
  }
}

// 监听 name 变化
watch(() => props.name, loadSvg)

// 初始化加载
onMounted(loadSvg)
</script>

<template>
  <div class="svg-container" :class="svgClass" :style="{
    width: typeof size === 'number' ? `${size}px` : size,
    height: typeof size === 'number' ? `${size}px` : size,
    color: color
  }" role="img" :aria-label="name">
    <div v-if="isLoading" class="loading-placeholder" />
    <div v-else-if="svgContent" class="svg-wrapper" v-html="svgContent" />
    <div v-else class="error-placeholder">
      <slot name="error">
        <span class="error-text">⚠️ SVG Load Failed</span>
      </slot>
    </div>
  </div>
</template>

<style scoped>
.svg-container {
  display: inline-block;
  vertical-align: middle;
  line-height: 0;
}

.svg-wrapper :deep(svg) {
  width: 100%;
  height: 100%;
  fill: currentColor;
  stroke: currentColor;
}

.loading-placeholder {
  width: 100%;
  height: 100%;
  background: #f0f0f0;
  animation: pulse 1.5s infinite;
}

.error-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ffe6e6;
  color: #ff4444;
}

@keyframes pulse {
  0% {
    opacity: 1
  }

  50% {
    opacity: 0.4
  }

  100% {
    opacity: 1
  }
}
</style>