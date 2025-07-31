import { createApp } from "vue";
import App from "./App.vue";
import "./styles/index.scss";
import BeBitten from "./assets/image/BeBitten.webp";
import CatLoad from "./assets/image/CatLoad.webp";
// 链接组合
// import useApiUrl from "@/libs/useApiUrl/index";
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

// import type { MarkdownIt } from "markdown-it";

// md文件完整版
import VMdEditor from "@kangc/v-md-editor/lib/codemirror-editor";
import "@kangc/v-md-editor/lib/style/codemirror-editor.css";

// md预览组件
import VMdPreview from "@kangc/v-md-editor/lib/preview";
import "@kangc/v-md-editor/lib/style/preview.css";

// vuepress主题
import vuepressTheme from "@kangc/v-md-editor/lib/theme/vuepress.js";
import "@kangc/v-md-editor/lib/theme/style/vuepress.css";
// prismjs
import Prism from "prismjs";

// codemirror 编辑器的相关资源
import Codemirror from "codemirror";
// mode
import "codemirror/mode/markdown/markdown";
import "codemirror/mode/javascript/javascript";
import "codemirror/mode/css/css";
import "codemirror/mode/htmlmixed/htmlmixed";
import "codemirror/mode/vue/vue";
// edit
import "codemirror/addon/edit/closebrackets";
import "codemirror/addon/edit/closetag";
import "codemirror/addon/edit/matchbrackets";
// placeholder
import "codemirror/addon/display/placeholder";
// active-line
import "codemirror/addon/selection/active-line";
// scrollbar
import "codemirror/addon/scroll/simplescrollbars";
import "codemirror/addon/scroll/simplescrollbars.css";
// style
import "codemirror/lib/codemirror.css";

// 代码块行号
import createLineNumbertPlugin from "@kangc/v-md-editor/lib/plugins/line-number/index";
// 复制代码
import createCopyCodePlugin from "@kangc/v-md-editor/lib/plugins/copy-code/index";
import "@kangc/v-md-editor/lib/plugins/copy-code/copy-code.css";
// 表情插件
import createEmojiPlugin from "@kangc/v-md-editor/lib/plugins/emoji/index";
import "@kangc/v-md-editor/lib/plugins/emoji/emoji.css";
// 待办事项插件
import createTodoListPlugin from "@kangc/v-md-editor/lib/plugins/todo-list/index";
import "@kangc/v-md-editor/lib/plugins/todo-list/todo-list.css";
VMdEditor.Codemirror = Codemirror;
VMdEditor.use(vuepressTheme, {
  Prism,
  // extend(md: MarkdownIt) {
  //   // md为 markdown-it 实例，可以在此处进行修改配置,并使用 plugin 进行语法扩展
  //   // md.set(option).use(plugin);
  // },
  codeHighlightExtensionMap: {
    vue: "html",
  },
})
  .use(createLineNumbertPlugin())
  .use(createCopyCodePlugin())
  .use(createEmojiPlugin())
  .use(createTodoListPlugin());

VMdPreview.use(vuepressTheme, {
  Prism,
  // extend(md: MarkdownIt) {
  //   // md为 markdown-it 实例，可以在此处进行修改配置,并使用 plugin 进行语法扩展
  //   // md.set(option).use(plugin);
  // },
  codeHighlightExtensionMap: {
    vue: "html",
  },
})
  .use(createLineNumbertPlugin())
  .use(createCopyCodePlugin())
  .use(createEmojiPlugin())
  .use(createTodoListPlugin());
// 全局注册
const app = createApp(App);
// 注册pinia
app.use(pinia);

// 注册路由
app.use(router);
// 注册指令
app.use(VueLazyload, {
  preLoad: 1.3,
  error: BeBitten,
  loading: CatLoad,
  attempt: 1,
});
// 挂载
// app.use(ElementPlus);

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

// 注册全局自定义指令
app.use(directives);
// 注册md编辑器
app.use(VMdEditor);
// 注册md预览组件
app.use(VMdPreview);
app.mount("#app");
