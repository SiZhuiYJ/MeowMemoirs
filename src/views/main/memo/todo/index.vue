<!--<script lang="ts" setup>-->
<!--import { ref, onMounted } from 'vue'-->

<!--const iframeRef = ref<HTMLIFrameElement>()-->
<!--const isLoading = ref(true)-->
<!--const error = ref<string | null>(null)-->

<!--const loadHtmlContent = async () => {-->
<!--  try {-->
<!--    isLoading.value = true-->
<!--    error.value = null-->

    // 使用正确的路径
<!--    const htmlPath = new URL('/html/index.html', import.meta.url).href-->
    // 或者使用相对路径
    // const htmlPath = '/src/assets/html/index.html'

<!--    if (iframeRef.value) {-->
<!--      iframeRef.value.src = htmlPath-->
<!--    }-->
<!--  } catch (err) {-->
<!--    error.value = `加载失败: ${err instanceof Error ? err.message : String(err)}`-->
<!--    console.error('加载iframe内容失败:', err)-->
<!--  } finally {-->
<!--    isLoading.value = false-->
<!--  }-->
<!--}-->

// 监听 iframe 加载完成
<!--const handleIframeLoad = () => {-->
<!--  isLoading.value = false-->
<!--}-->

// 监听 iframe 错误
<!--const handleIframeError = () => {-->
<!--  error.value = 'iframe加载失败，请检查文件路径'-->
<!--  isLoading.value = false-->
<!--}-->

<!--onMounted(() => {-->
<!--  loadHtmlContent()-->
<!--})-->
<!--</script>-->

<!--<template>-->
<!--  <div class="iframe-container">-->
    <!-- 加载状态 -->
<!--    <div v-if="isLoading" class="loading">-->
<!--      加载中...-->
<!--    </div>-->

    <!-- 错误提示 -->
<!--    <div v-if="error && !isLoading" class="error">-->
<!--      {{ error }}-->
<!--      <button @click="loadHtmlContent" class="retry-btn">重试</button>-->
<!--    </div>-->

    <!-- iframe -->
<!--    <iframe ref="iframeRef" :class="['christmas-tree', { hidden: isLoading }]" frameborder="0" @load="handleIframeLoad"-->
<!--      @error="handleIframeError"></iframe>-->
<!--  </div>-->
<!--</template>-->

<!--<style scoped lang="scss">-->
<!--.iframe-container {-->
<!--  position: relative;-->
<!--  width: 100vw;-->
<!--  height: 100vh;-->
<!--}-->

<!--.christmas-tree {-->
<!--  width: 100%;-->
<!--  height: 100%;-->
<!--  border: none;-->

<!--  &.hidden {-->
<!--    opacity: 0;-->
<!--  }-->
<!--}-->

<!--.loading,-->
<!--.error {-->
<!--  position: absolute;-->
<!--  top: 50%;-->
<!--  left: 50%;-->
<!--  transform: translate(-50%, -50%);-->
<!--  padding: 20px;-->
<!--  background: rgba(255, 255, 255, 0.9);-->
<!--  border-radius: 8px;-->
<!--  text-align: center;-->
<!--}-->

<!--.error {-->
<!--  color: #f56c6c;-->
<!--}-->

<!--.retry-btn {-->
<!--  margin-top: 10px;-->
<!--  padding: 8px 16px;-->
<!--  background: #409eff;-->
<!--  color: white;-->
<!--  border: none;-->
<!--  border-radius: 4px;-->
<!--  cursor: pointer;-->

<!--  &:hover {-->
<!--    background: #66b1ff;-->
<!--  }-->
<!--}-->
<!--</style>-->
<script setup lang="ts">
// 这里什么都不用写
</script>

<template>
  <iframe
    src="/html/index.html"
    class="christmas-tree"
    frameborder="0"
  />
</template>

<style scoped lang="scss">
.christmas-tree {
  width: 100vw;
  height: 100vh;
  border: none;
}
</style>