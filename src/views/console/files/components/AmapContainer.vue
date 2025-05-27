<script setup>
import { onMounted, onUnmounted } from "vue";
import AMapLoader from "@amap/amap-jsapi-loader";
// 接收父组件参数
const props = defineProps({
  // 经纬度
  lnglat: Array,
});
let map = null;

onMounted(() => {
  console.log(props.lnglat);
  AMapLoader.load({
    key: "3d349cedfb25241944fe21e4c6928367", // 申请好的Web端开发者Key，首次调用 load 时必填
    version: "2.0", // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
    plugins: ["AMap.Scale"], //需要使用的的插件列表，如比例尺'AMap.Scale'，支持添加多个如：['...','...']
  })
    .then((AMap) => {
      map = new AMap.Map("container", {
        // 设置地图容器id
        viewMode: "3D", // 是否为3D地图模式
        zoom: 15, // 初始化地图级别
        // center: [116.397428, 39.90923], // 初始化地图中心点位置
        center: props.lnglat,
        resizeEnable: true,
      });
      // 点标记显示内容，HTML要素字符串
      var markerContent =
        "" +
        '<div class="custom-content-marker">' +
        '   <img src="//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-red.png">' +
        "</div>";

      var marker = new AMap.Marker({
        // position: new AMap.LngLat(116.397428, 39.90923),
        position: new AMap.LngLat(props.lnglat[0], props.lnglat[1]),
        // 将 html 传给 content
        content: markerContent,
        // 以 icon 的 [center bottom] 为原点
        offset: new AMap.Pixel(-13, -30),
      });

      // 将 markers 添加到地图
      map.add([marker]);

      // 清除 marker
      function clearMarker() {
        map.remove(marker);
      }
    })
    .catch((e) => {
      console.log(e);
    });
});

onUnmounted(() => {
  map?.destroy();
});
</script>

<template>
  <div id="container"></div>
</template>

<style scoped>
#container {
  width: 100%;
  height: 200px;
}
</style>
