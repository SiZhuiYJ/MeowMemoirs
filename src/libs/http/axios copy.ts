// @/libs/http/axios.ts
import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios'
import { meowMsgError } from '@/utils/message'
import router from '@/routers/index'
import { useUserStore } from '@/stores/index'
import { getToken } from '@/utils/storage'
import { LOGIN_URL } from '@/config'
// 返回值类型
export interface Result<T = any> {
    code: number;
    msg: string;
    data: T;
}
// 只有请求封装用的Yu，方便简写
class Yu {
    private instance: AxiosInstance;
    // 初始化
    constructor(config: AxiosRequestConfig) {
        // 实例化axios
        this.instance = axios.create(config);
        // 配置拦截器
        this.interceptors();
    }

    // 拦截器
    private interceptors() {
        // 请求发送之前的拦截器：携带token
        // @ts-ignore

        this.instance.interceptors.request.use(
            config => {
                // 获取token
                const token = getToken();
                // 如果实现挤下线功能，需要用户绑定一个uuid，uuid发生变化，后端将数据进行处理[直接使用Sa-Token框架也阔以]
                if (token) {
                    config.headers!["Authorization"] = "Bearer " + token;
                }
                return config;
            },
            (error: any) => {
                error.data = {};
                error.data.msg = "服务器异常，请联系管理员🌻";
                return error;
            }
        );
        // 请求返回之后的拦截器：数据或者状态
        this.instance.interceptors.response.use(
            (res: AxiosResponse) => {
                console.log("axios返回数据：", res);
                console.log("服务器状态", res.status);
                const status = res.data.status || res.data.code; // 后端返回数据状态
                if (status == 200) {
                    // 服务器连接状态，非后端返回的status 或者 code
                    // 这里的后端可能是code OR status 和 msg OR message需要看后端传递的是什么？
                    // console.log("200状态", status);
                    return res.data;
                } else if (status == 401) {
                    // console.log("401状态", status);
                    const userStore = useUserStore();
                    userStore.setToken(null); // 清空token必须使用这个，不能使用session清空，因为登录的时候js会获取一遍token还会存在。
                    meowMsgError("登录身份过期，请重新登录🌻");
                    router.replace(LOGIN_URL);
                    return Promise.reject(res.data);
                } else {
                    // console.log("后端返回数据：", res.data.msg)
                    meowMsgError(res.data.msg + "🌻" || "服务器偷偷跑到火星去玩了🌻");
                    return Promise.reject(res.data.msg + "🌻" || "服务器偷偷跑到火星去玩了🌻"); // 可以将异常信息延续到页面中处理，使用try{}catch(error){};
                }
            },
            (error: any) => {
                // 处理网络错误，不是服务器响应的数据
                // console.log("进入错误", error);
                error.data = {};
                if (error && error.response) {
                    switch (error.response.status) {
                        case 400:
                            error.data.msg = "错误请求🌻";
                            meowMsgError(error.data.msg);
                            break;
                        case 401:
                            error.data.msg = "未授权，请重新登录🌻";
                            meowMsgError(error.data.msg);
                            break;
                        case 403:
                            error.data.msg = "对不起，您没有权限访问🌻";
                            meowMsgError(error.data.msg);
                            break;
                        case 404:
                            error.data.msg = "请求错误,未找到请求路径🌻";
                            meowMsgError(error.data.msg);
                            break;
                        case 405:
                            error.data.msg = "请求方法未允许🌻";
                            meowMsgError(error.data.msg);
                            break;
                        case 408:
                            error.data.msg = "请求超时🌻";
                            meowMsgError(error.data.msg);
                            break;
                        case 500:
                            error.data.msg = "服务器又偷懒了，请重试🌻";
                            meowMsgError(error.data.msg);
                            break;
                        case 501:
                            error.data.msg = "网络未实现🌻";
                            meowMsgError(error.data.msg);
                            break;
                        case 502:
                            error.data.msg = "网络错误🌻";
                            meowMsgError(error.data.msg);
                            break;
                        case 503:
                            error.data.msg = "服务不可用🌻";
                            meowMsgError(error.data.msg);
                            break;
                        case 504:
                            error.data.msg = "网络超时🌻";
                            meowMsgError(error.data.msg);
                            break;
                        case 505:
                            error.data.msg = "http版本不支持该请求🌻";
                            meowMsgError(error.data.msg);
                            break;
                        default:
                            error.data.msg = `连接错误${error.response.status}`;
                            meowMsgError(error.data.msg);
                    }
                } else {
                    error.data.msg = "连接到服务器失败🌻";
                    meowMsgError(error.data.msg);
                }
                return Promise.reject(error); // 将错误返回给 try{} catch(){} 中进行捕获，就算不进行捕获，上方 res.data.status != 200 也会抛出提示。
            }
        );
    };
    // Get请求
    get<T = Result>(url: string, params?: object): Promise<T> {
        return this.instance.get(url, { params });
    };
    // Post请求
    post<T = Result>(url: string, data?: object): Promise<T> {
        console.log(data);
        return this.instance.post(url, data);
    };
    // Put请求
    put<T = Result>(url: string, data?: object): Promise<T> {
        return this.instance.put(url, data);
    };
    // Delete请求 /yu/role/1
    delete<T = Result>(url: string): Promise<T> {
        return this.instance.delete(url);
    };
    // 图片上传
    upload<T = Result>(url: string, formData?: object): Promise<T> {
        return this.instance.post(url, formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });
    };
    // 导出Excel
    exportExcel<T = Result>(url: string, params?: object): Promise<T> {
        return axios.get(import.meta.env.VITE_SERVER + url, {
            params,
            headers: {
                Accept: "application/vnd.ms-excel",
                Authorization: "Bearer " + getToken()
            },
            responseType: "blob"
        });
    };
    // 下载
    download<T = Result>(url: string, data?: object): Promise<T> {
        return axios.post(import.meta.env.VITE_SERVER + url, data, {
            headers: {
                Authorization: "Bearer " + getToken()
            },
            responseType: 'blob'
        });
    }
}
export default Yu // 实例化axios
// import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse, type InternalAxiosRequestConfig, type AxiosError } from 'axios'
// import type { ResponseData, BusinessError, DownloadConfig } from './type'
// import { generateReqId, handleFileDownload } from './utils'
// class Http {
//     private instance: AxiosInstance
//     private pendingMap = new Map<string, AbortController>()

