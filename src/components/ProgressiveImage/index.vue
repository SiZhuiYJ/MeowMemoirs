<script setup lang="ts">
import { ref, onMounted, watch } from "vue";

interface Props {
  placeholderSrc: string; // 低质量图片地址
  fullSrc: string; // 高质量图片地址
  alt?: string; // 图片alt文本
  transitionDuration?: number; // 过渡动画持续时间(ms)
}

const props = withDefaults(defineProps<Props>(), {
  alt: "",
  transitionDuration: 500,
});

const isLoaded = ref(false);
const placeholderLoaded = ref(false);
const fullLoaded = ref(false);

const imgRef = ref<HTMLImageElement | null>(null);

// 加载图片
const loadImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
};

// 加载两张图片
const loadImages = async () => {
  try {
    isLoaded.value = false;
    placeholderLoaded.value = false;
    fullLoaded.value = false;

    // 先加载占位图
    await loadImage(props.placeholderSrc);
    placeholderLoaded.value = true;

    // 然后加载高清图
    await loadImage(props.fullSrc);
    fullLoaded.value = true;

    // 两张图都加载完成后显示
    isLoaded.value = true;
  } catch (error) {
    console.error("Error loading images:", error);
  }
};

// 监听图片src变化
watch(
  () => [props.placeholderSrc, props.fullSrc],
  () => {
    loadImages();
  }
);

onMounted(() => {
  loadImages();
});
</script>

<template>
  <div class="progressive-image-container">
    <!-- 占位图 -->
    <img
      v-show="!isLoaded && placeholderLoaded"
      ref="imgRef"
      :src="placeholderSrc"
      :alt="alt"
      class="placeholder-image"
    />

    <!-- 高清图 -->
    <img
      v-show="isLoaded"
      :src="fullSrc"
      :alt="alt"
      :class="['full-image', { 'fade-in': isLoaded }]"
    />

    <!-- 加载中状态 -->
    <div v-if="!placeholderLoaded" class="loading-state">
      <!-- 可以在这里添加加载动画 -->
      <div class="loading-spinner"></div>
    </div>
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

  .loading-state {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #f5f5f5;
  }

  .loading-spinner {
    width: 40px;
    height: 40px;
    border: 3px solid rgba(0, 0, 0, 0.1);
    border-radius: 50%;
    border-top-color: #333;
    animation: spin 1s ease-in-out infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
}
</style>
