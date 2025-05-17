import { defineStore } from "pinia";
import { CACHE_PREFIX } from "@/config/index.ts";
import { ref } from "vue";
type KeepAlive = {
    keepAliveName: string[]
}
const infoKeepAlive: KeepAlive = {
    keepAliveName: []
}
// defineStore方法执行会返回一个函数，函数的作用就是让组件可以获取到仓库数据
export const useKeepAliveStore = defineStore('keepAlive', () => {

    const keepAliveStore = ref<KeepAlive>(infoKeepAlive)

    // 该方法用于向 keepAliveName 数组中添加新的名称。如果数组中已经存在相同的名称，则不会重复添加。
    const addKeepAliveName = async (name: string) => {
        !keepAliveStore.value.keepAliveName.includes(name) && keepAliveStore.value.keepAliveName.push(name);
        console.log('keepAliveStore', keepAliveStore.value);
    }
    // 该方法用于从 keepAliveName 数组中移除指定的名称。使用 filter 方法过滤出不等于指定名称的元素，重新赋值给 keepAliveName 数组。
    const removeKeepAliveName = async (name: string) => {
        keepAliveStore.value.keepAliveName = keepAliveStore.value.keepAliveName.filter((item: string) => item !== name);
        console.log('keepAliveStore', keepAliveStore.value);
    }
    // 该方法用于设置 keepAliveName 数组的值。可以传入一个新的字符串数组作为参数，如果没有传入参数则默认为空数组。
    const setKeepAliveName = async (keepAliveName: string[] = []) => {
        keepAliveStore.value.keepAliveName = keepAliveName;
        console.log('keepAliveStore', keepAliveStore.value);
    }
    return {
        keepAliveStore,
        addKeepAliveName,
        removeKeepAliveName,
        setKeepAliveName
    }
}, {
    persist: {// 开启数据持久化
        // enabled: true, // true 表示开启持久化保存
        key: CACHE_PREFIX + "keepAlive", // 默认会以 store 的 id 作为 key
        storage: localStorage
    },
})