//     constructor(config: AxiosRequestConfig) {
//         this.instance = axios.create({
//             timeout: 15000,
//             withCredentials: true,
//             ...config
//         })
//         this.initInterceptors()
//     }

//     // 初始化拦截器
//     private initInterceptors() {
//         this.instance.interceptors.request.use(
//             (config) => this.handleRequest(config),
//             (error) => this.handleRequestError(error)
//         )

//         this.instance.interceptors.response.use(
//             (response) => this.handleResponse(response),
//             (error) => this.handleResponseError(error)
//         )
//     }

//     // 请求拦截处理
//     private handleRequest(config: InternalAxiosRequestConfig) {
//         console.log('发送请求', config)
//         this.removePending(config)
//         this.addPending(config)

//         const token = useUserStore().userStore.token
//         if (token && config.headers) {
//             config.headers.Authorization = `Bearer ${token}`
//         }

//         return config
//     }

//     // 响应拦截处理
//     private handleResponse(response: AxiosResponse<ResponseData>) {
//         console.log('响应成功', response)
//         console.log('获取成功', response.config)

//         this.removePending(response.config)

//         if (response.config.originalResponse) {
//             return response
//         }

//         const { code, message: msg, data } = response.data

//         if (code === 401) {
//             this.handleUnauthorized()
//             return Promise.reject({ code, message: msg })
//         }

//         if (code !== 200) {
//             response.config.showError !== false && meowMsgError(msg)
//             return Promise.reject({ code, message: msg })
//         }

//         return data
//     }
//     // 添加请求错误处理方法
//     private handleRequestError(error: AxiosError<ResponseData>) {
//         this.removePending(error.config || {})

//         const showError = error.config?.showError !== false
//         const status = error.response?.status || 0
//         const businessCode = error.response?.data?.code || -1
//         const errorMessage = error.response?.data?.message || error.message

