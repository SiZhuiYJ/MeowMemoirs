import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  // resolve: {
  //   // 配置路径别名
  //   alias: {
  //     "@": path.resolve("./src"), // 相对路径别名配置，使用 @ 代替 src
  //     "~": path.resolve("./src")
  //   }
  // },

  resolve: {
    alias: {
      // 相对路径别名配置，使用 @ 代替 src
      "@": path.join(__dirname, "./src"),
    }
  },
  css: {
    // css全局变量使用，@/styles/variable.scss文件
    preprocessorOptions: {
      scss: {
        additionalData: '@use "@/styles/variable.scss" as *;'
      }
    }
  },
})
