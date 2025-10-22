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

// Markdown编辑器（带Codemirror支持的完整版）
import VMdEditor from "@kangc/v-md-editor/lib/codemirror-editor";
import "@kangc/v-md-editor/lib/style/codemirror-editor.css";

// Markdown预览组件
import VMdPreview from "@kangc/v-md-editor/lib/preview";
import "@kangc/v-md-editor/lib/style/preview.css";

// VuePress主题样式
import vuepressTheme from "@kangc/v-md-editor/lib/theme/vuepress.js";
import "@kangc/v-md-editor/lib/theme/style/vuepress.css";

// PrismJS - 代码语法高亮库
import Prism from "prismjs";

// CodeMirror - 功能强大的代码编辑器
import Codemirror from "codemirror";

// CodeMirror语言模式支持
import "codemirror/mode/markdown/markdown";      // Markdown语法
import "codemirror/mode/javascript/javascript";  // JavaScript语法
import "codemirror/mode/css/css";                // CSS语法
import "codemirror/mode/htmlmixed/htmlmixed";    // HTML语法
import "codemirror/mode/vue/vue";                // Vue语法

// CodeMirror编辑功能增强
import "codemirror/addon/edit/closebrackets";    // 自动闭合括号
import "codemirror/addon/edit/closetag";         // 自动闭合标签
import "codemirror/addon/edit/matchbrackets";    // 括号匹配

// CodeMirror显示功能增强
import "codemirror/addon/display/placeholder";   // 占位符显示

// CodeMirror交互功能增强
import "codemirror/addon/selection/active-line"; // 当前行高亮

// CodeMirror滚动条样式
import "codemirror/addon/scroll/simplescrollbars";
import "codemirror/addon/scroll/simplescrollbars.css";

// CodeMirror核心样式
import "codemirror/lib/codemirror.css";

// Markdown编辑器插件 - 行号显示
import createLineNumbertPlugin from "@kangc/v-md-editor/lib/plugins/line-number/index";

// Markdown编辑器插件 - 代码复制功能
import createCopyCodePlugin from "@kangc/v-md-editor/lib/plugins/copy-code/index";
import "@kangc/v-md-editor/lib/plugins/copy-code/copy-code.css";

// Markdown编辑器插件 - Emoji表情支持
import createEmojiPlugin from "@kangc/v-md-editor/lib/plugins/emoji/index";
import "@kangc/v-md-editor/lib/plugins/emoji/emoji.css";

// Markdown编辑器插件 - 待办事项列表
import createTodoListPlugin from "@kangc/v-md-editor/lib/plugins/todo-list/index";
import "@kangc/v-md-editor/lib/plugins/todo-list/todo-list.css";

// 将CodeMirror绑定到Markdown编辑器
VMdEditor.Codemirror = Codemirror;

// 配置Markdown编辑器，使用VuePress主题
VMdEditor.use(vuepressTheme, {
  Prism, // 使用Prism进行代码高亮
  // extend(md: MarkdownIt) {
  //   // 可以在此处扩展Markdown解析功能
  //   // md.set(option).use(plugin);
  // },
  // 代码高亮扩展映射：将.vue文件视为html进行高亮
  codeHighlightExtensionMap: {
    vue: "html",
  },
})
  // 添加行号显示插件
  .use(createLineNumbertPlugin())
  // 添加代码复制插件
  .use(createCopyCodePlugin())
  // 添加表情符号插件
  .use(createEmojiPlugin())
  // 添加待办事项列表插件
  .use(createTodoListPlugin());

// 配置Markdown预览组件，使用VuePress主题
VMdPreview.use(vuepressTheme, {
  Prism, // 使用Prism进行代码高亮
  // extend(md: MarkdownIt) {
  //   // 可以在此处扩展Markdown解析功能
  //   // md.set(option).use(plugin);
  // },
  // 代码高亮扩展映射：将.vue文件视为html进行高亮
  codeHighlightExtensionMap: {
    vue: "html",
  },
})
  // 添加行号显示插件
  .use(createLineNumbertPlugin())
  // 添加代码复制插件
  .use(createCopyCodePlugin())
  // 添加表情符号插件
  .use(createEmojiPlugin())
  // 添加待办事项列表插件
  .use(createTodoListPlugin());

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

// 注册Markdown编辑器组件
app.use(VMdEditor);

// 注册Markdown预览组件
app.use(VMdPreview);
// main.js
import VConsole from 'vconsole';

if (process.env.NODE_ENV === 'development') {
  new VConsole();
}
// 将应用挂载到DOM元素上
app.mount("#app");
