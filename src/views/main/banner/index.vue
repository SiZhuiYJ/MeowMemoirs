<template>
  <div ref="banner" class="container">
    <article @click="startDeviceOrientation" @mousemove="updatePosition">
      <div class="assets">
        <img
          src="http://mattcannon.games/codepen/sweet-treats/bg.webp"
          alt="Background clouds"
          class="bg-image"
        />
        <h3>CUPCAKES</h3>
        <img
          src="http://mattcannon.games/codepen/sweet-treats/cup-cake.png"
          alt="Cupcake"
          class="cupcake-image"
        />
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
        <p><i class="fas fa-map-marker-alt"></i> Sweet Dreams Bakery</p>
        <p><i>Los Angeles, CA</i></p>
      </div>
    </article>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, useTemplateRef } from "vue";
const bannerRef = useTemplateRef("banner");

const updatePosition = (event: MouseEvent) => {
  if (bannerRef.value) {
    bannerRef.value;
    const x = (event.clientX / bannerRef.value.clientWidth - 0.5) * 2;
    const y = (event.clientY / bannerRef.value.clientHeight - 0.5) * 2;
    document.documentElement.style.setProperty("--x", `${x}`);
    document.documentElement.style.setProperty("--y", `${y}`);
  }
};

const handleOrientation = (event: DeviceOrientationEvent) => {
  console.log("handleOrientation");

  const isLandscape = window.matchMedia("(orientation: landscape)").matches;
  const beta = event.beta || 0;
  const gamma = event.gamma || 0;

  const xVal = Math.max(-1, Math.min(1, isLandscape ? beta / 45 : gamma / 45));
  const yVal = Math.max(-1, Math.min(1, isLandscape ? Math.abs(gamma) / 45 : beta / 45));

  document.documentElement.style.setProperty("--x", `${xVal}`);
  document.documentElement.style.setProperty("--y", `${yVal}`);
};

const startDeviceOrientation = async () => {
  console.log("startDeviceOrientation");
  if ("requestPermission" in DeviceOrientationEvent) {
    try {
      const permission = await (DeviceOrientationEvent as any).requestPermission();
      if (permission === "granted") {
        window.addEventListener("deviceorientation", handleOrientation);
      }
    } catch (error) {
      console.error("Device orientation permission denied:", error);
    }
  } else {
    window.addEventListener("deviceorientation", handleOrientation);
  }
};

onMounted(() => {
  if (bannerRef.value) bannerRef.value.addEventListener("mousemove", updatePosition);
});

onBeforeUnmount(() => {
  if (bannerRef.value) bannerRef.value.removeEventListener("mousemove", updatePosition);
  window.removeEventListener("deviceorientation", handleOrientation);
});
</script>

<style scoped lang="scss">
.container {
  display: flex;
  place-items: center;
  justify-content: center;
  // min-height: 100svh;
  // padding: 0.5rem;
  background: linear-gradient(to bottom, #e68d9f, #ffffff),
    url("https://www.transparenttextures.com/patterns/asfalt-light.png");
  background-blend-mode: overlay;
  touch-action: none;
  // 隐藏超出的部分
  overflow: hidden;
}

:root {
  --x: 0;
  --y: 0;
}

article {
  width: 100%;
  // width: 600px;
  aspect-ratio: 2 / 1.1;
  // max-height: calc(100svh - 2rem);
  height: 100%;
  position: relative;
  overflow: hidden;
  // border-radius: 4em;
  // max-width: calc(100% - 2rem);
  filter: drop-shadow(0 10px 20px rgba(0, 0, 0, 0.1));

  @media (orientation: portrait) {
    min-height: 330px;
  }
}

.assets {
  position: absolute;
  inset: 0;
  // border-radius: 4em;
  overflow: hidden;
  z-index: 0;

  img {
    position: absolute;
    top: 50%;
    left: 50%;
    height: 100%;
    width: 100%;
    // width: 660px;
    object-fit: cover;
    object-position: center 43%;
    user-select: none;
    pointer-events: none;
    // transform: translateX(-50%);
    transform: translate(-50%, -50%);
  }

  .bg-image {
    filter: saturate(1.5) brightness(0.9);
    object-position: calc(50% + (var(--x) * 30px)) calc(50% + (var(--y) * -20px));
  }

  .cupcake-image {
    width: 250px;
    height: 250px;
    object-position: calc(50% + (var(--x) * 40px)) calc(50% + (var(--y) * 10px));
    z-index: 99;
  }

  h3 {
    position: absolute;
    left: 50%;
    top: 30%;
    margin: 0;
    font-size: 8rem;
    text-transform: uppercase;
    font-family: "Bebas Neue", sans-serif;
    color: white;
    transform: translate(calc(-50% + (var(--x) * -30px)), calc(var(--y) * -20px));
    z-index: 4;
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
  padding-bottom: 0.5rem;
  z-index: 3;

  p {
    margin: 0;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 1.2rem;
    position: relative;

    &:first-of-type::after {
      content: "";
      position: absolute;
      bottom: calc(100% + 1rem);
      left: 50%;
      width: 20ch;
      background: white;
      height: 1px;
      transform: translateX(-50%);
    }

    &:last-of-type {
      opacity: 0.8;
      font-size: 0.8rem;
    }
  }
}
</style>
