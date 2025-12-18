<template>
    <video-play v-bind="options" @play="handlePlay" @pause="handlePause" :danmu="true" :danmuList="danmuList" />
</template>
<script setup lang="ts">
// 配置项
const options =
{
    width: '800px',
    // 播放器宽度  
    height: '450px',
    // // 播放器高度  
    url: '/Videos/虚一直构｜《仲夏萤火之约》.mp4',
    // // 视频地址  
    poster: '/Videos/高清.jpg',
    // // 视频封面  
    speed: true, // 是否显示倍速  
    loop: false, // 是否循环播放  
    muted: false, // 是否静音
    quality: [
        { label: '超清4K', url: '/Videos/虚一直构｜《仲夏萤火之约》.mp4' },
        { label: '高清1080P', url: '/Videos/虚一直构｜《仲夏萤火之约》.mp4' },
        { label: '标清720P', url: '/Videos/虚一直构｜《仲夏萤火之约》.mp4' }
    ], // 清晰度选项
    defaultQuality: 1, // 默认选中高清1080P
    color: '#409eff' // 主题色（Element Plus 主色示例）
}
// 初始弹幕列表 
const danmuList = [
    {
        text: '欢迎使用 MeowMemoirs ！',
        color: '#ff0000',
        time: 1
    },
    {
        text: '这是一个弹幕示例。',
        color: '#00ff00',
        time: 3
    }
]
// 播放回调
const handlePlay = () => {
    console.log('视频开始播放')
}
// 暂停回调
const handlePause = () => {
    console.log('视频暂停播放')
}
</script>