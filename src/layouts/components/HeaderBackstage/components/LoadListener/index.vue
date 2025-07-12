<script setup lang="ts">
import { onMounted, ref } from "vue";
import Signal from "@/layouts/components/HeaderBackstage/components/Signal/index.vue";
const Level = ref(0);
const Loading = ref(false);
// 声明全局性能API类型
declare const PerformanceObserver:
  | {
      prototype: PerformanceObserver;
      new (callback: PerformanceObserverCallback): PerformanceObserver;
      supportedEntryTypes?: string[];
    }
  | undefined;

interface PerformanceMetrics {
  DNS查询时间: string;
  TCP连接时间: string;
  TLS握手时间: string;
  请求响应时间: string;
  DOM解析时间: string;
  白屏时间: string;
  DOM准备时间: string;
  页面完全加载时间: string;
  "首次内容绘制(FCP)": string;
  "最大内容绘制(LCP)": string;
}

const metrics = ref<Partial<PerformanceMetrics>>({});
const isModernAPISupported = ref(false);
const showDetails = ref(false);
const totalLoadTime = ref("");

const calculateMetrics = () => {
  const [entry] = performance.getEntriesByType(
    "navigation"
  ) as PerformanceNavigationTiming[];

  if (!entry) return;

  // 计算总加载时间
  const loadTime = entry.loadEventEnd - entry.startTime;
  totalLoadTime.value = `${loadTime.toFixed(2)}ms`;

  // 详细指标
  metrics.value = {
    DNS查询时间: `${(entry.domainLookupEnd - entry.domainLookupStart).toFixed(2)}ms`,
    TCP连接时间: `${(entry.connectEnd - entry.connectStart).toFixed(2)}ms`,
    TLS握手时间:
      entry.secureConnectionStart > 0
        ? `${(entry.connectEnd - entry.secureConnectionStart).toFixed(2)}ms`
        : "未使用HTTPS",
    请求响应时间: `${(entry.responseEnd - entry.requestStart).toFixed(2)}ms`,
    DOM解析时间: `${(entry.domComplete - entry.domInteractive).toFixed(2)}ms`,
    白屏时间: `${(entry.responseStart - entry.startTime).toFixed(2)}ms`,
    DOM准备时间: `${(entry.domContentLoadedEventEnd - entry.startTime).toFixed(2)}ms`,
    页面完全加载时间: totalLoadTime.value,
  };

  // 添加更多现代性能指标
  const paintEntries = performance.getEntriesByType("paint");
  const fcpEntry = paintEntries.find((entry) => entry.name === "first-contentful-paint");
  if (fcpEntry) {
    metrics.value["首次内容绘制(FCP)"] = `${fcpEntry.startTime.toFixed(2)}ms`;
  }

  // 监听LCP (可能需要稍后触发)
  if (PerformanceObserver) {
    new PerformanceObserver((entryList) => {
      const lcpEntries = entryList.getEntries();
      const lastLcpEntry = lcpEntries[lcpEntries.length - 1];
      metrics.value["最大内容绘制(LCP)"] = `${lastLcpEntry.startTime.toFixed(2)}ms`;
    }).observe({ type: "largest-contentful-paint", buffered: true });
  }
};
/**
 * 将毫秒时间字符串转换为秒时间字符串
 * @param msString 毫秒时间字符串，如 "300ms"
 * @returns 秒时间字符串，如 "0.3s"
 * @throws 当输入格式无效时抛出错误
 */
