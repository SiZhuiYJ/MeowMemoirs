import { createApp } from "vue";
import App from "./App.vue";
import "./styles/index.scss";
import BeBitten from "./assets/image/BeBitten.webp";
import CatLoad from "./assets/image/CatLoad.webp";

// 链接组合工具（已注释）
// import useApiUrl from "@/libs/useApiUrl/index";

// 图片懒加载插件
import VueLazyload from "vue-lazyload";

// element-plus暗黑主题样式
import "element-plus/theme-chalk/dark/css-vars.css";
import "element-plus/theme-chalk/src/loading.scss";

// element-plus图标库
import * as ElementPlusIconsVue from "@element-plus/icons-vue";

// 状态管理 - Pinia
import pinia from "./stores";

// 路由管理 - Vue Router
import router from "./routers";

// 自定义指令集合
import directives from "./directives";

// 注册SVG图标（Vite插件生成的虚拟模块）
import "virtual:svg-icons-register";

// v-md-editor 编辑器相关的导入与配置已迁移到 `src/libs/vmd-editor.ts`，
// 需要在使用编辑器的组件中按需导入：
// import { VMdEditor, VMdPreview } from '@/libs/vmd-editor';

// 创建Vue应用实例
const app = createApp(App);

// 注册Pinia状态管理
app.use(pinia);

// 注册Vue Router路由系统
app.use(router);

// 注册图片懒加载插件，并配置相关选项
app.use(VueLazyload, {
  preLoad: 1.3,        // 预加载高度比例
  error: BeBitten,     // 图片加载失败时显示的占位图
  loading: CatLoad,    // 图片加载中时显示的占位图
  attempt: 1,          // 加载尝试次数
});

// 注册Element Plus所有图标组件为全局组件
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

// 注册全局自定义指令
app.use(directives);

// 注意：VMdEditor / VMdPreview 改为在使用处局部引入并注册
// main.js
import VConsole from 'vconsole';

if (process.env.NODE_ENV === 'development') {
  new VConsole();
}
// 将应用挂载到DOM元素上
app.mount("#app");
