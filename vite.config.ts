import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";
import { createSvgIconsPlugin } from "vite-plugin-svg-icons";
import fs from "fs";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
import { visualizer } from "rollup-plugin-visualizer";

// https://vite.dev/config/
import tsconfigPaths from "vite-tsconfig-paths"; //npm uninstall vite-tsconfig-paths
import cssAnalyzer from "./plugins/vite-plugin-css-analyzer";
export default defineConfig({
  plugins: [
    vue(),
    tsconfigPaths(), //  配置tsconfig.json路径
    cssAnalyzer(), //  配置css分析插件 鼠标
    createSvgIconsPlugin({
      iconDirs: [path.resolve(process.cwd(), "src/assets/icons")],
      symbolId: "icon-[dir]-[name]",
    }),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
    visualizer({ open: true }),
  ],
  server: {
    host: "catsdiary.com", //服务器主机名
    // host: "0.0.0.0", //本地测试时使用
    port: 2345, //端口号
    open: false, //启动后是否自动打开浏览器
    https: {
      key: fs.readFileSync("certs/localhost+1-key.pem"),
      cert: fs.readFileSync("certs/localhost+1.pem"),
    },
  },
  build: {
    assetsDir: "assets",
    rollupOptions: {
      output: {
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
      // output: {
      //   manualChunks: function (id: string) {
      //     if (
      //       id.includes("node_modules") &&
      //       (id.endsWith(".js") || id.endsWith(".ts"))
      //     ) {
      //       return "vendor";
      //     }
      //   },
      // },
    },
    minify: "terser",
    // 清除所有console和debugger
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
  assetsInclude: ["**/*.ani"], // 添加 ANI 格式支持
  css: {
    // 确保所有样式都被处理
    devSourcemap: true,
    postcss: {
      // 其他 PostCSS 插件可以在这里添加
    },
  },
  //路径别名
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
