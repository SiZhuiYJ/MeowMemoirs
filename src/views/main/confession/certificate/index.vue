<script setup lang="ts">
import { ref } from "vue";
import { useScreenStore } from "@/utils/screen";
import useApiUrl from "@/libs/useApiUrl/index";
import { useRoute } from "vue-router";
const route = useRoute();
const { isMobile } = useScreenStore();
const { getStaticFileUrl } = useApiUrl();

const confessionName = ref<string>(route.query.name as string);
const confessingName = ref<string>(route.query.confessing as string);
</script>
<template>
  <div class="confession-love">
    <span class="love-title" :style="{ fontSize: !isMobile ? '30px' : '25px' }">
      !!!喜欢你!! ( >᎑<)♡︎{{ confessionName ? confessionName + "，( >᎑<)♡︎" : "" }}
    </span>
    <img class="love-img" :src="getStaticFileUrl('img/love/hug.png')" alt="" />
    <span class="love-content" :style="{ fontSize: !isMobile ? '25px' : '15px' }">
      💕 从此以后，我们就是彼此最重要的人了 💕
    </span>
    <span class="love-name" :style="{ fontSize: !isMobile ? '20px' : '10px' }">
      {{ confessingName }} {{ confessingName ? "and" : "love" }} {{ confessionName }}
    </span>
  </div>
</template>
<style scoped lang="scss">
.confession-love {
  display: flex;
  flex-direction: column;
  align-items: center;
  .love-title {
    color: #68495b;
    font-size: 30px;
    font-weight: bold;
  }
  .love-img {
    width: 100%;
  }

  .love-content {
    color: #68495b;
    font-size: 20px;
  }
  .love-name {
    background: linear-gradient(to right, red, orange, yellow, lime, aqua, blue, fuchsia)
      0 / 100%;
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: hue 2s linear infinite;
    padding: 20px;
  }
}

@keyframes hue {
  from {
    filter: hue-rotate(360deg);
  }
  to {
    filter: hue-rotate(0deg);
  }
}
</style>
