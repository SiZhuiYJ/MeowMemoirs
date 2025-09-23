// 导入 createPinia 函数用于创建 Pinia 实例
import { createPinia } from "pinia";
// 导入 persist 插件用于持久化存储 Pinia 状态
import persist from "pinia-plugin-persistedstate";

// 创建 Pinia 实例
const pinia = createPinia();
// 使用 persist 插件
pinia.use(persist);

// 导出 Pinia 实例
export default pinia;

// 导出 userStore 模块
export * from "./modules/userStores";
// 导出 authStore 模块
export * from "./modules/authStore";
// 导出 globalStore 模块
export * from "./modules/globalStore";
// 导出 keepAliveStore 模块
export * from "./modules/keepAliveStore";
// 导出 TabsStore 模块
export * from "./modules/tabStore";
// 导出 MediaStore 模块
export * from "./modules/mediaStore";
// 导出 blogStore 模块
export * from "./modules/blogStore";
// 导出 classStore 模块
export * from "./modules/classStore";
