<script lang="ts" setup>
import { ref, onMounted } from 'vue'

const iframeRef = ref<HTMLIFrameElement>()

const loadHtmlContent = () => {
  const htmlPath = new URL('@/assets/html/index.html', import.meta.url).href
  iframeRef.value!.src = htmlPath
}

onMounted(() => {
  loadHtmlContent()
})
</script>

<template>
  <iframe ref="iframeRef" class="christmas-tree" frameborder="0" allow="same-origin"></iframe>
</template>

<style scoped lang="scss">
.christmas-tree {
  width: 100vw;
  height: 100vh;
  border: none;
}
</style>