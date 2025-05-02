import http from '@/libs/http'
import type { ResponseData } from '@/libs/http/type'

// 用户类型
export interface User {
    id: number
    username: string
    email: string
    avatar: string
}

// 登录参数
export interface LoginParams {
    handover: string
    username: string
    password: string
}

export const userApi = {
    // 用户登录
    login(params: LoginParams) {
        return http.post<ResponseData<{ token: string }>>('/Auth/UserToLogin', params)
    },

    // 获取当前用户信息
    getProfile() {
        return http.get<ResponseData<User>>('/user/profile')
    },

    // 更新用户信息
    updateProfile(data: Partial<User>) {
        return http.put<ResponseData<User>>('/user/profile', data)
    },

    // 导出用户列表
    exportUserList(params: Record<string, any>) {
        return http.download('/users/export', {
            filename: `users-${Date.now()}.xlsx`,
            params
        })
    }
}