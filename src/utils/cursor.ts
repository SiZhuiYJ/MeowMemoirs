import { setANICursorWithGroupElement } from "ani-cursor.js";

const getAniUrl = (fileName: string): string => {
  return `https://catsdiary.com:4567/MeowMemoirs/File/MediaFile/indigenous/MapStorage?path=mouse/${fileName}.ani`;
};
export interface GroupedCursor {
  name: string;
  list: string[];
}
let EL_DEFAULT_CURSOR: string[] = []; // 默认光标
let EL_LOAD_CURSOR: string[] = []; // 加载光标
let EL_POINTER_CURSOR: string[] = []; // 按钮光标
let EL_TEXT_CURSOR: string[] = []; // 文本光标
let EL_DISABLED_CURSOR: string[] = []; // 禁用光标
let EL_MOVE_CURSOR: string[] = []; // 拖拽光标
// let EL_HEAD_CURSOR: string[] = []; // 头部光标
// let EL_AUTO_CURSOR: string[] = []; // 自动光标
// let EL_GRAB_CURSOR: string[] = []; // 抓取光标
// let EL_GRABBING_CURSOR: string[] = []; // 抓取中光标
// let EL_HELP_CURSOR: string[] = []; // 帮助光标
// let EL_WAIT_CURSOR: string[] = []; // 等待光标
// let EL_CROSSHAIR_CURSOR: string[] = []; // 十字光标
// let EL_ZOOM_IN_CURSOR: string[] = []; // 放大光标
// let EL_CONTEXT_MENU_CURSOR: string[] = []; // 鼠标右键光标

// const aniModules = import.meta.glob("@/assets/mouse/*.ani", {
//   eager: true,
//   query: "?url", // 替换 as 参数
//   import: "default", // 明确指定导入方式
// }); // 使用时直接取值（不再需要 .default）
// const getAniUrl = (fileName: string): string => {
//   const key = `/src/assets/mouse/${fileName}.ani`;
//   return aniModules[key] as string; // 直接返回 URL 字符串
// };
const getCursor = async () => {
  const baseUrl = import.meta.env.BASE_URL;

  // 使用 fetch 加载 JSON 文件
  const response = await fetch(`${baseUrl}cursor-styles.json`);

  if (!response.ok)
    throw new Error(`Failed to fetch cursor styles: ${response.statusText}`);

  const cursorRules: GroupedCursor[] = await response.json();
  cursorRules.forEach((item: GroupedCursor) => {
    if (item.name === "default") EL_DEFAULT_CURSOR = item.list;
    if (item.name === "load") EL_LOAD_CURSOR = item.list;
    if (item.name === "pointer") EL_POINTER_CURSOR = item.list;
    if (item.name === "text") EL_TEXT_CURSOR = item.list;
    if (item.name === "not-allowed") EL_DISABLED_CURSOR = item.list;
    if (item.name === "move") EL_MOVE_CURSOR = item.list;
    // if (item.name === "head") EL_HEAD_CURSOR = item.list;
    // if (item.name === "auto") EL_AUTO_CURSOR = item.list;
    // if (item.name === "grabbing") EL_GRABBING_CURSOR = item.list;
    // if (item.name === "grab") EL_GRAB_CURSOR = item.list;
    // if (item.name === "help") EL_HELP_CURSOR = item.list;
    // if (item.name === "wait") EL_WAIT_CURSOR = item.list;
    // if (item.name === "crosshair") EL_CROSSHAIR_CURSOR = item.list;
    // if (item.name === "zoom-in") EL_ZOOM_IN_CURSOR = item.list;
    // if (item.name === "context-menu") EL_CONTEXT_MENU_CURSOR = item.list;
  });
  console.log({
    EL_DEFAULT_CURSOR,
    EL_LOAD_CURSOR,
    EL_POINTER_CURSOR,
    EL_TEXT_CURSOR,
    EL_DISABLED_CURSOR,
    EL_MOVE_CURSOR,
  });
};

export async function setCursor() {
  try {
    // 获取基础 URL
    await getCursor();
    let defaultAbleGroup: string[] = ["body", ...EL_DEFAULT_CURSOR];
    setANICursorWithGroupElement(defaultAbleGroup, getAniUrl("NormalSelect")); // 默认
    let loadAbleGroup: string[] = [
      'img[lazy="loading"]',
      ".el-loading-mask",
      ...EL_LOAD_CURSOR,
    ];
    setANICursorWithGroupElement(loadAbleGroup, getAniUrl("Busy")); // 加载
    // 按钮选择
    let pointerAbleGroup: string[] = [
      ".left-column,.Logo,.toolbar",
      ...EL_POINTER_CURSOR,
    ];
    setANICursorWithGroupElement(
      pointerAbleGroup,
      getAniUrl("AlternateSelect")
    ); // 按钮
    let textAbleGroup: string[] = [
      "textarea,p,h1,h2,h3,h4,h5,h6,.text", // 自定义
      ".el-range-input,.el-form-item__label,.el-input__wrapper .el-input__inner", // 输入框
      ...EL_TEXT_CURSOR,
    ];
    setANICursorWithGroupElement(textAbleGroup, getAniUrl("TextSelect")); // 文本
    let disabledAbleGroup: string[] = [...EL_DISABLED_CURSOR];
    setANICursorWithGroupElement(disabledAbleGroup, getAniUrl("Unavailable")); // 禁用
    let moveAbleGroup: string[] = [...EL_MOVE_CURSOR];
    setANICursorWithGroupElement(moveAbleGroup, getAniUrl("Move")); // 拖拽
  } catch (error) {
    console.log(error);
  }
}
