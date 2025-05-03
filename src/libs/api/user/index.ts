// @/libs/api/user/index.ts
import http from '@/libs/http'
import type { ResponseData } from '@/libs/http/type'
import type { ILoginParams, Data } from './type'
export const userApi = {
    // 用户登录
    MMLogin(params: ILoginParams) {
        return http.post<ResponseData<(Data)>>('/Auth/UserToLogin', params);
    },
}