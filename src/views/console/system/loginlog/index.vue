<script setup lang="ts">
import { ref, onMounted } from "vue";
import {
  meowNoticeSuccess,
  meowNoticeError,
  // meowMsgWarning,
  meowMsgBox,
  meowMsgInfo,
  meowMsgError,
} from "@/utils/message";
import { useAccessStore } from "@/stores";
import type { IpInfo } from "@/libs/api/system/loginlog/type";
import { parseUserAgent } from "@/utils/http";
const accessStore = useAccessStore();
const { queryIpAccessLog } = useAccessStore();
// 表格加载动画Loading
const loading = ref(false);
// 是否显示搜索表单[默认显示]
const showSearch = ref<boolean>(true); // 默认显示搜索条件

// 查询参数
const searchParams = ref({
  pageNo: 1, // 第几页
  pageSize: 10, // 每页显示多少条
  loginName: "",
  ipAddress: "",
  loginStatus: "",
});

const total = ref<number>(0);
// 时间
const dateRange = ref();

/** 重置搜索参数 */
const resetSearchParams = () => {
  dateRange.value = [];
  searchParams.value = {
    pageNo: 1,
    pageSize: 10,
    loginName: "",
    ipAddress: "",
    loginStatus: "",
  };
};

/** 搜索 */
const handleSearch = () => {
  console.log("搜索");
  searchParams.value.pageNo = 1;
  handleListPage();
};

/** 重置 */
const resetSearch = () => {
  console.log("重置搜索");
  resetSearchParams();
  handleListPage();
};

/** @current-change：点击分页组件页码发生变化：例如：切换第2、3页 OR 上一页 AND 下一页 OR 跳转某一页 */
/** @size-change：点击分页组件下拉选择条数发生变化：例如：选择10条/页、20条/页等 */
// 分页查询，@current-change AND @size-change都会触发分页，调用后端分页接口
/** 数据表格 */
const handleListPage = async () => {
  total.value = 200;
  // try {
  //   loading.value = true;
  //   tableList.value = []; // 重置表格数据
  //   const res: any = await listPage(koiDatePicker(searchParams.value, dateRange.value));
  //   console.log("日志数据表格数据->", res.data);
  //   tableList.value = res.data.records;
  //   total.value = res.data.total;
  //   loading.value = false;
  // } catch (error) {
  //   console.log(error);
  //   koiNoticeError("数据查询失败，请刷新重试🌻");
  // }
};

/** 数据表格[删除、批量删除等刷新使用] */
const handleTableData = async () => {
  try {
    // const res: any = await listPage(koiDatePicker(searchParams.value, dateRange.value));
    // console.log("日志数据表格数据->", res.data);
    // tableList.value = res.data.records;
    // total.value = res.data.total;
  } catch (error) {
    console.log(error);
    meowNoticeError("数据查询失败，请刷新重试🌻");
  }
};

// 静态页面防止报错(可直接删除)
// @ts-ignore
const handleStaticPage = () => {
  // listPage(searchParams.value);
};

onMounted(async () => {
  // 获取表格数据
  await queryIpAccessLog();
  console.log("accessStore", useAccessStore().getIpAccessLog);
  handleListPage();
});

const ids = ref([]); // 选择数组
const single = ref<boolean>(true); // 非单个禁用
const multiple = ref<boolean>(true); // 非多个禁用

/** 是否多选 */
const handleSelectionChange = (selection: any) => {
  // console.log(selection);
  ids.value = selection.map((item: any) => item.loginId);
  single.value = selection.length != 1; // 单选
  multiple.value = !selection.length; // 多选
};

/** 状态开关 */
// const handleSwitch = (row: any) => {
//   let text = row.loginStatus === "0" ? "启用" : "停用";
//   meowMsgBox("确认要[" + text + "]-[" + row.loginName + "]吗？")
//     .then(async () => {
//       if (!row.loginId || !row.loginStatus) {
//         meowMsgWarning("请选择需要修改的数据🌻");
//         return;
//       }
//       try {
//         // await updateStatus(row.loginId, row.loginStatus);
//         meowNoticeSuccess("修改成功🌻");
//       } catch (error) {
//         console.log(error);
//         handleTableData();
//         meowNoticeError("修改失败，请刷新重试🌻");
//       }
//     })
//     .catch(() => {
//       meowMsgError("已取消🌻");
//     });
// };

