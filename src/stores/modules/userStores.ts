import { defineStore } from "pinia";
import { ref } from "vue";
import { CACHE_PREFIX } from "@/config";
interface User {
    token: string, // [token] --token,
    expires_in: number, // [ExpiresIn] --过期时间,
    refresh_token: string, // [RefreshToken] --token,
    token_type: string, // [TokenType] --类型,
}
const initUser: User = {
    token: "",
    expires_in: 0,
    refresh_token: "",
    token_type: "Bearer",
}
export const useUserStore = defineStore("user", () => {

    const userStore = ref<User>(initUser);

    function setToken(token: { access_token: string, expires_in: number, refresh_token: string, token_type: string }) {
        userStore.value.token = token.access_token;
        userStore.value.expires_in = token.expires_in;
        userStore.value.refresh_token = token.refresh_token;
        userStore.value.token_type = token.token_type;
    }

    return { userStore, setToken };
}, {
    persist: {
        // enabled: true, // true 表示开启持久化保存，默认localStorage
        key: CACHE_PREFIX + "user", // 默认会以 store 的 id 作为 key
        storage: localStorage
    },
});