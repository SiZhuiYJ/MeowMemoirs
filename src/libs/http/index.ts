import Http from './axios'
import type { AxiosRequestConfig } from 'axios'

const defaultConfig: AxiosRequestConfig = {
  baseURL: import.meta.env.VITE_API_BASE_URL || '',
  timeout: 30000
}

const http = new Http(defaultConfig)

export default http