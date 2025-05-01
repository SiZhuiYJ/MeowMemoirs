<script setup lang="ts">
import { ref, reactive, onMounted, computed, getCurrentInstance, onUnmounted } from 'vue'
const { proxy } = getCurrentInstance()
import useApiUrl from '@/plugins/useApiUrl'
const { getLoveImgUrl, getLocalImgUrl } = useApiUrl()
import { useSiteStore } from '@/stores/index'
import ShowDetails from '@/components/ShowDetails/index.vue'
type dataLove = {
	attributes: String
	creationTime: String
	lastWriteTime: String
	name: String
	size: Number
	type: String
}
const tableData = ref([] as dataLove[])
const tableShow = ref(false)
const activeName = ref('2024')

const iamgeShow = ref(false)
const defaultLoveData = ref<dataLove>({
	attributes: ".webp",
	creationTime: "2022-04-21 21:06:00",
	lastWriteTime: "2024-04-30 16:34:00",
	name: "loveDate.webp",
	size: 905216,
	type: "image/webp",
})
// 默认数据
const defaultData = ref<dataLove>({
	attributes: ".mp4",
	creationTime: "2025-01-07T14:40:50.1400336+08:00",
	lastWriteTime: "2024-05-04T23:29:01+08:00",
	name: "mmexport1714836541107.mp4",
	size: 6506740,
	type: "video/mp4",
})
const showContent = ref('日记')
const showList = computed(() => {
	return {
		mediumId: 18,
		userImg: getLocalImgUrl('_6.webp'),
		userName: '喵咪记事簿',
		dateTime: defaultData.value.lastWriteTime,
		type: defaultData.value.type === "video/mp4" ? 'video' : 'atlas',
		title: '图片集',
		coverImage: getLocalImgUrl('_6.webp'),
		content: showContent.value,
		MediaContent: [
			showContent.value === '日记' ? getLoveImgUrl(defaultData.value.name) : getLocalImgUrl(defaultData.value.name),
		]
	}
})

const handleClick = (item: dataLove, content: string = '日记') => {
	iamgeShow.value = true
	showContent.value = content
	defaultData.value = item
}

// 示例输入数组
const OpenAddess = async () => {
	const data = await proxy.$api.postImageData({
		RainbowID: 'LoveCalendar',
		Path: '',
		AccessType: 'MapStorage',
	})
	const sortedItems = computed(() => {
		return [...data.documentList].sort((a, b) => {
			return a.lastWriteTime.localeCompare(b.lastWriteTime)
			// return new Date(a.lastWriteTime) - new Date(b.lastWriteTime);
		})
	})

	tableData.value = sortedItems.value
	scrollbarAdd()
}
const organizedData = ref([])
const scrollbarData = ref([])

const scrollbarAdd = () => {
	const result1 = reactive({})
	const result2 = reactive({})
	tableData.value.forEach((item) => {
		const [year, month, day] = item.lastWriteTime.split('T')[0].split('-')
		const yearKey = year
		const monthKey = `${year}-${month}`
		const dayKey = `${year}-${month}-${day}`

		// 确保年份对象存在
		if (!(yearKey in result1)) {
			result1[yearKey] = {}
		}
		if (!(yearKey in result2)) {
			result2[yearKey] = {}
		}

		// 确保月份对象存在
		if (!(monthKey in result1[yearKey])) {
			result1[yearKey][monthKey] = {}
		}
		if (!(monthKey in result2[yearKey])) {
			result2[yearKey][monthKey] = monthKey
		}
		// 确保日期数组存在，并将项目添加到日期数组中
		if (!(dayKey in result1[yearKey][monthKey])) {
			result1[yearKey][monthKey][dayKey] = []
		}

		// 将项目添加到对应的日期数组中
		result1[yearKey][monthKey][dayKey].push(item)
	})
	organizedData.value = result1
	scrollbarData.value = result2
	tableShow.value = true
}

function scrollTo(sectionId: string) {
	// 使用原生 JavaScript 滚动到页面内的特定元素
	const element = document.getElementById(sectionId)
	if (element) {
		element.scrollIntoView({ behavior: 'smooth' }) // 平滑滚动
	}
}

const importantDays = ref({
	startDate: new Date('2022-04-21 21:06:00'),
	loveDate: new Date('2024-04-30 16:34:00'),
})
const currentDate = ref(new Date())
const startDifferenceInDays = computed(() => {
	const timeDiff = Math.abs(currentDate.value - importantDays.value.startDate) // 获取两者之间的毫秒差
	// 将时间差转换为天数
	const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24))
	return diffDays
})
const loveDifferenceInDays = computed(() => {
	const timeDiff = Math.abs(currentDate.value - importantDays.value.loveDate) // 获取两者之间的毫秒差
	// 将时间差转换为天数
	const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24))
	return diffDays
})
function nowDate(time) {
	var year = time.getFullYear() // 年
	var month = (time.getMonth() + 1).toString().padStart(2, '0') // 月
	var date = time.getDate().toString().padStart(2, '0') // 日
	var hour = time.getHours().toString().padStart(2, '0') // 时
	var minute = time.getMinutes().toString().padStart(2, '0') // 分
	var second = time.getSeconds().toString().padStart(2, '0') // 秒
	return year + '-' + month + '-' + date + ' ' + hour + ':' + minute + ':' + second
}

