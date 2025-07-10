import { setANICursorWithGroupElement } from "ani-cursor.js";
let DEFAULT_CURSOR: string[] = ["body"]; // 默认光标
let LOAD_CURSOR: string[] = ['img[lazy="loading"]', ".el-loading-mask"]; // 加载光标
let POINTER_CURSOR: string[] = [".left-column,.Logo,.toolbar"]; // 按钮光标
let TEXT_CURSOR: string[] = [
  "textarea,p,h1,h2,h3,h4,h5,h6,.text,.el-range-input,.el-form-item__label,.el-input__wrapper .el-input__inner",
]; // 文本光标
let DISABLED_CURSOR: string[] = []; // 禁用光标
let MOVE_CURSOR: string[] = []; // 拖拽光标
let GRAB_CURSOR: string[] = []; // 抓取光标
let GRABBING_CURSOR: string[] = []; // 抓取中光标
let HELP_CURSOR: string[] = []; // 帮助光标
let WAIT_CURSOR: string[] = []; // 等待光标
let CROSSHAIR_CURSOR: string[] = []; // 十字光标
let ZOOM_IN_CURSOR: string[] = []; // 放大光标
let CONTEXT_MENU_CURSOR: string[] = []; // 鼠标右键光标
// 鼠标样式
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
let EL_GRAB_CURSOR: string[] = []; // 抓取光标
let EL_GRABBING_CURSOR: string[] = []; // 抓取中光标
let EL_HELP_CURSOR: string[] = []; // 帮助光标
let EL_WAIT_CURSOR: string[] = []; // 等待光标
let EL_CROSSHAIR_CURSOR: string[] = []; // 十字光标
let EL_ZOOM_IN_CURSOR: string[] = []; // 放大光标
let EL_CONTEXT_MENU_CURSOR: string[] = []; // 鼠标右键光标
//导入样式
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
    if (item.name === "grabbing") EL_GRABBING_CURSOR = item.list;
    if (item.name === "grab") EL_GRAB_CURSOR = item.list;
    if (item.name === "help") EL_HELP_CURSOR = item.list;
    if (item.name === "wait") EL_WAIT_CURSOR = item.list;
    if (item.name === "crosshair") EL_CROSSHAIR_CURSOR = item.list;
    if (item.name === "zoom-in") EL_ZOOM_IN_CURSOR = item.list;
    if (item.name === "context-menu") EL_CONTEXT_MENU_CURSOR = item.list;
  });
  console.log({
    EL_DEFAULT_CURSOR,
    EL_LOAD_CURSOR,
    EL_POINTER_CURSOR,
    EL_TEXT_CURSOR,
    EL_DISABLED_CURSOR,
    EL_MOVE_CURSOR,
    EL_GRAB_CURSOR,
    EL_GRABBING_CURSOR,
    EL_HELP_CURSOR,
    EL_WAIT_CURSOR,
    EL_CROSSHAIR_CURSOR,
    EL_ZOOM_IN_CURSOR,
    EL_CONTEXT_MENU_CURSOR,
  });
};
// 设置光标
export async function setCursor() {
  try {
    // 获取基础 URL
    await getCursor();
    // 定义光标类型和对应的动画URL配置
    const CURSOR_CONFIGS = [
      {
        cursors: [...DEFAULT_CURSOR, ...EL_DEFAULT_CURSOR],
        aniType: "NormalSelect",
      },
      { cursors: [...LOAD_CURSOR, ...EL_LOAD_CURSOR], aniType: "Work" },
      {
        cursors: [...POINTER_CURSOR, ...EL_POINTER_CURSOR],
        aniType: "AlternateSelect",
      },
      { cursors: [...TEXT_CURSOR, ...EL_TEXT_CURSOR], aniType: "TextSelect" },
      {
        cursors: [...DISABLED_CURSOR, ...EL_DISABLED_CURSOR],
        aniType: "Unavailable",
      },
      { cursors: [...MOVE_CURSOR, ...EL_MOVE_CURSOR], aniType: "Move" },
      {
        cursors: [...GRAB_CURSOR, ...EL_GRAB_CURSOR],
        aniType: "LocationSelect",
      },
      { cursors: [...GRABBING_CURSOR, ...EL_GRABBING_CURSOR], aniType: "Move" },
      { cursors: [...HELP_CURSOR, ...EL_HELP_CURSOR], aniType: "HelpSelect" },
      { cursors: [...WAIT_CURSOR, ...EL_WAIT_CURSOR], aniType: "Busy" },
      {
        cursors: [...CROSSHAIR_CURSOR, ...EL_CROSSHAIR_CURSOR],
        aniType: "PrecisionSelect",
      },
      { cursors: [...ZOOM_IN_CURSOR, ...EL_ZOOM_IN_CURSOR], aniType: "Work" },
      {
        cursors: [...CONTEXT_MENU_CURSOR, ...EL_CONTEXT_MENU_CURSOR],
        aniType: "AlternateSelect",
      },
    ];
    console.log(CURSOR_CONFIGS);
    // 遍历配置并设置光标
    CURSOR_CONFIGS.forEach(({ cursors, aniType }) => {
      setANICursorWithGroupElement(cursors, getAniUrl(aniType));
    });
  } catch (error) {
    console.log(error);
  }
}
