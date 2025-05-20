<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from "vue";
import throttle from "lodash.throttle";
import type { ShowData, VideoData } from "./type";
const props = withDefaults(
  defineProps<{
    showdata: ShowData;
    modelValue: boolean;
    autoplay?: boolean;
    muted?: boolean;
    preload?: "auto" | "metadata" | "none";
  }>(),
  {
    modelValue: false,
    autoplay: false,
    muted: false,
    preload: "auto",
  }
);

const emit = defineEmits<{
  (e: "error", error: Error): void;
  (e: "play"): void;
  (e: "pause"): void;
  (e: "volume-change", volume: number): void;
  (e: "rate-change", rate: number): void;
  (e: "error", error: Error): void;

  // v-model 双向绑定事件（注意参数类型）
  (e: "update:modelValue", value: boolean): void;
}>();

// 关闭处理
const handleClose = () => {
  const video = videoRef.value;
  if (video) video!.pause();
  emit("update:modelValue", false); // 这里第二个参数类型要与定义保持一致
};

// DOM 引用
const videoRef = ref<HTMLVideoElement | null>(null);
const containerRef = ref<HTMLElement | null>(null);

// 组件状态
const isPlaying = ref(false);
const currentTime = ref(0);
const duration = ref(0);
const volume = ref(1);
const isMuted = ref(props.muted);
const playbackRate = ref(1);
const isFullscreen = ref(false);
const showControls = ref(true);
const bufferProgress = ref(0);
const isLoading = ref(false);
const lastVolumeBeforeMute = ref(1);
const controlsTimer = ref<number | null>(null);
const maxSupportedRate = ref(16);

const rotateAngle = ref(0); // 0, 90, 180, 270
const flipHorizontal = ref(1);
const flipVertical = ref(1);
const isNeat = ref(true);

// 常量
const playbackRates = [0.25, 0.5, 0.75, 1, 2, 4, 8, 16, 32];

const isVolumePanelVisible = ref(false);
const isTransformControls = ref(false);
const toggleVolumePanel = () => {
  isVolumePanelVisible.value = !isVolumePanelVisible.value;
};
const toggleTransformControls = () => {
  isTransformControls.value = !isTransformControls.value;
};

const dataList = ref<VideoData>({
  like: 0,
  share: 0,
  collect: 0,
  comment: 0,
  isLike: false,
  isShare: false,
  isCollect: false,
  isComment: false,
});

const handleIsLike = () => {
  if (dataList.value.isLike) {
    dataList.value.like--;
    dataList.value.isLike = false;
  } else {
    dataList.value.like++;
    dataList.value.isLike = true;
  }
};
const handleIsShare = () => {
  if (dataList.value.isShare) {
    dataList.value.share--;
    dataList.value.isShare = false;
  } else {
    dataList.value.share++;
    dataList.value.isShare = true;
  }
};
const handleIsCollect = () => {
  if (dataList.value.isCollect) {
    dataList.value.collect--;
    dataList.value.isCollect = false;
  } else {
    dataList.value.collect++;
    dataList.value.isCollect = true;
  }
};
const handleisComment = () => {
  if (dataList.value.isComment) {
    dataList.value.comment--;
    dataList.value.isComment = false;
  } else {
    dataList.value.comment++;
    dataList.value.isComment = true;
  }
};

// 可选：ESC 键关闭支持
const onKeydown = (e: KeyboardEvent) => {
  if (e.key === "Escape" && props.modelValue) {
    handleClose();
  }
};

const handleChange = (current: number, prev: number) => {
  console.log("前", current);
  console.log("后", prev);
};

// 监听显示状态来添加/移除事件监听
watch(
  () => props.modelValue,
  (val) => {
    if (val) {
      window.addEventListener("keydown", onKeydown);
    } else {
      window.removeEventListener("keydown", onKeydown);
    }
  }
);

// 在setup脚本中添加
const progress = computed(() => {
  return duration.value > 0 ? (currentTime.value / duration.value) * 100 : 0;
});

// 生命周期钩子
onMounted(() => {
  const video = videoRef.value;
  if (video) {
    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("progress", handleProgress);
  }
  initEventListeners();
  detectRateSupport();
});

onUnmounted(() => {
  cleanupEventListeners();
  cancelAnimationFrameControls();
});

// 事件监听器
const initEventListeners = () => {
  document.addEventListener("fullscreenchange", handleFullscreenChange);
  document.addEventListener("keydown", handleGlobalKeyboard);
};

const cleanupEventListeners = () => {
  document.removeEventListener("fullscreenchange", handleFullscreenChange);
  document.removeEventListener("keydown", handleGlobalKeyboard);
};

// 初始化检测
const detectRateSupport = () => {
  try {
    const testVideo = document.createElement("video");
    testVideo.playbackRate = 32;
    if (testVideo.playbackRate !== 32) {
      maxSupportedRate.value = 16;
    }
  } catch {
    maxSupportedRate.value = 16;
  }
};

// 时间格式化
const formatTime = (seconds: number) => {
  const date = new Date(0);
  date.setSeconds(seconds);
  return date.toISOString().substring(11, 19);
};

// 播放控制
const togglePlay = async () => {
  if (props.showdata.type === "video") {
    const video = videoRef.value;
    if (!video) return;
    isLoading.value = true;
    try {
      if (isPlaying.value) {
        video.pause();
      } else {
        video.play();
      }
      isPlaying.value = !isPlaying.value;
    } catch (error) {
      handlePlayError(error);
    } finally {
      isLoading.value = false;
      resetControlsTimer();
    }
  } else {
    isPlaying.value = !isPlaying.value;
  }
};

const handlePlayError = (error: unknown) => {
  let message = "播放错误";
  if (error instanceof Error) {
    message = error.name === "NotAllowedError" ? "需要用户交互后才能播放" : error.message;
  }
  emit("error", new Error(message));
};

