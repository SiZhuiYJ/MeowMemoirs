<template>
    <div class="new-year-container">
        <!-- 背景装饰 -->
        <div class="snowflake" v-for="n in 30" :key="n" :style="getSnowflakeStyle(n)"></div>

        <!-- 主要卡片 -->
        <div class="card">
            <!-- 日期显示 -->
            <div class="date-display" :class="{ 'date-change': isChangingDate }">
                {{ currentDate }}
            </div>

            <!-- 时间显示 -->
            <div class="time-display">
                <div class="time-digit" v-for="(digit, index) in timeDigits" :key="index" :class="{
                    'digit-change': changingDigits.has(index),
                    'colon': digit === ':'
                }">
                    {{ digit }}
                </div>
            </div>

            <!-- 祝福语 -->
            <div class="blessing" :class="{ 'blessing-visible': showBlessing }">
                那就祝我们 <span class="english-text">all is well</span>
            </div>

            <!-- 控制按钮 -->
            <div class="controls">
                <button @click="toggleAutoPlay" class="control-btn">
                    {{ autoPlay ? '暂停' : '播放' }}
                </button>
                <button @click="reset" class="control-btn">
                    重置
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

// 定义时间数据接口
interface TimePoint {
    date: string
    time: string
    blessing: string
}

// 三个时间点的数据
const timePoints: TimePoint[] = [
    {
        date: '2025年12月31日 冬月十二 周三',
        time: '23:59:59',
        blessing: '那就祝我们 all is well'
    },
    {
        date: '2026年1月1日 冬月十三 周四',
        time: '00:00:00',
        blessing: '那就祝我们 all is well'
    },
    {
        date: '2026年1月1日 冬月十三 周四',
        time: '00:00:01',
        blessing: '那就祝我们 all is well'
    }
]

// 响应式数据
const currentIndex = ref(0)
const isChangingDate = ref(false)
const changingDigits = ref<Set<number>>(new Set())
const showBlessing = ref(true)
const autoPlay = ref(true)
const autoPlayTimer = ref<NodeJS.Timeout | null>(null)

// 计算当前显示的时间点
const currentTimePoint = computed(() => timePoints[currentIndex.value])

// 计算当前日期
const currentDate = computed(() => currentTimePoint.value.date)

// 将时间字符串转换为数字数组用于显示
const timeDigits = computed(() => {
    const timeStr = currentTimePoint.value.time
    return timeStr.split('').map((char, index) => char)
})

// 切换时间点
const switchToNextTimePoint = () => {
    // 日期变化动画
    if (currentIndex.value === 0) {
        isChangingDate.value = true
        setTimeout(() => {
            isChangingDate.value = false
        }, 1000)
    }

    // 数字变化动画
    const newTime = timePoints[currentIndex.value + 1]?.time || timePoints[0].time
    const currentTime = currentTimePoint.value.time

    changingDigits.value.clear()

    newTime.split('').forEach((char, index) => {
        if (char !== currentTime[index]) {
            changingDigits.value.add(index)
        }
    })

    // 更新当前索引
    currentIndex.value = (currentIndex.value + 1) % timePoints.length

    // 清除变化动画
    setTimeout(() => {
        changingDigits.value.clear()
    }, 600)

    // 祝福语闪烁效果
    showBlessing.value = false
    setTimeout(() => {
        showBlessing.value = true
    }, 100)
}

// 自动播放控制
const toggleAutoPlay = () => {
    autoPlay.value = !autoPlay.value
    if (autoPlay.value) {
        startAutoPlay()
    } else {
        stopAutoPlay()
    }
}

const startAutoPlay = () => {
    stopAutoPlay() // 清除现有定时器
    autoPlayTimer.value = setInterval(() => {
        switchToNextTimePoint()
    }, 2000) // 每2秒切换一次
}

const stopAutoPlay = () => {
    if (autoPlayTimer.value) {
        clearInterval(autoPlayTimer.value)
        autoPlayTimer.value = null
    }
}

