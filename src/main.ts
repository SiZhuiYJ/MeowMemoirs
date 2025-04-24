import { createApp } from 'vue'
import './style.css'
import App from './App.vue'


// 引入路由
import router from "./routers";
// 引入ElementPlus
import ElementPlus from "element-plus";
// 引入ElementPlus的css
import "element-plus/dist/index.css";
// 引入ElementPlus所有图标
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
// 引入ElementPlus的暗黑模式css
import "element-plus/theme-chalk/dark/css-vars.css";
// 引入仓库pinia
import pinia from "./stores/index";
// 引入全局组件配置
import Components from "@/components/index";
// 引入全局自定义指令
import Directives from "@/directives/index";
// 引入styles
import "@/styles/index.scss";

const app = createApp(App);
// 注册ElementPlus
app.use(ElementPlus);
// 注册ElementPlus所有图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component);
}
// 注册路由
app.use(router);
// 注册pinia
app.use(pinia);
// 全局组件
app.use(Components);
// 注册全局自定义指令
app.use(Directives);
// 挂载
app.mount("#app");
