<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import { formatFileSize, collectImageData,type ImageTable,isArrayIncluded ,type options} from "@/utils/index";
import Card from "@/components/Card/index.vue";
import Select from "@/components/Select/index.vue";
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
interface searchType{
  type: options[];
  createAddress: options[];
  deviceName: options[];
}
const { getGalleryImgUrl } = useApiUrl();
const imageList = ref<ImageTable[]>([]);
const currentPage = ref<number>(1);
const pageSize = ref<number>(10);
const imageFilter=ref<ImageTable[]>([]);
const allData = ref<ImageTable[]>([]);

const searchList = ref<searchType>({
  type: [],
  createAddress: [],
  deviceName: [],
});
const imageTags  = ref<options[]>([
  { label: "做爱",  value: "1001" },
  { label: "旅游",  value: "1002" },
  { label: "吃饭", value: "1003" },
  { label: "做饭", value: "1004" },
  { label: "内设", value: "1005" },
]);
const imageType = ref<{[key: string]: string}>({
  "1001":"做爱",
  "1002":"旅游",
  "1003":"吃饭",
  "1004":"做饭",
  "1005":"内设",
});

//添加tag
const addTag=(name:string)=>{
  imageTags.value.push({label:name,value:name})
}
// 重置搜索条件
const tableReset =()=>{
    currentPage.value = 1;
    pageSize.value = 10;
    imageList.value = [];
        const table = document
      .querySelector(".el-table__body-wrapper")
      ?.querySelector(".el-scrollbar__wrap");
    if (table) {
      table.scrollTop = 0;
    }
    loadMoreData();
}

// 使用异步获取数据
const getData = async () => {
  try {
    // 重置所有数据
    allData.value = [];

    // const { data } = await galleryApi.MMGetImageList();
    // allData.value = data.items.map((item: item, index: number) => {
    //   return {
    //     imageId: index,
    //     url: item.path,
    //     name: getName(item.path),
    //     tags: ["1001", "1003", "1002"],
    //     size: item.size,
    //     createTime: "",
    //     uploadTime: item.modified,
    //     createAddress: [""],
    //     deviceName: "string",
    //     type: item.type,
    //   };
    // });
    imageFilter.value=allData.value
    const {type ,createAddress,deviceName}=collectImageData(allData.value);

    searchList.value ={
      type:type.map((item: string) => {return{label:item,value:item}}),
      createAddress:createAddress.map((item: string) => {return{label:item,value:item}}),
      deviceName:deviceName.map((item: string) => {return{label:item,value:item}}),
    }
    tableReset()
    console.log(searchList.value);
  } catch (error) {
    console.error("Failed to fetch data:", error);
    meowNoticeError("数据获取失败，请刷新重试🌻");
  }
};

const loadMoreData = () => {
  const startIndex = (currentPage.value - 1) * pageSize.value;
  const endIndex = startIndex + pageSize.value;
  const newData = imageFilter.value.slice(startIndex, endIndex);
  imageList.value = [...imageList.value, ...newData];
  currentPage.value += 1;
};

const handleScroll = () => {
  const table = document
    .querySelector(".el-table__body-wrapper")
    ?.querySelector(".el-scrollbar__wrap");
  if (table) {
    const { scrollTop, scrollHeight, clientHeight } = table;
    if (scrollTop + clientHeight >= scrollHeight - 10) {
      loadMoreData();
    }
  }
};

const ids = ref<number[]>([]); // 选择数组
const single = ref<boolean>(true); // 非单个禁用
const multiple = ref<boolean>(true); // 非多个禁用