onMounted(async () => {
	await OpenAddess()
})

onMounted(async () => {
	await OpenAddess()
})
</script>

<template>
	<div v-if="tableShow" class="container">
		<div v-for="(months, year) in organizedData" :key="year">
			<h2>{{ year }}</h2>
			<el-timeline>
				<el-timeline-item icon="Clock" color="#67c23a" size="large" :hollow="true" style="width: 600px"
					v-for="(days, month) in months" :key="month" :id="month" :timestamp="month" placement="top">
					<el-timeline>
						<el-timeline-item type="success" :hollow="true" v-for="(items, day) in days" :timestamp="day"
							placement="top" :id="month" :key="day">
							<div style="display: flex; flex-direction: row; width: 524px; flex-wrap: wrap">
								<div v-for="item in items" :key="item.name" style="padding: 0 2px"
									class="waterfall-item" @click="handleClick(item)">
									<img :id="item.name"
										v-lazy="item.type === 'video/mp4' ? getLocalImgUrl('favicon.ico') : getLoveImgUrl(item.name)"
										class="img-show" :class="{ 'video-show': item.type === 'video/mp4' }" />
								</div>
							</div>
						</el-timeline-item>
					</el-timeline>
				</el-timeline-item>
			</el-timeline>
		</div>
	</div>

	<el-card class="right-Navigation" shadow="hover" v-show="useSiteStore().siteStore.isLargeNavigation">
		<el-collapse v-model="activeName" accordion>
			<el-collapse-item v-for="(months, year) in scrollbarData" :key="year" :title="year" :name="year">
				<div class="navigation-Item" v-for="(_, monthKey) in months" :key="monthKey"
					@click="scrollTo(monthKey)">{{ monthKey }}</div>
			</el-collapse-item>
		</el-collapse>
	</el-card>

	<div class="left-Navigation" v-show="useSiteStore().siteStore.isLargeWidth">
		<el-card shadow="hover">
			<p class="el-card__h1">重要日</p>
			<p class="show-Date">
				相爱于<span>{{ nowDate(importantDays.loveDate) }}</span> 已经相爱<span>{{ loveDifferenceInDays }}</span>天
			</p>
			<p class="show-Date">
				相识于<span>{{ nowDate(importantDays.startDate) }}</span> 已经相识<span>{{ startDifferenceInDays }}</span>天
			</p>
		</el-card>
		<div style="height: 6px; width: 100%"></div>
		<el-card shadow="hover" v-show="useSiteStore().siteStore.isLargeHeight"
			@click="handleClick(defaultLoveData, '命运开始交织的那天')">
			<template #header>
				<div style="display: flex; justify-content: space-between">
					<p class="el-card__h1">命运开始交织的那天</p>
				</div>
			</template>
			<template #default>
				<img v-lazy="getLocalImgUrl('loveDate.webp')" style="height: 300px;object-fit: fill;" />
			</template>
			<template #footer>
				<p style="font-size: 10px">祝我们永远永远恩恩爱爱一辈子，永不分离！</p>
			</template>
		</el-card>
	</div>

	<ShowDetails v-model="iamgeShow" :showdata="showList" />
</template>

<style scoped>
.container {
	position: relative;
	/* 设置为相对定位 */
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	background: #fff;
}

.left-Navigation {
	position: fixed;
	top: 100px;
	width: 190px;
	padding: 0 0 0 5px;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
}

.el-card__h1 {
	font-size: 15px;
	font-weight: bold;
}

.show-Date {
	font-size: 10px;

	span {
		font-size: 15px;
		color: #ffc0cb;
		font-weight: bold;
	}
}

.right-Navigation {
	/* 当前容器的右上角 */
	position: fixed;
	right: 10px;
	top: 100px;
	width: 100px;
	background-color: #fff;
}

.navigation-Item {
	cursor: pointer;
}

.navigation-Item:hover {
	color: #409eff;
}

/* 添加一些样式以更好地显示数据 */
h2,
h3 {
	margin-top: 20px;
}

ul {
	list-style-type: none;
	padding-left: 20px;
}

li {
	margin-bottom: 10px;
}

.image-List {
	width: 100px;
	height: 100px;
	margin-right: 10px;
}

.waterfall-item {


	.img-show {
		width: 100px;
		height: 100px
	}

	.video-show {
		width: 524px;
		height: 320px;
		object-fit: contain;
		background-image: linear-gradient(to bottom right, #91defe, #99c0f9, #bdb6ec, #d7b3e3, #efb3d5, #f9bccc);
	}
}
</style>
