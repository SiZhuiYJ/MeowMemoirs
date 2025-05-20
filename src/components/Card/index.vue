<template>
  <div class="content-card">
    <div class="p-b-8px" style="padding-bottom: 8px">
      <slot name="header"></slot>
    </div>
    <slot></slot>
    <div class="p-t-12px" style="padding-top: 12px">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
.content-card {
  /* @apply overflow-hidden p-x-20px p-t-10px p-b-0px bg-#fff text-#303133 dark:bg-#1d1e1f dark:text-#cfd3dc dark:b-#414243 border-1px border-solid border-#e4e7ed rounded-6px flex flex-col flex-1; */
  display: flex;
  flex: 1 1 0%;
  flex-direction: column;
  overflow: hidden;
  border-width: 1px;
  --un-border-opacity: 1;
  border-color: rgb(228 231 237 / var(--un-border-opacity));
  border-radius: 6px;
  border-style: solid;
  --un-bg-opacity: 1;
  background-color: rgb(255 255 255 / var(--un-bg-opacity));
  padding: 10px 20px 0;
  --un-text-opacity: 1;
  color: rgb(48 49 51 / var(--un-text-opacity));
}
.dark .content-card {
  --un-border-opacity: 1;
  border-color: rgb(65 66 67 / var(--un-border-opacity));
  --un-bg-opacity: 1;
  background-color: rgb(29 30 31 / var(--un-bg-opacity));
  --un-text-opacity: 1;
  color: rgb(207 211 220 / var(--un-text-opacity));
}
</style>
