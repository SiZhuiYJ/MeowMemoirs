<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
// import { mdString_20250718 } from "/BlogPost/20250718/index.ts";
// import { mdString_20250720 } from "/BlogPost/20250720/index.ts";

import MarkdownIt from "markdown-it";
import hljs from "highlight.js";
import "highlight.js/styles/github-dark.css";
import { useMarkdownStore } from "@/stores/modules/markdown";
import LoadingSpinner from "./LoadingSpinner.vue";

import { BlogPostApi } from "@/libs/api/blogPost";
const data = ref();
const square = ref("api/auth");
const getData = async () => {
  try {
    const response = await BlogPostApi.MMPostBlogPostApiList();
    console.log(response.data);
    data.value = response.data;
  } catch (error) {
    console.error(error);
  }
};

// Pinia store
const store = useMarkdownStore();

// 使用markdown-it初始化Markdown解析器
const md: MarkdownIt = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  highlight: (str: string, lang: string) => {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return `<pre class="hljs"><code>${
          hljs.highlight(str, { language: lang, ignoreIllegals: true }).value
        }</code></pre>`;
      } catch (__) {}
    }
    return `<pre class="hljs"><code>${md.utils.escapeHtml(str)}</code></pre>`;
  },
});

// 响应式数据
const htmlContent = ref("");
const errorMessage = ref("");
const currentFile = ref("项目介绍");
// 文件列表
const markdownFiles: { name: string; file: string }[] = [
  {
    name: "项目介绍",
    file: "/BlogPost/20250720/index",
  },
  {
    name: "视频（mp4）转动图（gif）",
    file: "/BlogPost/20250718/index",
  },
  { name: "Vue 介绍", file: "vue-intro.md" },
  { name: "TypeScript 基础", file: "typescript-basics" },
  { name: "Pinia 状态管理", file: "pinia-guide" },
  { name: "Axios 使用", file: "axios-tutorial" },
];

// 获取并渲染Markdown
const renderMarkdown = async (filename: string) => {
  try {
    store.setLoading(true);
    errorMessage.value = "";

    // 检查缓存
    if (store.cachedContent[filename]) {
      htmlContent.value = store.cachedContent[filename];
      console.log("从缓存中获取Markdown:", htmlContent.value);
      store.setLoading(false);
      return;
    }

    // 从服务器获取Markdown
    // const response = await axios.get(`/docs/${filename}`, {
    //   headers: { "Cache-Control": "max-age=3600" },
    // });
    const mdString = markdownFiles.filter((item) => item.name === filename)[0].file;
    // 渲染Markdown为HTML
    // const result = md.render(response.data);
    console.log("从服务器获取Markdown:", mdString);
    const result = md.render(mdString);
    htmlContent.value = result;
    console.log("渲染后的HTML:", result);

    // 缓存结果
    store.cacheContent(filename, result);
  } catch (error) {
    console.error("Error loading Markdown:", error);
    errorMessage.value = "无法加载Markdown文件，请稍后再试";
    htmlContent.value = "";
  } finally {
    store.setLoading(false);
  }
};

// 切换文件
const selectFile = (file: string) => {
  currentFile.value = file;
  renderMarkdown(file);
};

// 初始加载
onMounted(() => {
  console.log("currentFile:", currentFile.value);
  renderMarkdown(currentFile.value);
});

// 监听文件变化
watch(currentFile, (newFile) => {
  renderMarkdown(newFile);
});
</script>

<template>
  <div class="markdown-viewer-container">
    <header class="viewer-header">
      <h1>Markdown 文档查看器</h1>
      <p class="subtitle">使用 Vue3.5 + TypeScript + Vite + Pinia + Axios 构建</p>
    </header>

    <div class="content-wrapper">
      <aside class="file-selector">
        <h2>文档列表</h2>
        <ul>
          <li
            v-for="(item, index) in markdownFiles"
            :key="index"
            :class="{ active: currentFile === item.file }"
            @click="selectFile(item.file)"
          >
            {{ item.name }}
          </li>
        </ul>
      </aside>

      <main class="markdown-preview">
        <input type="text" v-model="square" />
        <button @click="getData">测试连接</button>
        <div v-for="(item, index) in data" :key="index">{{ item }}<br /></div>
        <img src="https://tool.lu/netcard/" />
        <div class="toolbar">
          <span>当前文档: {{ currentFile }}</span>
          <div class="loading-indicator" v-if="store.isLoading">
            <LoadingSpinner />
            加载中...
          </div>
        </div>

        <div class="error-message" v-if="errorMessage">
          {{ errorMessage }}
        </div>

        <div
          class="markdown-content"
          v-html="htmlContent"
          v-show="!store.isLoading && !errorMessage"
        ></div>
      </main>
    </div>

    <footer class="viewer-footer">
      <p>© 2023 Vue Markdown 查看器 | 使用 highlight.js 代码高亮</p>
    </footer>
  </div>