//         // 业务错误处理
//         if (businessCode !== -1) {
//             showError && meowMsgError(errorMessage)
//             return Promise.reject({
//                 code: businessCode,
//                 message: errorMessage,
//                 originalError: error
//             } as BusinessError)
//         }

//         // HTTP 错误处理
//         const httpError = this.getHttpErrorMessage(status)
//         showError && meowMsgError(httpError)

//         // 401 特殊处理
//         if (status === 401) {
//             this.handleUnauthorized()
//         }

//         return Promise.reject({
//             code: status,
//             message: httpError,
//             originalError: error
//         } as BusinessError)
//     }
//     // 错误处理
//     private handleResponseError(error: AxiosError<ResponseData>) {
//         this.removePending(error.config || {})

//         const showError = error.config?.showError !== false
//         const status = error.response?.status || 0
//         const businessCode = error.response?.data?.code || -1
//         const errorMessage = error.response?.data?.message || error.message

//         // 业务错误处理
//         if (businessCode !== -1) {
//             showError && meowMsgError(errorMessage)
//             return Promise.reject({
//                 code: businessCode,
//                 message: errorMessage,
//                 originalError: error
//             } as BusinessError)
//         }

//         // HTTP 错误处理
//         const httpError = this.getHttpErrorMessage(status)
//         showError && meowMsgError(httpError)

//         // 401 特殊处理
//         if (status === 401) {
//             this.handleUnauthorized()
//         }

//         return Promise.reject({
//             code: status,
//             message: httpError,
//             originalError: error
//         } as BusinessError)
//     }

//     // 添加请求标记
//     private addPending(config: AxiosRequestConfig) {
//         const reqId = generateReqId(config)
//         const controller = new AbortController()
//         config.signal = controller.signal
//         this.pendingMap.set(reqId, controller)
//     }

//     // 移除请求标记
//     private removePending(config: AxiosRequestConfig) {
//         const reqId = generateReqId(config)
//         const controller = this.pendingMap.get(reqId)
//         controller?.abort()
//         this.pendingMap.delete(reqId)
//     }

//     // 获取 HTTP 错误信息
//     private getHttpErrorMessage(status: number): string {
//         const messages: Record<number, string> = {
//             400: "错误请求",
//             401: "未授权，请重新登录",
//             403: "对不起，您没有权限访问",
//             404: "请求错误,未找到请求路径",
//             405: "请求方法未允许",
//             408: "请求超时",
//             500: "服务器又偷懒了，请重试",
//             501: "网络未实现",
//             502: "网络错误",
//             503: "服务不可用",
//             504: "网络超时",
//             505: "http版本不支持该请求",
//         }
//         return messages[status] || `网络连接错误 (${status})`
//     }

//     // 处理未授权
//     private handleUnauthorized() {
//         useUserStore().setToken({ access_token: '', expires_in: 1, refresh_token: '', token_type: '' })
//         router.replace('/login')
//         meowMsgError('登录状态已过期，请重新登录')
//     }

//     // 核心请求方法
//     request<T = any>(config: AxiosRequestConfig): Promise<T> {
//         return this.instance.request(config)
//     }

//     // get请求
//     get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
//         return this.instance.get(url, config)
//     }

//     // post请求
//     post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
//         return this.instance.post(url, data, config)
//     }

//     // put请求
//     put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
//         return this.instance.put(url, data, config)
//     }

//     // delete请求
//     delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
//         return this.instance.delete(url, config)
//     }

//     // 文件上传
//     upload<T = any>(url: string, file: File, fieldName = 'file') {
//         const formData = new FormData()
//         formData.append(fieldName, file)
//         return this.post<T>(url, formData, {
//             headers: { 'Content-Type': 'multipart/form-data' }
//         })
//     }

//     // 文件下载
//     async download(url: string, config?: DownloadConfig) {
//         const response = await this.instance.post(url, config?.data, {
//             responseType: 'blob',
//             params: config?.params
//         })

//         handleFileDownload(response.data, config?.filename)
//         return response.data
//     }
// }

// export default Http