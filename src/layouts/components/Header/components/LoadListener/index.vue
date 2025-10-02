<script setup lang="ts">
import { onMounted, ref } from "vue";
import Signal from "./Signal/index.vue";
import Folding from "./Folding/index.vue";
import { getRandomColor } from "@/utils/color";
import { useAccessStore } from "@/stores";
const accessStore = useAccessStore();
const Level = ref(0);
const Loading = ref(false);
// 名次个位
const rankNum = ref(0);
// 名次十位
const rankTen = ref(0);
// 评分
const score = ref(["菜狗", "死菜", "奇菜", "菜", "小菜", "微菜", "还行", "不错", "能看"]);
const score_color = ref([
  "red",
  "red",
  "red",
  "red",
  "red",
  "red",
  "#ffcc00",
  "#ffcc00",
  "#86DC46",
]);
const COLUMN_COLORS = ["red", "red", "red", "#ffcc00", "#ffcc00", "#86DC46"];
const serverMessage = [
  "服务器丢失",
  "连接信号弱",
  "信号不稳定",
  "信号较弱",
  "信号波动",
  "已连接",
];

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
  Level.value = Math.floor(Math.random() * 6);
  // 排名为1到9之间的随机数
  rankNum.value = Math.floor(Math.random() * 9) + 1;
  rankTen.value = Math.floor(Math.random() * 9) + 1;
  setTimeout(() => {
    Loading.value = false;
  }, 10000);
});
</script>

<template>
  <div class="performance-monitor">
    <el-popover class="box-item" placement="bottom-end" :width="230">
      <template #reference>
        <button class="article" style="">
          <Signal :Level="Level" :size="14" :Loading="Loading" />
        </button>
      </template>

      <Folding>
        <span class="label font-class">主服务器状态:</span>
        <template #toggle>
          <span :style="{ color: COLUMN_COLORS[Level] }">
            {{ serverMessage[Level] }}
          </span>
        </template>
        <template #container>
          <h3>服务器连接详情</h3>
          <div class="metrics-container">
            服务器未开放！连接失败均为正常现象，请耐心等待后续公告通知喵~
          </div>
        </template>
      </Folding>

      <div style="background-color: rgb(194 194 194); width: 100%; height: 1px"></div>

      <Folding>
        <span class="label font-class">页面加载时间:</span>
        <template #toggle>
          {{ convertMsToSeconds(totalLoadTime) || "计算中..." }}
        </template>
        <template #container>
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
        </template>
      </Folding>

      <div style="background-color: rgb(194 194 194); width: 100%; height: 1px"></div>

      <Folding>
        <span class="label font-class">性能测试结果:</span>
        <template #toggle>
          <span :style="{ color: score_color[rankNum] }">
            {{ score[rankTen] }}
          </span>
        </template>
        <template #container>
          <h3>详细性能测试数据</h3>
          <div>
            本次打开网页的速度击败全世界<span
              style="font-size: 16px; font-weight: bold"
              :style="{ color: getRandomColor() }"
              >{{ rankNum }}</span
            >
            <span
              style="font-size: 16px; font-weight: bold"
              :style="{ color: getRandomColor() }"
              >{{ rankTen }}</span
            >
            <span
              style="font-size: 16px; font-weight: bold"
              :style="{ color: getRandomColor() }"
              >%</span
            >
            的人
          </div>
        </template>
      </Folding>
      <div style="background-color: rgb(194 194 194); width: 100%; height: 1px"></div>

      <Folding>
        <span class="label font-class">地址信息:</span>
        <template #toggle>
          {{ accessStore.getSimpleIP?.ip || "未知" }}
        </template>
        <template #container>
          <h3>IP 信息详情</h3>
          <div class="ip-info-table">
            <div class="table-row">
              <div class="table-cell">
                <span class="cell-label">IP地址:</span>
                <span class="cell-value"
                  ><el-text truncated>{{
                    accessStore.getSimpleIP?.ip || "未知"
                  }}</el-text></span
                >
              </div>
            </div>
            <div class="table-row">
              <div class="table-cell">
                <span class="cell-label">AS编号:</span>
                <span class="cell-value"
                  ><el-text truncated>{{
                    accessStore.getSimpleIP?.as?.number || "未知"
                  }}</el-text></span
                >
              </div>
            </div>
            <div class="table-row">
              <div class="table-cell">
                <span class="cell-label">AS名称:</span>
                <span class="cell-value"
                  ><el-text truncated>{{
                    accessStore.getSimpleIP?.as?.name || "未知"
                  }}</el-text></span
                >
              </div>
            </div>
            <div class="table-row">
              <div class="table-cell">
                <span class="cell-label">运营商:</span>
                <span class="cell-value"
                  ><el-text truncated>{{
                    accessStore.getSimpleIP?.as?.info || "未知"
                  }}</el-text></span
                >
              </div>
            </div>
            <div class="table-row">
              <div class="table-cell">
                <span class="cell-label">地址段:</span>
                <span class="cell-value"
                  ><el-text truncated>{{
                    accessStore.getSimpleIP?.addr || "未知"
                  }}</el-text></span
                >
              </div>
            </div>
            <div class="table-row">
              <div class="table-cell">
                <span class="cell-label">国家:</span>
                <span class="cell-value"
                  ><el-text truncated
                    >{{ accessStore.getSimpleIP?.country?.name || "未知" }} ({{
                      accessStore.getSimpleIP?.country?.code || "未知"
                    }})</el-text
                  ></span
                >
              </div>
            </div>
            <div class="table-row">
              <div class="table-cell">
                <span class="cell-label">注册国家:</span>
                <span class="cell-value"
                  ><el-text truncated
                    >{{ accessStore.getSimpleIP?.registeredCountry?.name || "未知" }} ({{
                      accessStore.getSimpleIP?.registeredCountry?.code || "未知"
                    }})</el-text
                  ></span
                >
              </div>
            </div>
            <div class="table-row">
              <div class="table-cell">
                <span class="cell-label">地区:</span>
                <span class="cell-value"
                  ><el-text truncated>{{
                    (accessStore.getSimpleIP?.regions || []).join(" / ") || "未知"
                  }}</el-text></span
                >
              </div>
            </div>
            <div class="table-row">
              <div class="table-cell">
                <span class="cell-label">地区简称:</span>
                <span class="cell-value"
                  ><el-text truncated>{{
                    (accessStore.getSimpleIP?.regionsShort || []).join(" / ") || "未知"
                  }}</el-text></span
                >
              </div>
            </div>
            <div class="table-row">
              <div class="table-cell">
                <span class="cell-label">连接类型:</span>
                <span class="cell-value"
                  ><el-text truncated>{{
                    accessStore.getSimpleIP?.type || "未知"
                  }}</el-text></span
                >
              </div>
            </div>
          </div>
        </template>
      </Folding>
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
  background-color: initial;
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

