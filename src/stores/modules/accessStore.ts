import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { IPLocation } from "@/libs/api/access/type";
import { LocationApi } from "@/libs/api/access";

export const useAccessStore = defineStore("access", () => {
  const accessStore = ref<IPLocation>();


  async function initializeData() {
    const { data } = await LocationApi.MMPostQueryLocation();
    steAccess(data);
  }

  async function steAccess(access: IPLocation) {
    accessStore.value = access;
  }

  const getAccess = computed(() => accessStore.value);

  return {
    accessStore,
    initializeData,
    steAccess,
    getAccess,
  };
});
