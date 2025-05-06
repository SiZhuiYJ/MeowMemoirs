import { createApp } from 'vue'
import App from './App.vue'
import './styles/index.scss'
// 链接组合
import useApiUrl from '@/libs/useApiUrl/index'
// 懒加载
import VueLazyload from 'vue-lazyload';
// element-plus
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
// element-plus图标
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
// 状态
import pinia from './stores'
// 路由
import router from './routers'


const app = createApp(App)
const { getLocalImgUrl } = useApiUrl()
app.use(VueLazyload, {
    preLoad: 1.3,
    error: getLocalImgUrl('BeBitten.webp'),
    loading: getLocalImgUrl('CatLoad.webp'),
    attempt: 1
})
app.use(ElementPlus)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

app.use(pinia)


app.use(router)


app.mount('#app')