/** 删除 */
// const handleDelete = (row: any) => {
//   const id = row.loginId;
//   if (id == null || id == "") {
//     meowMsgWarning("请选择需要删除的数据🌻");
//     return;
//   }
//   meowMsgBox("您确认需要删除用户名称[" + row.loginName + "]么？")
//     .then(async () => {
//       try {
//         // await deleteById(id);
//         handleTableData();
//         meowNoticeSuccess("删除成功🌻");
//       } catch (error) {
//         console.log(error);
//         handleTableData();
//         meowNoticeError("删除失败，请刷新重试🌻");
//       }
//     })
//     .catch(() => {
//       meowMsgError("已取消🌻");
//     });
// };

/** 批量删除 */
const handleBatchDelete = () => {
  if (ids.value.length == 0) {
    meowMsgInfo("请选择需要删除的数据🌻");
    return;
  }
  meowMsgBox("您确认需要进行批量删除么？")
    .then(async () => {
      try {
        // console.log("ids", ids.value);
        // await batchDelete(ids.value);
        handleTableData();
        meowNoticeSuccess("批量删除成功🌻");
      } catch (error) {
        console.log(error);
        meowNoticeError("批量删除失败，请刷新重试🌻");
        handleTableData();
      }
    })
    .catch(() => {
      meowMsgError("已取消🌻");
    });
};
// string => json
const toJson = (str: string): IpInfo => {
  const ipInfo: IpInfo = JSON.parse(str);
  return ipInfo;
};
</script>

