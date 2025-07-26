import { defineStore } from "pinia";
import { ref } from "vue";

export const useMarkdownStore = defineStore("markdown", () => {
  const isLoading = ref<boolean>(false);
  const cachedContent = ref<Record<string, string>>({});

  function setLoading(loading: boolean) {
    isLoading.value = loading;
  }
  function cacheContent(filename: string, content: string) {
    cachedContent.value[filename] = content;
  }
  return {
    isLoading,
    cachedContent,
    setLoading,
    cacheContent,
  };
});
