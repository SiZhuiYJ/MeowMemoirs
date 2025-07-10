<script setup lang="ts">
import { useUserStore } from "@/stores";
import router from "@/routers";
const outLogin = () => {
  useUserStore().setToken(null);
};
const login = () => {
  router.push("/login");
};
</script>
<template>
  <div class="btn-box">
    <button @click="outLogin">退出登录</button>
    <button @click="login">登录</button>
  </div>

  <div class="login-box">
    <div class="glitch" data-text="喵咪记事簿">喵咪记事簿</div>
  </div>
</template>
<style scoped lang="scss">
.btn-box {
  width: 100%;
  height: 10%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.login-box {
  width: 100%;
  height: 90%;
  display: flex;
  align-items: center;
  justify-content: center;
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