/** 是否多选 */
const handleSelectionChange = (selection: ImageTable[]) => {
  console.log(selection);

  ids.value = selection.map((item: ImageTable) => item.imageId);
  console.log("ids", ids.value);
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
const searchParams = ref<{
  pageNo: number;
    pageSize: number;
    imageName: string;
    createAddress: string;
    deviceName: string;
    type: string;
    tags: string[];
  }>({
  pageNo: 1, // 第几页
  pageSize: 10, // 每页显示多少条
  imageName: "", // 图片名称
  createAddress: "", // 拍照地址
  deviceName: "", // 设备名称
  type: "", // 图片类型
  tags:[] // 图片标签
});
// 表格加载动画Loading
const loading = ref<boolean>(false);
const dateCreate = ref();
const dateUpload = ref();
const handleListPage = async () => {
  tableReset()
  imageFilter.value=allData.value.filter((item:ImageTable)=>
    item.name.toLowerCase().includes(searchParams.value.imageName.toLowerCase())
    && item.deviceName.includes(searchParams.value.deviceName)
    && item.type.includes(searchParams.value.type)
    && isArrayIncluded(item.tags,searchParams.value.tags)
    && item.createAddress.includes(searchParams.value.createAddress)
    && (!dateCreate.value || (item.createTime >= dateCreate.value[0] && item.createTime <= dateCreate.value[1]))
    && (!dateUpload.value || (item.uploadTime >= dateUpload.value[0] && item.uploadTime <= dateUpload.value[1]))
  )
  imageList.value=[]
  console.log("imageFilter", imageFilter.value);
  console.log("searchParams", searchParams.value);
  console.log("dateCreate", dateCreate.value);
  console.log("dateUpload", dateUpload.value);
  currentPage.value = 1;
  loadMoreData()
  // getData();
};

/** 重置搜索参数 */
const resetSearchParams = () => {
  dateCreate.value = [];
  dateUpload.value = [];
  searchParams.value = {
    pageNo: 1, // 第几页
    pageSize: 10, // 每页显示多少条
    imageName: "", // 图片名称
    createAddress: "", // 拍照地址
    deviceName: "", // 设备名称
    type: "", // 图片类型
    tags: [], //  标签
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
const handleUpload=async()=>{
  console.log("上传中...")
}

// 截取下划线到点之间的字符串
const getName = (path: string) => {
  const newName = path.split("/")[2];
  const endIndex = newName.indexOf(".");
  return newName.substring(0, endIndex);
};

onMounted(() => {
  getData();
  const table = document
    .querySelector(".el-table__body-wrapper")
    ?.querySelector(".el-scrollbar__wrap");

  if (table) {
    table.addEventListener("scroll", handleScroll);
  }
});

onUnmounted(() => {
  const table = document
    .querySelector(".el-table__body-wrapper")
    ?.querySelector(".el-scrollbar__wrap");
  if (table) {
    table.removeEventListener("scroll", handleScroll);
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

        <el-form-item label="图片类型" prop="type">
          <Select
            v-model="searchParams.type"
            :options="searchList.type"
            multiple
            collapseTags
            collapse-tags-tooltip
            placeholder="请选择图片类型"
            @change="handleListPage"
          >
          </Select>
        </el-form-item>
        <el-form-item label="图片标签" prop="tags">
          <Select
            v-model="searchParams.tags"
            :options="imageTags"
            multiple
            addable
            collapseTags
            collapse-tags-tooltip
            placeholder="请选择图片类型"
            @add="addTag"
            @change="handleListPage"
          >
          </Select>
        </el-form-item>
        <el-form-item label="拍摄地址" prop="createAddress">
          <Select
            v-model="searchParams.createAddress"
            :options="searchList.createAddress"
            multiple
            collapseTags
            collapse-tags-tooltip
            placeholder="请选择拍摄地址"
            @change="handleListPage"
          >
          </Select>
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

        <el-form-item label="设备名称" prop="deviceName">
          <Select
            v-model="searchParams.deviceName"
            :options="searchList.deviceName"
            multiple
            collapseTags
            collapse-tags-tooltip
            placeholder="请选择设备名称"
            @change="handleListPage"
          >
          </Select>
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
        <!-- 上传 -->
        <el-col :span="1.5" v-auth="['system:role:add']">
          <el-button type="primary" icon="upload" plain @click="handleUpload">
            上传
          </el-button>
        </el-col>
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
      <div style="height: 20px">{{ imageList.length }}</div>
      <!-- 数据表格 -->
    </Card>
  </div>
</template>

<style scoped lang="scss">
p {
  margin: 10px;
  padding: 0;
}
.tag-item + .tag-item {
  margin-left: 5px;
}
</style>