h3 {
  margin: 6px 0 6px;
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

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.ip-info-table {
  padding: 0;
}

.table-row {
  display: flex;
  border-bottom: 1px solid #f0f0f0;
  transition: background-color 0.3s ease;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background-color: #f8f9fa;
  }
}

.table-cell {
  display: flex;
  width: 100%;
}

.cell-label {
  color: #495057;
  display: flex;
  align-items: center;
  flex: 0 0 60px;
  font-size: 13px;
  font-weight: 600;
}

.cell-value {
  flex: 1;
  color: #212529;
  font-size: 16px;
  display: flex;
  align-items: center;
  word-break: break-word;
  width: calc(100% - 150px);
}

/* 移动端适配 */
@media (max-width: 768px) {
  .ip-info-card {
    border-radius: 10px;
  }

  .ip-info-title {
    font-size: 18px;
    padding: 15px;
  }

  .table-cell {
    // padding: 10px 15px;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .cell-value {
    flex: 1;
    font-size: 13px;
    text-align: right;
    // padding-left: 10px;
  }
}

.info {
  align-items: center;
  justify-content: center;
  height: 80px;
  background-color: #000;

  p {
    a {
      color: #fff;
      font-family: "宋体";
      position: relative;
      text-decoration: none;

      &:before {
        content: "";
        position: absolute;
        left: 50%;
        bottom: -2px;
        width: 0;
        height: 2px;
        background: var(--el-color-primary);
        transition: all 0.3s;
      }

      &:hover:before {
        width: 100%;
        left: 0;
        right: 0;
      }
    }
  }
}

@keyframes center-to {
  100% {
    transform: translate(0, -50%);
  }
}

@keyframes bottom-to {
  0% {
    transform: translate(-50%, 0);
  }

  100% {
    // 向上移200px
    transform: translate(-50%, -200px);
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
<style>
.el-popover__title {
  font-family: "Roboto Mono", monospace;
}
</style>
