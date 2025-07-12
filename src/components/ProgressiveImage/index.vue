<script setup lang="ts">
import { ref, onMounted, watch } from "vue";

// 配置项类型
interface ProgressiveImageConfig {
  placeholderSrc: string;
  fullSrc: string;
  alt?: string;
  transitionDuration?: number;
  retryCount?: number;
}

const props = withDefaults(defineProps<ProgressiveImageConfig>(), {
  alt: "",
  transitionDuration: 500,
  retryCount: 3,
});

// 加载状态
const state = ref<{
  isLoading: boolean;
  isPlaceholderLoaded: boolean;
  isFullLoaded: boolean;
  error: Error | null;
  retryAttempts: number;
}>({
  isLoading: false,
  isPlaceholderLoaded: false,
  isFullLoaded: false,
  error: null,
  retryAttempts: 0,
});

const imgRef = ref<HTMLImageElement | null>(null);

// 图片加载器
const loadImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(new Error(`图片加载失败: ${src};错误信息:${e}`));
    img.src = src;
  });
};

// 带重试机制的图片加载
const loadWithRetry = async (src: string, isPlaceholder = false) => {
  try {
    await loadImage(src);
    if (isPlaceholder) {
      state.value.isPlaceholderLoaded = true;
    } else {
      state.value.isFullLoaded = true;
    }
    state.value.error = null;
  } catch (err) {
    if (state.value.retryAttempts < props.retryCount) {
      state.value.retryAttempts++;
      await loadWithRetry(src, isPlaceholder);
    } else {
      state.value.error = err as Error;
      console.error("图片加载最终失败:", err);
    }
  }
};

// 加载流程控制
const loadImages = async () => {
  state.value.isLoading = true;
  state.value.retryAttempts = 0;

  try {
    // 并行加载占位图和高清图
    await Promise.all([
      loadWithRetry(props.placeholderSrc, true),
      loadWithRetry(props.fullSrc),
    ]);
  } finally {
    state.value.isLoading = false;
  }
};

// 监听图片源变化
watch(
  () => [props.placeholderSrc, props.fullSrc],
  () => {
    loadImages();
  },
  { immediate: true }
);

onMounted(() => {
  loadImages();
});
</script>

<template>
  <div class="progressive-image-container">
    <!-- 错误状态 -->
    <div v-if="state.error" class="error-state">图片加载失败</div>

    <!-- 加载中状态 -->
    <div v-else-if="state.isLoading || !state.isPlaceholderLoaded" class="loading-state">
      <slot name="loading">
        <div class="loading-spinner"></div>
      </slot>
    </div>

    <!-- 占位图 -->
    <img
      v-show="!state.isFullLoaded && state.isPlaceholderLoaded"
      ref="imgRef"
      :src="props.placeholderSrc"
      :alt="props.alt"
      class="placeholder-image"
    />

    <!-- 高清图 -->
    <img
      v-show="state.isFullLoaded"
      :src="props.fullSrc"
      :alt="props.alt"
      :class="['full-image', { 'fade-in': state.isFullLoaded }]"
    />
  </div>
</template>

<style scoped lang="scss">
.progressive-image-container {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  .placeholder-image {
    filter: blur(5px);
    transform: scale(1.1);
  }

  .full-image {
    position: absolute;
    top: 0;
    left: 0;
    opacity: 0;
    transition: opacity v-bind("`${transitionDuration}ms`") ease-in-out;

    &.fade-in {
      opacity: 1;
    }
  }

  .loading-state,
  .error-state {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(245, 245, 245, 0.8);
  }

  .loading-spinner {
    width: 40px;
    height: 40px;
    border: 3px solid transparent;
    border-top-color: #409eff;
    border-radius: 50%;
    animation: spin 1s linear infinite;

    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }
  }
}
</style>
