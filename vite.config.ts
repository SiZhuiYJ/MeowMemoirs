import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";
import { createSvgIconsPlugin } from "vite-plugin-svg-icons";
import fs from "fs";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
import { visualizer } from "rollup-plugin-visualizer";

import prismjs from "vite-plugin-prismjs";

// https://vite.dev/config/
import tsconfigPaths from "vite-tsconfig-paths"; //npm uninstall vite-tsconfig-paths
import cssAnalyzer from "./plugins/vite-plugin-css-analyzer";

/**
 * Vite构建配置
 * 
 * 主要功能包括：
 * 1. 配置开发服务器（HTTPS、端口等）
 * 2. 设置构建选项（代码压缩、分块策略等）
 * 3. 配置插件（Vue、SVG图标、自动导入等）
 * 4. 设置路径别名
 * 5. 配置资源处理规则
 */
export default defineConfig({
  /**
   * 配置需要使用的Vite插件
   */
  plugins: [
    // Vue官方插件，用于处理.vue文件
    vue(),

    // PrismJS插件，用于代码高亮
    prismjs({
      languages: ["json", "bash", "typescript", "css", "sql", "javascript"],
    }),

    // TS路径映射插件，使tsconfig.json中的paths配置生效
    tsconfigPaths(),

    // 自定义CSS分析插件，用于处理鼠标相关样式
    cssAnalyzer(),

    // SVG图标插件，用于处理SVG雪碧图
    createSvgIconsPlugin({
      // 指定存放SVG图标的目录
      iconDirs: [path.resolve(process.cwd(), "src/assets/icons")],
      // 指定symbolId格式
      symbolId: "icon-[dir]-[name]",
    }),

    // 打包可视化分析插件，用于分析打包文件大小
    visualizer({ open: true }),

    // 自动导入插件，自动导入常用API
    AutoImport({
      // 配置需要自动导入的第三方库解析器
      resolvers: [ElementPlusResolver()],
    }),

    // 组件自动导入插件
    Components({
      // 配置Element Plus组件解析器
      resolvers: [ElementPlusResolver()],
    }),
  ],

  /**
   * 开发服务器配置
   */
  server: {
    // 服务器主机名，0.0.0.0表示允许外部访问
    host: "0.0.0.0",
    // 服务器端口号
    port: 9191,
    // 启动后是否自动打开浏览器
    open: false,
    // HTTPS配置
    https: {
      // SSL证书私钥文件
      key: fs.readFileSync("certs/localhost+1-key.pem"),
      // SSL证书文件
      cert: fs.readFileSync("certs/localhost+1.pem"),
    },
  },

  /**
   * 构建配置
   */
  build: {
    // 指定生成静态资源的存放目录
    assetsDir: "assets",
    // 指定输出目录
    outDir: "dist",
    // 指定压缩器
    minify: "terser",
    // 启用CSS代码分割
    cssCodeSplit: true,

    /**
     * Rollup打包选项
     */
    rollupOptions: {
      output: {
        /**
         * 自定义chunks分组策略
         * 将node_modules中的依赖分别打包成独立文件
         */
        manualChunks(id) {
          if (id.includes("node_modules")) {
            // 让每个插件都打包成独立的文件
            return id
              .toString()
              .split("node_modules/")[1]
              .split("/")[0]
              .toString();
          }
        },
      },
    },

    /**
     * Terser压缩选项
     */
    terserOptions: {
      compress: {
        // 是否删除console语句
        drop_console: false,
        // 是否删除debugger语句
        drop_debugger: true,
      },
    },
  },

  /**
   * 静态资源处理配置
   * 指定需要额外处理的静态资源类型
   */
  assetsInclude: ["**/*.ani"],

  /**
   * CSS相关配置
   */
  css: {
    // 启用CSS源映射，便于调试
    devSourcemap: true,
    // PostCSS配置
    postcss: {
      // 可在此处添加其他PostCSS插件
    },
  },

  /**
   * 路径解析配置
   * 设置模块导入路径别名，提高代码可读性和维护性
   */
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@assets": path.resolve(__dirname, "src/assets"),
      "@components": path.resolve(__dirname, "src/components"),
      "@libs": path.resolve(__dirname, "src/libs"),
      "@utils": path.resolve(__dirname, "src/utils"),
      "@views": path.resolve(__dirname, "src/views"),
    },
  },
});