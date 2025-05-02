
import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse, type InternalAxiosRequestConfig, type AxiosError } from 'axios'
import { meowMsgError } from '@/utils/message'
import router from '@/routers/index'
import { useUserStore } from '@/stores/index'
import type { ResponseData, BusinessError, DownloadConfig } from './type'
import { generateReqId, handleFileDownload } from './utils'

class Http {
    private instance: AxiosInstance
    private pendingMap = new Map<string, AbortController>()

    constructor(config: AxiosRequestConfig) {
        this.instance = axios.create({
            timeout: 15000,
            withCredentials: true,
            ...config
        })
        this.initInterceptors()
    }

    // 初始化拦截器
    private initInterceptors() {
        this.instance.interceptors.request.use(
            (config) => this.handleRequest(config),
            (error) => this.handleRequestError(error)
        )

        this.instance.interceptors.response.use(
            (response) => this.handleResponse(response),
            (error) => this.handleResponseError(error)
        )
    }

    // 请求拦截处理
    private handleRequest(config: InternalAxiosRequestConfig) {
        this.removePending(config)
        this.addPending(config)

        const token = useUserStore().userStore.token
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`
        }

        return config
    }

    // 响应拦截处理
    private handleResponse(response: AxiosResponse<ResponseData>) {
        this.removePending(response.config)

        if (response.config.originalResponse) {
            return response
        }

        const { code, message: msg, data } = response.data

        if (code === 401) {
            this.handleUnauthorized()
            return Promise.reject({ code, message: msg })
        }

        if (code !== 200) {
            response.config.showError !== false && meowMsgError(msg)
            return Promise.reject({ code, message: msg })
        }

        return data
    }
    // 添加请求错误处理方法
    private handleRequestError(error: AxiosError<ResponseData>) {
        this.removePending(error.config || {})

        const showError = error.config?.showError !== false
        const status = error.response?.status || 0
        const businessCode = error.response?.data?.code || -1
        const errorMessage = error.response?.data?.message || error.message

        // 业务错误处理
        if (businessCode !== -1) {
            showError && meowMsgError(errorMessage)
            return Promise.reject({
                code: businessCode,
                message: errorMessage,
                originalError: error
            } as BusinessError)
        }

        // HTTP 错误处理
        const httpError = this.getHttpErrorMessage(status)
        showError && meowMsgError(httpError)

        // 401 特殊处理
        if (status === 401) {
            this.handleUnauthorized()
        }

        return Promise.reject({
            code: status,
            message: httpError,
            originalError: error
        } as BusinessError)
    }
    // 错误处理
    private handleResponseError(error: AxiosError<ResponseData>) {
        this.removePending(error.config || {})

        const showError = error.config?.showError !== false
        const status = error.response?.status || 0
        const businessCode = error.response?.data?.code || -1
        const errorMessage = error.response?.data?.message || error.message

        // 业务错误处理
        if (businessCode !== -1) {
            showError && meowMsgError(errorMessage)
            return Promise.reject({
                code: businessCode,
                message: errorMessage,
                originalError: error
            } as BusinessError)
        }

        // HTTP 错误处理
        const httpError = this.getHttpErrorMessage(status)
        showError && meowMsgError(httpError)

        // 401 特殊处理
        if (status === 401) {
            this.handleUnauthorized()
        }

        return Promise.reject({
            code: status,
            message: httpError,
            originalError: error
        } as BusinessError)
    }

    // 添加请求标记
    private addPending(config: AxiosRequestConfig) {
        const reqId = generateReqId(config)
        const controller = new AbortController()
        config.signal = controller.signal
        this.pendingMap.set(reqId, controller)
    }

    // 移除请求标记
    private removePending(config: AxiosRequestConfig) {
        const reqId = generateReqId(config)
        const controller = this.pendingMap.get(reqId)
        controller?.abort()
        this.pendingMap.delete(reqId)
    }

    // 获取 HTTP 错误信息
    private getHttpErrorMessage(status: number): string {
        const messages: Record<number, string> = {
            400: "错误请求",
            401: "未授权，请重新登录",
            403: "对不起，您没有权限访问",
            404: "请求错误,未找到请求路径",
            405: "请求方法未允许",
            408: "请求超时",
            500: "服务器又偷懒了，请重试",
            501: "网络未实现",
            502: "网络错误",
            503: "服务不可用",
            504: "网络超时",
            505: "http版本不支持该请求",
        }
        return messages[status] || `网络连接错误 (${status})`
    }

    // 处理未授权
    private handleUnauthorized() {
        useUserStore().setToken({ access_token: '', expires_in: 1, refresh_token: '', token_type: '' })
        router.replace('/login')
        meowMsgError('登录状态已过期，请重新登录')
    }

    // 核心请求方法
    request<T = any>(config: AxiosRequestConfig): Promise<T> {
        return this.instance.request(config)
    }

    // get请求
    get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
        return this.instance.get(url, config)
    }

    // post请求
    post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
        return this.instance.post(url, data, config)
    }

    // put请求
    put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
        return this.instance.put(url, data, config)
    }

    // delete请求
    delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
        return this.instance.delete(url, config)
    }

    // 文件上传
    upload<T = any>(url: string, file: File, fieldName = 'file') {
        const formData = new FormData()
        formData.append(fieldName, file)
        return this.post<T>(url, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        })
    }

    // 文件下载
    async download(url: string, config?: DownloadConfig) {
        const response = await this.instance.post(url, config?.data, {
            responseType: 'blob',
            params: config?.params
        })

        handleFileDownload(response.data, config?.filename)
        return response.data
    }
}

export default Http