</template>

<style scoped lang="scss">
// 定义颜色变量
$primary-color: #3498db;
$accent-color: #9b59b6;
$text-dark: #2c3e50;
$text-medium: #34495e;
$text-light: #7f8c8d;

// 其他变量
$border-radius: 8px;
$box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
.markdown-viewer-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4edf5 100%);
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  color: $text-dark;
}

.viewer-header {
  text-align: center;
  padding: 1.5rem;
  background: $primary-color;
  color: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

  h1 {
    margin: 0;
    font-size: 2.2rem;
    font-weight: 600;
  }

  .subtitle {
    margin: 0.5rem 0 0;
    opacity: 0.9;
    font-size: 1.1rem;
  }
}

.content-wrapper {
  display: flex;
  flex: 1;
  overflow: hidden;
  padding: 20px;
  gap: 20px;
  width: calc(100vw - 40px);
}

.file-selector {
  flex: 0 0 250px;
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  overflow: auto;

  h2 {
    margin-top: 0;
    color: $primary-color;
    font-size: 1.5rem;
    padding-bottom: 0.8rem;
    border-bottom: 2px solid #eaeaea;
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 1rem 0 0;

    li {
      padding: 0.9rem 1.2rem;
      margin-bottom: 0.8rem;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.3s ease;
      font-weight: 500;
      color: $text-medium;

      &:hover {
        // background: lighten($primary-color, 45%);
        color: $primary-color;
      }

      &.active {
        background: $primary-color;
        color: white;
        box-shadow: 0 4px 8px rgba($primary-color, 0.3);
      }
    }
  }
}

.markdown-preview {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
}

.toolbar {
  padding: 1rem 1.5rem;
  background: #f8f9fa;
  border-bottom: 1px solid #eaeaea;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.95rem;
  color: $text-medium;
  width: 100%;

  .loading-indicator {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: $primary-color;
    font-weight: 500;
  }
}

.error-message {
  padding: 2rem;
  text-align: center;
  color: #e74c3c;
  font-weight: 500;
  background: #fef2f2;
  margin: 1rem;
  border-radius: 8px;
}

.markdown-content {
  flex: 1;
  padding: 1.5rem 2rem;
  overflow: auto;
  //   width: calc(100vw - 600px);

  // 自定义Markdown内容的样式
  :deep() {
    h1,
    h2,
    h3 {
      color: $primary-color;
      font-weight: 600;
      margin-top: 1.8rem;
      margin-bottom: 1rem;
    }

    h1 {
      font-size: 2rem;
      border-bottom: 2px solid #eaeaea;
      padding-bottom: 0.5rem;
    }

    h2 {
      font-size: 1.7rem;
    }

    h3 {
      font-size: 1.4rem;
    }

    p {
      line-height: 1.7;
      margin-bottom: 1.2rem;
      color: $text-dark;
    }

    a {
      color: $accent-color;
      text-decoration: none;
      font-weight: 500;

      &:hover {
        text-decoration: underline;
      }
    }

    code {
      background: #f3f4f6;
      padding: 0.2rem 0.4rem;
      border-radius: 4px;
      color: #d63384;
      font-family: "Fira Code", monospace;
    }

    pre {
      background: #2d2d2d;
      border-radius: 8px;
      padding: 1.2rem;
      overflow: auto;
      margin: 1.5rem 0;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);

      code {
        background: none;
        padding: 0;
        color: #f8f8f2;
      }
    }

    blockquote {
      border-left: 4px solid $accent-color;
      //   background: lighten($accent-color, 40%);
      padding: 1rem 1.5rem;
      margin: 1.5rem 0;
      border-radius: 0 8px 8px 0;

      p {
        margin: 0;
        // color: darken($accent-color, 20%);
        // color: color.scale($accent-color, $lightness: -20%);
      }
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin: 1.5rem 0;

      th,
      td {
        padding: 0.8rem 1rem;
        border: 1px solid #e2e8f0;
        text-align: left;
      }

      th {
        background: $primary-color;
        color: white;
        font-weight: 600;
      }

      tr:nth-child(even) {
        background: #f8fafc;
      }
    }

    ul,
    ol {
      padding-left: 1.8rem;
      margin-bottom: 1.5rem;

      li {
        margin-bottom: 0.6rem;
        line-height: 1.6;
      }
    }

    img {
      max-width: 100%;
      border-radius: 8px;
      margin: 1rem 0;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }
  }
}

.viewer-footer {
  text-align: center;
  padding: 1.2rem;
  background: $primary-color;
  color: rgba(white, 0.85);
  font-size: 0.9rem;
}

// 响应式设计
@media (max-width: 768px) {
  .content-wrapper {
    flex-direction: column;
    padding: 1rem;
  }

  .file-selector {
    flex: none;
    width: 100%;
  }

  .markdown-content {
    padding: 1rem;
  }
}
</style>