// 音量控制
const handleVolumeChange = (e: Event) => {
  const target = e.target as HTMLInputElement;
  const newVolume = parseFloat(target.value);
  volume.value = newVolume;
  if (videoRef.value) {
    videoRef.value.volume = newVolume;
    videoRef.value.muted = newVolume === 0;
  }
  emit("volume-change", newVolume);
};

const toggleMute = () => {
  isMuted.value = !isMuted.value;
  if (videoRef.value) {
    videoRef.value.muted = isMuted.value;
    if (isMuted.value) {
      lastVolumeBeforeMute.value = volume.value;
      volume.value = 0;
    } else {
      volume.value = lastVolumeBeforeMute.value;
    }
  }
};

// 播放速率控制
watch(playbackRate, (newRate) => {
  const clampedRate = Math.min(maxSupportedRate.value, Math.max(0.25, newRate));
  if (videoRef.value) {
    try {
      videoRef.value.playbackRate = clampedRate;
      if (newRate !== clampedRate) {
        playbackRate.value = clampedRate;
      }
      emit("rate-change", clampedRate);
    } catch (error) {
      emit("error", new Error(`播放速率设置失败: ${error}`));
    }
  }
});

// 全屏控制
const toggleFullscreen = async () => {
  try {
    if (isFullscreen.value) {
      await document.exitFullscreen();
    } else if (containerRef.value) {
      await containerRef.value.requestFullscreen();
    }
  } catch (error) {
    emit("error", new Error(`全屏操作失败: ${error}`));
  }
};

const handleFullscreenChange = () => {
  isFullscreen.value = !!document.fullscreenElement;
};

// 控制栏逻辑
const resetControlsTimer = () => {
  showControls.value = true;
  cancelAnimationFrameControls();
  controlsTimer.value = window.setTimeout(() => {
    showControls.value = false;
  }, 3000);
};

const cancelAnimationFrameControls = () => {
  if (controlsTimer.value) {
    clearTimeout(controlsTimer.value);
    controlsTimer.value = null;
  }
};

const hideControls = () => {
  showControls.value = false;
};

// 键盘控制
const handleKeyboard = (e: KeyboardEvent) => {
  switch (e.key.toLowerCase()) {
    case " ":
      e.preventDefault();
      togglePlay();
      break;
    case "m":
      toggleMute();
      break;
    case "arrowleft":
      seekRelative(-5);
      break;
    case "arrowright":
      seekRelative(5);
      break;
    case "r":
      rotateVideo(90);
      break;
    case "shift+r":
      rotateVideo(-90);
      break;
  }
};

const handleGlobalKeyboard = (e: KeyboardEvent) => {
  if (e.ctrlKey) {
    switch (e.key) {
      case "ArrowUp":
        playbackRate.value = Math.min(maxSupportedRate.value, playbackRate.value * 2);
        break;
      case "ArrowDown":
        playbackRate.value = Math.max(0.25, playbackRate.value / 2);
        break;
    }
  }
};

const seekRelative = (seconds: number) => {
  if (videoRef.value) {
    videoRef.value.currentTime += seconds;
  }
};

// 缓冲处理
const handleProgress = () => {
  const video = videoRef.value;
  if (video && video.buffered.length > 0) {
    const bufferedEnd = video.buffered.end(video.buffered.length - 1);
    bufferProgress.value = (bufferedEnd / video.duration) * 100;
  }
};

// 元数据加载
const handleLoadedMetadata = () => {
  const video = videoRef.value;
  if (video) {
    duration.value = video.duration;
    video.volume = volume.value;
    video.muted = isMuted.value;
    video.playbackRate = playbackRate.value;
    containerRef.value?.style.setProperty("--video-width", `${video.videoWidth}px`);
    containerRef.value?.style.setProperty("--video-height", `${video.videoHeight}px`);
  }
};

// 添加旋转方法
const rotateVideo = (degrees: number) => {
  rotateAngle.value = (rotateAngle.value + degrees) % 360;
};

// 添加翻转方法
const toggleFlip = (direction: "horizontal" | "vertical") => {
  if (direction === "horizontal") {
    flipHorizontal.value *= -1;
  } else {
    flipVertical.value *= -1;
  }
};

// 新增视频源切换处理
watch(
  () => props.showdata.MediaContent[0],
  (newSrc) => {
    resetVideoState();
    loadNewSource(newSrc);
  }
);

// 状态重置方法
const resetVideoState = () => {
  currentTime.value = 0;
  duration.value = 0;
  bufferProgress.value = 0;
  isPlaying.value = false;
  rotateAngle.value = 0;
  flipHorizontal.value = 1;
  flipVertical.value = 1;

  const video = videoRef.value;
  if (video) {
    video.pause();
    video.removeAttribute("src");
    video.load();
  }
};

// 安全加载新视频源
const loadNewSource = (src: string) => {
  const video = videoRef.value;
  if (!video) return;

  video.src = src;
  video.load();

  video.addEventListener(
    "loadedmetadata",
    () => {
      video.playbackRate = playbackRate.value;
      duration.value = video.duration;
    },
    { once: true }
  );

  // 错误处理
  const errorHandler = () => {
    emit("error", new Error(`无法加载视频源: ${src}`));
    video.removeEventListener("error", errorHandler);
  };
  video.addEventListener("error", errorHandler, { once: true });
};

// 安全操作方法
// const safeVideoOperation = (callback: (video: HTMLVideoElement) => void) => {
//   const video = videoRef.value;
//   if (video && video.readyState > 0) {
//     try {
//       callback(video);
//     } catch (error) {
//       handleVideoError(error);
//     }
//   }
// };

// 增强错误处理
// const handleVideoError = (error: unknown) => {
//   if (error instanceof Error) {
//     const message =
//       {
//         NotAllowedError: "需要用户交互后才能播放",
//         AbortError: "视频加载被中止",
//         NetworkError: "网络错误导致视频加载失败",
//       }[error.name] || error.message;

//     emit("error", new Error(message));
//   }
// };