// 重置到初始状态
const reset = () => {
    currentIndex.value = 0
    isChangingDate.value = false
    changingDigits.value.clear()
    showBlessing.value = true

    if (autoPlay.value) {
        startAutoPlay()
    }
}

// 生成雪花样式
const getSnowflakeStyle = (n: number) => {
    const size = Math.random() * 10 + 5
    return {
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        width: `${size}px`,
        height: `${size}px`,
        animationDelay: `${Math.random() * 5}s`,
        opacity: Math.random() * 0.5 + 0.3
    }
}

// 生命周期
onMounted(() => {
    startAutoPlay()
})

onUnmounted(() => {
    stopAutoPlay()
})
</script>

<style scoped>
.new-year-container {
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    position: relative;
    overflow: hidden;
    font-family: 'Arial', 'Microsoft YaHei', sans-serif;
}

/* 雪花动画 */
.snowflake {
    position: absolute;
    background: white;
    border-radius: 50%;
    pointer-events: none;
    animation: snowfall 10s linear infinite;
}

@keyframes snowfall {
    0% {
        transform: translateY(-100%) rotate(0deg);
        opacity: 1;
    }

    100% {
        transform: translateY(100vh) rotate(360deg);
        opacity: 0;
    }
}

/* 卡片样式 */
.card {
    background: rgba(255, 255, 255, 0.9);
    border-radius: 20px;
    padding: 40px;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
    text-align: center;
    min-width: 400px;
    backdrop-filter: blur(10px);
    z-index: 10;
    position: relative;
    overflow: hidden;
}

/* 日期显示 */
.date-display {
    font-size: 24px;
    color: #333;
    margin-bottom: 30px;
    font-weight: 600;
    transition: all 0.5s ease;
    padding: 10px;
    border-radius: 10px;
    background: linear-gradient(45deg, #f3f4f6, #e5e7eb);
}

.date-change {
    animation: dateChange 1s ease;
    background: linear-gradient(45deg, #fef3c7, #fde68a);
    color: #92400e;
}

@keyframes dateChange {

    0%,
    100% {
        transform: scale(1);
    }

    50% {
        transform: scale(1.05);
    }
}

/* 时间显示 */
.time-display {
    display: flex;
    justify-content: center;
    gap: 5px;
    margin-bottom: 40px;
    font-family: 'Courier New', monospace;
}

.time-digit {
    font-size: 60px;
    font-weight: 700;
    color: #1e293b;
    min-width: 40px;
    text-align: center;
    padding: 5px;
    border-radius: 8px;
    transition: all 0.3s ease;
    background: linear-gradient(45deg, #f8fafc, #f1f5f9);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.digit-change {
    animation: digitChange 0.6s ease;
    background: linear-gradient(45deg, #c7d2fe, #a5b4fc);
    color: #3730a3;
}

@keyframes digitChange {

    0%,
    100% {
        transform: translateY(0);
    }

    50% {
        transform: translateY(-10px);
    }
}

.colon {
    min-width: 20px;
    background: transparent;
    box-shadow: none;
}

/* 祝福语 */
.blessing {
    font-size: 28px;
    color: #dc2626;
    margin-top: 30px;
    padding: 15px;
    border-radius: 10px;
    opacity: 0;
    transform: translateY(20px);
    transition: all 0.8s ease;
    background: linear-gradient(45deg, #fef2f2, #fee2e2);
}

.blessing-visible {
    opacity: 1;
    transform: translateY(0);
}

.english-text {
    font-family: 'Georgia', serif;
    font-style: italic;
    color: #7c2d12;
    font-weight: bold;
}

/* 控制按钮 */
.controls {
    display: flex;
    justify-content: center;
    gap: 15px;
    margin-top: 30px;
}

.control-btn {
    padding: 10px 20px;
    border: none;
    border-radius: 8px;
    background: linear-gradient(45deg, #4f46e5, #7c3aed);
    color: white;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    min-width: 80px;
}

.control-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(79, 70, 229, 0.4);
}

.control-btn:active {
    transform: translateY(0);
}
</style>