// src/plugins/axios.js
import axios from 'axios'
const NETWORL_ERROR = '网络错误，请稍后再试'
// 创建axios实例
const service = axios.create({
	baseURL: import.meta.env.VITE_API_BASE_URL || 'https://localhost:5219', // 'http://172.16.1.236:999/'// 替换为你的API基础URL
	timeout: 50000, // 请求超时时间
})
// 请求拦截器
service.interceptors.request.use(
	(config) => {
		// 在发送请求之前做些什么
		// 例如，你可以在这里添加token到请求头

		console.log('请求发送：', config) // for debug
		return config
	},
	(error) => {
		// 对请求错误做些什么
		console.error('请求出错：', error) // for debug
		Promise.reject(error)
	}
)

// 响应拦截器
service.interceptors.response.use(
	(res) => {
		const { code, data, message } = res.data
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
interface RedirectOptions {
	url: string
	method?: string
	data?: any
	params?: any
	headers?: any
	[other: string]: any // 其他参数
}
export interface LoginParams {
	Type: string, Identifier: string, Password: string,
}
function redirect(options: RedirectOptions) {
	options.method = options.method || 'get'
	return service(options)
}
export function GetIpInfo() {
	return redirect({
		url: '/IpInfo/GetIpInfo',
		method: 'get',
	})
}
//普通登录
export function UserToLogin(LoginDto: LoginParams) {
	return redirect({
		url: '/Auth/UserToLogin',
		method: 'post',
		data: LoginDto,
	})
}
//获取用户信息
export function GetUserInfo() {
	return redirect({
		url: '/users/GetUser',
		method: 'get',
	})
}
//获取用户信息
export function PostProfile(id: string) {
	return redirect({
		url: '/users/GetProfile/' + id,
		method: 'post',
	})
}
// export default redirect
