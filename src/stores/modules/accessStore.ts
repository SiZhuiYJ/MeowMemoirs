import {
  defineStore
} from "pinia";
import {
  ref,
  computed
} from "vue";
import type {
  IPLocation,
  IPInfo
} from "@/libs/api/access/type";
import {
  LocationApi
} from "@/libs/api/access";

export const useAccessStore = defineStore("access", () => {
  const accessStore = ref < IPLocation > ();
  const SimpleIP = ref < IPInfo > ();


  async function initializeData() {
    try {
      const {
        data
      } = await LocationApi.MMGetSimpleIP();
      SimpleIP.value = data.ipInfo;
      // const {data} = await LocationApi.MMGetQueryLocation();
      // accessStore.value = data.ipLocation
    } catch (error) {
      console.log(error);
    }
    try {
      const {
        data
      } = await LocationApi.MMGetQueryLocation();
      accessStore.value = data.ipLocation
    } catch (error) {
      console.log(error);
    }

  }

  async function steAccess(access: IPLocation) {
    accessStore.value = access;
  }

  const getAccess = computed(() => accessStore.value);

  return {
    accessStore,
    SimpleIP,
    initializeData,
    steAccess,
    getAccess,
  };
});