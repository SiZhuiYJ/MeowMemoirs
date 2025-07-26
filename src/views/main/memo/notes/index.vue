<script setup lang="ts">
import { ref } from "vue";
interface ListItem {
  id: number;
  name: string;
  date: string;
  title: string;
  content: string;
}
const list = ref<ListItem[]>([
  {
    id: 1,
    name: "小小刘",
    date: "2025-07-19",
    title: "小刘的日常",
    content: "厨房备个可移动的空调或者风扇（水空调）",
  },
]);
</script>
<template>
  <div class="main-content">
    <div v-for="item in list">
      <div class="note-header">
        <span>{{ item.name }}</span
        ><span>{{ item.title }}</span>
      </div>
      <div class="note-content">{{ item.content }}</div>
      <div class="note-footer">{{ item.date }}</div>
    </div>
  </div>
</template>
<style lang="scss" scoped></style>
