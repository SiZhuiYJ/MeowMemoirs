import { CACHE_PREFIX } from "@/config";

/**
 * 封装获取用户信息的方法
 */
export const getToken = () => {
  const User = window.localStorage.getItem(CACHE_PREFIX + "user");
  if (User != null && User != "" && User != undefined) {
    const parseUser = JSON.parse(User).userStore;
    const keys = Object.keys(parseUser);
    if (keys.includes("token")) {
      return parseUser.token;
    } else {
      return "";
    }
  } else {
    return "";
  }
};

/**
 * 各个小仓库之间进行数据交互使用 OR 页面获取storge值使用
 * window.sessionStorage
 * @method set 设置会话缓存
 * @method get 获取会话缓存
 * @method remove 移除会话缓存
 * @method clear 移除全部会话缓存
 */
export const SessionStorage = {
  put(key: string, value: any) {
    window.sessionStorage.setItem(CACHE_PREFIX + key, value);
  },
  set(key: string, value: any) {
    window.sessionStorage.setItem(CACHE_PREFIX + key, value);
  },
  get(key: string) {
    const value: any = window.sessionStorage.getItem(CACHE_PREFIX + key);
    return value;
  },
  remove(key: string) {
    window.sessionStorage.removeItem(CACHE_PREFIX + key);
  },
  clear() {
    window.sessionStorage.clear();
  },
  putJSON(key: string, jsonValue: any) {
    window.sessionStorage.put(CACHE_PREFIX + key, JSON.stringify(jsonValue));
  },
  setJSON(key: string, jsonValue: any) {
    window.sessionStorage.put(CACHE_PREFIX + key, JSON.stringify(jsonValue));
  },
  getJSON(key: string) {
    const jsonValue: any = window.sessionStorage.get(CACHE_PREFIX + key);
    return JSON.parse(jsonValue);
  }
};

/**
 * window.localStorage
 * @method set 设置
 * @method get 获取
 * @method remove 移除
 * @method clear 移除全部
 */
export const LocalStorage = {
  put<T>(key: string, value: T) {
    window.localStorage.setItem(CACHE_PREFIX + key, JSON.stringify(value));
  },
  set<T>(key: string, value: T) {
    window.localStorage.setItem(CACHE_PREFIX + key, JSON.stringify(value));
  },
  get<T>(key: string): T | null {
    const value: string | null = window.localStorage.getItem(CACHE_PREFIX + key);
    return value ? JSON.parse(value) : null;
  },
  remove(key: string) {
    window.localStorage.removeItem(CACHE_PREFIX + key);
  },
  clear() {
    window.localStorage.clear();
  },
  putJSON<T>(key: string, jsonValue: T) {
    window.localStorage.put(CACHE_PREFIX + key, JSON.stringify(jsonValue));
  },
  setJSON<T>(key: string, jsonValue: T) {
    window.localStorage.put(CACHE_PREFIX + key, JSON.stringify(jsonValue));
  },
  getJSON<T>(key: string): T {
    const jsonValue: any = window.localStorage.get(CACHE_PREFIX + key);
    return JSON.parse(jsonValue);
  }
};
