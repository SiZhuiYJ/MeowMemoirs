<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, useTemplateRef } from 'vue';
import ShowDetails from '@/components/ShowDetails/index.vue'
import WaterfallFlow from '@/components/WaterfallFlow/index.vue'
import useApiUrl from '@/libs/useApiUrl/index'
import { galleryApi } from '@/libs/api/gallery';
import type { ShowData } from '@/components/ShowDetails/type'
import type { item } from '@/libs/api/gallery/type'
const { getGalleryImgUrl } = useApiUrl()
interface ImageItem {
	id: number;
	name: string;
	path: string;
	type: string;
	size: number;
	modified: string;
}
// 截取下划线到点之间的字符串
const getName = (path: string) => {
	const startIndex = path.indexOf('_') + 1;
	const endIndex = path.indexOf('.');
	return path.substring(startIndex, endIndex);
}
const dataList = ref<ImageItem[]>([{
	id: 0,
	name: "CYY",
	path: "CYY\\IMG\\CYY_20250327001.jpg",
	type: ".jpg",
	size: 502466,
	modified: "2025-03-27 00:18:20"
},])
const listElement = useTemplateRef('list')
//获取数据
const getData = async () => {
	const { data } = await galleryApi.MMGetImageList()
	// 为每个项添加唯一id并赋值
	dataList.value = data.items.map((item: item, index: number) => {
		return {
			...item,
			id: index
		}
	})
	imageList.value = [...dataList.value]
}

const name = ref<string>('ALL')
const nameList = ref<string[]>(['JJW', 'SYJ', 'ZXY', 'PCC', 'CYY', 'ALL'])
const imageShow = ref<boolean>(false)
const imageList = ref<ImageItem[]>([...dataList.value])
const getImgUrlList = () => {
	return imageList.value.map(item => {
		return getGalleryImgUrl(item.path)
	})
}


const showList = ref<ShowData>({
	mediumId: 18,
	userImg: getGalleryImgUrl(imageList.value[0].path),
	userName: name.value,
	dateTime: new Date().toString(),
	type: 'atlas',
	title: name.value + '的图片集',
	coverImage: getGalleryImgUrl(imageList.value[0].path),
	content: '我的玩物:' + name.value,
	MediaContent: getImgUrlList()
})

// 打开展示
const showImg = () => {
	showList.value = {
		mediumId: 18,
		userImg: getGalleryImgUrl(imageList.value[0].path),
		userName: name.value,
		dateTime: new Date().toString(),
		type: 'atlas',
		title: name.value + '的图片集',
		coverImage: getGalleryImgUrl(imageList.value[0].path),
		content: '我的玩物:' + name.value,
		MediaContent: getImgUrlList()
	}
	imageShow.value = true
}

/**
 * 过滤图片源
 * @param name 
 * @returns ImageItem[]
 */
const filterItemByName = (name: string) => {
	if (name === 'ALL')
		return dataList.value
	else
		return dataList.value.filter((item: ImageItem) => item.name === name);
}


const isLoading = ref(false)
const pageSize = 15
const currentPage = ref(1)
const displayedList = ref<ImageItem[]>([

])
/**
 * 切换图片源
 */
const handleNameChange = () => {
	displayedList.value = []
	currentPage.value = 1
	imageList.value = filterItemByName(name.value)
	loadMore()
}

/**
 * 加载更多
 */
const loadMore = () => {
	if (isLoading.value) return
	isLoading.value = true
	const startIndex = (currentPage.value - 1) * pageSize
	const endIndex = startIndex + pageSize
	const newItems = imageList.value.slice(startIndex, endIndex)
	displayedList.value = [...displayedList.value, ...newItems]
	currentPage.value++
	isLoading.value = false
}

const handleScroll = () => {
	// 判断是否滚动到底部
	if (listElement.value!.scrollTop + listElement.value!.clientHeight >= listElement.value!.scrollHeight - 50) {
		loadMore()
	}
}

onMounted(async () => {
	// 模拟数据
	await getData()
	loadMore()
	listElement.value!.addEventListener('scroll', handleScroll)
})

onBeforeUnmount(() => {
	listElement.value!.removeEventListener('scroll', handleScroll)
})
</script>

<template>
	<div id="list" ref="list">
		<WaterfallFlow :columnWidth="200" :gap="6">
			<div v-for="(item, index) in displayedList" :key="index" class="waterfall-item">
				<img v-lazy="getGalleryImgUrl(item.path)" class="item-image" />
				<div class="item-content">{{ getName(item.path) }}</div>
			</div>
		</WaterfallFlow>
		<div v-if="isLoading" class="loading">Loading...</div>
		<div class="list-header">
			<el-select v-model="name" placeholder="Select" size="small" style="width: 240px" @change="handleNameChange">
				<el-option v-for="item in nameList" :key="item" :label="item" :value="item" />
			</el-select>
			<el-button style="height: 24px;width: 24px;" @click="showImg">
				<el-icon>
					<FullScreen />
				</el-icon>
			</el-button>
		</div>
		<ShowDetails v-model="imageShow" :showdata="showList" />
	</div>
</template>


<style scoped lang="scss">
#list {
	height: 100%;
	width: 100%;
	// 背景颜色为粉红色渐变到紫色
	// background: linear-gradient(to right, #ffc3a0, #ffafbd);
	background-image: linear-gradient(to bottom right, #91defe, #99c0f9, #bdb6ec, #d7b3e3, #efb3d5, #f9bccc);
	overflow-y: auto;
	/* 超出部分出现垂直滚动条 */
	overflow-x: hidden;
	// position: absolute;

	/* 隐藏水平滚动条 */
	&::-webkit-scrollbar {
		width: 0px;
	}

	.list-header {
		padding: 0 0 5px;
		margin-top: 10px;
		display: flex;
		align-items: center;
		gap: 10px;
		position: sticky;
		margin: 0 10px;
		bottom: 10px;
	}
}

/* 用户自定义项样式 */
.waterfall-item {
	background: #fff;
	border-radius: 8px;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	overflow: hidden;
	margin: 3px;

	.item-image {
		width: 100%;
		height: auto;
		display: block;
	}

	.item-content {
		padding: 6px;
		color: #000;
		font-size: 13px;
	}
}



.loading {
	text-align: center;
	padding: 20px;
	font-size: 16px;
	color: #666;
}


/* 媒体查询手机端样式 */
@media (max-width: 768px) {
	.waterfall-item {
		width: 100%;
	}

	.item-image {
		height: auto;
		display: block;
	}
}
</style>