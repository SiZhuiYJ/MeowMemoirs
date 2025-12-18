<template>
    <div class="player-container">
        <video-play v-bind="options" @play="onPlay" @pause="onPause" @timeupdate="onTimeUpdate" />
    </div>
</template>

<script setup lang="ts">
import { videoPlay } from 'vue3-video-play/dist/index.mjs' // 导入播放器组件
import 'vue3-video-play/dist/style.css' // 导入样式

// 使用 reactive 让配置项具备响应式，方便后期动态修改
const options = {
    width: '100%',
    height: '100%',
    color: '#409eff',            // 主题色
    title: '虚一直构｜《仲夏萤火之约》', // 视频名称
    type: 'video/mp4', // 显式指定视频类型，通常是 mp4
    src: '/Videos/虚一直构｜《仲夏萤火之约》.mp4', // 注意：vue3-video-play 通常使用 src 属性
    poster: '/Videos/高清.jpg',  // 封面
    currentTime: 0,          // 初始播放时间，单位秒
    speed: true,                // 是否支持倍速
    loop: false,                // 是否循环播放
    muted: false,               // 是否静音
    control: true,              // 是否显示控制栏
}

// 事件回调
const onPlay = (ev: any) => {
    console.log('视频开始播放', ev)
}

const onPause = (ev: any) => {
    console.log('视频暂停播放', ev)
}
const onTimeUpdate = (ev: any) => {
    const video = ev.target;
    const currentTime = video.currentTime; // 当前播放时间（秒）
    const duration = video.duration;       // 视频总时长（秒）
    console.log('当前播放时间更新', video)
    console.log('当前播放时间', currentTime, '视频总时长', duration)
}
</script>

<style scoped lang="scss">
.player-container {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #f0f0f0;
    padding: 20px;
}
</style>