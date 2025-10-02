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
import type {
  IpAccessLog
} from "@/libs/api/system/loginlog/type";
import {
  LocationApi
} from "@/libs/api/access";
import { AccessLogApi } from "@/libs/api/system/loginlog";


export const useAccessStore = defineStore("access", () => {
  const accessStore = ref<IPLocation>();
  const SimpleIP = ref<IPInfo>();
  const IpAccessLog = ref<IpAccessLog[]>();


  async function initializeData() {
    try {
      const {
        data
      } = await LocationApi.MMGetSimpleIP();
      SimpleIP.value = data.ipInfo;
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
  // ip查询
  async function queryLocation(ip: string) {
    try {
      const {
        data
      } = await LocationApi.MMGetSimpleIPByIP(ip);
      SimpleIP.value = data.ipInfo
    } catch (error) {
      console.log(error);
    }
  }

  // 登录日志
  async function queryIpAccessLog() {
    try {
      const {
        data
      } = await AccessLogApi.MMPostIpAccessLog();
      IpAccessLog.value = data.ipAccessLogs;
    } catch (error) {
      console.log(error);
    }
  }

  async function steAccess(access: IPLocation) {
    accessStore.value = access;
  }
  async function setSimpleIP(ipInfo: IPInfo) {
    SimpleIP.value = ipInfo;
  }

  const getAccess = computed(() => accessStore.value);
  const getSimpleIP = computed(() => SimpleIP.value);
  const getIpAccessLog = computed(() => IpAccessLog.value);

  return {
    initializeData,
    queryLocation,
    queryIpAccessLog,
    steAccess,
    setSimpleIP,
    getAccess,
    getSimpleIP,
    getIpAccessLog
  };
});