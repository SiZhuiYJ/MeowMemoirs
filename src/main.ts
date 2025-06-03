import { createApp } from "vue";
import App from "./App.vue";
import "./styles/index.scss";
// 链接组合
import useApiUrl from "@/libs/useApiUrl/index";
// 懒加载
import VueLazyload from "vue-lazyload";
// element-plus
// import ElementPlus from "element-plus";
// import "element-plus/dist/index.css";
import "element-plus/theme-chalk/dark/css-vars.css";
import "element-plus/theme-chalk/src/loading.scss";
// element-plus图标
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
// 状态
import pinia from "./stores";
// 路由
import router from "./routers";
// 指令
import directives from "./directives";

import "virtual:svg-icons-register";

const app = createApp(App);
// 注册pinia
app.use(pinia);

// 注册路由
app.use(router);
const { getLocalImgUrl } = useApiUrl();
app.use(VueLazyload, {
  preLoad: 1.3,
  error: getLocalImgUrl("BeBitten.webp"),
  loading: getLocalImgUrl("CatLoad.webp"),
  attempt: 1,
});

// 挂载
// app.use(ElementPlus);

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

// 注册全局自定义指令
app.use(directives);

app.mount("#app");
