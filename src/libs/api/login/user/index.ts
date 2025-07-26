// @/libs/api/user/index.ts
import http from "@/libs/http";
import type { ResponseData } from "@/libs/http/type";
import type {
  ILoginParams,
  Data,
  IRegisterParams,
  ToInfo,
  menuList,
} from "./type";
interface AuthRouter {
  menuList: menuList[];
}
export const userApi = {
  // 用户登录
  MMLogin(params: ILoginParams) {
    return http.post<ResponseData<Data>>("/Auth/UserLogin", params);
  },
  // token验证
  MMPostToken() {
    return http.post<ResponseData<Data>>("/Auth/RefreshToken");
  },
  // 获取用户信息
  MMPostUser() {
    return http.post<ResponseData<ToInfo>>("/Auth/TokenToInfo");
  },
  // 获取路由
  MMPostRouter() {
    return http.post<ResponseData<AuthRouter>>("/Auth/TokenToMenuList");
  },
  // 用户注册
  MMPostRegister(params: IRegisterParams) {
    return http.post<ResponseData<Data>>("/Auth/UserRegistration", params);
  },
};
