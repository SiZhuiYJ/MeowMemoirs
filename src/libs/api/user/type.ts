// @/libs/api/user/type.ts
import type { ToUser, UserInfo } from '@/stores'
import type { RouteRecordRaw } from 'vue-router'
// 登录参数
export interface ILoginParams {
    Type: string,
    Identifier: string,
    Password: string,
}
//  登录返回数据
export interface Data {
    jwtTokenResult: ToUser
    menuList: RouteRecordRaw[]
    userInfo: UserInfo
}