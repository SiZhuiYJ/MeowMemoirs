<template>
  <div class="typewriter-container">
    <span ref="textElement" class="typewriter-text" :style="textStyle">
      {{ displayText }}
      <span class="cursor" :class="{ blinking: isTyping }">|</span>
    </span>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch } from "vue";

interface TypewriterProps {
  messages: string[];
  typeSpeed?: number;
  deleteSpeed?: number;
  pauseDuration?: number;
  emptyPause?: number;
  fontSize?: number;
  cursorColor?: string;
  textColor?: string;
}

const props = withDefaults(defineProps<TypewriterProps>(), {
  typeSpeed: 100,
  deleteSpeed: 50,
  pauseDuration: 1500,
  emptyPause: 500,
  fontSize: 16,
  cursorColor: "currentColor",
  textColor: "currentColor",
});

const textElement = ref<HTMLElement | null>(null);
const displayText = ref("");
const isTyping = ref(true);
let timer: ReturnType<typeof setTimeout> | null = null;
let currentIndex = 0;
let currentMessage = "";
let isDeleting = false;

// 使用CSS变量
const textStyle = computed(() => ({
  "--font-size": `${props.fontSize}px`,
  "--text-color": props.textColor,
  "--cursor-color": props.cursorColor,
}));

// 获取随机消息（避免连续重复）
const getRandomMessage = () => {
  if (props.messages.length === 0) return "";
  if (props.messages.length === 1) return props.messages[0];

  const filtered = props.messages.filter((msg) => msg !== currentMessage);
  return filtered[Math.floor(Math.random() * filtered.length)];
};

// 打字机动画核心逻辑
const typeWriter = () => {
  if (timer) clearTimeout(timer);

  const typeDelay = isDeleting ? props.deleteSpeed : props.typeSpeed;

  if (!isDeleting) {
    // 打字模式
    displayText.value = currentMessage.substring(0, currentIndex + 1);
    currentIndex++;

    if (currentIndex === currentMessage.length) {
      isDeleting = true;
      timer = setTimeout(typeWriter, props.pauseDuration);
      return;
    }
  } else {
    // 删除模式
    displayText.value = currentMessage.substring(0, currentIndex - 1);
    currentIndex--;

    if (currentIndex === 0) {
      isDeleting = false;
      currentMessage = getRandomMessage();
      timer = setTimeout(typeWriter, props.emptyPause);
      return;
    }
  }

  timer = setTimeout(typeWriter, typeDelay);
};

// 监听消息变化
watch(
  () => props.messages,
  (newMessages) => {
    if (newMessages.length > 0) {
      currentMessage = getRandomMessage();
      if (timer) clearTimeout(timer);
      displayText.value = "";
      currentIndex = 0;
      isDeleting = false;
      timer = setTimeout(typeWriter, props.emptyPause);
    }
  }
);

onMounted(() => {
  if (props.messages.length > 0) {
    currentMessage = getRandomMessage();
    timer = setTimeout(typeWriter, props.emptyPause);
  }
});

onBeforeUnmount(() => {
  if (timer) clearTimeout(timer);
});
</script>

<style scoped lang="scss">
.typewriter-container {
  display: inline-block;
  min-height: calc(var(--font-size) * 1.5);
  line-height: 1.5;
}

.typewriter-text {
  font-size: var(--font-size);
  color: var(--text-color);
  white-space: pre-wrap;
  word-break: break-word;

  .cursor {
    display: inline-block;
    color: var(--cursor-color);
    font-weight: bold;
    margin-left: -0.05em; // 消除光标与文本间的间隙
    vertical-align: baseline;
    position: relative;
    top: 0.05em; // 微调垂直位置
  }
}

.blinking {
  animation: blink 1s step-end infinite;
}

@keyframes blink {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
}
</style>
