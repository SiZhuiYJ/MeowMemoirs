<script setup lang="ts">
import { ref } from "vue";
interface ListItem {
  id: number;
  name: string;
  date: string;
  title: string;
  content: string;
}
const list = ref<ListItem[]>([
  {
    id: 1,
    name: "小小刘",
    date: "2025-07-19",
    title: "小刘的日常",
    content: "厨房备个可移动的空调或者风扇（水空调）",
  },
]);
// 滚动动画
import useApiUrl from "@/libs/useApiUrl/index";
const { getStaticFileUrl } = useApiUrl();
// 引入 GSAP 和 ScrollTrigger 插件
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// 注册插件
gsap.registerPlugin(ScrollTrigger);
const section = document.querySelectorAll("section");
section.forEach((section) => {
  gsap.fromTo(
    section,
    {
      backgroundPositionY: `-${window.innerHeight / 2}px`,
    },
    {
      backgroundPositionY: `${window.innerHeight / 2}px`,
      ease: "none",
      scrollTrigger: {
        trigger: section,
        scrub: true,
      },
    }
  );
});
</script>
<template>
  <div class="main-content">
    <div style="width: 100vw; height: 100%">
      <section
        v-for="item in [1, 2, 4, 8, 9]"
        :style="{
          backgroundImage:
            'url(' + (getStaticFileUrl('img/home/_' + item + '.webp') + ')'),
        }"
        class="progressive"
      >
        <h1>{{ list[item]?.content }}</h1>
      </section>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.progressive {
  background-color: #f5f5f5;
  width: 100vw;
  height: 100vh;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
}
</style>