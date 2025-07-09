import { defineStore } from "pinia";
import { ref } from "vue";
import { CACHE_PREFIX, DEFAULT_THEME } from "@/config";
// interface global {
//   //菜单折叠
//   isCollapse: boolean;
//   //菜单宽度
//   menuWidth: number;
//   //是否全屏
//   isFullScreen: boolean;
//   //是否暗黑模式
//   isDark: boolean;
//   //ElementPlus 尺寸大小
//   dimension: string;
//   //当前页面是否全屏
//   maximize: boolean;
//   //当前系统语言[默认中文]
//   language: string;
//   //选择主题[默认兔子坦克形态]
//   themeColor: string;
//   //布局模式 (纵向：vertical | 经典：classic | 横向：horizontal | 分栏：column)
//   layout: string;
//   //路由动画
//   transition: string;
//   //菜单是否可展开单个[默认：true仅仅一个]
//   uniqueOpened: boolean;
//   //灰色模式
//   isGrey: boolean;
//   //色弱模式
//   isWeak: boolean;
//   asideInverted: boolean;
//   headerInverted: boolean;
// }
// const initGlobal: global = {
//   isCollapse: false,
//   menuWidth: 200,
//   isFullScreen: false,
//   isDark: false,
//   dimension: "default",
//   maximize: false,
//   language: "zh",
//   themeColor: DEFAULT_THEME,
//   layout: "columns",
//   transition: "fade-scale",
//   uniqueOpened: true,
//   isGrey: false,
//   isWeak: false,
//   asideInverted: false,
//   headerInverted: false,
// };
// export const useGlobalStore = defineStore(
//   "global",
//   () => {
//     const globalStore = ref<global>(initGlobal);

//     // 设置全局数据模式
//     function setGlobal<K extends keyof global>(key: K, value: global[K]) {
//       globalStore.value[key] = value;
//     }
//     // 设置菜单折叠状态
//     function setCollapse(value: boolean) {
//       globalStore.value.isCollapse = !value;
//       return globalStore.value.isCollapse;
//     }
//     // 设置左侧菜单宽度
//     function setMenuWidth(value: number) {
//       globalStore.value.menuWidth = value;
//       return globalStore.value.menuWidth;
//     }
//     // 设置ElementPlus尺寸
//     function setDimension(value: string) {
//       globalStore.value.dimension = value;
//     }
//     return { globalStore, setGlobal, setDimension, setCollapse, setMenuWidth };
//   },
//   {
//     persist: {
//       // enabled: true, // true 表示开启持久化保存，默认localStorage
//       key: CACHE_PREFIX + "global", // 默认会以 store 的 id 作为 key
//       storage: localStorage,
//     },
//   }
// );
export const useGlobalStore = defineStore(
  "global",
  () => {
    //菜单折叠
    const isCollapse = ref<boolean>(false);
    //菜单宽度
    const menuWidth = ref<number>(200);
    //是否全屏
    const isFullScreen = ref<boolean>(false);
    //是否暗黑模式
    const isDark = ref<boolean>(false);
    //ElementPlus 尺寸大小
    const dimension = ref<string>("default");
    //当前页面是否全屏
    const maximize = ref<boolean>(false);
    //当前系统语言[默认中文]
    const language = ref<string>("zh");
    //选择主题[默认兔子坦克形态]
    const themeColor = ref<string>(DEFAULT_THEME);
    //布局模式 (纵向：vertical | 经典：classic | 横向：horizontal | 分栏：column)
    const layout = ref<string>("columns");
    //路由动画
    const transition = ref<string>("fade-scale");
    //菜单是否可展开单个[默认：true仅仅一个]
    const uniqueOpened = ref<boolean>(true);
    //灰色模式
    const isGrey = ref<boolean>(false);
    //色弱模式
    const isWeak = ref<boolean>(false);
    // 暗黑模式
    const asideInverted = ref<boolean>(false);
    // 侧边栏
    const headerInverted = ref<boolean>(false);
    // 创建状态对象集合（关键修改）
    const state = {
      isCollapse,
      menuWidth,
      isFullScreen,
      isDark,
      dimension,
      maximize,
      language,
      themeColor,
      layout,
      transition,
      uniqueOpened,
      isGrey,
      isWeak,
      asideInverted,
      headerInverted,
    };
    // 类型：获取所有可修改状态的键
    type GlobalStateKey = keyof typeof state;

    // 设置全局状态（修正实现）
    function setGlobal<K extends GlobalStateKey>(
      key: K,
      value: (typeof state)[K]["value"]
    ) {
      state[key].value = value;
    }
    // 设置菜单折叠状态
    function setCollapse(value: boolean) {
      isCollapse.value = !value;
      return isCollapse.value;
    }
    // 设置左侧菜单宽度
    function setMenuWidth(value: number) {
      menuWidth.value = value;
      return menuWidth.value;
    }
    // 设置ElementPlus尺寸
    function setDimension(value: string) {
      dimension.value = value;
    }
    return {
      ...state,
      setGlobal,
      setDimension,
      setCollapse,
      setMenuWidth,
    };
  },
  {
    persist: {
      // enabled: true, // true 表示开启持久化保存，默认localStorage
      key: CACHE_PREFIX + "global", // 默认会以 store 的 id 作为 key
      storage: localStorage,
    },
  }
);
