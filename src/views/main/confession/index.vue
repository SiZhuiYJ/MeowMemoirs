<script setup lang="ts">
import { ref } from "vue";
import { useScreenStore } from "@/utils/screen";
import { useRoute } from "vue-router";
const route = useRoute();
const { isMobile } = useScreenStore();
import hug from "/img/love/hug.png";
import crying from "/img/love/crying.png";

const isConfession = ref<boolean>(false);
const confessionName = ref<string>(route.query.name as string);
const confessingName = ref<string>(route.query.confessing as string);
const confessionImg = ref<string[]>([
  "/img/love/heart.png",
  "/img/love/shocked.png",
  "/img/love/think.png",
  "/img/love/angry.png",
  crying,
  crying,
]);
const confessionTitle = ref<string[]>([
  "不愿意…",
  "真的不考虑一下了吗？",
  "再想想嘛~~~",
  "不要这么绝情嘛~",
  "我会很难过的…",
  "求求你了~",
]);
const confessionSize = ref<{ width: number; height: number; fontSize: number }>({
  width: 82,
  height: 50,
  fontSize: 20,
});
const confessionTextList = ref<string[]>([
  (confessionName.value ? `${confessionName.value}~ ` : "") + "可以成为我的恋人吗？",
  (confessionName.value ? `${confessionName.value}~ ` : "") + "愿意和我在一起吗~",
  (confessionName.value ? `${confessionName.value}~ ` : "") + "愿意成为我的另一半吗~",
]);
const loveTextList = ref<string[]>([
  "只要你愿意，当你失落失意的时候，最需要一个肩膀的时候，告诉我，我会立即出现。",
  "我一生很短，只够喜欢你一人。",
  "有你在，我的世界才有了意义。你的存在，让我感到了幸福。",
  "当你在我身边，你就是我的全世界；当你不在我身边，我的全世界都是你。",
  "你是我想跟全世界炫耀，却又舍不得跟任何人分享的人。",
  "我爱你，多一个不行，少一个也不行。",
  "我对你并无所企图，如果非要说我对你有企图，今生无非是图你幸福。",
  "你是年少的欢喜，我想把这句话反过来告诉你。",
]);
// 当前阶段
const stage = ref<number>(0);
const stageCount = ref<number>(0);
const unwilling = ref<string>(confessionTitle.value[0]);
// 获取图片
const getImage = (): string => {
  if (stage.value > confessionImg.value.length)
    return confessionImg.value[confessionImg.value.length - 1];
  return confessionImg.value[stage.value];
};
// 我愿意
const handleConfession = () => {
  isConfession.value = !isConfession.value;
};
// 不愿意
const handleNotConfession = () => {
  stageCount.value++;
  if (stage.value < confessionTitle.value.length - 1) {
    stage.value++;
  } else {
    stage.value = 5;
  }
  unwilling.value = confessionTitle.value[stage.value];
};
</script>
<template>
  <div class="confession-container">
    <div class="confession-tis">
      <TypewriterEffect
        :messages="loveTextList"
        :type-speed="80"
        :delete-speed="40"
        :pause-duration="2000"
        :empty-pause="300"
        :font-size="10"
      />
    </div>
    <div class="confession" v-show="!isConfession">
      <div class="confession-img">
        <img :src="getImage()" alt="" srcset="" />
      </div>
      <div class="confession-title">
        <TypewriterEffect
          :messages="confessionTextList"
          :type-speed="80"
          :delete-speed="40"
          :pause-duration="2000"
          :empty-pause="300"
          :font-size="isMobile ? 25 : 30"
        />
      </div>
      <div class="confession-content">
        <button
          class="willing"
          style="padding: 10px"
          :style="{
            height: confessionSize.height * (stageCount + 1) + 'px',
            width: confessionSize.width * (stageCount + 1) + 'px',
            fontSize: confessionSize.fontSize * (stageCount + 1) + 'px',
          }"
          @click="handleConfession"
        >
          我愿意
        </button>
        <button class="unwilling" @click="handleNotConfession">{{ unwilling }}</button>
      </div>
    </div>
    <div class="confession-love" v-show="isConfession">
      <span class="love-title" :style="{ fontSize: !isMobile ? '30px' : '25px' }"
        >!!!喜欢你!! ( >᎑<)♡︎{{ confessionName }}，( >᎑<)♡︎</span
      >
      <img class="love-img" :src="hug" alt="" />
      <span class="love-content" :style="{ fontSize: !isMobile ? '25px' : '15px' }"
        >💕 从此以后，我们就是彼此最重要的人了 💕</span
      >
      <span class="love-name" :style="{ fontSize: !isMobile ? '20px' : '10px' }">
        {{ confessingName }} {{ confessingName ? "and" : "love" }} {{ confessionName }}
      </span>
    </div>
  </div>
</template>
<style scoped lang="scss">
.confession-container {
  width: 100%;
  height: 100%;
  background-color: #f1d5da;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  .confession-tis {
    position: absolute;
    padding: 5px;
    width: 100%;
    top: 50px;
    left: 0;
  }
  .confession {
    display: flex;
    flex-direction: column;
    align-items: center;
    .confession-img {
      width: 240px;
      height: 240px;
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
    .confession-title {
      width: 100%;
      color: white;
      font-size: 20px;
      text-align: center;
      padding: 20px 0;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .confession-content {
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 10px 0;

      .willing,
      .unwilling {
        text-align: center;
        height: 40px;
        color: #fff;
        border-radius: 5px;
        border: 0;
        font-size: 20px;
        padding: 10px;
        margin: 0 20px 0 0;
        transition: all 0.5s ease;
      }
      .willing {
        background-color: #ea80b0;
      }
      .unwilling {
        background-color: #6784b1;
        height: 50px;
      }
    }
  }
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
      background: linear-gradient(
          to right,
          red,
          orange,
          yellow,
          lime,
          aqua,
          blue,
          fuchsia
        )
        0 / 100%;
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      animation: hue 2s linear infinite;
      padding: 20px;
    }
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
