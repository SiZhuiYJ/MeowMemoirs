
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { UserInfo } from '@/libs/api/user/type'
import { userApi } from '@/libs/api/user'
import { generateRoutes, getShowStaticAndDynamicMenuList } from '@/routers/utils'
export interface Auth {
    // 扁平化路由数据
    menuList: any[],
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

    async function listRouters() {
        const { data } = await userApi.MMPostRouter()
        console.log('路由数据', data)
        // 去除掉不需要的路由数据
        const filterMenuList = getShowStaticAndDynamicMenuList(data.menuList)
        console.log('去除掉不需要的路由数据', filterMenuList)
        // 递归菜单数据
        const recursiveMenuList = generateRoutes(filterMenuList, 0)
        console.log('递归菜单数据', recursiveMenuList)
        authStore.value.menuList = recursiveMenuList
        console.log('扁平化路由数据', authStore.value.menuList)
    }
    async function getLoginUserInfo() {
        const { data } = await userApi.MMPostUser()
        authStore.value.loginUser = data.userInfo
        authStore.value.buttonList = data.buttonList
        authStore.value.roleList = data.roleList
    }

    const getMenuList = computed(() => authStore.value.menuList)
    const getRouters = computed(() => authStore.value.menuList.filter(item => item.menuType === '1'))
    const getButtonList = computed(() => authStore.value.buttonList)
    const getRoleList = computed(() => authStore.value.roleList)

    return { authStore, listRouters, getLoginUserInfo, getMenuList, getRouters, getButtonList, getRoleList }
})