<template>
  <div class="typewriter-container">
    <span
      ref="textElement"
      class="typewriter-text"
      :style="{ fontSize: fontSize + 'px' }"
    >
      {{ displayText }}
    </span>
    <span
      class="cursor"
      :class="{ blinking: isTyping }"
      :style="{ fontSize: fontSize + 'px' }"
    >
      |
    </span>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";

const props = defineProps<{
  messages: string[];
  typeSpeed?: number; // 打字速度（毫秒）
  deleteSpeed?: number; // 删除速度（毫秒）
  pauseDuration?: number; // 显示完成后的暂停时间（毫秒）
  emptyPause?: number; // 清空后的暂停时间（毫秒）
  fontSize?: number; // 字体大小
}>();

const textElement = ref<HTMLElement | null>(null);
const displayText = ref("");
const isTyping = ref(true);
let timer: number | null = null;
let currentIndex = 0;
let currentMessage = "";
let isDeleting = false;

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

  const typeDelay = isDeleting ? props.deleteSpeed || 50 : props.typeSpeed || 100;

  // 当前文本处理状态
  if (!isDeleting) {
    // 打字模式
    displayText.value = currentMessage.substring(0, currentIndex + 1);
    currentIndex++;

    // 检查是否完成打字
    if (currentIndex === currentMessage.length) {
      isDeleting = true;
      timer = (setTimeout(typeWriter, props.pauseDuration || 1500) as unknown) as number;
      return;
    }
  } else {
    // 删除模式
    displayText.value = currentMessage.substring(0, currentIndex - 1);
    currentIndex--;

    // 检查是否完成删除
    if (currentIndex === 0) {
      isDeleting = false;
      currentMessage = getRandomMessage();
      timer = (setTimeout(typeWriter, props.emptyPause || 500) as unknown) as number;
      return;
    }
  }

  timer = (setTimeout(typeWriter, typeDelay) as unknown) as number;
};

// 初始化
onMounted(() => {
  if (props.messages.length > 0) {
    currentMessage = getRandomMessage();
    timer = (setTimeout(typeWriter, props.emptyPause || 500) as unknown) as number;
  }
});

// 清理定时器
onBeforeUnmount(() => {
  if (timer) clearTimeout(timer);
});
</script>

<style scoped lang="scss">
.typewriter-container {
  min-height: 1.5em;
  display: inline-flex;
  align-items: center;
  .typewriter-text {
    white-space: pre;
  }
}

.cursor {
  font-weight: 400;
  margin-left: 2px;
}

.blinking {
  animation: blink 1s infinite;
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
