import { defineStore } from "pinia";
import { ref } from "vue";
interface User {
    token: string, // [token] --token,
    expires_in: number, // [ExpiresIn] --过期时间,
    refresh_token: string, // [RefreshToken] --token,
    token_type: string, // [TokenType] --类型,
    rainbowId: string, // [UserID] --id,
    userImg: string,// [RainbowID] --编号,
    userName: string,// [UserName] --昵称,

}
const initUser: User = {
    token: "",
    expires_in: 0,
    refresh_token: "",
    token_type: "Bearer",
    rainbowId: "",
    userImg: "",
    userName: "",
}
export const useUserStore = defineStore("user", () => {

    const userStore = ref<User>(initUser);

    function setUser(user: { rainbowId: string, userImg: string, userName: string }) {
        userStore.value.rainbowId = user.rainbowId;
        userStore.value.userImg = user.userImg;
        userStore.value.userName = user.userName;
    }

    function setToken(token: { access_token: string, expires_in: number, refresh_token: string, token_type: string }) {
        userStore.value.token = token.access_token;
        userStore.value.expires_in = token.expires_in;
        userStore.value.refresh_token = token.refresh_token;
        userStore.value.token_type = token.token_type;
    }

    return { userStore, setUser, setToken };
});