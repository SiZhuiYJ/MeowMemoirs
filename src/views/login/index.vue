<script setup lang="ts">
import Login from "./components/Login.vue";
import Register from "./components/Register.vue";
import useApiUrl from "@/libs/useApiUrl/index";
import { useRouter } from "vue-router";
import { useScreenStore } from "@/utils/screen";
import { computed, ref } from "vue";
const router = useRouter();
const { getLocalImgUrl } = useApiUrl();
const { isMobile, isPad, isDesktop, isScreen } = useScreenStore();
const isLogin = ref(true);
const login = () => {
  isLogin.value = true;
};
const register = () => {
  isLogin.value = false;
};
const background = computed(() => {
  return isMobile.value
    ? getLocalImgUrl("_9.webp")
    : isPad.value
    ? getLocalImgUrl("_4.webp")
    : isScreen.value
    ? getLocalImgUrl("_3.webp")
    : isDesktop.value
    ? getLocalImgUrl("_1.webp")
    : getLocalImgUrl("_8.webp");
});
</script>
<template>
  <div class="body" :style="{ 'background-image': `url(${background})` }">
    <div
      class="Logo animate-float"
      @click="router.push('/home/index')"
      title="暂不登录,前往首页"
    >
      <img :src="getLocalImgUrl('favicon.ico')" alt="" />
      <span>喵咪记事簿</span>
    </div>
    <div class="container" :style="{ width: isMobile ? '350px' : '650px' }">
      <div
        ref="form-box"
        class="form-box"
        :style="{ transform: `translateX(${isMobile ? 0 : !isLogin ? 80 : 0}%)` }"
      >
        <!-- 注册 -->
        <Register :class="isLogin ? '' : 'hidden'" />
        <!-- 登录 -->
        <Login :class="isLogin ? 'hidden' : ''" />
      </div>
      <div class="con-box left" v-if="!isMobile">
        <h2>欢迎来到<span>恋爱之家</span></h2>
        <p>快来领取你的专属<span>对象</span>吧</p>
        <img :src="getLocalImgUrl('_5.webp')" alt="" />
        <p>已有账号？</p>
        <button id="login" @click="login">去登录</button>
      </div>
      <div class="con-box right" v-if="!isMobile">
        <h2>欢迎来到<span>恋爱之家</span></h2>
        <p>快来看看你的可爱<span>对象</span>吧</p>
        <img class="ILXY_image" :src="getLocalImgUrl('_6.webp')" alt="" />
        <p>没有账号？</p>
        <button id="register" @click="register">去注册</button>
      </div>
    </div>
    <div class="footer-btn" v-if="isMobile">
      <button v-if="!isLogin" id="login" @click="login">去登录</button>
      <button v-else id="register" @click="register">去注册</button>
    </div>
  </div>
