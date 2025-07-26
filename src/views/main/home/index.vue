<script setup lang="ts">
import { useUserStore } from "@/stores";
import { useRouter } from "vue-router";
import { useScreenStore } from "@/utils/screen";
import PersonalDataCard from "./PersonalDataCard/index.vue";
import ToHome from "./ToHome/index.vue";
import useApiUrl from "@/libs/useApiUrl/index";
const { getStaticFileUrl } = useApiUrl();
const { isMobile } = useScreenStore();
const router = useRouter();
const outLogin = () => {
  useUserStore().setToken(null);
};
const login = () => {
  router.push("/login");
};
const imgList = [
  {
    progressive: "img/home/_2-720p.webp",
    src: "img/home/_2-4k.webp",
    alt: "Image 示例图片",
  },
  {
    progressive: "img/home/_4-720p.webp",
    src: "img/home/_4-4k.webp",
    alt: "Image 示例图片",
  },
  {
    progressive: "img/home/_8-720p.webp",
    src: "img/home/_8-4k.webp",
    alt: "Image 示例图片",
  },
];
const TextList = [
  "🐾「爪印轻点，心事成册——喵咪记事簿，记录你的每一份柔软」",
  "📸「毛茸茸的时光机，一键收藏与主子的独家记忆」",
  "🌙「深夜emo时，翻开和TA的暖心备忘录」",
  "🎨「涂鸦、便签、喵星语翻译——你的撸猫日常，我们承包了！」",
  "📅「喵生大事提醒：绝育？驱虫？打疫苗？本簿替你记牢！」",
  "✨「比猫肚皮更软的，是这里存下的温柔时光」",
  "💌「给未来的一封信：当TA老去，这里还有年轻的模样」",
  "🚀「懒人福音！语音记事+自动生成喵星日记」",
  "🌸「每一页都是猫薄荷——让记录变成享受」",
  "👫「独居青年的云养猫搭子，社恐的秘密树洞」",
];
</script>

<template>
  <div class="progressive-container">
    <!-- 封面 -->
    <div class="cover">
      <img
        class="preview"
        :src="getStaticFileUrl(`img/home/_${isMobile ? '9' : '1'}-4k.webp`)"
        v-progressive.lazy="
          getStaticFileUrl(`img/home/_${isMobile ? '9' : '1'}-720p.webp`)
        "
        alt="Image 示例图片"
      />

      <!-- 打字机宣传语 -->
      <div
        class="typing"
        :style="{ left: isMobile ? '5%' : '20%', width: isMobile ? '' : 'auto' }"
      >
        <div class="typing-title">
          欢迎来到<span style="font-size: 30px; color: #e3c0df">喵咪记事簿</span>
        </div>
        <ToHome class="typing-btn" />
        <TypewriterEffect
          :messages="TextList"
          :type-speed="80"
          :delete-speed="40"
          :pause-duration="3000"
          :empty-pause="300"
          :font-size="isMobile ? 25 : 30"
          style="color: #fff"
        />
      </div>
      <!-- 向下标 -->
      <div class="down-arrow">
        <span class="arrow-title">逝去的人会永远活在我们的回忆里</span>
        <div class="arrow-down">
          <svg
            t="1752727759925"
            class="icon"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="4445"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            width="40"
            height="40"
          >
            <path
              d="M512 817.664l264.832-264.832-60.330667-60.330667L512 697.002667l-204.501333-204.501334-60.330667 60.330667L512 817.664z m0-241.066667l264.832-264.832-60.330667-60.330666L512 455.936 307.498667 251.434667 247.168 311.765333 512 576.597333z"
              fill="#FFF"
              p-id="4446"
            ></path>
          </svg>
        </div>
      </div>
    </div>
    <div class="progressive" v-for="(item, index) in imgList">
      <img
        class="preview"
        v-progressive.lazy="getStaticFileUrl(item.progressive)"
        :src="getStaticFileUrl(item.src)"
        :alt="item.alt"
        :key="index"
      />
    </div>
    <!-- 封页 -->
    <div class="page-break">
      <img
        class="preview"
        :src="getStaticFileUrl(`img/home/_${isMobile ? '1' : '9'}-4k.webp`)"
        v-progressive.lazy="
          getStaticFileUrl(`img/home/_${isMobile ? '1' : '9'}-720p.webp`)
        "
        alt="Image 示例图片"
      />
    </div>
    <div :class="isMobile ? 'mobile' : 'message'">
      <div class="message-btn">
        <span>欢迎参观我的小破网站</span>
        <button @click="outLogin">退出登录</button>
        <button @click="login">登录</button>
      </div>

      <PersonalDataCard />
      <div :class="isMobile ? 'mobile-box' : 'login-box'">
        <div
          class="glitch"
          data-text="喵咪记事簿"
          :style="{ writingMode: isMobile ? 'vertical-rl' : 'horizontal-tb' }"
        >
          喵咪记事簿
        </div>
      </div>
    </div>
    <div class="info">
      <p>
        <a href="https://beian.miit.gov.cn/" target="_blank">渝ICP备2025063979号-1</a>
      </p>
    </div>
  </div>
