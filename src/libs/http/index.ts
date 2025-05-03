// @/libs/http/index.ts
import Http from './axios'
import type { AxiosRequestConfig } from 'axios'

const defaultConfig: AxiosRequestConfig = {
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://localhost:5219', // 'http://172.16.1.236:999/'
  timeout: 30000
}

const http = new Http(defaultConfig)

export default http