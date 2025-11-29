/// <reference types="vite/client" />
/// <reference types="vite-plugin-svg-icons/client" />
// src/types/ani-cursor.d.ts
declare module "ani-cursor.js" {
  export function setANICursor(selector: string, aniPath: string): void;
  export function setANICursorWithGroupElement(
    selectors: string[],
    aniPath: string
  ): void;
}
//./types/vue.d.ts
declare module "*.vue" {
  import type { DefineComponent } from "vue";
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

// md文件预览相关类型声明
declare module "@kangc/v-md-editor/lib/preview";
declare module "@kangc/v-md-editor/lib/plugins/line-number/index";
declare module "@kangc/v-md-editor/lib/plugins/copy-code/index";
declare module "@kangc/v-md-editor/lib/plugins/emoji/index";
declare module "@kangc/v-md-editor/lib/plugins/todo-list/index";
// 添加对vuepress主题的类型声明
declare module "@kangc/v-md-editor/lib/theme/vuepress.js";
// 添加对codemirror的类型声明
declare module "codemirror";
// 添加对codemirror-editor的类型声明
declare module "@kangc/v-md-editor/lib/codemirror-editor" {
  import { DefineComponent } from "vue";

  interface VMdEditorInstance {
    [key: string]: any;
  }

  const component: VMdEditorInstance &
    DefineComponent<{}, {}, any> & { install: (app: any) => void };
  export default component;

  // 导出Codemirror属性和use方法
  export const Codemirror: any;
  export function use(theme: any, options?: any): void;
}
// prismjs
declare module "prismjs";
// md相关类型声明结束

declare module "webtorrent/dist/webtorrent.min.js" {
  import WebTorrent from "webtorrent";
  export default WebTorrent;
}
