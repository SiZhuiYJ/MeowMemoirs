<template>
  <div class="banner-container">
    <div class="banner" ref="bannerRef">
      <div class="assets">
        <img :src="bgImage" alt="Background" class="bg-image" />
        <h3 class="cupcakes-title">{{ title }}</h3>
        <img :src="cupcakeImage" alt="Cupcake" class="cupcake-image" />
      </div>

      <div class="blur">
        <div
          v-for="index in 5"
          :key="index"
          class="layer"
          :style="`--index: ${index}`"
        ></div>
      </div>

      <div class="content">
        <p><i class="fas fa-map-marker-alt"></i> {{ locationName }}</p>
        <p>
          <i>{{ locationAddress }}</i>
        </p>
      </div>

      <div v-if="isMobile" class="mobile-notice">倾斜手机查看3D效果</div>

      <div class="device-controls">
        <button class="btn" @click="enableDeviceOrientation">
          <i class="fas" :class="gyroEnabled ? 'fa-check' : 'fa-compass'"></i>
          <span>{{ gyroEnabled ? "陀螺仪已启用" : "启用陀螺仪" }}</span>
        </button>
        <button class="btn" @click="resetPosition">
          <i class="fas fa-sync"></i>
          <span>重置位置</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";

// Props
interface Props {
  bgImage?: string;
  cupcakeImage?: string;
  title?: string;
  locationName?: string;
  locationAddress?: string;
}

withDefaults(defineProps<Props>(), {
  bgImage:
    "https://images.unsplash.com/photo-1506459225024-1428097a7e18?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
  cupcakeImage: "https://cdn-icons-png.flaticon.com/512/3081/3081989.png",
  title: "CUPCAKES",
  locationName: "Sweet Dreams Bakery",
  locationAddress: "Los Angeles, CA",
});

// Refs
const bannerRef = ref<HTMLElement | null>(null);
const gyroEnabled = ref(false);
const isMobile = ref(false);

// 更新视差位置
const updatePosition = (x: number, y: number) => {
  document.documentElement.style.setProperty("--x", `${x}`);
  document.documentElement.style.setProperty("--y", `${y}`);
};

// 鼠标移动处理
const handleMouseMove = (event: MouseEvent) => {
  if (!bannerRef.value) return;

  const rect = bannerRef.value.getBoundingClientRect();
  const x = (event.clientX - rect.left) / rect.width;
  const y = (event.clientY - rect.top) / rect.height;

  const normalizedX = (x - 0.5) * 2;
  const normalizedY = (y - 0.5) * 2;

  updatePosition(normalizedX, normalizedY);
};

// 设备方向处理
const handleDeviceOrientation = (event: DeviceOrientationEvent) => {
  if (!gyroEnabled.value) return;

  const isLandscape = window.matchMedia("(orientation: landscape)").matches;
  const beta = event.beta || 0; // 前后倾斜
  const gamma = event.gamma || 0; // 左右倾斜

  let xVal, yVal;

  if (isLandscape) {
    xVal = Math.max(-1, Math.min(1, beta / 45));
    yVal = Math.max(-1, Math.min(1, gamma / 45));
  } else {
    xVal = Math.max(-1, Math.min(1, gamma / 45));
    yVal = Math.max(-1, Math.min(1, beta / 45));
  }

  updatePosition(xVal, -yVal);
};

// 触摸设备处理
const handleTouchMove = (event: TouchEvent) => {
  event.preventDefault();
  if (event.touches.length > 0 && bannerRef.value) {
    const touch = event.touches[0];
    const rect = bannerRef.value.getBoundingClientRect();
    const x = (touch.clientX - rect.left) / rect.width;
    const y = (touch.clientY - rect.top) / rect.height;

    const normalizedX = (x - 0.5) * 2;
    const normalizedY = (y - 0.5) * 2;

    updatePosition(normalizedX, normalizedY);
  }
};

// 启用设备方向
const enableDeviceOrientation = async () => {
  if (
    typeof DeviceOrientationEvent !== "undefined" &&
    typeof (DeviceOrientationEvent as any).requestPermission === "function"
  ) {
    try {
      const permission = await (DeviceOrientationEvent as any).requestPermission();
      if (permission === "granted") {
        setupGyro();
      } else {
        alert("需要设备方向权限才能使用此功能");
      }
    } catch (error) {
      console.error("设备方向权限请求失败:", error);
      alert("无法请求设备方向权限");
    }
  } else {
    setupGyro();
  }
};

const setupGyro = () => {
  window.addEventListener("deviceorientation", handleDeviceOrientation);
  gyroEnabled.value = true;
};

// 重置位置
const resetPosition = () => {
  updatePosition(0, 0);
};

// 检测移动设备
const checkIfMobile = () => {
  isMobile.value = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
};

// 生命周期钩子
onMounted(() => {
  checkIfMobile();

  if (bannerRef.value) {
    bannerRef.value.addEventListener("mousemove", handleMouseMove);
    bannerRef.value.addEventListener("touchmove", handleTouchMove, { passive: false });
  }
});

