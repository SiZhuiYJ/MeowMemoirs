// 定义选项卡tabs小仓库[选择式Api写法]
import { defineStore } from "pinia";
import { CACHE_PREFIX, STATIC_URL } from "@/config/index.ts";
import router from "@/routers/index.ts";
import { getUrlWithParams } from "@/routers/utils/index";
import { meowMsgWarning } from "@/utils/message";
// 导入keepAliveStore仓库，必须使用下方这种导入方法，不然会报错。但是使用下方方法有一个问题就是使用keepAliveStore.addKeepAliveName(tab.name);等方法不能进行持久化缓存。
// 想进行缓存，只能将const keepAliveStore = useKeepAliveStore(); 放到方法里面，不能放置全局变量。
import { useKeepAliveStore } from "@/stores";
import { ref, computed } from "vue";
export interface Tab {
  icon: string,
  title: string,
  enName: string,
  path: string,
  name: string,
  closeIcon?: boolean,
  isKeepAlive: string
}

interface Tabs {
  tabList: Tab[];
}

const infoTabs: Tabs = {
  tabList: []
}

export const useTabsStore = defineStore('tabs', () => {

  const tabsStore = ref<Tabs>(infoTabs)

  // 添加选项卡数据
  const addTab = async (tab: Tab) => {
    // 判断是否已经添加过此条数据，只要数组中有一个元素满足条件，就返回 true。
    const isTab = tabsStore.value.tabList.some((item: Tab) => {
      return item.path === tab.path;
    });
    if (isTab) {
      return;
    } else {
      if (!useKeepAliveStore().keepAliveStore.keepAliveName.includes(tab.name) && tab.isKeepAlive == "0") {
        if (tab.name) {
          useKeepAliveStore().addKeepAliveName(tab.name);
        }
      }
      tabsStore.value.tabList.push(tab);
    }
  }
  // 删除选项卡数据，tabPath: 右键选择的path，selectedPath：当前选项卡被选择的path
  const removeTab = async (tabPath: string, isCurrent: boolean = true, selectedPath?: string) => {
    // 如果关闭的是首页，直接返回，不进行操作
    if (tabPath == STATIC_URL) {
      meowMsgWarning("首页禁止关闭🌻");
      return;
    }
    // 删除选项卡路由缓存
    const tabItem = tabsStore.value.tabList.find(item => item.path === tabPath);
    tabItem?.isKeepAlive && useKeepAliveStore().removeKeepAliveName(tabItem.name);
    const oldTabList = tabsStore.value.tabList;
    // 将这个需要删除的选项卡过滤掉，重新赋值给选项卡数组。
    tabsStore.value.tabList = tabsStore.value.tabList.filter(item => item.path !== tabPath);
    if (isCurrent) {
      // 如果关闭的不是选项卡被选择的，则依旧选择被选择的选项卡。
      const matchingPathObject = tabsStore.value.tabList.find((item: Tab) => item.path == selectedPath);
      if (matchingPathObject) {
        router.push(matchingPathObject?.path || STATIC_URL);
        return;
      }
      // 如果关闭的是选项卡被选择的，则选择上一个或下一个。
      oldTabList.forEach((item, index) => {
        if (item.path !== tabPath) return;
        // 找到下一个选项卡或上一个选项卡。通过计算索引值可以得到下一个选项卡的位置，即 tabsStore.value.tabList[index + 1]；如果不存在下一个选项卡，则返回上一个选项卡的位置，即 tabsStore.value.tabList[index - 1]。
        const nextTab = oldTabList[index + 1] || oldTabList[index - 1];
        if (!nextTab) return;
        // 如果找到了下一个或上一个选项卡，则使用路由导航方法[假设是 router.push]将页面跳转到该选项卡对应的路径。
        router.push(nextTab.path);
      });
    }
  }
  // 用来清空Tabs缓存
  const setTab = async (tabList: Tab[]) => {
    tabsStore.value.tabList = tabList;
  }
  // 设置选项卡标题
  const setTabTitle = async (title: string) => {
    // 根据当前标签页的path进行替换，tabList持久化数据里面的标签名称
    tabsStore.value.tabList.forEach(item => {
      // console.log("getUrlWithParams()", getUrlWithParams());
      if (item.path == getUrlWithParams()) item.title = title;
    });
  }
  // 关闭左边 OR 右边选项卡
  const closeSideTabs = async (path: string, type: "left" | "right") => {
    const currentIndex = tabsStore.value.tabList.findIndex(item => item.path === path);
    if (currentIndex !== -1) {
      const range = type === "left" ? [0, currentIndex] : [currentIndex + 1, tabsStore.value.tabList.length];
      tabsStore.value.tabList = tabsStore.value.tabList.filter((item, index) => {
        return index < range[0] || index >= range[1] || !item.closeIcon;
      });

      const closeTab = tabsStore.value.tabList.filter((item: Tab) => {
        return !item.closeIcon;
      });

      if (type === "left") {
        const nextTab = tabsStore.value.tabList[closeTab.length];
        router.push(nextTab?.path);
      }

      if (type === "right") {
        const nextTab = tabsStore.value.tabList[currentIndex] || tabsStore.value.tabList[currentIndex + 1] || tabsStore.value.tabList[currentIndex - 1];
        router.push(nextTab?.path);
      }
    }
    // 重新设置路由缓存，将新的tabList的name覆盖keepAliveList
    const keepAliveList = tabsStore.value.tabList.filter(item => item.isKeepAlive);
    useKeepAliveStore().setKeepAliveName(keepAliveList.map(item => item.name));
  }
  // 关闭多个选项卡，若tabValue传递有值并且选项卡数组中存在，则关闭除自己和固定选项卡之外的所有选项卡[关闭其他选项卡]，若tabValue不传值，则关闭除固定选项卡之外的所有选项卡[关闭所有选项卡]。
  const closeManyTabs = async (tabValue?: string) => {
    tabsStore.value.tabList = tabsStore.value.tabList.filter(item => {
      return item.path === tabValue || !item.closeIcon;
    });
    // 重新设置路由缓存，将新的tabList的name覆盖keepAliveList
    const keepAliveList = tabsStore.value.tabList.filter(item => item.isKeepAlive);
    useKeepAliveStore().setKeepAliveName(keepAliveList.map(item => item.name));
  }
  // 选项卡是否固钉
  const replaceIsAffix = async (tabPath?: string, closeIcon?: boolean) => {
    tabsStore.value.tabList.forEach(item => {
      if (item.path == tabPath) {
        item.closeIcon = closeIcon;
      }
    });
  }

  const getTabs = computed(() => tabsStore.value.tabList)
  return {
    tabsStore,
    addTab,
    removeTab,
    setTab,
    setTabTitle,
    closeSideTabs,
    closeManyTabs,
    replaceIsAffix,
    getTabs,
  }
}, {
  persist: {// 开启数据持久化
    // enabled: true, // true 表示开启持久化保存
    key: CACHE_PREFIX + "tabs", // 默认会以 store 的 id 作为 key
    storage: localStorage
  },
})