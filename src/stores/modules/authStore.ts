import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { UserInfo } from "@/libs/api/login/user/type";
import { userApi } from "@/libs/api/login/user";
import {
  generateFlattenRoutes,
  generateRoutes,
  getShowStaticAndDynamicMenuList,
  getAllBreadcrumbList,
} from "@/routers/utils";
import { staticRouter } from "@/routers/modules/staticRouter";
import type { AppRouteRecordRaw } from "@/routers/type";

export interface Auth {
  // 扁平化路由数据
  menuList: AppRouteRecordRaw[];
  // 递归之后的菜单数据
  recursiveMenuList: AppRouteRecordRaw[];
  // 面包屑数据
  breadcrumbList: [];
  // 用户角色
  roleList: string[];
  // 按钮权限列表
  buttonList: string[];
  // 用户信息
  loginUser: UserInfo;
}

const infoAuth: Auth = {
  // 扁平化路由数据
  menuList: [],
  // 递归之后的菜单数据
  recursiveMenuList: [],
  // 面包屑数据
  breadcrumbList: [],
  // 用户角色
  roleList: [],
  // 按钮权限列表
  buttonList: [],
  // 用户信息
  loginUser: {
    rainbowId: "",
    userImg: "",
    userName: "",
  },
};
export const useAuthStore = defineStore("auth", () => {
  const authStore = ref<Auth>(infoAuth);

  async function listRouters() {
    const { data } = await userApi.MMPostRouter();
    authStore.value.menuList = generateFlattenRoutes(data.menuList);
    authStore.value.recursiveMenuList = generateRoutes(
      getShowStaticAndDynamicMenuList(data.menuList),
      0
    );
    authStore.value.breadcrumbList = staticRouter.concat(
      generateRoutes(data.menuList, 0)
    );;
  }
  async function getLoginUserInfo() {
    const { data } = await userApi.MMPostUser();
    authStore.value.loginUser = data.userInfo;
    authStore.value.buttonList = data.buttonList;
    authStore.value.roleList = data.roleList;
  }

  const getMenuList = computed(() => authStore.value.menuList);
  const getButtonList = computed(() => authStore.value.buttonList);
  const getRoleList = computed(() => authStore.value.roleList);
  // 菜单权限列表 ==> 左侧菜单栏渲染，这里的菜单将后端数据进行递归，需要将动态路由 isHide == 0 的隐藏菜单剔除, 将静态路由 isHide == 0 的隐藏菜单剔除
  const showMenuList = computed(
    () => authStore.value.recursiveMenuList[0].children
  );
  const getBreadcrumbList = computed(() =>
    getAllBreadcrumbList(authStore.value.breadcrumbList)
  );
  return {
    authStore,
    listRouters,
    getLoginUserInfo,
    getMenuList,
    getButtonList,
    getRoleList,
    showMenuList,
    getBreadcrumbList,
  };
});
