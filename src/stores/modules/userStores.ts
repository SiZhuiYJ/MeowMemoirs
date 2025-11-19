import { defineStore } from "pinia";
import { ref } from "vue";
import { CACHE_PREFIX, STATIC_URL } from "@/config";
import { userApi } from "@/libs/api/login/user";
import type { ILoginParams } from "@/libs/api/login/user/type";
import router from "@/routers";
export interface User {
  token: string; // [token] --token,
  expires_in: number; // [ExpiresIn] --过期时间,
  refresh_token: string; // [RefreshToken] --token,
  token_type: string; // [TokenType] --类型,
}
export interface ToUser {
  access_token: string; // [token] --token,
  expires_in: number; // [ExpiresIn] --过期时间,
  refresh_token: string; // [RefreshToken] --token,
  token_type: string; // [TokenType] --类型,
}
const initUser: User = {
  token: "",
  expires_in: 0,
  refresh_token: "",
  token_type: "Bearer",
};
export const useUserStore = defineStore(
  "user",
  () => {
    const userStore = ref<User>(initUser);

    function setToken(token: ToUser | null) {
      userStore.value.token = token?.access_token || "";
      userStore.value.expires_in = token?.expires_in || 0;
      userStore.value.refresh_token = token?.refresh_token || "";
      userStore.value.token_type = token?.token_type || "";
    }

    async function login(ILoginParams: ILoginParams) {
      try {
        const { data } = await userApi.MMLogin({
          Type: ILoginParams.Type,
          Identifier: ILoginParams.Identifier,
          Password: ILoginParams.Password,
        });
        setToken(data.jwtTokenResult);
        console.log(data);
        console.log(userStore.value);
        router.push(STATIC_URL);
      } catch (error: any) {
        setToken(null);
        return Promise.reject(error);
      }
    }
    async function postToken() {
      try {
        userStore.value.token = userStore.value.refresh_token;
        const { data } = await userApi.PostToken();
        setToken(data.jwtTokenResult);
        console.log("换token成功", data);
        router.push(STATIC_URL);
      } catch (error: any) {
        setToken(null);
        return Promise.reject(error);
      }
    }
    return {
      userStore,
      setToken,
      login,
      postToken,
    };
  },
  {
    persist: {
      // enabled: true, // true 表示开启持久化保存，默认localStorage
      key: CACHE_PREFIX + "user", // 默认会以 store 的 id 作为 key
      storage: localStorage,
    },
  }
);
