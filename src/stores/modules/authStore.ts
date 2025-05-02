import type { RouteRecordRaw } from 'vue-router'
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
interface UserInfo {
    rainbowId: string, // [UserID] --id,
    userImg: string,// [RainbowID] --编号,
    userName: string,// [UserName] --昵称,
}
interface Auth {
    // 扁平化路由数据
    menuList: RouteRecordRaw[],
    // 递归之后的菜单数据
    recursiveMenuList: [],
    // 面包屑数据
    breadcrumbList: [],
    // 用户角色
    roleList: string[],
    // 按钮权限列表
    buttonList: string[],
    // 用户信息
    loginUser: UserInfo
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
        rainbowId: '',
        userImg: '',
        userName: '',
    }
}
export const useAuthStore = defineStore('auth', () => {

    const authStore = ref<Auth>(infoAuth)

    const getMenuList = computed(() => authStore.value.menuList)

    return { authStore, getMenuList }
})