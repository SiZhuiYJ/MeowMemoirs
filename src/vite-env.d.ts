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

