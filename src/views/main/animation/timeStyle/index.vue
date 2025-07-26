<script setup>
import { ref, onMounted } from "vue";

const isClockVisible = ref(false);
const isGlitch = ref(true);
const realTime = ref("");

function secondPassed() {
  isClockVisible.value = true;
}

function glitch() {
  isGlitch.value = true;
}

onMounted(() => {
  setTimeout(secondPassed, 2000);

  setInterval(() => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();

    realTime.value = `${hours < 10 ? "0" : ""}${hours} : ${
      minutes < 10 ? "0" : ""
    }${minutes} : ${seconds < 10 ? "0" : ""}${seconds}`;
  }, 1000);
});
</script>

<template>
  <div class="container">
    <a class="switcher" href="#" @click.prevent="glitch"></a>
    <div class="screen" :class="{ glitch: isGlitch }">
      <div class="clock" :class="{ 'is-off': !isClockVisible }">
        <span :data-time="realTime" class="time">{{ realTime }}</span>
      </div>
      <div class="figure"></div>
      <div class="figure-mask"></div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
*,
*:before,
*:after {
  margin: 0;
  padding: 0;
  border: 0;
  outline: 0;
  box-sizing: border-box;
  user-select: none;
}

.container {
  font-family: "Lato", sans-serif;
  font-weight: 700;
  background: #111;
  color: #fff;
  height: 100vh;
  width: 100%;
}

a.switcher {
  display: block;
  position: fixed;
  text-decoration: none;
  z-index: 999999999999;
  right: 20px;
  bottom: 20px;
  width: 16px;
  height: 16px;
  background: transparent;
  border: 2px solid #fff;
  border-radius: 50%;
  opacity: 0.15;
  transition: opacity 0.15s;
}

a.switcher:hover {
  opacity: 1;
}

a.switcher:before {
  display: block;
  content: "";
  position: absolute;
  border-radius: 4px;
  width: 2px;
  height: 5px;
  background: #fff;
  top: 0;
  left: 5px;
}