// 计算transform样式
const videoTransform = computed(() => {
  return {
    transform: `rotate(${rotateAngle.value}deg) scale(${flipHorizontal.value}, ${flipVertical.value})`,
    // 处理不同旋转角度的宽高适配
    // width: rotateAngle.value % 180 === 0 ? 'auto' : '100%',
    // height: rotateAngle.value % 180 === 0 ? '100%' : 'auto'
  };
});
const isVideoReady = ref(false);

const handleReadyStateChange = () => {
  const video = videoRef.value;
  isVideoReady.value = video ? true : false && video!.readyState >= 2; // HAVE_CURRENT_DATA
};

// 更新时间处理逻辑
const handleTimeUpdate = throttle(() => {
  const video = videoRef.value;
  if (video) {
    currentTime.value = video.currentTime;
    duration.value = video.duration || 0;
  }
}, 200);

// 拖动处理
const handleSeek = (e: Event) => {
  const video = videoRef.value;
  const target = e.target as HTMLInputElement;
  if (video && duration.value) {
    const seekTime = (parseFloat(target.value) / 100) * duration.value;
    video.currentTime = seekTime;
  }
};
</script>

<template>
  <!-- 添加淡入淡出过渡 -->
  <transition name="fade">
    <div
      v-show="modelValue"
      class="show-data-container"
      ref="containerRef"
      tabindex="0"
      @keydown="handleKeyboard"
      @mousemove="resetControlsTimer"
      @mouseleave="hideControls"
    >
      <!--头 -->
      <div class="show-header"></div>
      <!-- 视频组件 -->
      <div class="show-data" v-if="showdata.type === 'video'">
        <div class="show-backdrop" style="">
          <img :src="showdata.coverImage" alt="" srcset="" />
        </div>
        <!-- 视频元素 -->
        <video
          ref="videoRef"
          :src="showdata.MediaContent[0]"
          :style="videoTransform"
          :poster="showdata.coverImage"
          :autoplay="autoplay"
          :preload="preload"
          @click="togglePlay"
          @dblclick="toggleFullscreen"
          @play="isPlaying = true"
          @pause="isPlaying = false"
          @timeupdate="handleTimeUpdate"
          @progress="handleProgress"
          @loadedmetadata="handleLoadedMetadata"
          class="video-content"
          @readystatechange="handleReadyStateChange"
        ></video>
      </div>
      <!-- 轮播组件 -->
      <el-carousel
        v-else-if="showdata.type === 'atlas'"
        :interval="5000"
        arrow="hover"
        class="show-data"
        :indicator-position="showControls ? '' : 'none'"
        :autoplay="isPlaying"
        @change="handleChange"
      >
        <el-carousel-item v-for="(u, i) in showdata.MediaContent" :key="i">
          <!-- 图片容器 -->
          <div class="show-backdrop" style="">
            <img :src="u" alt="" srcset="" />
          </div>
          <img
            class="show-img"
            :src="u"
            :alt="`展示图 ${i + 1}`"
            srcset=""
            :style="videoTransform"
          />
        </el-carousel-item>
      </el-carousel>
      <!-- 关闭按钮 -->
      <transition name="fade">
        <button
          v-show="isNeat"
          @click="handleClose"
          class="close-btn"
          aria-label="关闭展示"
        >
          <el-icon>
            <ArrowLeft />
          </el-icon>
        </button>
      </transition>
      <!-- 内容 isNeat ? showControls : false -->
      <transition name="fade">
        <div v-show="isNeat" class="show-content">
          <span class="info">
            <p class="info-name">@{{ showdata.userName }}</p>
            <p class="info-time">· {{ showdata.dateTime }}</p>
          </span>
          <span class="info-content">{{ showdata.content }}</span>
        </div>
      </transition>
      <!-- 控制栏 -->
      <transition name="fade">
        <div v-show="showControls" class="controls">
          <!-- 进度条 -->
          <div class="progress-bar" v-show="showdata.type === 'video'">
            <div class="buffer-progress" :style="{ width: `${bufferProgress}%` }" />
            <div class="current-progress" :style="{ width: `${progress}%` }" />
            <input
              type="range"
              min="0"
              :max="duration"
              :value="currentTime"
              @input="handleSeek"
              aria-label="视频进度"
              class="seek-bar"
            />
          </div>

          <!-- 控制按钮组 -->
          <div class="control-group">
            <!-- 播放/暂停 -->
            <button @click="togglePlay" :aria-label="isPlaying ? '暂停' : '播放'">
              <i class="cat-icon" v-show="isPlaying">
                <svg
                  t="1740803249511"
                  class="icon"
                  viewBox="0 0 1024 1024"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  p-id="1315"
                  width="30"
                  height="30"
                >
                  <path
                    d="M477.87008 716.8c0 37.5296-30.74048 68.27008-68.27008 68.27008h-68.27008c-37.5296 0-68.25984-30.74048-68.25984-68.27008V307.2c0-37.5296 30.73024-68.27008 68.25984-68.27008H409.6c37.5296 0 68.27008 30.74048 68.27008 68.27008v409.6zM750.92992 716.8c0 37.5296-30.73024 68.27008-68.25984 68.27008H614.4c-37.5296 0-68.27008-30.74048-68.27008-68.27008V307.2c0-37.5296 30.74048-68.27008 68.27008-68.27008h68.27008c37.5296 0 68.25984 30.74048 68.25984 68.27008v409.6z"
                    fill="#FFFFFF"
                    p-id="1316"
                  ></path>
                </svg>
              </i>
              <i class="cat-icon" v-show="!isPlaying">
                <svg
                  t="1740803239414"
                  class="icon"
                  viewBox="0 0 1024 1024"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  p-id="1149"
                  width="30"
                  height="30"
                >
                  <path
                    d="M341.32992 731.37152a53.73952 53.73952 0 0 0 53.77024 53.69856h0.43008c18.8416 0 35.90144-7.59808 48.27136-19.99872l228.92544-228.74112a34.1504 34.1504 0 0 0 0-48.19968L443.36128 258.92864a68.096 68.096 0 0 0-48.27136-19.99872 53.69856 53.69856 0 0 0-53.77024 53.73952v438.70208z"
                    fill="#FFFFFF"
                    p-id="1150"
                  ></path>
                </svg>
              </i>
            </button>

            <!-- 时间显示 -->
            <div class="time-display" v-show="showdata.type === 'video'">
              {{ formatTime(currentTime) }}/{{ formatTime(duration) }}
            </div>

            <!-- 音量控制 -->
            <div class="volume-control">
              <button
                @click="toggleVolumePanel"
                :aria-label="isMuted ? '取消静音' : '静音'"
              >
                <svg
                  t="1741082093466"
                  class="icon"
                  viewBox="0 0 1024 1024"
                  version="1.1"
                  v-if="isMuted || volume === 0"
                  xmlns="http://www.w3.org/2000/svg"
                  p-id="8025"
                  width="20"
                  height="20"
                >
                  <path
                    d="M100.1 399v221c0 30.5 24.7 55.3 55.3 55.3h82.9V343.7h-82.9c-30.5 0-55.3 24.8-55.3 55.3zM803 509.5l115.3-115.3c12.4-12.4 13.6-31.5 2.6-42.5s-30-9.9-42.5 2.6L763.1 469.6 647.9 354.3c-12.4-12.5-31.5-13.6-42.5-2.6s-9.9 30 2.6 42.5l115.3 115.3L608 624.8c-12.4 12.4-13.6 31.5-2.6 42.5s30 9.9 42.5-2.6l115.3-115.3 115.3 115.3c12.4 12.4 31.5 13.6 42.5 2.6s9.9-30-2.6-42.5L803 509.5zM486.9 178L293.5 306.9v405.2L486.9 841c30.5 0 55.3-24.7 55.3-55.3V233.2c-0.1-30.5-24.8-55.2-55.3-55.2z"
                    fill="#FFFFFF"
                    p-id="8026"
                  ></path>
                </svg>
                <svg
                  t="1741082233623"
                  class="icon"
                  viewBox="0 0 1024 1024"
                  version="1.1"
                  v-else
                  xmlns="http://www.w3.org/2000/svg"
                  p-id="9083"
                  width="20"
                  height="20"
                >
                  <path
                    d="M576 701.6v-65.6c55.2-14.4 96-64 96-124s-40.8-109.6-96-124v-65.6C666.4 337.6 736 416.8 736 512s-69.6 174.4-160 189.6z m0-568v64.8c145.6 29.6 256 159.2 256 313.6 0 154.4-110.4 284-256 313.6v64.8c181.6-30.4 320-188 320-378.4S757.6 164 576 133.6zM256 384H128v256h128l256 256V128L256 384z"
                    fill="#FFFFFF"
                    p-id="9084"
                  ></path>
                </svg>
              </button>
              <transition name="fade">
                <div v-show="isVolumePanelVisible" class="volume-panel">
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    :value="isMuted ? 0 : volume"
                    @input="handleVolumeChange"
                    aria-label="音量调节"
                    class="volume-slider vertical"
                  />
                </div>
              </transition>
            </div>

            <!-- 播放速率 -->
            <div class="playback-rate" v-show="showdata.type === 'video'">
              <select
                v-model.number="playbackRate"
                aria-label="播放速度"
                @change="resetControlsTimer"
              >
                <option
                  v-for="rate in playbackRates"
                  :key="rate"
                  :value="rate"
                  :disabled="rate > maxSupportedRate"
                >
                  {{ rate }}X
                </option>
              </select>
            </div>
            <!-- 清屏 -->
            <div class="clear-screen">
              <el-switch
                v-model="isNeat"
                inline-prompt
                active-text="显示"
                inactive-text="清屏"
                size="small"
              />
            </div>
            <!-- 旋转 -->
            <div class="transform-controls">
              <button @click="toggleTransformControls">
                <svg
                  t="1741700723396"
                  class="icon"
                  viewBox="0 0 1024 1024"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  p-id="4835"
                  width="20"
                  height="20"
                >
                  <path
                    d="M716.8 290.133333c-110.933333-102.4-281.6-106.666667-396.8-12.8S170.666667 537.6 247.466667 665.6c59.733333 106.666667 179.2 166.4 302.933333 149.333333s221.866667-102.4 256-221.866666c8.533333-34.133333 42.666667-51.2 76.8-42.666667 34.133333 8.533333 51.2 42.666667 42.666667 76.8-68.266667 226.133333-302.933333 354.133333-524.8 290.133333C174.933333 853.333333 42.666667 618.666667 106.666667 392.533333c42.666667-145.066667 153.6-256 298.666666-298.666666s298.666667 0 405.333334 102.4l81.066666-81.066667c8.533333-8.533333 21.333333-12.8 34.133334-8.533333 4.266667 12.8 12.8 21.333333 12.8 34.133333v264.533333c0 17.066667-12.8 29.866667-29.866667 29.866667h-260.266667c-12.8 0-25.6-8.533333-29.866666-17.066667s0-25.6 8.533333-34.133333l89.6-93.866667zM512 601.6c-46.933333 0-85.333333-38.4-85.333333-89.6s38.4-89.6 85.333333-89.6 85.333333 38.4 85.333333 89.6-38.4 89.6-85.333333 89.6z"
                    fill="#FFFFFF"
                    p-id="4836"
                  ></path>
                </svg>
              </button>
              <transition name="fade">
                <div v-show="isTransformControls" class="transform-bar">
                  <button @click="rotateVideo(90)" aria-label="顺时针旋转90度">
                    <svg
                      t="1741074833423"
                      class="icon"
                      viewBox="0 0 1024 1024"
                      version="1.1"
                      xmlns="http://www.w3.org/2000/svg"
                      p-id="4037"
                      width="20"
                      height="20"
                    >
                      <path
                        d="M832.0512 272.0256h-448a112.128 112.128 0 0 0-111.9744 112.0256v448a112.128 112.128 0 0 0 112.0256 112.0256h448a112.128 112.128 0 0 0 112.0256-111.9744v-448a112.128 112.128 0 0 0-112.0768-112.0768z m16.0256 560.0256a16.0256 16.0256 0 0 1-15.9744 16.0256h-448a16.0256 16.0256 0 0 1-15.9744-15.9744v-448a16.0256 16.0256 0 0 1 16.0256-15.9744h448a16.0256 16.0256 0 0 1 16.0256 16.0256z"
                        fill="#FFFFFF"
                        p-id="4038"
                      ></path>
                      <path
                        d="M464.0256 176.0256v16.0256a47.9232 47.9232 0 0 0 19.968 38.912 47.5648 47.5648 0 0 0 28.0576 9.1136 47.4112 47.4112 0 0 0 15.36-2.5088l192-64a47.9744 47.9744 0 0 0 32.8192-45.5168 47.9744 47.9744 0 0 0-32.8192-45.5168l-192-64a47.5136 47.5136 0 0 0-43.2128 6.6048 47.9232 47.9232 0 0 0-19.968 38.912v15.9744H384.256a304.3328 304.3328 0 0 0-303.9744 304.0256v256a48.0256 48.0256 0 0 0 48.0256 48.0256 48.0256 48.0256 0 0 0 48.0256-47.9744v-256A208.2304 208.2304 0 0 1 384.3584 176.128z"
                        fill="#FFFFFF"
                        p-id="4039"
                      ></path>
                    </svg>
                  </button>
                  <button @click="rotateVideo(-90)" aria-label="逆时针旋转90度">
                    <svg
                      t="1741075052707"
                      class="icon"
                      viewBox="0 0 1024 1024"
                      version="1.1"
                      xmlns="http://www.w3.org/2000/svg"
                      p-id="5023"
                      width="20"
                      height="20"
                    >
                      <path
                        d="M640.0512 272.0256h-448a112.128 112.128 0 0 0-111.9744 112.0256v448a112.128 112.128 0 0 0 112.0256 112.0256h448a112.128 112.128 0 0 0 112.0256-111.9744v-448a112.128 112.128 0 0 0-112.0768-112.0768z m16.0256 560.0256a16.0256 16.0256 0 0 1-15.9744 16.0256h-448a16.0256 16.0256 0 0 1-15.9744-15.9744v-448a16.0256 16.0256 0 0 1 16.0256-15.9744h448a16.0256 16.0256 0 0 1 16.0256 16.0256z"
                        fill="#FFFFFF"
                        p-id="5024"
                      ></path>
                      <path
                        d="M640.0512 80.0256h-79.9744v-15.9744a47.9232 47.9232 0 0 0-19.968-38.912 47.5136 47.5136 0 0 0-43.2128-6.6048l-192 64a47.9744 47.9744 0 0 0-32.8192 45.5168 47.9744 47.9744 0 0 0 32.8192 45.5168l192 64a47.4112 47.4112 0 0 0 15.36 2.5088 47.5648 47.5648 0 0 0 28.0576-9.1136 47.9232 47.9232 0 0 0 19.968-38.912v-15.9744h80.0256a208.2304 208.2304 0 0 1 207.7184 207.9744v256a48.0256 48.0256 0 0 0 48.0256 48.0256 48.0256 48.0256 0 0 0 48.0256-47.9744v-256a304.3328 304.3328 0 0 0-304.0256-304.0768z"
                        fill="#FFFFFF"
                        p-id="5025"
                      ></path>
                    </svg>
                  </button>
                  <button @click="toggleFlip('horizontal')" aria-label="水平翻转">
                    <svg
                      t="1741075120287"
                      class="icon"
                      viewBox="0 0 1024 1024"
                      version="1.1"
                      xmlns="http://www.w3.org/2000/svg"
                      p-id="6038"
                      width="20"
                      height="20"
                    >
                      <path
                        d="M252.76928 299.904l146.2784 0 0 472.42752-146.2784 0 0-472.42752Z"
                        fill="#FFFFFF"
                        p-id="6039"
                      ></path>
                      <path
                        d="M477.48096 85.34528l70.87104 0 0 885.80608-70.87104 0 0-885.80608Z"
                        fill="#FFFFFF"
                        p-id="6040"
                      ></path>
                      <path
                        d="M629.80096 284.8l31.0016 0 0 502.88128-31.0016 0L629.80096 284.8zM776.42752 284.8l31.0016 0 0 502.88128-31.0016 0L776.42752 284.8zM657.09056 315.8016l0-31.0016 123.04896 0 0 31.0016L657.09056 315.8016zM657.27488 787.64544l0-31.0016 123.04896 0 0 31.0016L657.27488 787.64544z"
                        fill="#FFFFFF"
                        p-id="6041"
                      ></path>
                    </svg>
                  </button>
                  <button @click="toggleFlip('vertical')" aria-label="垂直翻转">
                    <svg
                      t="1741075160297"
                      class="icon"
                      viewBox="0 0 1024 1024"
                      version="1.1"
                      xmlns="http://www.w3.org/2000/svg"
                      p-id="7046"
                      width="20"
                      height="20"
                    >
                      <path
                        d="M286.01856 250.91584l472.4224 0 0 146.2784-472.4224 0 0-146.2784Z"
                        fill="#FFFFFF"
                        p-id="7047"
                      ></path>
                      <path
                        d="M87.19872 475.62752l885.80096 0 0 70.87104-885.80096 0 0-70.87104Z"
                        fill="#FFFFFF"
                        p-id="7048"
                      ></path>
                      <path
                        d="M773.55008 627.94752l0 31.0016L270.6688 658.94912l0-31.0016L773.55008 627.94752zM773.55008 774.5792l0 31.0016L270.6688 805.5808l0-31.0016L773.55008 774.5792zM742.54848 655.24224l31.0016 0 0 123.04896-31.0016 0L742.54848 655.24224zM270.70464 655.42144l31.0016 0 0 123.04896-31.0016 0L270.70464 655.42144z"
                        fill="#FFFFFF"
                        p-id="7049"
                      ></path>
                    </svg>
                  </button>
                </div>
              </transition>
            </div>

            <!-- 全屏 -->
            <button
              @click="toggleFullscreen"
              :aria-label="isFullscreen ? '退出全屏' : '全屏'"
            >
              <svg
                t="1741074200936"
                class="icon"
                viewBox="0 0 1024 1024"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                p-id="4355"
                width="30"
                height="30"
                v-show="!isFullscreen"
              >
                <path
                  d="M368.896 192H224a32 32 0 0 0-32 32v137.888a32 32 0 0 0 64 0V256h112.896a32 32 0 0 0 0-64zM784.864 192H640a32 32 0 1 0 0 64h112.864v105.888a32 32 0 1 0 64 0V224a32 32 0 0 0-32-32zM368.896 777.92H256V672a32 32 0 1 0-64 0v137.92a32 32 0 0 0 32 32h144.896a32 32 0 1 0 0-64zM784.864 640a32 32 0 0 0-32 32v105.92H640a32 32 0 1 0 0 64h144.864a32 32 0 0 0 32-32V672a32 32 0 0 0-32-32z"
                  fill="#FFFFFF"
                  p-id="4356"
                ></path>
                <path
                  d="M912 48h-800c-35.296 0-64 28.704-64 64v800c0 35.296 28.704 64 64 64h800c35.296 0 64-28.704 64-64v-800c0-35.296-28.704-64-64-64z m-800 864v-800h800l0.064 800H112z"
                  fill="#FFFFFF"
                  p-id="4357"
                ></path>
              </svg>
              <svg
                t="1741074323184"
                class="icon"
                viewBox="0 0 1024 1024"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                p-id="6984"
                width="30"
                height="30"
                v-show="isFullscreen"
              >
                <path
                  d="M851.42 64.58H172.58c-59.65 0-108 48.35-108 108v678.84c0 59.65 48.35 108 108 108h678.84c59.65 0 108-48.35 108-108V172.58c0-59.65-48.35-108-108-108z m47 786.84c0 25.92-21.08 47-47 47H172.58c-25.92 0-47-21.08-47-47V172.58c0-25.92 21.08-47 47-47h678.84c25.92 0 47 21.08 47 47v678.84z"
                  fill="#FFFFFF"
                  p-id="6985"
                ></path>
                <path
                  d="M382.64 225.23h-0.08c-16.84 0.04-30.46 13.73-30.42 30.58l0.25 97.26h-99.14c-16.84 0-30.5 13.66-30.5 30.5s13.66 30.5 30.5 30.5h129.72c8.1 0 15.87-3.22 21.59-8.96a30.515 30.515 0 0 0 8.91-21.62l-0.33-127.84c-0.05-16.82-13.69-30.42-30.5-30.42zM381 608.3l-127.84 0.33c-16.84 0.04-30.46 13.73-30.42 30.58 0.04 16.82 13.69 30.42 30.5 30.42h0.08l97.26-0.25v99.14c0 16.84 13.66 30.5 30.5 30.5s30.5-13.66 30.5-30.5V638.8c0-8.1-3.22-15.87-8.96-21.59s-13.54-8.93-21.62-8.91zM765.08 353.47l-97.26 0.25v-99.14c0-16.84-13.66-30.5-30.5-30.5s-30.5 13.66-30.5 30.5V384.3c0 8.1 3.22 15.87 8.96 21.59 5.72 5.7 13.46 8.91 21.54 8.91h0.08l127.84-0.33c16.84-0.04 30.47-13.73 30.42-30.58-0.05-16.85-13.77-30.48-30.58-30.42zM765.16 609.03H635.43c-8.1 0-15.87 3.22-21.59 8.96a30.515 30.515 0 0 0-8.91 21.62l0.33 127.84c0.04 16.82 13.69 30.42 30.5 30.42h0.08c16.84-0.04 30.46-13.73 30.42-30.58l-0.25-97.26h99.14c16.84 0 30.5-13.66 30.5-30.5s-13.65-30.5-30.49-30.5z"
                  fill="#FFFFFF"
                  p-id="6986"
                ></path>
              </svg>
            </button>
          </div>
        </div>
      </transition>
      <!-- 右侧按钮 -->
      <transition name="fade">
        <div v-show="isNeat" class="show-right-btn">
          <div class="btn avatar-btn" @click="handleClose" title="头像">
            <el-avatar :size="40" :src="showdata.userImg" />
          </div>
          <div class="btn" @click="handleIsLike" title="点赞">
            <svg
              t="1740804394565"
              class="icon"
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              p-id="4825"
              width="30"
              height="30"
            >
              <path
                d="M710.549333 384.810667a12409.045333 12409.045333 0 0 0 47.466667-0.32l8.746667-0.085334c83.989333-0.618667 141.44 67.584 126.72 150.229334L847.296 794.026667c-10.026667 56.448-63.914667 101.546667-121.130667 101.589333L298.624 896a42.730667 42.730667 0 0 1-42.666667-42.410667l-0.810666-383.978666a42.666667 42.666667 0 0 1 42.026666-42.666667l3.157334-0.064c5.226667-0.042667 11.797333-0.042667 19.626666 0 91.946667 0.768 170.88-86.698667 170.709334-170.944-0.149333-86.741333 39.786667-126.762667 106.453333-127.573333 62.250667-0.746667 106.602667 59.605333 107.349333 149.12 0.213333 26.602667-6.293333 73.237333-14.506666 107.434666 6.186667 0 13.077333-0.042667 20.586666-0.085333z m-497.706666 63.232L213.333333 874.624A21.312 21.312 0 0 1 191.786667 896H149.525333A21.333333 21.333333 0 0 1 128 874.624l0.042667-426.581333A21.269333 21.269333 0 0 1 149.44 426.666667h41.984c11.669333 0 21.418667 9.578667 21.418667 21.376z"
                :fill="dataList.isLike ? 'red' : '#FFFFFF'"
                p-id="4826"
              ></path>
            </svg>
            <span :style="{ color: dataList.isLike ? 'red' : '#FFFFFF' }">{{
              dataList.like
            }}</span>
          </div>
          <div class="btn" @click="handleisComment" title="评论">
            <svg
              t="1740804720171"
              class="icon"
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              p-id="6246"
              width="30"
              height="30"
            >
              <path
                d="M512 64C264.96 64 64 236.256 64 448c0 182.976 149.344 339.168 357.056 375.744l64.896 90.848C491.968 923.008 501.664 928 512 928s20.032-4.992 26.048-13.408l64.896-90.88C810.656 787.168 960 631.008 960 448 960 236.256 759.04 64 512 64zM288.032 512c-35.296 0-64-28.704-64-64s28.704-64 64-64 64 28.704 64 64S323.328 512 288.032 512zM512.032 512c-35.296 0-64-28.704-64-64s28.704-64 64-64c35.296 0 64 28.704 64 64S547.328 512 512.032 512zM736.032 512c-35.296 0-64-28.704-64-64s28.704-64 64-64 64 28.704 64 64S771.328 512 736.032 512z"
                fill="#FFFFFF"
                p-id="6247"
              ></path>
            </svg>
            <span>{{ dataList.comment }}</span>
          </div>
          <div class="btn" @click="handleIsCollect" title="收藏">
            <svg
              t="1740804432669"
              class="icon"
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              p-id="4975"
              width="30"
              height="30"
            >
              <path
                d="M284.458667 941.397333c-36.437333 15.637333-68.48-7.68-64.896-47.168l22.613333-248.917333-164.394667-188.053333c-26.069333-29.824-13.653333-67.562667 24.789334-76.309334l243.370666-55.381333 127.786667-214.677333c20.288-34.090667 59.946667-34.069333 80.213333 0l127.786667 214.677333 243.370667 55.381333c38.656 8.789333 50.858667 46.485333 24.789333 76.309334l-164.394667 188.053333 22.741334 249.002667c3.605333 39.509333-28.458667 62.805333-64.896 47.146666l-229.504-98.517333-229.376 98.453333z"
                :fill="dataList.isCollect ? '#FFB802' : '#FFFFFF'"
                p-id="4976"
              ></path>
            </svg>
            <span :style="{ color: dataList.isCollect ? '#FFB802' : '#FFFFFF' }">{{
              dataList.collect
            }}</span>
          </div>
          <div class="btn" @click="handleIsShare" title="转发">
            <svg
              t="1740804860675"
              class="icon"
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              p-id="4533"
              width="30"
              height="30"
            >
              <path
                d="M259.2 690.2c-8 0-16.1-1.6-23.8-4.8-23.2-9.6-38.2-32.1-38.2-57.3 0-137.8 62.2-368.3 292.5-381.2V145.2c0-25.2 15-47.7 38.3-57.3 23.2-9.6 49.8-4.4 67.6 13.5l232 232c24.2 24.2 24.2 63.5 0 87.7l-232 232c-17.8 17.8-44.4 23.1-67.6 13.5-23.3-9.6-38.3-32.1-38.3-57.3v-79.4c-57.7 12.7-96 51.3-152.5 108L303 672c-12 11.9-27.7 18.2-43.8 18.2zM510.1 336c-83.6 0-143.1 36.8-181.9 112.4-18.5 36-28.8 74.1-34.5 106.1C360 488.9 423 435.7 534.4 435.7h44.8v107l165.4-165.4-165.4-165.4V336h-69.1zM846.5 940.8h-669c-37.9 0-68.7-31.8-68.7-70.9V739.2h89.6v112h627.2v-112h89.6v130.7c0 39.1-30.8 70.9-68.7 70.9z"
                fill="#FFFFFF"
                p-id="4534"
              ></path>
            </svg>
            <span>{{ dataList.share }}</span>
          </div>
          <div class="btn more-btn" @click="handleClose" title="更多">
            <svg
              t="1740804582209"
              class="icon"
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              p-id="2495"
              width="30"
              height="30"
            >
              <path
                d="M288 512m-64 0a64 64 0 1 0 128 0 64 64 0 1 0-128 0Z"
                fill="#ffffff"
                p-id="2496"
              ></path>
              <path
                d="M512 512m-64 0a64 64 0 1 0 128 0 64 64 0 1 0-128 0Z"
                fill="#ffffff"
                p-id="2497"
              ></path>
              <path
                d="M736 512m-64 0a64 64 0 1 0 128 0 64 64 0 1 0-128 0Z"
                fill="#ffffff"
                p-id="2498"
              ></path>
            </svg>
          </div>
        </div>
      </transition>
    </div>
  </transition>
