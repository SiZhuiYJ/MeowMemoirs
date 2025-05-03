// src/plugins/axios.js
import axios from 'axios'
import type { AxiosResponse, } from 'axios'
import { getToken } from '@/utils/storage'
import type { RouteRecordRaw } from 'vue-router'
import type { ToUser, UserInfo } from '@/stores/'
const NETWORL_ERROR = '网络错误，请稍后再试'
export interface ResponseData<T = any> {
	code: number
	data: T
	message: string
	success: boolean
}
interface Data {
	jwtTokenResult: ToUser
	menuList: RouteRecordRaw[]
	userInfo: UserInfo
}
interface user {
	userId: number,
	rainbowId: string,
	userName: string,
	userPwd: string,
	userPhome: string,
	userEmail: string,
	userImg: string,
	permissions: string,
	question: string,
	secPwd: string
}
// 创建axios实例
const service = axios.create({
	baseURL: import.meta.env.VITE_API_BASE_URL || 'https://localhost:5219', // 'http://172.16.1.236:999/'// 替换为你的API基础URL
	timeout: 50000, // 请求超时时间
})
// 请求拦截器
service.interceptors.request.use(
	(config) => {
		console.log('请求URL:', config.baseURL as string + config.url); // 打印完整URL
		console.log('请求方法:', config.method);
		console.log('请求参数:', config.data);
		// 在发送请求之前做些什么
		console.log('请求发送：', config) // for debug
		return config
	},
	(error) => {
		// 对请求错误做些什么
		console.error('请求出错：', error) // for debug
		return Promise.reject(error)
	}
)

// 响应拦截器
service.interceptors.response.use(
	(res: AxiosResponse<ResponseData>) => {
		const { code, data, message }: ResponseData = res.data
		if (code === 200) {
			console.log('响应成功：', res) // for debug
			return data
		} else {
			console.error('响应出错：', message) // for debug
			return Promise.reject(message || NETWORL_ERROR)
		}
	},
	(error) => {
		// 对响应错误做点什么
		if (error.status == 401) {

		}
		else {
			console.error('响应出错：', error) // for debug
		}
		return Promise.reject(error)
	}
)
export interface LoginParams {
	Type: string, Identifier: string, Password: string,
}
// 返回值类型
export interface Result<T = any> {
	code: number;
	msg: string;
	data: T;
}
// Get请求
export function get<T = Result>(url: string, params?: object): Promise<T> {
	return service.get(url, { params });
};
// Post请求
export function post<T = Result>(url: string, data?: object): Promise<T> {
	return service.post(url, data);
};

// 图片上传
export function upload<T = Result>(url: string, formData?: object): Promise<T> {
	return service.post(url, formData, {
		headers: {
			"Content-Type": "multipart/form-data"
		}
	});
};
// 下载
export function download<T = Result>(url: string, data?: object): Promise<T> {
	return service.post(import.meta.env.VITE_SERVER + url, data, {
		headers: {
			Authorization: "Bearer " + getToken()
		},
		responseType: 'blob'
	});
};

export const MMLogin = (params: LoginParams) => {
	return post<ResponseData<(Data)>>('/Auth/UserToLogin', params);
};
export const MMGetUser = () => {
	return get<ResponseData<(user)>>('/users/GetUser');
};
