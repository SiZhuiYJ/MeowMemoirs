<script lang="ts" setup>
  import { ref,
    onMounted } from "vue";

  const wrapper = ref < HTMLDivElement > ();
  const videoEl = ref < HTMLVideoElement > ();

  async function checkCamera() {
    const navigator = window.navigator.mediaDevices;
    const devices = await navigator.enumerateDevices();
    if (devices) {
      const stream = await navigator.getUserMedia({
        audio: false,
        video: {
          width: 300,
          height: 300,
          // facingMode: { exact: "environment" }, //强制后置摄像头
          facingMode: "user", //前置摄像头
        },
      });
      if (!videoEl.value) return;

      videoEl.value.srcObject = stream;
      videoEl.value.play();
    }
  }

  function shoot() {
    if (!videoEl.value || !wrapper.value) return;
    const canvas = document.createElement("canvas");
    canvas.width = videoEl.value.videoWidth;
    canvas.height = videoEl.value.videoHeight;
    //拿到 canvas 上下文对象
    const ctx = canvas.getContext("2d");
    ctx?.drawImage(videoEl.value, 0, 0, canvas.width, canvas.height);
    wrapper.value.appendChild(canvas);
  }

  onMounted(() => {
    checkCamera();
  });
</script>
<template>
  <div ref="wrapper" class="w-full h-full bg-red flex flex-col items-center">
    <video ref="videoEl" />
    <div
      @click="shoot"
      class="w-100px leading-100px text-center bg-black text-30px"
      >
      拍摄
    </div>
  </div>
</template>
<style scoped lang="scss">
</style>