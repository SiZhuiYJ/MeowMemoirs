import {
  defineStore
} from "pinia";
import {
  ref
} from "vue";
import {
  CACHE_PREFIX,
  DEFAULT_THEME
} from "@/config";

/**
 * 全局状态管理Store
 * 
 * 管理整个应用的全局状态，包括：
 * - 布局相关状态（菜单折叠、宽度等）
 * - 主题相关状态（暗黑模式、颜色主题等）
 * - 设备相关状态（尺寸、设备类型等）
 * - 功能相关状态（全屏、灰度模式等）
 * 
 * 使用Pinia进行状态管理，并通过localStorage持久化存储
 */
export const useGlobalStore = defineStore(
  "global",
  () => {
    // 菜单折叠状态
    const isCollapse = ref<boolean>(false);
    
    // header折叠状态
    const isHeader = ref<boolean>(false);
    
    // 菜单宽度
    const menuWidth = ref<number>(200);
    
    // 是否全屏状态
    const isFullScreen = ref<boolean>(false);
    
    // 是否暗黑模式
    const isDark = ref<boolean>(false);
    
    // ElementPlus组件尺寸大小
    const dimension = ref<string>("default");
    
    // 当前页面是否最大化
    const maximize = ref<boolean>(false);
    
    // 当前系统语言[默认中文]
    const language = ref<string>("zh");
    
    // 选择主题[默认兔子坦克形态]
    const themeColor = ref<string>(DEFAULT_THEME);
    
    // 布局模式 (纵向：vertical | 经典：classic | 横向：horizontal | 分栏：column)
    const layout = ref<string>("columns");
    
    // 路由动画效果
    const transition = ref<string>("fade-scale");
    
    // 菜单是否只展开一个子菜单项[默认：true仅展开一个]
    const uniqueOpened = ref<boolean>(true);
    
    // 灰色模式（用于特殊视觉效果）
    const isGrey = ref<boolean>(false);
    
    // 色弱模式（用于辅助视觉障碍用户）
    const isWeak = ref<boolean>(false);
    
    // 侧边栏暗黑模式
    const asideInverted = ref<boolean>(false);
    
    // 顶部栏暗黑模式
    const headerInverted = ref<boolean>(false);
    
    // 创建状态对象集合，方便统一管理和访问
    const state = {
      isCollapse,
      isHeader,
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
    
    // 类型定义：获取所有可修改状态的键名
    type GlobalStateKey = keyof typeof state;

    /**
     * 设置全局状态的通用方法
     * 
     * @param key 状态属性名
     * @param value 要设置的状态值
     * 
     * @example
     * setGlobal('isDark', true);  // 设置暗黑模式
     * setGlobal('layout', 'vertical'); // 设置布局模式
     */
    function setGlobal<K extends GlobalStateKey>(
      key: K,
      value: (typeof state)[K]["value"]
    ) {
      state[key].value = value;
    }
    
    /**
     * 设置菜单折叠状态
     * 
     * @param value 折叠状态值
     * @returns 返回当前折叠状态
     */
    function setCollapse(value: boolean) {
      isCollapse.value = !value;
      return isCollapse.value;
    }
    
    /**
     * 设置Header折叠状态
     * 
     * @param value 折叠状态值
     * @returns 返回当前折叠状态
     */
    function setHeader(value: boolean) {
      isHeader.value = !value;
      return isHeader.value;
    }
    
    /**
     * 设置左侧菜单宽度
     * 
     * @param value 菜单宽度值（像素）
     * @returns 返回当前菜单宽度
     */
    function setMenuWidth(value: number) {
      menuWidth.value = value;
      return menuWidth.value;
    }
    
    /**
     * 设置ElementPlus组件尺寸
     * 
     * @param value 尺寸值 ('large' | 'default' | 'small')
     */
    function setDimension(value: string) {
      dimension.value = value;
    }
    
    // 返回store实例的所有属性和方法
    return {
      ...state,
      setGlobal,
      setDimension,
      setCollapse,
      setHeader,
      setMenuWidth,
    };
  },
  {
    // 持久化配置
    persist: {
      // 持久化存储的键名
      key: CACHE_PREFIX + "global",
      // 存储方式：localStorage
      storage: localStorage,
    },
  }
);