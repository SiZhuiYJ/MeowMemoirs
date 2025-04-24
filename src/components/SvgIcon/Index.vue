<script lang="ts" setup>
import { computed, defineAsyncComponent } from 'vue'
const props = defineProps({
  // 名称
  name: {
    type: String,
    default: '',
    required: true,
  },
  // 大小
  size: {
    type: Number,
    default: 24,
  },
  // 颜色
  color: {
    type: String,
    default: '',
  },
  // class
  className: {
    type: String,
    default: '',
  },
  // 无障碍朗读文本
  ariaTitle: {
    type: String,
    default: '',
  },
})

const svgStyle = computed(() => {
  return {
    width: props.size + 'px',
    height: props.size + 'px',
    color: props.color,
  }
})
const svgModules = import.meta.glob('@/assets/svgs/**/*.svg')
const svgIconMap: Record<string, () => Promise<any>> = {}

Object.keys(svgModules).forEach((path) => {
  const relativePath = path.replace('/src/assets/svgs/', '').replace('.svg', '')
  // 子文件夹里svg 命名空间
  const iconName = relativePath.replace(/\//g, '-')
  console.log('svgModules', svgModules)
  console.log('path', path)
  console.log('svgIconMap', svgIconMap)
  console.log('relativePath', relativePath)
  console.log('iconName', iconName)
  svgIconMap[iconName] = svgModules[path]
})

const iconComponent = computed(() => {
  console.log('props.name', props.name)
  const component = defineAsyncComponent(svgIconMap[props.name])
  return component
})
</script>

<template>
  <Suspense>
    <template #default>
      <component v-if="iconComponent" :is="iconComponent" class="svg-icon" :style="svgStyle" :class="className"
        :aria-hidden="ariaTitle ? 'false' : 'true'" role="img" :aria-label="ariaTitle"></component>
    </template>
    <template #fallback>
      <div class="svg-icon-placeholder" :style="{ width: svgStyle.width, height: svgStyle.height }"></div>
    </template>
  </Suspense>
</template>

<style scoped>
.svg-icon,
.svg-icon-placeholder {
  display: inline-block;
  vertical-align: middle;
}

.svg-icon-placeholder {
  background-color: #ccc;
}
</style>