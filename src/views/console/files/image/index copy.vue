<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import { DatePicker, formatFileSize } from "@/utils/index";
import Card from "@/components/Card/index.vue";
import useApiUrl from "@/libs/useApiUrl/index";
import { galleryApi } from "@/libs/api/gallery";
import type { item } from "@/libs/api/gallery/type";
import {
  meowNoticeSuccess,
  meowNoticeError,
  meowMsgWarning,
  meowMsgBox,
  meowMsgInfo,
  meowMsgError,
} from "@/utils/message";
const { getGalleryImgUrl } = useApiUrl();
interface ImageItem {
  imageId: number;
  name: string;
  path: string;
  type: string;
  size: number;
  modified: string;
}
interface ImageTable {
  // 序号"
  imageId: number;
  // 图片"
  url: string;
  // 图片名称"
  name: string;
  // 标签"
  tags: string[];
  // 大小"
  size: string;
  // 图片类型
  type: string;
  // 拍照时间"
  createTime: string[];
  // 上传时间"
  uploadTime: string[];
  // 拍照地点"
  createAddress: string;
  // 设备名称"
  deviceName: string;
}
// const dataList = ref<ImageItem[]>([
//   {
//     imageId: 0,
//     name: "CYY",
//     path: "CYY\\IMG\\CYY_20250327001.jpg",
//     type: ".jpg",
//     size: 502466,
//     modified: "2025-03-27 00:18:20",
//   },
// ]);
const imageList = ref<ImageTable[]>([
  {
    imageId: 0,
    name: "CYY",
    url: getGalleryImgUrl("CYY\\IMG\\CYY_20250327001.jpg"),
    type: ".jpg",
    size: formatFileSize(502466)!,
    createTime: ["2025-03-27 00:18:20"],
    uploadTime: ["2025-03-27 00:18:20"],
    tags: ["CYY"],
    createAddress: "重庆",
    deviceName: "CYY",
  },
]);
const currentPage = ref(1);
const pageSize = ref(10);
const allData = ref<ImageItem[]>([]);

// 使用异步获取数据
const getData = async () => {
  try {
    const { data } = await galleryApi.MMGetImageList();
    allData.value = data.items.map((item: item, index: number) => {
      return {
        ...item,
        imageId: index,
      };
    });
    loadMoreData();
  } catch (error) {
    console.error("Failed to fetch data:", error);
    meowNoticeError("数据获取失败，请刷新重试🌻");
  }
};

const loadMoreData = () => {
  const startIndex = (currentPage.value - 1) * pageSize.value;
  const endIndex = startIndex + pageSize.value;
  const newData = allData.value.slice(startIndex, endIndex);

  imageList.value = [
    ...imageList.value,
    ...newData.map((item: ImageItem) => {
      return {
        imageId: item.imageId,
        url: getGalleryImgUrl(item.path),
        name: item.name,
        tags: [""],
        size: formatFileSize(item.size)!,
        createTime: [""],
        uploadTime: [""],
        createAddress: "",
        deviceName: "string",
        type: item.type,
      };
    }),
  ];

  currentPage.value += 1;
};

const handleScroll = () => {
  const table = document.querySelector('.el-table__body-wrapper');
  if (table) {
    const { scrollTop, scrollHeight, clientHeight } = table;
    if (scrollTop + clientHeight >= scrollHeight - 10) {
      loadMoreData();
    }
  }
};

const ids = ref([]); // 选择数组
const single = ref<boolean>(true); // 非单个禁用
const multiple = ref<boolean>(true); // 非多个禁用