// export function convertMsToSeconds(msString: string | undefined): string {
function convertMsToSeconds(msString: string | undefined): string {
  if (!msString) return "N/A";
  // 验证输入格式
  try {
    // 提取数字部分
    const numStr = msString.replace("ms", "");
    const num = parseInt(numStr, 10);

    // 转换为秒并保留一位小数
    const seconds = num / 1000;
    return `${seconds.toFixed(1).replace(/\.?0+$/, "")}s`;
  } catch (error) {
    console.error("Invalid input format:", error);
    return "N/A";
  }
}
const toggleDetails = () => {
  showDetails.value = !showDetails.value;
};
onMounted(() => {
  if (window.performance) {
    // 检查现代API支持情况
    isModernAPISupported.value = Boolean(
      PerformanceObserver?.supportedEntryTypes?.includes("navigation")
    );

    if (isModernAPISupported.value) {
      if (document.readyState === "complete") {
        calculateMetrics();
      } else {
        window.addEventListener("load", calculateMetrics, { once: true });
      }
    } else {
      console.warn("PerformanceNavigationTiming API not supported");
    }
  }
  Loading.value = true;
  Level.value = Math.floor(Math.random() * 5) + 1;
  setTimeout(() => {
    // 产生一个随机数1~5
    Loading.value = false;
  }, 10000);
});
</script>

<template>
  <div class="performance-monitor">
    <el-popover class="box-item" placement="bottom-end" :width="200">
      <template #reference>
        <button class="article" style="">
          <Signal :Level="Level" :size="14" :Loading="Loading" />
        </button>
      </template>
      <div class="summary" @click="toggleDetails">
        <span class="label font-class">页面加载时间:</span>
        <span class="value font-class">{{
          convertMsToSeconds(totalLoadTime) || "计算中..."
        }}</span>
        <span class="toggle-icon">{{ showDetails ? "▲" : "▼" }}</span>
      </div>

      <transition name="fade">
        <div v-if="showDetails" class="details">
          <h3>详细性能指标</h3>
          <div v-if="Object.keys(metrics).length > 0" class="metrics-container">
            <div v-for="(value, key) in metrics" :key="key" class="metric-item">
              <span class="metric-key font-class">{{ key }}:</span>
              <span class="metric-value">{{ convertMsToSeconds(value) }}</span>
            </div>
          </div>
          <div v-else class="loading-message">
            正在收集性能数据...
            <div v-if="!isModernAPISupported" class="warning">
              (您的浏览器不支持最新性能API)
            </div>
          </div>
        </div>
      </transition>
    </el-popover>
  </div>
</template>

<style scoped lang="scss">
// 默认字体类
.font-class {
  font-family: system-ui, -apple-system, sans-serif;
  font-family: "Roboto Mono", monospace;
}
.article {
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: box-shadow 0.2s ease-in-out;
  background-color: var(--el-header-bg-color);
  border-radius: 5px;
  border: 0;
  &:hover {
    background-color: var(--el-color-primary-light-9) #fcf9fc;
    border: 1px solid var(--el-color-primary-light-7);
    box-shadow: 0 0 4px 2px var(--el-color-primary-light-7);
    color: var(--el-color-primary);
    outline: none;
  }
}
.summary {
  padding: 0;
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }

  .label {
    font-weight: 500;
    margin-right: 8px;
  }

  .value {
    color: #ffcc00;
    font-family: "Roboto Mono", monospace;
    margin-right: 8px;
  }

  .toggle-icon {
    margin-left: auto;
    font-size: 12px;
  }
}
.details {
  padding: 0;
  border-top: 1px solid rgba(255, 255, 255, 0.1);

  h3 {
    margin: 12px 0 10px;
    color: #42b983;
    font-size: 15px;
    font-weight: 600;
  }

  .metrics-container {
    display: flex;
    flex-direction: column;
    gap: 8px;
    font-size: 14px;
  }

  .metric-item {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
  }

  .metric-key {
    font-weight: 500;
    margin-right: 12px;
    opacity: 0.9;
  }

  .metric-value {
    color: #ffcc00;
    font-family: "Roboto Mono", monospace;
    font-size: 13px;
  }

  .loading-message {
    color: #aaa;
    font-style: italic;
    font-size: 14px;

    .warning {
      margin-top: 6px;
      color: #ff6b6b;
      font-size: 12px;
    }
  }
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
<style>
.el-popover__title {
  font-family: "Roboto Mono", monospace;
}
</style>
