import type { AxiosRequestConfig } from 'axios'
import { saveAs } from 'file-saver'

// 生成唯一请求ID
export const generateReqId = (config: AxiosRequestConfig) => {
    return `${config.method?.toUpperCase()}|${config.url}|${JSON.stringify(config.params)}|${JSON.stringify(config.data)}`
}

// 处理文件下载
export const handleFileDownload = (blob: Blob, filename?: string) => {
    const name = filename || `file-${Date.now()}`
    saveAs(new Blob([blob]), name)
}