</template>
<style scoped lang="scss">
.progressive-container {
  width: 100vw;
  .cover {
    width: 100%;
    position: relative;
    height: 100vh;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .typing {
      position: absolute;
      top: 50%;
      transform: translate(-150%, -50%);
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      color: #fff;
      font-size: 20px;
      padding: 10px;
      background: rgba(0, 0, 0, 0.1);
      backdrop-filter: blur(2px);
      border-radius: 20px;
      animation: center-to 1s forwards ease-in-out;
      width: calc(100vw - 10% - 20px);
      .typing-title {
        font-size: 30px;
        padding: 0 10px;
      }
      .typing-btn {
        padding: 20px 0;
      }
    }
    .down-arrow {
      position: absolute;
      left: 50%;
      bottom: -200px;
      display: flex;
      flex-direction: column;
      align-items: center;
      animation: bottom-to 1s forwards ease-in-out;
      .arrow-title {
        width: calc(100vw - 10%);
        color: #fff;
        display: flex;
        justify-content: center;
      }
      .arrow-down {
        width: 40px;
        height: 40px;
      }
    }
  }
  .page-break,
  .progressive {
    background-color: #f5f5f5;
    width: calc(100vw - 20px);
    padding: 10px 10px 0;
    img {
      width: 100%;
    }
  }

  .message {
    flex-direction: row;
    align-items: center;
    justify-content: space-around;
  }
  .mobile {
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
  }
  .info,
  .mobile,
  .message {
    width: 100%;
    display: flex;
    text-align: center;
    position: relative;
    height: 400px;
    .login-box,
    .mobile-box {
      position: absolute;

      .glitch {
        position: relative;
        font-size: 50px;
        font-weight: bold;
        color: #ffffff;
        letter-spacing: 3px;
        z-index: 1;

        &:before,
        &:after {
          display: block;
          content: attr(data-text);
          position: absolute;
          top: 0;
          left: 0;
          opacity: 0.8;
        }

        &:before {
          animation: glitch-it 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) both infinite;
          color: #00ffff;
          z-index: -1;
        }

        &:after {
          animation: glitch-it 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) reverse both
            infinite;
          color: #ff00ff;
          z-index: -2;
        }
      }
    }
    .login-box {
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
    .mobile-box {
      top: 0;
      left: 0;
    }
    .message-btn {
      span {
        background: linear-gradient(to right, var(--el-color-primary), #61c454) no-repeat
          right bottom;
        background-size: 0 2px;
        transition: background-size 1000ms;
        &:hover {
          background-position-x: left;
          background-size: 100% 2px;
        }
      }
    }
  }
  .info {
    align-items: center;
    justify-content: center;
    height: 80px;
    background-color: #000;
    p {
      a {
        color: #fff;
        font-family: "宋体";
        position: relative;
        text-decoration: none;

        &:before {
          content: "";
          position: absolute;
          left: 50%;
          bottom: -2px;
          width: 0;
          height: 2px;
          background: var(--el-color-primary);
          transition: all 0.3s;
        }
        &:hover:before {
          width: 100%;
          left: 0;
          right: 0;
        }
      }
    }
  }
}
@keyframes center-to {
  100% {
    transform: translate(0, -50%);
  }
}
@keyframes bottom-to {
  0% {
    transform: translate(-50%, 0);
  }
  100% {
    // 向上移200px
    transform: translate(-50%, -200px);
  }
}
@keyframes glitch-it {
  0% {
    transform: translate(0);
  }

  20% {
    transform: translate(-2px, 2px);
  }

  40% {
    transform: translate(-2px, -2px);
  }

  60% {
    transform: translate(2px, 2px);
  }

  80% {
    transform: translate(2px, -2px);
  }

  to {
    transform: translate(0);
  }
}
</style>
