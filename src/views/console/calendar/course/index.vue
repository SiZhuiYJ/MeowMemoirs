<script setup lang="ts">
import { ref, onMounted } from 'vue';
import {
    meowNoticeSuccess,
    meowNoticeError,
    // meowMsgWarning,
    meowMsgBox,
    meowMsgInfo,
    meowMsgError,
} from "@/utils/message";
import { useScheduleStores } from "@/features/schedule/stores/useScheduleStores";
import { storeToRefs } from 'pinia';
const { initializeData } = useScheduleStores();
const { scheduleStore } = storeToRefs(useScheduleStores());
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
const ids = ref([]); // 选择数组
const multiple = ref<boolean>(true); // 非多个禁用
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
/** 数据表格 */
const handleListPage = async () => {
    total.value = 200;
    // try {
    //   loading.value = true;
    //   tableList.value = []; // 重置表格数据
    //   const res: any = await listPage(DatePicker(searchParams.value, dateRange.value));
    //   console.log("日志数据表格数据->", res.data);
    //   tableList.value = res.data.records;
    //   total.value = res.data.total;
    //   loading.value = false;
    // } catch (error) {
    //   console.log(error);
    //   NoticeError("数据查询失败，请刷新重试🌻");
    // }
};
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
/** 数据表格[删除、批量删除等刷新使用] */
const handleTableData = async () => {
    try {
        // const res: any = await listPage(DatePicker(searchParams.value, dateRange.value));
        // console.log("日志数据表格数据->", res.data);
        // tableList.value = res.data.records;
        // total.value = res.data.total;
    } catch (error) {
        console.log(error);
        meowNoticeError("数据查询失败，请刷新重试🌻");
    }
};
onMounted(() => {
    initializeData();
});
</script>
<template>
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

            <!-- 数据表格 -->
            <div class="schedule">
                <MeowCard v-for="value in scheduleStore" :key="value.id" class="schedule-item">
                    <div class="schedule-title">{{ value.scheduleName }}</div>
                    <div class="schedule-weekCount">{{ value.weekCount }}</div>
                    <div class="schedule-startTime">{{ value.startTime }}</div>
                    <div class="schedule-updateTime">{{ value.updateTime }}</div>
                    <div class="schedule-createTime">{{ value.createTime }}</div>
                    <div class="schedule-remark">{{ value.remark }}</div>
                </MeowCard>
            </div>
        </MeowCard>
    </div>
</template>
<style scoped lang="scss">
.schedule {
    padding-top: 20px;
    display: flex;
    flex-wrap: wrap;
    gap: 16px;

    .schedule-item {
        width: calc(33.333% - 10.666px);
        max-width: 300px;

        .schedule-title {
            border-bottom: 1px solid rgb(228 231 237 / var(--un-border-opacity));
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 8px;
        }

        .schedule-weekCount,
        .schedule-startTime,
        .schedule-updateTime,
        .schedule-createTime,
        .schedule-remark {
            margin-bottom: 4px;
            border-bottom: 1px solid rgb(228 231 237 / var(--un-border-opacity));
        }
    }
}
</style>