<template>
  <!-- 内容 -->
  <div class="main-content">
    <MeowCard>
      <!-- 搜索条件 -->
      <el-form v-show="showSearch" :inline="true">
        <el-form-item label="用户名称" prop="loginName">
          <el-input placeholder="请输入用户名称" v-model="searchParams.loginName" style="width: 200px" clearable
            @keyup.enter.native="handleListPage"></el-input>
        </el-form-item>
        <el-form-item label="IP地址" prop="ipAddress">
          <el-input placeholder="请输入IP地址" v-model="searchParams.ipAddress" style="width: 200px" clearable
            @keyup.enter.native="handleListPage"></el-input>
        </el-form-item>
        <el-form-item label="登录状态" prop="loginStatus">
          <el-select placeholder="请选择日志状态" v-model="searchParams.loginStatus" style="width: 200px" clearable
            @keyup.enter.native="handleListPage">
            <el-option label="登录成功" value="0" />
            <el-option label="登录失败" value="1" />
          </el-select>
        </el-form-item>
        <el-form-item label="访问时间" prop="loginTime">
          <el-date-picker v-model="dateRange" type="datetimerange" value-format="YYYY-MM-DD HH:mm:ss"
            start-placeholder="开始日期" range-separator="至" end-placeholder="结束日期" :default-time="[
              new Date(2000, 1, 1, 0, 0, 0),
              new Date(2000, 1, 1, 23, 59, 59),
            ]" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="search" plain v-debounce="handleSearch">
            搜索
          </el-button>
          <el-button type="danger" icon="refresh" plain v-throttle="resetSearch">
            重置
          </el-button>
        </el-form-item>
      </el-form>

      <!-- 表格头部按钮 -->
      <el-row :gutter="10">
        <el-col :span="1.5" v-auth="['system:role:delete']">
          <el-button type="danger" icon="delete" plain @click="handleBatchDelete()" :disabled="multiple">
            删除
          </el-button>
        </el-col>
        <Toolbar v-model:showSearch="showSearch" @refreshTable="handleListPage"></Toolbar>
      </el-row>

      <div class="h-20px" style="height: 20px"></div>
      <!-- 数据表格 -->
      <el-table v-loading="loading" border :data="accessStore.getIpAccessLog" empty-text="暂时没有数据哟🌻"
        @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="序号" prop="id" width="80px" align="center" type="id"></el-table-column>
        <el-table-column label="匿名化标识" prop="ipId" width="130px" align="center"
          :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="客户端IP地址" prop="ipAddress" width="130px" align="center"
          :show-overflow-tooltip="true"></el-table-column>
        <!-- （通过User-Agent解析） -->
        <el-table-column label="设备类型" prop="deviceType" width="130px" align="center" :show-overflow-tooltip="true">
          <template #default="scope">
            {{ parseUserAgent(scope.row.userAgent).deviceType || "未知" }}
          </template>
        </el-table-column>
        <el-table-column label="操作系统名称及版本" prop="osName" width="250px" align="center" :show-overflow-tooltip="true">
          <template #default="scope">
            {{ parseUserAgent(scope.row.userAgent).browser.name || "未知" }}-
            {{ parseUserAgent(scope.row.userAgent).browser.version || "未知" }}
          </template></el-table-column>
        <el-table-column label="浏览器名称及版本" prop="browserName" width="180px" align="center" :show-overflow-tooltip="true">
          <template #default="scope">
            {{ parseUserAgent(scope.row.userAgent).os.name || "未知" }}-
            {{ parseUserAgent(scope.row.userAgent).os.version || "未知" }}
          </template></el-table-column>
        <el-table-column label="客户端浏览器/设备信息" prop="userAgent" width="130px" align="center"
          :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="请求体内容（敏感信息需脱敏）" prop="requestBody" width="130px" align="center"
          :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="请求时间（精确到毫秒）" prop="requestTime" width="200px" align="center"
          :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="HTTP请求方法" prop="requestMethod" width="100px" align="center"
          :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="HTTP协议版本" prop="httpVersion" width="130px" align="center"
          :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="来源页面URL（可选）" prop="referer" width="130px" align="center"
          :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="完整请求路径（含查询参数）" prop="requestUrl" width="130px" align="center"
          :show-overflow-tooltip="true"></el-table-column>
        <!-- /** * ，示例：200（成功）、404（未找到）、500（服务器错误） */ -->
        <el-table-column label="服务器响应状态码" prop="responseStatus" width="90px" align="center"
          :show-overflow-tooltip="true">
          <template #default="scope">
            <el-tag
              :type="scope.row.responseStatus >= '500' ? 'warning' : scope.row.responseStatus >= '400' ? 'danger' : 'primary'">
              <!-- :type是用来判断块状的颜色 -->
              <!-- 里面填写内容 -->
              {{ scope.row.responseStatus || "未知" }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="服务器处理请求耗时（毫秒）" prop="responseTimeMs" width="90px" align="center"
          :show-overflow-tooltip="true">
          <template #default="scope">
            <el-tag
              :type="scope.row.responseTimeMs >= '200' ? 'danger' : scope.row.responseTimeMs >= '100' ? 'warning' : 'primary'">
              {{ scope.row.responseTimeMs }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="IP地理位置信息" prop="geoLocation" width="300px" align="center" :show-overflow-tooltip="true">
          <template #default="scope">
            {{ toJson(scope.row.geoLocation).AS?.Info || "未知" }}-
            {{ toJson(scope.row.geoLocation).Country?.Name || "未知" }}-
            {{ (toJson(scope.row.geoLocation).Regions || []).join(" / ") || "未知" }}-
            {{ toJson(scope.row.geoLocation).Type || "未知" }}
          </template>
        </el-table-column>
        <el-table-column label="是否为爬虫/机器人请求" prop="isBot" width="130px" align="center"
          :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="威胁等级（0-5）" prop="threatLevel" width="90px" align="center"
          :show-overflow-tooltip="true"></el-table-column>
        <!-- 0=正常，3=可疑，5=攻击行为  -->
        <el-table-column label="用户会话ID（如有）" prop="sessionId" width="130px" align="center"
          :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="关联用户ID（如已登录）" prop="userId" width="130px" align="center"
          :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="IP地理位置信息（JSON格式）" prop="geoLocation" width="130px" align="center"
          :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="请求头信息（JSON格式）" prop="headers" width="130px" align="center"
          :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="备注信息（如攻击类型）" prop="extraNotes" width="130px" align="center"
          :show-overflow-tooltip="true"></el-table-column>
      </el-table>
    </MeowCard>
  </div>
</template>

<style lang="scss" scoped></style>
