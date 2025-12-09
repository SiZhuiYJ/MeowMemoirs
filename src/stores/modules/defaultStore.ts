import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useDefaultStore = defineStore("auth", () => {
  const defaultStore = ref<string>("");

  async function steDefault(name: string) {
    defaultStore.value = name;
  }

  const getDefault = computed(() => defaultStore.value);

  return {
    defaultStore,
    steDefault,
    getDefault
  };
});