onBeforeUnmount(() => {
  if (bannerRef.value) {
    bannerRef.value.removeEventListener("mousemove", handleMouseMove);
    bannerRef.value.removeEventListener("touchmove", handleTouchMove);
  }
  window.removeEventListener("deviceorientation", handleDeviceOrientation);
});
</script>

<style scoped lang="scss">
.banner-container {
  width: 100%;
  max-width: 600px;
  aspect-ratio: 2 / 1.1;
  position: relative;
  overflow: hidden;
  border-radius: 25px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.25);
  touch-action: none;
  margin: 0 auto;
}

:root {
  --x: 0;
  --y: 0;
}

.banner {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
}

.assets {
  position: absolute;
  inset: 0;
  overflow: hidden;
  z-index: 0;

  img {
    position: absolute;
    top: 50%;
    left: 50%;
    height: 100%;
    width: 100%;
    object-fit: cover;
    object-position: center 43%;
    user-select: none;
    pointer-events: none;
    transform: translate(-50%, -50%);
  }

  .bg-image {
    filter: saturate(1.5) brightness(0.9);
    object-position: calc(50% + (var(--x) * 30px)) calc(50% + (var(--y) * -20px));
    transition: transform 0.1s ease-out;
  }

  .cupcake-image {
    width: 250px;
    height: 250px;
    object-fit: contain;
    object-position: calc(50% + (var(--x) * 40px)) calc(50% + (var(--y) * 10px));
    z-index: 99;
    filter: drop-shadow(0 5px 15px rgba(0, 0, 0, 0.2));
  }

  .cupcakes-title {
    position: absolute;
    left: 50%;
    top: 30%;
    margin: 0;
    font-size: 7rem;
    text-transform: uppercase;
    font-family: "Bebas Neue", sans-serif;
    color: white;
    transform: translate(calc(-50% + (var(--x) * -30px)), calc(var(--y) * -20px));
    z-index: 4;
    text-shadow: 0 3px 10px rgba(0, 0, 0, 0.3);
    letter-spacing: 3px;
  }
}

.blur {
  --layers: 5;
  position: absolute;
  inset: 0;
  z-index: 1;

  .layer {
    position: absolute;
    inset: 0;
    background: hsl(0 0% 60% / 0.015);
    backdrop-filter: blur(min(calc(var(--blur) * 1px), 4px));
    mask: radial-gradient(
      180% 160% at 45% 90%,
      #fff 10%,
      #0000 calc((10 + var(--stop)) * 1%)
    );
    z-index: 2;
    --blur: calc(sin(((var(--layers) - var(--index)) / var(--layers)) * 90deg) * 5);
    --stop: calc(sin(((var(--index)) / var(--layers)) * 90deg) * 25);
  }
}

.content {
  min-height: 32%;
  position: absolute;
  bottom: 0;
  width: 100%;
  color: white;
  display: grid;
  gap: 0.2rem;
  place-items: center;
  align-content: center;
  padding-bottom: 1.5rem;
  z-index: 3;
  background: linear-gradient(to top, rgba(90, 42, 39, 0.85), transparent);
  padding-top: 2rem;

  p {
    margin: 0;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 1.2rem;
    position: relative;
    font-weight: 500;

    &:first-of-type::after {
      content: "";
      position: absolute;
      bottom: calc(100% + 1rem);
      left: 50%;
      width: 20ch;
      background: rgba(255, 255, 255, 0.5);
      height: 1px;
      transform: translateX(-50%);
    }

    &:last-of-type {
      opacity: 0.9;
      font-size: 0.9rem;
    }
  }
}

.mobile-notice {
  display: none;
  position: absolute;
  bottom: 20px;
  left: 0;
  right: 0;
  text-align: center;
  color: white;
  font-size: 0.9rem;
  z-index: 10;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
  animation: pulse 2s infinite;
}

.device-controls {
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 100;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.btn {
  background: rgba(90, 42, 39, 0.85);
  color: white;
  border: none;
  border-radius: 50px;
  padding: 10px 20px;
  font-family: "Poppins", sans-serif;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  backdrop-filter: blur(5px);

  &:hover {
    background: rgba(122, 58, 54, 0.9);
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(1px);
  }

  i {
    font-size: 1.2rem;
  }
}

@keyframes pulse {
  0% {
    opacity: 0.7;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0.7;
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .cupcakes-title {
    font-size: 5.5rem !important;
    top: 25% !important;
  }

  .cupcake-image {
    width: 200px !important;
    height: 200px !important;
  }

  .content p {
    font-size: 1rem !important;

    &:last-of-type {
      font-size: 0.8rem !important;
    }
  }

  .mobile-notice {
    display: block;
  }
}

@media (max-width: 480px) {
  .banner-container {
    border-radius: 15px;
  }

  .cupcakes-title {
    font-size: 4rem !important;
  }

  .btn {
    padding: 8px 15px;
    font-size: 0.9rem;
  }
}
</style>