/** 是否多选 */
const handleSelectionChange = (selection: any) => {
  console.log(selection);
  ids.value = selection.map((item: any) => item.loginId);
  single.value = selection.length != 1; // 单选
  multiple.value = !selection.length; // 多选
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

const showSearch = ref<boolean>(true); // 默认显示搜索条件
// 查询参数
const searchParams = ref({
  pageNo: 1, // 第几页
  pageSize: 10, // 每页显示多少条
  imageName: "",
  ipAddress: "",
  loginStatus: "",
});
// 表格加载动画Loading
const loading = ref(false);
const total = ref<number>(0);
const dateCreate = ref();
const dateUpload = ref();
const handleListPage = async () => {
  const data = DatePicker(searchParams.value, dateCreate.value);
  console.log(data);
  // getData();
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
/** 重置搜索参数 */
const resetSearchParams = () => {
  dateCreate.value = [];
  searchParams.value = {
    pageNo: 1,
    pageSize: 10,
    imageName: "",
    ipAddress: "",
    loginStatus: "",
  };
};
/** 搜索 */
const handleSearch = () => {
  console.log("搜索");
  searchParams.value.pageNo = 1;
  // handleListPage();
};

/** 重置 */
const resetSearch = () => {
  console.log("重置搜索");
  resetSearchParams();
  // handleListPage();
};

/** 删除 */
const handleDelete = (row: any) => {
  const id = row.loginId;
  if (id == null || id == "") {
    meowMsgWarning("请选择需要删除的数据🌻");
    return;
  }
  meowMsgBox("您确认需要删除用户名称[" + row.loginName + "]么？")
    .then(async () => {
      try {
        // await deleteById(id);
        handleTableData();
        meowNoticeSuccess("删除成功🌻");
      } catch (error) {
        console.log(error);
        handleTableData();
        meowNoticeError("删除失败，请刷新重试🌻");
      }
    })
    .catch(() => {
      meowMsgError("已取消🌻");
    });
};

onMounted(() => {
  getData();
  const table = document.querySelector('.el-table__body-wrapper');
  if (table) {
    table.addEventListener('scroll', handleScroll);
  }
});

onUnmounted(() => {
  const table = document.querySelector('.el-table__body-wrapper');
  if (table) {
    table.removeEventListener('scroll', handleScroll);
  }
});

</script>

<template>
  <!-- 内容 -->
  <div class="main-content">
    <Card>
      <!-- 搜索条件 -->
      <el-form v-show="showSearch" :inline="true">
        <el-form-item label="图片名称" prop="imageName">
          <el-input
            placeholder="请输入图片名称"
            v-model="searchParams.imageName"
            style="width: 200px"
            clearable
            @keyup.enter.native="handleListPage"
          ></el-input>
        </el-form-item>
        <el-form-item label="IP地址" prop="ipAddress">
          <el-input
            placeholder="请输入IP地址"
            v-model="searchParams.ipAddress"
            style="width: 200px"
            clearable
            @keyup.enter.native="handleListPage"
          ></el-input>
        </el-form-item>
        <el-form-item label="登录状态" prop="loginStatus">
          <el-input
            placeholder="请输入IP地址"
            v-model="searchParams.ipAddress"
            style="width: 200px"
            clearable
            @keyup.enter.native="handleListPage"
          ></el-input>
        </el-form-item>
        <el-form-item label="拍照时间" prop="createTime">
          <el-date-picker
            v-model="dateCreate"
            type="datetimerange"
            value-format="YYYY-MM-DD HH:mm:ss"
            start-placeholder="开始日期"
            range-separator="至"
            end-placeholder="结束日期"
            :default-time="[
              new Date(2000, 1, 1, 0, 0, 0),
              new Date(2000, 1, 1, 23, 59, 59),
            ]"
          />
        </el-form-item>
        <el-form-item label="拍照时间" prop="uploadTime">
          <el-date-picker
            v-model="dateUpload"
            type="datetimerange"
            value-format="YYYY-MM-DD HH:mm:ss"
            start-placeholder="开始日期"
            range-separator="至"
            end-placeholder="结束日期"
            :default-time="[
              new Date(2000, 1, 1, 0, 0, 0),
              new Date(2000, 1, 1, 23, 59, 59),
            ]"
          />
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
          <el-button
            type="danger"
            icon="delete"
            plain
            @click="handleBatchDelete()"
            :disabled="multiple"
          >
            删除
          </el-button>
        </el-col>
        <Toolbar v-model:showSearch="showSearch" @refreshTable="handleListPage"></Toolbar>
      </el-row>
      <div style="height: 20px"></div>
      <!--         :data="visibleData"数据表格 -->
      <el-table
        v-loading="loading"
        border
        :data="imageList"
        empty-text="暂时没有数据哟🌻"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column
          label="序号"
          prop="imageId"
          width="60px"
          align="center"
          type="index"
        ></el-table-column>
        <el-table-column label="图片" prop="path" width="65px" align="center">
          <template #default="scope">
            <img
              v-lazy="scope.row.url"
              style="height: 40px; width: 40px; object-fit: cover"
            />
          </template>
        </el-table-column>
        <el-table-column
          label="图片名称"
          prop="name"
          width="160px"
          align="center"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column
          label="标签"
          prop="tags"
          width="160px"
          align="center"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column
          label="大小"
          prop="size"
          width="120px"
          align="center"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column
          label="拍照时间"
          prop="createTime"
          width="260px"
          align="center"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column
          label="上传时间"
          prop="uploadTime"
          width="260px"
          align="center"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column
          label="拍照地点"
          prop="createAddress"
          width="260px"
          align="center"
          :show-overflow-tooltip="true"
        >
        </el-table-column>
        <el-table-column
          label="设备名称"
          prop="deviceName"
          width="150px"
          align="center"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column label="操作" align="center" width="120" fixed="right">
          <template #default="{ row }">
            <el-tooltip content="删除🌻" placement="top">
              <el-button
                type="danger"
                icon="Delete"
                circle
                plain
                @click="handleDelete(row)"
                v-auth="['system:role:delete']"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <div style="height: 20px"></div>
      <!-- {{ searchParams.pageNo }} --- {{ searchParams.pageSize }} -->
      <!-- 分页 -->
      <el-pagination
        background
        v-model:current-page="searchParams.pageNo"
        v-model:page-size="searchParams.pageSize"
        v-show="total > 0"
        :page-sizes="[10, 20, 50, 100, 200]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleListPage"
        @current-change="handleListPage"
      />
    </Card>
  </div>
</template>

<style scoped lang="scss"></style>