</template>

<style scoped lang="scss">
button {
  background: none;
  border: none;
  color: white;
  // cursor: pointer;
  // padding: 0.5rem;
  transition: opacity 0.2s;
  display: flex;
}

button:hover {
  opacity: 0.8;
}

.cat-icon {
  color: #fff;
  display: flex;
}

.show-data-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 990;
  background-color: #fff;

  .show-header {
    position: absolute;
    top: 0;
    right: 0;
    z-index: 9998;
    width: 10px;
    height: 10px;
    background-color: rgba(0, 0, 0, 0);
  }

  .show-data {
    width: 100%;
    height: 100%;

    .video-content {
      width: 100%;
      height: calc(100% - 46px);
      // background-color: #111ddd;
      transition: transform 0.3s ease;
      transform-origin: center center;
      width: 100%;
      height: 100%;
      // cursor: pointer;
    }
  }

  .show-backdrop {
    transform: scale(1.2);
    z-index: -1;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    overflow: hidden;

    > img {
      filter: blur(60px);
      width: 100%;
      height: 100%;
    }
  }

  .show-content {
    padding: 16px 135px 16px 16px;
    position: absolute;
    left: 0;
    bottom: 46px;
    width: 100%;
    display: flex;
    flex-direction: column;
    color: #fff;

    .info {
      flex-direction: row;
      justify-content: flex-start;
      align-items: center;
      margin-bottom: 2px;
      display: flex;

      .info-name {
        font-size: 18px;
        font-weight: 500;
      }

      .info-time {
        font-size: 12px;
        font-weight: 400;
        padding: 5px;
      }
    }

    .info-content {
      text-shadow: 0.5px 0.5px 1px rgba(0, 0, 0, 0.7);
      font-size: 14px;
      line-height: 22px;
      color: #fff;
    }
  }

  .show-footer {
    position: absolute;
    bottom: 0;
    left: 0;
    height: 46px;
    width: 100%;
    background-color: rgba(77, 89, 103, 0.5);
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .show-right-btn {
    // padding-right: 38px;
    // position: absolute;
    // right: 0;
    // bottom: 60px;
    z-index: 11;
    height: auto;
    flex-direction: column;
    justify-content: flex-end;
    align-items: center;
    padding-right: 12px;
    display: flex;
    position: absolute;
    bottom: 60px;
    right: 0;

    .btn {
      margin: 5px 0;
      width: 30px;
      height: 50px;
      border: none;
      color: #ffffff;
      background-color: #ffffff00;
      border-radius: 50%;
      font-size: 12px;
      // cursor: pointer;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
    }

    .avatar-btn {
      width: 40px;
      height: 40px;
    }

    .more-btn {
      height: 30px;
      padding: 0;
    }
  }

  .close-btn {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(77, 89, 103, 0.5);
    border: none;
    border-radius: 10px;
    color: #ffffff;
    position: absolute;
    width: 36px;
    height: 36px;
    left: 20px;
    top: 40px;
    font-size: 12px;
    // cursor: pointer;
  }

  .controls {
    // padding: 0.65rem;
    padding: 5px;
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    // padding: 1rem;
    background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
    transition: opacity 0.3s ease;
    will-change: opacity;

    .progress-bar {
      position: relative;
      height: 5px;
      margin-bottom: 1rem;

      .buffer-progress {
        position: absolute;
        height: 2px;
        background: rgba(255, 255, 255, 0.3);
        top: 50%;
        transform: translateY(-50%);
        transition: width 0.3s ease;
        z-index: 1;
      }

      /* 当前进度显示 */
      .current-progress {
        position: absolute;
        height: 2px;
        background: #00a1ff;
        top: 50%;
        transform: translateY(-50%);
        z-index: 1;
      }

      .seek-bar {
        width: 100%;
        height: 5px;
        appearance: none;
        background: rgba(255, 255, 255, 0.1);
        position: relative;
        z-index: 2;

        /* 自定义滑块 */
        &::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 32px;
          height: 16px;
          background: url("https://localhost:5219/Gallery/catsdiary.jpg") center/32px
            no-repeat;
          border-radius: 10px;
          // box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
          transition: transform 0.2s, box-shadow 0.2s;
        }

        &::-moz-range-thumb {
          width: 32px;
          height: 16px;
          background: url("https://localhost:5219/Gallery/catsdiary.jpg") center/32px
            no-repeat;
          border-radius: 10px;
          border: none;
          // box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        /* 悬停效果 */
        &:hover::-webkit-slider-thumb {
          transform: scale(1.2);
          box-shadow: 0 3px 6px rgba(0, 0, 0, 0.3);
        }

        /* 焦点状态 */
        &:focus-visible {
          outline: none;
        }

        &:focus-visible::-webkit-slider-thumb {
          box-shadow: 0 0 0 3px rgba(0, 161, 255, 0.3);
        }
      }
    }

    .control-group {
      height: 30px;
      display: flex;
      align-items: center;
      // gap: 1rem;

      .time-display {
        color: white;
        font-family: monospace;
        font-size: 0.9rem;
      }

      .loading-indicator {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }

      /* 旋转按钮样式 */
      .transform-controls {
        display: flex;
        gap: 0.5rem;
        margin-left: auto;
        padding: 0 2px;

        button {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
          padding: 5px;
          display: flex;
          // padding: 0.3rem;
          // font-size: 1.2rem;
        }

        .transform-bar {
          padding: 5px;
          position: absolute;
          bottom: 40px;
          right: 0;
          background: rgba(255, 255, 255, 0.3);
          border-radius: 5px;
          display: flex;
          z-index: 9999;
        }
      }

      .volume-control {
        display: flex;

        .volume-panel {
          padding: 5px;
          position: absolute;
          bottom: 30px;
          left: 160px;
          background: rgba(255, 255, 255, 0.3);
          border-radius: 5px;
          display: flex;
          z-index: 9999;
        }
      }

      > button {
        padding: 0;
        display: flex;
      }
    }
  }
}

