import type { AxiosRequestConfig, AxiosError } from 'axios'

// 基础响应结构
export interface ResponseData<T = any> {
    code: number
    data: T
    message: string
    success: boolean
}

// 扩展 axios 配置类型
declare module 'axios' {
    interface AxiosRequestConfig {
        /**
         * @description 是否显示错误提示
         */
        showError?: boolean
        /**
         * @description 是否返回原始响应（不经过拦截器处理）
         */
        originalResponse?: boolean
    }

    interface AxiosResponse<T = any> extends ResponseData<T> { }
}

// 业务错误类型
export interface BusinessError {
    code: number
    message: string
    originalError: AxiosError
}

// 文件下载参数
export interface DownloadConfig {
    filename?: string
    data?: Record<string, any>
    params?: Record<string, any>
}