.screen {
  position: relative;
  z-index: 1;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.clock {
  display: block;
  position: absolute;
  z-index: 9;
  width: 720px;
  height: 128px;
  text-align: center;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  margin: auto;
  cursor: default;
}

.clock span {
  display: block;
  position: relative;
  font-size: 128px;
  line-height: 1;
  font-weight: bold;
}

.clock span:before,
.clock span:after {
  display: block;
  content: attr(data-time);
  position: absolute;
  top: 0;
  color: #fff;
  background: #111;
  overflow: hidden;
  width: 720px;
  height: 128px;
  clip: rect(0, 900px, 0, 0);
}

.clock span:before {
  left: calc(-2px);
  text-shadow: 2px 0 blue;
  animation: c2 1s infinite linear alternate-reverse;
}

.clock span:after {
  left: 3px;
  text-shadow: calc(-2px) 0 red;
  animation: c1 2s infinite linear alternate-reverse;
}

.clock.is-off {
  animation: is-off 2s linear infinite !important;
}

.glitch:before {
  position: absolute;
  z-index: 999999;
  content: "";
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  -webkit-animation: bg-move 2s linear infinite;
  animation: bg-move 2s linear infinite;
  background-size: 100% 8px;
  background-image: linear-gradient(
    0,
    rgba(255, 255, 255, 0.05) 10%,
    transparent 10%,
    transparent 50%,
    rgba(255, 255, 255, 0.05) 50%,
    rgba(255, 255, 255, 0.05) 60%,
    transparent 60%,
    transparent
  );
}

.glitch .figure,
.glitch .figure-mask {
  -webkit-transform: skewX(0deg) scaleY(1);
  transform: skewX(0deg) scaleY(1);
  -webkit-animation: tr-bag 4s linear infinite;
  animation: tr-bag 4s linear infinite;
}

.glitch .clock {
  -webkit-transform: skewX(0deg) scaleY(1);
  transform: skewX(0deg) scaleY(1);
  -webkit-animation: clock-bag 4s linear infinite;
  animation: clock-bag 4s linear infinite;
}

.glitch .clock span:before,
.glitch .clock span:after {
  display: block;
  content: attr(data-time);
  position: absolute;
  top: 0;
  color: #fff;
  background: #111;
  overflow: hidden;
  width: 720px;
  height: 128px;
  clip: rect(0, 900px, 0, 0);
}

.glitch .clock span:before {
  left: -2px;
  text-shadow: 2px 0 #00f;
  animation: c2 1s infinite linear alternate-reverse;
}

.glitch .clock span:after {
  left: 3px;
  text-shadow: -2px 0 #f00;
  animation: c1 2s infinite linear alternate-reverse;
}

@keyframes c1 {
  0% {
    clip: rect(100px, 9999px, 38px, 0);
  }

  5% {
    clip: rect(66px, 9999px, 84px, 0);
  }

  10% {
    clip: rect(7px, 9999px, 82px, 0);
  }

  15% {
    clip: rect(11px, 9999px, 11px, 0);
  }

  20% {
    clip: rect(31px, 9999px, 27px, 0);
  }

  25% {
    clip: rect(65px, 9999px, 18px, 0);
  }

  30% {
    clip: rect(49px, 9999px, 52px, 0);
  }

  35% {
    clip: rect(84px, 9999px, 96px, 0);
  }

  40% {
    clip: rect(60px, 9999px, 83px, 0);
  }

  45% {
    clip: rect(95px, 9999px, 63px, 0);
  }

  50% {
    clip: rect(13px, 9999px, 21px, 0);
  }

  55% {
    clip: rect(30px, 9999px, 84px, 0);
  }

  60% {
    clip: rect(84px, 9999px, 20px, 0);
  }

  65% {
    clip: rect(34px, 9999px, 29px, 0);
  }

  70% {
    clip: rect(60px, 9999px, 56px, 0);
  }

  75% {
    clip: rect(65px, 9999px, 58px, 0);
  }

  80% {
    clip: rect(34px, 9999px, 74px, 0);
  }

  85% {
    clip: rect(18px, 9999px, 22px, 0);
  }

  90% {
    clip: rect(36px, 9999px, 85px, 0);
  }

  95% {
    clip: rect(48px, 9999px, 69px, 0);
  }

  100% {
    clip: rect(45px, 9999px, 42px, 0);
  }
}

@keyframes c2 {
  0% {
    clip: rect(55px, 9999px, 57px, 0);
  }

  5% {
    clip: rect(26px, 9999px, 56px, 0);
  }

  10% {
    clip: rect(73px, 9999px, 56px, 0);
  }

  15% {
    clip: rect(4px, 9999px, 4px, 0);
  }

  20% {
    clip: rect(49px, 9999px, 1px, 0);
  }

  25% {
    clip: rect(79px, 9999px, 65px, 0);
  }

  30% {
    clip: rect(59px, 9999px, 81px, 0);
  }

  35% {
    clip: rect(70px, 9999px, 48px, 0);
  }

  40% {
    clip: rect(27px, 9999px, 50px, 0);
  }

  45% {
    clip: rect(100px, 9999px, 9px, 0);
  }

  50% {
    clip: rect(55px, 9999px, 6px, 0);
  }

  55% {
    clip: rect(69px, 9999px, 40px, 0);
  }

  60% {
    clip: rect(73px, 9999px, 99px, 0);
  }

  65% {
    clip: rect(61px, 9999px, 42px, 0);
  }

  70% {
    clip: rect(25px, 9999px, 68px, 0);
  }

  75% {
    clip: rect(58px, 9999px, 46px, 0);
  }

  80% {
    clip: rect(9px, 9999px, 89px, 0);
  }

  85% {
    clip: rect(20px, 9999px, 24px, 0);
  }

  90% {
    clip: rect(54px, 9999px, 90px, 0);
  }

  95% {
    clip: rect(83px, 9999px, 36px, 0);
  }

  100% {
    clip: rect(15px, 9999px, 36px, 0);
  }

  23% {
    transform: scaleX(0.8);
  }
}

@keyframes clock-bag {
  0% {
    transform: translate(1px, 2px);
  }

  2% {
    transform: translate(1px, 5px);
  }

  4% {
    transform: translate(5px, 5px);
  }

  6% {
    transform: translate(4px, 3px);
  }

  8% {
    transform: translate(5px, 2px);
  }

  10% {
    transform: translate(2px, 4px);
  }

  12% {
    transform: translate(1px, 2px);
  }

  14% {
    transform: translate(5px, 3px);
  }

  16% {
    transform: translate(4px, 2px);
  }

  18% {
    transform: translate(5px, 3px);
  }

  20% {
    transform: translate(4px, 1px);
  }

  22% {
    transform: translate(1px, 5px);
  }

  24% {
    transform: translate(1px, 5px);
  }

  26% {
    transform: translate(5px, 4px);
  }

  28% {
    transform: translate(5px, 5px);
  }

  30% {
    transform: translate(2px, 3px);
  }

  32% {
    transform: translate(5px, 1px);
  }

  34% {
    transform: translate(2px, 4px);
  }

  36% {
    transform: translate(1px, 4px);
  }

  38% {
    transform: translate(4px, 3px);
  }

  40% {
    transform: translate(5px, 4px);
  }

  42% {
    transform: translate(1px, 5px);
  }

  44% {
    transform: translate(5px, 2px);
  }

  46% {
    transform: translate(1px, 2px);
  }

  48% {
    transform: translate(4px, 4px);
  }

  50% {
    transform: translate(5px, 4px);
  }

  52% {
    transform: translate(4px, 2px);
  }

  54% {
    transform: translate(3px, 4px);
  }

  56% {
    transform: translate(1px, 1px);
  }

  58% {
    transform: translate(1px, 2px);
  }

  60% {
    transform: translate(3px, 1px);
  }

  62% {
    transform: translate(2px, 5px);
  }

  64% {
    transform: translate(1px, 2px);
  }

  66% {
    transform: translate(5px, 5px);
  }

  68% {
    transform: translate(1px, 1px);
  }

  70% {
    transform: translate(2px, 1px);
  }

  72% {
    transform: translate(3px, 4px);
  }

  74% {
    transform: translate(2px, 2px);
  }

  76% {
    transform: translate(1px, 3px);
  }

  78% {
    transform: translate(5px, 3px);
  }

  80% {
    transform: translate(3px, 2px);
  }

  82% {
    transform: translate(3px, 1px);
  }

  84% {
    transform: translate(1px, 4px);
  }

  86% {
    transform: translate(4px, 3px);
  }

  88% {
    transform: translate(3px, 1px);
  }

  90% {
    transform: translate(1px, 5px);
  }

  92% {
    transform: translate(1px, 4px);
  }

  94% {
    transform: translate(2px, 1px);
  }

  96% {
    transform: translate(2px, 4px);
  }

  98% {
    transform: translate(1px, 5px);
  }

  100% {
    transform: translate(2px, 4px);
  }

  1% {
    transform: scaleY(1) skewX(0deg);
  }

  1.5% {
    transform: scaleY(3) skewX(-60deg);
  }

  51% {
    transform: scaleX(1) scaleY(1) skewX(0deg);
  }

  52% {
    transform: scaleX(1.5) scaleY(0.2) skewX(80deg);
  }

  53% {
    transform: scaleX(1) scaleY(1) skewX(0deg);
  }
}

@keyframes is-off {
  0%,
  50%,
  80%,
  85% {
    opacity: 1;
  }

  56%,
  57%,
  81%,
  84% {
    opacity: 0;
  }

  58% {
    opacity: 1;
  }

  71%,
  73% {
    transform: scaleY(1) skewX(0deg);
  }

  72% {
    transform: scaleY(3) skewX(-60deg);
  }

  91%,
  93% {
    transform: scaleX(1) scaleY(1) skewX(0deg);
    color: #fff;
  }

  92% {
    transform: scaleX(1.5) scaleY(0.2) skewX(80deg);
    color: green;
  }
}
</style>
