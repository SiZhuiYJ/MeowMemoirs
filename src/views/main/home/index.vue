<script setup lang="ts">
import { useUserStore } from "@/stores";
import { useRouter } from "vue-router";
const router = useRouter();
const outLogin = () => {
  useUserStore().setToken(null);
};
const login = () => {
  router.push("/login");
};
const imgList = [
  {
    progressive: "/img/_1-720p.webp",
    src: "/img/_1-4k.webp",
    alt: "Image 示例图片",
  },
  {
    progressive: "/img/_2-720p.webp",
    src: "/img/_2-4k.webp",
    alt: "Image 示例图片",
  },
  {
    progressive: "/img/_4-720p.webp",
    src: "/img/_4-4k.webp",
    alt: "Image 示例图片",
  },
  {
    progressive: "/img/_8-720p.webp",
    src: "/img/_8-4k.webp",
    alt: "Image 示例图片",
  },
  {
    progressive: "/img/_9-720p.webp",
    src: "/img/_9-4k.webp",
    alt: "Image 示例图片",
  },
];
</script>

<template>
  <div class="progressive-container">
    <div class="progressive" v-for="(item, index) in imgList">
      <img
        class="preview"
        v-progressive.lazy="item.progressive"
        :src="item.src"
        :alt="item.alt"
        :key="index"
      />
    </div>
    <div class="message">
      <span>欢迎参观我的小破网站</span><button @click="outLogin">退出登录</button>
      <button @click="login">登录</button>
    </div>
    <div class="info">
      <p>
        <a href="https://beian.miit.gov.cn/" target="_blank">渝ICP备2025063979号-1</a>
      </p>
    </div>
  </div>

  <div class="login-box">
    <div class="glitch" data-text="喵咪记事簿">喵咪记事簿</div>
  </div>
</template>
<style scoped lang="scss">
.progressive-container {
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  .progressive {
    position: relative;
    overflow: hidden;
    background-color: #f5f5f5;
  }
  .info,
  .message {
    height: 80px;
    width: 100%;
    display: flex;
    text-align: center;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }
  .message {
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
  .info {
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
.login-box {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  .glitch {
    position: relative;
    font-size: 60px;
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
      animation: glitch-it 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) reverse both infinite;
      color: #ff00ff;
      z-index: -2;
    }
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
