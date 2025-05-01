<script setup>
	import {
		ref,
		onMounted,
		onBeforeUnmount,
		computed,
		getCurrentInstance
	} from 'vue';
	const {
		proxy
	} = getCurrentInstance()
	import ShowDetails from '@/components/ShowDetails/index.vue'
	import WaterfallFlow from '@/components/WaterfallFlow/index.vue'
	import AutoScroll from '@/components/AutoScroll/index.vue'
	import useApiUrl from '@/plugins/useApiUrl'
	const {
		getGalleryImgUrl
	} = useApiUrl()

	const list = ref([{
		"name": "CYY",
		"path": "CYY\\IMG\\CYY_20250327001.jpg",
		"type": ".jpg",
		"size": 502466,
		"modified": "2025-03-27 00:18:20"
	}, ])

	//获取数据
	const getData = async () => {
		const res = await proxy.$api.getGallerys()
		console.log('获取数据', res)
		list.value = res.items
		imageList.value = [...list.value]
	}

	const name = ref('ALL')
	const nameList = ref(['JJW', 'SYJ', 'ZXY', 'PCC', 'CYY', 'ALL'])
	const imageShow = ref(false)
	const imageList = ref([...list.value])
	const getImgUrlList = () => {
		return imageList.value.map(item => {
			return getGalleryImgUrl(item.path)
		})
	}

	// 打开展示
	const showImg = () => {
		showList.value = {
			mediumId: 18,
			userImg: getGalleryImgUrl(imageList.value[0].path),
			userName: name.value,
			dateTime: new Date(),
			type: 'atlas',
			title: name.value + '的图片集',
			coverImage: getGalleryImgUrl(imageList.value[0].path),
			content: '我的玩物:' + name.value,
			MediaContent: getImgUrlList()
		}
		imageShow.value = true
	}
	const showList = ref({
		mediumId: 18,
		userImg: getGalleryImgUrl(imageList.value[0].path),
		userName: name.value,
		dateTime: new Date(),
		type: 'atlas',
		title: name.value + '的图片集',
		coverImage: getGalleryImgUrl(imageList.value[0].path),
		content: '我的玩物:' + name.value + ``,
		MediaContent: getImgUrlList()
	})
	const filterItemByName = (name) => {
		if (name === 'ALL')
			return list.value
		else
			return list.value.filter(item => item.name === name);
	}


	const isLoading = ref(false)
	const pageSize = 15
	const currentPage = ref(1)
	const displayedList = ref([])

	const handleNameChange = () => {
		displayedList.value = []
		currentPage.value = 1
		imageList.value = filterItemByName(name.value)
		loadMore()
	}


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
		const listElement = document.getElementById('list')
		if (listElement.scrollTop + listElement.clientHeight >= listElement.scrollHeight - 50) {
			loadMore()
		}
	}

	onMounted(async () => {
		// 模拟数据
		await getData()

		loadMore()
		const listElement = document.getElementById('list')
		listElement.addEventListener('scroll', handleScroll)
	})

	onBeforeUnmount(() => {
		const listElement = document.getElementById('list')
		listElement.removeEventListener('scroll', handleScroll)
	})
</script>

<template>
	<div id="list">
		<AutoScroll>
			<WaterfallFlow :columnWidth="200" :gap="10">
				<div v-for="(item, index) in displayedList" :key="index" class="waterfall-item">
					<img v-lazy="getGalleryImgUrl(item.path)" class="item-image" />
					<div class="item-content">{{ item.path }}</div>
				</div>
			</WaterfallFlow>
		</AutoScroll>
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
		padding: 5px 0 0 5px;
		height: 100%;
		width: 100%;
		// 背景颜色为粉红色渐变到紫色
		// background: linear-gradient(to right, #ffc3a0, #ffafbd);
		background-image: linear-gradient(to bottom right, #91defe, #99c0f9, #bdb6ec, #d7b3e3, #efb3d5, #f9bccc);
		overflow-y: auto;
		/* 超出部分出现垂直滚动条 */
		overflow-x: hidden;

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
			position: fixed;
			bottom: 40px;
			right: 10px;
		}
	}

	/* 用户自定义项样式 */
	.waterfall-item {
		background: #fff;
		border-radius: 8px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
		overflow: hidden;
	}

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