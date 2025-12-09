<template>
  <!-- 内容卡片容器 -->
  <div class="content-card">
    <!-- 头部插槽区域 -->
    <div style="padding-bottom: 8px">
      <slot name="header"></slot>
    </div>
    
    <!-- 默认插槽区域（主体内容） -->
    <slot></slot>
    
    <!-- 底部插槽区域 -->
    <div style="padding-top: 12px">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * MeowCard 组件
 * 
 * 这是一个通用的内容卡片组件，提供了头部、主体和底部三个插槽区域，
 * 方便在不同场景下灵活使用。
 * 
 * 插槽说明：
 * - header: 卡片头部内容插槽
 * - default: 卡片主体内容插槽
 * - footer: 卡片底部内容插槽
 * 
 * 示例用法：
 * <MeowCard>
 *   <template #header>
 *     <h3>卡片标题</h3>
 *   </template>
 *   
 *   <p>这是卡片的主要内容</p>
 *   
 *   <template #footer>
 *     <button>操作按钮</button>
 *   </template>
 * </MeowCard>
 */
</script>

<style scoped>
/**
 * 内容卡片样式
 * 提供了浅色和深色两种主题样式
 */
.content-card {
  /* 使用UnoCSS类名（被注释掉的方案） */
  /* @apply overflow-hidden p-x-20px p-t-10px p-b-0px bg-#fff text-#303133 dark:bg-#1d1e1f dark:text-#cfd3dc dark:b-#414243 border-1px border-solid border-#e4e7ed rounded-6px flex flex-col flex-1; */
  
  /* Flex布局设置 */
  display: flex;
  flex: 1 1 0%;                    /* 弹性盒子模型：可伸缩，初始比例0 */
  flex-direction: column;          /* 垂直排列子元素 */
  overflow: hidden;                /* 隐藏溢出内容 */
  
  /* 边框样式 */
  border-width: 1px;               /* 边框宽度 */
  --un-border-opacity: 1;          /* 边框透明度变量 */
  border-color: rgb(228 231 237 / var(--un-border-opacity)); /* 浅色主题边框颜色 */
  border-radius: 6px;              /* 圆角 */
  border-style: solid;             /* 实线边框 */
  
  /* 背景和文字样式 */
  --un-bg-opacity: 1;              /* 背景透明度变量 */
  background-color: rgb(255 255 255 / var(--un-bg-opacity)); /* 浅色主题背景色 */
  padding: 10px 20px 0;            /* 内边距：上10px，左右20px，下0px */
  --un-text-opacity: 1;            /* 文字透明度变量 */
  color: rgb(48 49 51 / var(--un-text-opacity)); /* 浅色主题文字颜色 */
}

/**
 * 深色主题下的内容卡片样式
 * 当父元素有.dark类时应用此样式
 */
.dark .content-card {
  --un-border-opacity: 1;          /* 边框透明度 */
  border-color: rgb(65 66 67 / var(--un-border-opacity)); /* 深色主题边框颜色 */
  --un-bg-opacity: 1;              /* 背景透明度 */
  background-color: rgb(29 30 31 / var(--un-bg-opacity)); /* 深色主题背景色 */
  --un-text-opacity: 1;            /* 文字透明度 */
  color: rgb(207 211 220 / var(--un-text-opacity)); /* 深色主题文字颜色 */
}
</style>