</template>
<style scoped lang="scss">
.body {
  /* 100%窗口高度 */
  width: 100vw;
  height: 100vh;
  /* 弹性布局 水平+垂直居中 */
  display: flex;
  justify-content: center;
  align-items: center;
  /* 渐变背景 */
  background: linear-gradient(200deg, #f3e7e9, #e3eeff);
  /* 背景图垂直、水平均居中 */
  background-position: center center;
  /* 背景图不平铺 */
  background-repeat: no-repeat;
  /* 当内容高度大于图片高度时，背景图像的位置相对于viewport固定 */
  background-attachment: fixed;
  /* 让背景图基于容器大小伸缩 */
  background-size: cover;
  /* 设置背景颜色，背景图加载过程中会显示背景色 */
  background-color: #464646;

  .Logo {
    position: fixed;
    top: 0;
    left: 0;
    display: flex;
    align-items: center;
    margin-left: 20px;
    // cursor: pointer;

    img {
      width: 80px;
      height: 80px;
    }

    span {
      font-size: 40px;
      font-weight: 200;
      color: #fff;
      font-family: "华文行楷";
    }
  }

  .container {
    transition: width 0.5s ease-in-out;
    background-color: #fff;
    width: 650px;
    height: 415px;
    border-radius: 5px;
    /* 阴影 */
    box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.1);
    /* 相对定位 */
    position: relative;

    .form-box {
      /* 绝对定位 */
      // position: absolute;
      top: -10%;
      left: 5%;
      background-color: #e3c0df;
      width: 320px;
      height: 500px;
      border-radius: 5px;
      box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 2;
      /* 动画过渡 加速后减速 */
      transition: all 0.5s ease-in-out;
      position: relative;
      overflow: hidden;
    }

    .con-box {
      width: 50%;
      /* 弹性布局 垂直排列 居中 */
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      /* 绝对定位 居中 */
      position: absolute;
      top: 50%;
      transform: translateY(-50%);

      h2 {
        color: #8e9aaf;
        font-size: 25px;
        font-weight: bold;
        letter-spacing: 3px;
        text-align: center;
        margin-bottom: 4px;
      }

      p {
        font-size: 12px;
        letter-spacing: 2px;
        color: #8e9aaf;
        text-align: center;
      }

      span {
        color: #d3b7d8;
      }

      img {
        border-radius: 25px;
        width: 170px;
        height: 170px;
        opacity: 0.9;
        margin: 40px 0;
        object-fit: cover;
      }

      button {
        width: 120px;
        margin-top: 3%;
        background-color: #fff;
        color: #a262ad;
        border: 1px solid #d3b7d8;
        padding: 6px 10px;
        border-radius: 5px;
        letter-spacing: 1px;
        outline: none;
        // cursor: pointer;
      }

      button:hover {
        background-color: #d3b7d8;
        color: #fff;
      }

      .ILXY_image {
        background-position: center center;
        /* 背景图不平铺 */
        background-repeat: no-repeat;
        /* 当内容高度大于图片高度时，背景图像的位置相对于viewport固定 */
        background-attachment: fixed;
        /* 让背景图基于容器大小伸缩 */
        background-size: cover;
        /* 设置背景颜色，背景图加载过程中会显示背景色 */
        background-color: #464646;
      }
    }

    .left {
      left: -2%;
    }

    .right {
      right: -2%;
    }
  }

  /* 适配手机 */
  @media (max-width: 768px) {
    .container {
      background-color: rgba(0, 0, 0, 0);

      .form-box {
        box-shadow: 0 10px 30px #00000085;
        border-top: 1px solid rgba(255, 255, 255, 0.9);
        border-left: 1px solid rgba(255, 255, 255, 0.9);
        background: linear-gradient(
          to right bottom,
          rgba(255, 255, 255, 0.6),
          rgba(255, 255, 255, 0.3),
          rgba(255, 255, 255, 0.2)
        );
        backdrop-filter: blur(5px);
      }
    }
  }

  .footer-btn {
    position: absolute;
    right: 10px;
    bottom: 10px;
    animation: pop-btn 0.3s both ease-in-out 0.5s;

    button {
      border: none;
      width: 80px;
      // height: 40px;
      border-radius: 50px;
      background-color: #f6f6f6;
      outline: none;
      color: #a262ad;
      letter-spacing: 2px;
      border: none;
      // cursor: pointer;
    }

    button:hover {
      background-color: #a262ad;
      color: #f6f6f6;
      transition: background-color 0.5s ease;
    }
  }
}

.register-box,
.login-box {
  /* 弹性布局 垂直排列 */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  opacity: 0;
  width: 320px;
  height: 500px;
  position: absolute;
  top: 0;
  left: 0;
  transition: all 0.5s ease-in-out;
  /* 动画时长为0.5秒 */
}

.register-box {
  transform: translateX(-100%);
  /* 默认显示注册框 */
}

.login-box {
  transform: translateX(100%);
  /* 默认隐藏登录框 */
}

.login-box.hidden {
  opacity: 1;
  transform: translateX(0);
  /* 显示登录框 */
}

.register-box.hidden {
  opacity: 1;
  transform: translateX(0%);
  /* 隐藏注册框 */
}

// .hidden {
//     visibility: visible;
//     width: 100%;
//     opacity: 1;
// }

.animate-float {
  animation: float 5s linear 0ms infinite;
}

@keyframes float {
  0% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(20px);
  }

  100% {
    transform: translateY(0);
  }
}

/* 定义一个名为pop-btn的关键帧动画*/
@keyframes pop-btn {
  0% {
    transform: scale(0);
    /* 动画开始时缩放为0 */
  }

  80% {
    transform: scale(1.2);
    /* 动画进行到80%时缩放为1.2 */
  }

  100% {
    transform: scale(1);
    /* 动画结束时缩放为1 */
  }
}
</style>
