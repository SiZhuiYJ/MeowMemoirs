<script setup lang="ts">
import { onMounted, ref, onBeforeUnmount } from 'vue'
import WaterfallFlow from '@/components/WaterfallFlow/index.vue'
import MessageList from '@/components/MessageBoard/MessageList.vue'
import SpiralMenu from '@/components/MessageBoard/SpiralMenu.vue'
import AddMessage from '@/components/MessageBoard/AddMessage.vue'
import { useBoardStore } from '@/stores/index.ts'
import ShowDetails from '@/components/ShowDetails/index.vue'

const handleScroll = () => {
	const listElement = document.getElementById('list')!
	if (listElement.scrollTop + listElement.clientHeight >= listElement.scrollHeight - 50) {
		useBoardStore().loadMore()
	}
}

onMounted(() => {
	useBoardStore().getAllData()
	useBoardStore().loadMore()
	useBoardStore().Log()
	const listElement = document.getElementById('list')!
	listElement.addEventListener('scroll', handleScroll)
})

onBeforeUnmount(() => {
	const listElement = document.getElementById('list')!
	listElement.removeEventListener('scroll', handleScroll)
})

</script>

<template>
	<div id="list">
		<div v-show="!useBoardStore().boardStore.isLisLoading" class="loading">Loading...</div>
		<WaterfallFlow :columnWidth="200" :gap="10" v-show="useBoardStore().boardStore.isLisLoading">
			<MessageList />
		</WaterfallFlow>
	</div>
	<SpiralMenu />
	<AddMessage />
	<ShowDetails v-if="useBoardStore().boardStore.isLisLoading" v-model="useBoardStore().boardStore.isShow"
		:showdata="useBoardStore().boardStore.currentShow" />
</template>
<style scoped lang="scss">
#list {
	padding: 5px 0 0 5px;
	height: 100%;
	width: 100%;
	// 背景颜色为粉红色渐变到紫色
	background-image: linear-gradient(to bottom right, #91defe, #99c0f9, #bdb6ec, #d7b3e3, #efb3d5, #f9bccc);
	overflow-y: auto;
	/* 超出部分出现垂直滚动条 */
	overflow-x: hidden;

	/* 隐藏水平滚动条 */
	&::-webkit-scrollbar {
		width: 0px;
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