.show-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  transition: transform 0.3s ease;
}

// 媒体查询是否为手机
@media (max-width: 768px) {
  .transform-controls {
    display: none;
  }

  .volume-slider {
    width: 100px;
  }
}
</style>
<style lang="scss">
.el-carousel__container {
  // height: calc(100% - 46px);
  height: 100%;
  position: relative;

  .el-carousel__item {
    // 垂直水平居中
    justify-content: center;
    align-items: center;
    display: flex;
  }
}

.el-carousel__arrow--right {
  right: 80px;
}

.el-carousel__arrow--left {
  left: 80px;
}

.el-carousel__indicators {
  width: 100%;
  /* ul 宽度 100% */
  display: flex;
  /* 启用 Flex 布局 */
  padding: 0;
  /* 清除默认内边距 */
  margin: 0;
  /* 清除默认外边距 */
  list-style: none;
  // padding: 0 0 34px;
  bottom: 46px;

  .el-carousel__indicator--horizontal {
    // padding: 0 4px 40px;
    padding: 12px 4px 0;
  }

  /* 清除列表样式 */
  .el-carousel__indicator {
    flex: 1;
    /* 关键属性：子元素平分剩余空间 */
    min-width: 0;

    /* 防止内容溢出破坏布局 */
    > button {
      width: 100%;
    }
  }
}

/* 可选：修复 li 之间的间隙（如果存在） */
// .el-carousel__indicator + .el-carousel__indicator {
//   // margin-left: 0;
// }
</style>
