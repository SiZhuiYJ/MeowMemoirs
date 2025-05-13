<script setup lang="ts">
import { ref, onMounted, computed, onUnmounted, getCurrentInstance } from 'vue'
import MessageList from '@/components/MessageBoard/MessageList.vue'
import SpiralMenu from '@/components/MessageBoard/SpiralMenu.vue'
import AddMessage from '@/components/MessageBoard/AddMessage.vue'
import useApiUrl from '@/plugins/useApiUrl'
const { getMessageImgUrl, getLocalImgUrl, getUserImgUrl } = useApiUrl()
//定义一个类
class MessageSet {
	addImage: boolean
	content: string
	dateTime: string
	imageList: string
	rainbowId: string
	userImg: string
	userName: string
}
class MessageGet {
	addImage: boolean
	content: string
	dateTime: string
	imageList: Array<string>
	rainbowId: string
	userImg: string
	userName: string
	height: number
	top: number
	left: number
}

const { proxy } = getCurrentInstance()
const rootData = ref<MessageSet[]>([])

//api获取数据
const getData = async () => {
	const res = await proxy.$api.postMessageBoard()
	console.log(res)
	rootData.value = res.boardList as MessageSet[]
	console.log(rootData.value)
	calculationWidth()
}

// 定义响应式数据
const waterfallList = ref<MessageGet[]>([])
const waterfallImgWidth = ref(296) // 每个盒子的宽度
const waterfallImgCol = ref(100) // 瀑布流的列数
const waterfallDeviationHeight = ref<number[]>([])

// 计算宽度和列数的方法
const calculationWidth = () => {
	const domWidth = document.getElementById('v-waterfall')!.offsetWidth
	if (waterfallImgWidth.value) {
		if (waterfallImgCol.value === Math.floor(domWidth / waterfallImgWidth.value)) return
		waterfallList.value.length = 0
		waterfallImgCol.value = Math.floor(domWidth / waterfallImgWidth.value) > 0 ? Math.floor(domWidth / waterfallImgWidth.value) : 1
	}
	waterfallDeviationHeight.value = new Array(waterfallImgCol.value).fill(0)
	console.log(waterfallDeviationHeight.value)
	imgPreloading()
}

// 图片预加载的方法
const imgPreloading = () => {
	rootData.value.forEach((item: MessageSet) => {
		const imageList = [] as string[]
		if (item.addImage) {
			const imageNameList = item.imageList.split('&')
			imageNameList.forEach((imageName: string) => {
				imageList.push(getMessageImgUrl({ RainbowID: item.rainbowId, imageName: imageName }))
			})
		}
		let message: MessageGet = {
			addImage: item.addImage,
			content: item.content,
			dateTime: item.dateTime,
			imageList: item.addImage ? imageList : [getLocalImgUrl(`_7.webp`)],
			rainbowId: item.rainbowId,
			userImg: getUserImgUrl({ RainbowID: item.rainbowId, imageName: item.userImg }),
			userName: item.userName,
			height: 0,
			top: 0,
			left: 0,
		}
		const aImg = new Image()
		aImg.src = message.imageList[0].toString()
		aImg.onload = aImg.onerror = (e) => {
			message.height = (290.67 / aImg.width) * aImg.height
			waterfallList.value.push(message as MessageGet)
			rankImg(message as MessageGet)
		}
	})
	console.log(waterfallList.value)
}

// 瀑布流布局的方法
const rankImg = (imgData: MessageGet) => {
	const minIndex = filterMin()
	imgData.top = waterfallDeviationHeight.value[minIndex]
	imgData.left = minIndex * waterfallImgWidth.value
	waterfallDeviationHeight.value[minIndex] += imgData.height + 20 + (imgData.content?.length > 18 ? 2 : 1) * 20 + 42
}

// 找到最短的列并返回下标的方法
const filterMin = () => {
	const min = Math.min(...waterfallDeviationHeight.value)
	return waterfallDeviationHeight.value.indexOf(min)
}

//监听窗口宽度变化
const windowWidth = ref<number>(window.innerWidth)
const lastResizeTime = ref<string>(new Date().toLocaleTimeString())
const isResizing = ref<boolean>(false)

let resizeTimeout: number | null = null

const updateWindowWidth = () => {
	windowWidth.value = window.innerWidth
	isResizing.value = true

	if (resizeTimeout !== null) {
		clearTimeout(resizeTimeout)
	}

	resizeTimeout = window.setTimeout(() => {
		isResizing.value = false
		lastResizeTime.value = new Date().toLocaleTimeString()
		onResizeStop()
	}, 300) // 延时300毫秒判断用户是否停止调整窗口大小
}

const onResizeStop = () => {
	calculationWidth()
}

// 监听窗口大小变化，更新页面高度模块
const pageHeight = ref(0)
const containerHeight = computed(() => {
	return pageHeight.value - 132
})

function updatePageHeight() {
	pageHeight.value = window.innerHeight
}

onMounted(() => {
	getData()
	// 组件挂载时更新页面高度
	updatePageHeight()
	// 监听窗口大小变化
	window.addEventListener('resize', updatePageHeight)

	window.addEventListener('resize', updateWindowWidth)
})

onUnmounted(() => {
	// 组件卸载时移除事件监听器
	window.removeEventListener('resize', updatePageHeight)

	window.removeEventListener('resize', updateWindowWidth)
	if (resizeTimeout !== null) {
		clearTimeout(resizeTimeout)
	}
})
</script>

<template>
	<div class="v-waterfall-content" id="v-waterfall" :style="{ height: containerHeight + 'px' }">
		<MessageList :imageList="waterfallList" :waterfallImgWidth="waterfallImgWidth" />
	</div>
	<SpiralMenu />
	<AddMessage />
</template>
<style scoped>
.v-waterfall-content {
	/* 主要 */
	width: 100%;
	height: 400px;
	position: relative;
	/* 次要：设置滚动条，要求固定高度 */
	overflow-y: auto;
}

.v-waterfall-content::-webkit-scrollbar {
	width: 8px;
	/* 设置滚动条的宽度 */
}

.v-waterfall-content::-webkit-scrollbar-thumb {
	background-color: rgba(0, 0, 0, 0.5);
	/* 设置滑块的颜色 */
	border-radius: 8px;
	/* 设置滑块的圆角 */
}

.v-waterfall-content::-webkit-scrollbar-track {
	background-color: #f1f1f1;
	/* 设置轨道的颜色 */
}
</style>
