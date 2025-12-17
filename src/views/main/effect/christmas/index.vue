<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
const route = useRoute()
const pageName = ref<string>(route.query.n as string);
const pageLink = ref<string>(route.query.l as string);

const iframeRef = ref<HTMLIFrameElement>()
const iframeLoaded = ref(false)

// 监听 iframe 消息
const handleMessage = (event: MessageEvent) => {
  // 确保消息来自 iframe
  if (event.source !== iframeRef.value?.contentWindow) return

  if (event.data.type === 'IFRAME_READY') {
    // iframe 准备就绪，发送参数
    sendParamsToIframe()
  }
}

// 向 iframe 发送参数
const sendParamsToIframe = () => {
  if (!iframeRef.value?.contentWindow) return

  iframeRef.value.contentWindow.postMessage({
    type: 'UPDATE_PARAMS',
    data: {
      name: pageName.value ? pageName.value : '记事员',
      link: pageLink.value ? pageLink.value + '&name=' + pageName.value : 'https://www.meowmemoirs.cn/'
    }
  }, '*')
}

// 加载 iframe 内容
const loadIframe = () => {
  iframeRef.value!.src = '/html/index.html'
}

const handleIframeLoad = () => {
  iframeLoaded.value = true
  // 延迟发送消息，确保 iframe 内部已准备好
  setTimeout(() => {
    sendParamsToIframe()
  }, 100)
}

onMounted(() => {
  window.addEventListener('message', handleMessage)
  loadIframe()

  return () => {
    window.removeEventListener('message', handleMessage)
  }
})

// 监听 props 变化，更新 iframe
import { watch } from 'vue'
watch(() => [pageName.value, pageLink.value], () => {
  if (iframeLoaded.value) {
    sendParamsToIframe()
  }
})
</script>

<template>
  <iframe ref="iframeRef" class="christmas-tree" frameborder="0" @load="handleIframeLoad"></iframe>
</template>

<style scoped lang="scss">
.christmas-tree {
  width: 100vw;
  height: 100vh;
  border: none;
}
</style>