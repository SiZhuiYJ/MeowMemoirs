<script setup>
import { onMounted, onUnmounted } from 'vue'
import AMapLoader from '@amap/amap-jsapi-loader'
let map = null
onMounted(() => {
	// window._AMapSecurityConfig = {
	// 	securityJsCode: 'e4cf0342551e7a5da04a6704eb228893',
	// }
	AMapLoader.load({
		key: '677faee7961ef2c61dcd82d7c0436272', // 申请好的Web端开发者Key，首次调用 load 时必填
		version: '2.0', // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
		plugins: ['AMap.Scale', 'AMap.Geolocation'], //需要使用的的插件列表，如比例尺'AMap.Scale'，支持添加多个如：['...','...']
	})
		.then((AMap) => {
			map = new AMap.Map('container', {
				// 设置地图容器id
				viewMode: '3D', // 是否为3D地图模式
				zoom: 11, // 初始化地图级别
				center: [106.5859644, 29.7499178], // 初始化地图中心点位置
			})
			const location = new AMap.Geolocation({
				// 是否使用高精度定位，默认：true
				enableHighAccuracy: true,
				// 设置定位超时时间，默认：无穷大
				timeout: 10000,
				// 定位按钮的停靠位置的偏移量，默认：Pixel(10, 20)
				buttonOffset: new AMap.Pixel(10, 20),
				//  定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
				zoomToAccuracy: true,
				//  定位按钮的排放位置,  RB表示右下
				buttonPosition: 'RB',
			})
			console.log(location)
		})
		.catch((e) => {
			console.log(e)
		})
})

onUnmounted(() => {
	map?.destroy()
})
</script>

<template>
	<div id="container"></div>
</template>

<style lang="less" scoped>
#container {
	width: 100%;
	height: 100%;
}
</style>
