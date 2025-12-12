# Vue3 + TypeScript 模块化前端项目架构与编码规范文档

## 一、项目架构设计核心思想

### 1. 基于功能模块的垂直拆分
采用"按功能组织代码"（Feature-Oriented）的架构模式，将相关功能代码集中在一个目录下，实现高内聚低耦合。每个功能模块(`feature`)包含完整的API、组件、状态、类型等，形成独立单元。

### 2. 清晰的关注点分离
- **API层**：统一管理网络请求和类型定义
- **UI层**：专用组件和样式
- **逻辑层**：组合式函数和状态管理
- **工具层**：通用工具函数和常量
- **测试层**：单元测试和集成测试

### 3. 渐进式可扩展性
- 支持从简单功能到复杂功能的平滑演进
- 新功能可快速创建独立模块
- 共享代码可通过工具层或组合式函数实现

## 二、项目目录结构规范

```
src/
├── assets/               # 静态资源
├── composables/          # 全局组合式函数
├── constants/            # 全局常量
├── stores/               # 全局状态管理
├── styles/               # 全局样式
├── types/                # 全局类型定义
├── utils/                # 全局工具函数
├── features/             # 功能模块目录
│   ├── {feature-name}/   # 功能模块目录（如user、product等）
│   │   ├── api/          # 功能API调用
│   │   │   ├── {feature}-api.ts      # API接口定义
│   │   │   └── types.ts              # API类型定义
│   │   ├── components/   # 功能专用组件
│   │   ├── composables/  # 功能专用组合式函数
│   │   ├── stores/       # 功能状态管理
│   │   │   └── {feature}Store.ts      # Pinia Store
│   │   ├── types/        # 功能类型定义
│   │   ├── utils/        # 功能工具函数
│   │   ├── constants/     # 功能常量
│   │   ├── __tests__/    # 功能测试文件
│   │   └── index.ts      # 模块入口(公共API)
│   └── ...
├── App.vue              # 根组件
└── main.ts              # 应用入口
```

## 三、编码规范

### 1. 文件命名规范
- **组件文件**：使用PascalCase命名（如`UserCard.vue`）
- **API文件**：`{feature}-api.ts`（如`user-api.ts`）
- **类型文件**：`types.ts`或`{feature}.types.ts`
- **工具文件**：`{function}.util.ts`（如`date.util.ts`）
- **常量文件**：`constants.ts`或`{feature}.constants.ts`
- **测试文件**：`{filename}.spec.ts`或`{filename}.test.ts`

### 2. Vue组件规范

#### 组件结构
```vue
<script setup lang="ts">
// 1. 导入
import { ref, computed } from 'vue'
import { useFeatureStore } from '@/stores/featureStore'
import type { FeatureType } from '@/features/feature/types'

// 2. 组合式API
const store = useFeatureStore()
const localState = ref('')
const derivedState = computed(() => store.someState + localState.value)

// 3. 方法定义
function handleClick() {
  // ...
}
</script>

<template>
  <!-- 4. 模板部分 -->
  <div class="feature-container">
    <!-- 使用语义化HTML标签 -->
    <h1 v-if="derivedState">{{ derivedState }}</h1>
    <button @click="handleClick">Click me</button>
  </div>
</template>

<style scoped lang="scss">
// 5. 样式部分
.feature-container {
  padding: 16px;
  
  h1 {
    color: $primary-color;
  }
}
</style>
```

#### 组件规范要点
- 必须使用`<script setup lang="ts">`语法
- 组件props必须明确定义类型
- 复杂组件应拆分为多个子组件
- 避免在模板中直接编写复杂逻辑
- 样式使用scoped避免污染全局

### 3. TypeScript规范

#### 类型定义
```typescript
// 接口定义
interface User {
  id: string
  name: string
  age: number
  roles: string[]
}

// 类型别名
type UserResponse = {
  code: number
  data: User
  message: string
}

// 枚举
enum UserRole {
  Admin = 'admin',
  User = 'user',
  Guest = 'guest'
}
```

#### 类型使用规范
- 优先使用接口(interface)定义对象类型
- 复杂类型使用类型别名(type)
- 常量使用枚举(enum)或联合类型
- 函数参数和返回值必须明确定义类型

### 4. API请求规范

#### API模块结构
```typescript
// features/user/api/user-api.ts
import type { User, UserResponse } from './types'
import { request } from '@/utils/request'

export const useUserApi = () => ({
  getUserById: (id: string): Promise<User> => {
    return request.get<UserResponse>(`/api/users/${id}`).then(res => res.data)
  },
  
  createUser: (user: Omit<User, 'id'>): Promise<User> => {
    return request.post<UserResponse>('/api/users', user).then(res => res.data)
  }
})
```

#### API类型定义
```typescript
// features/user/api/types.ts
export interface User {
  id: string
  name: string
  age: number
  email: string
  createdAt: string
}

export interface UserListResponse {
  list: User[]
  total: number
  page: number
  pageSize: number
}
```

### 5. Pinia状态管理规范

#### Store定义
```typescript
// features/user/stores/userStore.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useUserApi } from '../api/user-api'
import type { User } from '../api/types'

export const useUserStore = defineStore('user', () => {
  const api = useUserApi()
  const currentUser = ref<User | null>(null)
  const userList = ref<User[]>([])
  
  const isAdmin = computed(() => {
    return currentUser.value?.roles.includes('admin')
  })
  
  async function fetchUserById(id: string) {
    currentUser.value = await api.getUserById(id)
  }
  
  async function fetchUserList() {
    // 实际项目中可能需要分页参数
    const res = await api.getUserList({ page: 1, pageSize: 10 })
    userList.value = res.list
  }
  
  return {
    currentUser,
    userList,
    isAdmin,
    fetchUserById,
    fetchUserList
  }
})
```

#### Store使用规范
- 每个功能模块有自己的store
- 全局状态放在`src/stores/`目录
- 避免在store中存放过多业务逻辑
- 使用组合式API风格定义store

### 6. 组合式函数规范

#### 组合式函数示例
```typescript
// features/user/composables/useUser.ts
import { useUserStore } from '../stores/userStore'
import { useUserApi } from '../api/user-api'

export function useUser(id?: string) {
  const store = useUserStore()
  const api = useUserApi()
  
  const loadUser = async () => {
    if (id) {
      await store.fetchUserById(id)
    } else {
      await store.fetchCurrentUser()
    }
  }
  
  const updateUser = async (userData: Partial<User>) => {
    if (store.currentUser) {
      return api.updateUser(store.currentUser.id, userData)
    }
    throw new Error('No user found')
  }
  
  return {
    user: store.currentUser,
    isAdmin: store.isAdmin,
    loadUser,
    updateUser
  }
}
```

#### 组合式函数规范
- 每个功能模块可以有自己的组合式函数
- 组合式函数应专注于单一功能
- 返回对象应包含相关状态和方法
- 避免在组合式函数中直接操作DOM

### 7. 样式规范

#### SCSS组织
```scss
// 全局变量和混入
// src/styles/variables.scss
$primary-color: #409eff;
$secondary-color: #67c23a;
$text-color: #303133;

// src/styles/mixins.scss
@mixin flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
}

// 组件样式
// features/user/components/UserCard.vue
<style scoped lang="scss">
@use '@/styles/variables' as *;
@use '@/styles/mixins' as *;

.user-card {
  @include flex-center;
  padding: 16px;
  border: 1px solid $primary-color;
  border-radius: 8px;
  
  &__name {
    font-size: 18px;
    color: $text-color;
  }
  
  &:hover {
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  }
}
</style>
```

#### 样式规范要点
- 使用CSS Modules或scoped样式
- 优先使用SCSS变量和混入
- 采用BEM命名规范或类似约定
- 避免过度嵌套（建议不超过3层）
- 动画效果使用CSS而非JavaScript实现

## 四、项目配置规范

### 1. Vite配置
```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
      dts: 'src/auto-imports.d.ts'
    }),
    Components({
      resolvers: [ElementPlusResolver()],
      dts: 'src/components.d.ts'
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://your-api-server.com',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, '')
      }
    }
  }
})
```

### 2. ESLint配置
```javascript
// .eslintrc.js
module.exports = {
  root: true,
  env: {
    node: true,
    browser: true,
    es2021: true
  },
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-recommended',
    '@vue/typescript/recommended',
    'plugin:prettier/recommended'
  ],
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module'
  },
  rules: {
    'vue/multi-word-component-names': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'vue/no-setup-props-destructure': 'off',
    'prettier/prettier': [
      'error',
      {
        endOfLine: 'auto',
        semi: false,
        singleQuote: true,
        trailingComma: 'es5'
      }
    ]
  }
}
```

### 3. Prettier配置
```json
// .prettierrc
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100,
  "endOfLine": "auto"
}
```

## 五、开发流程规范

### 1. 新功能开发流程
1. 在`src/features/`下创建新功能目录
2. 按规范创建各子目录和文件
3. 实现API、组件、状态等
4. 编写单元测试
5. 在需要的地方导入使用

### 2. 代码提交规范
- 使用Conventional Commits规范
- 提交信息格式：`type(scope): subject`
- 支持的type类型：
  - feat: 新功能
  - fix: 修复bug
  - docs: 文档变更
  - style: 代码格式调整
  - refactor: 代码重构
  - perf: 性能优化
  - test: 测试相关
  - chore: 构建或工具链变更

### 3. 测试规范
- 单元测试使用Vitest
- 组件测试使用@testing-library/vue
- API测试应模拟网络请求
- 测试文件放在`__tests__`目录下
- 测试覆盖率目标：核心逻辑80%以上

## 六、最佳实践建议

1. **状态管理**：
   - 小型项目可直接使用组件状态或provide/inject
   - 中型项目使用Pinia按功能模块拆分store
   - 避免在store中存放过多派生状态

2. **API请求**：
   - 统一封装请求拦截器和响应拦截器
   - 实现请求重试和错误处理机制
   - 考虑使用请求缓存策略

3. **组件设计**：
   - 遵循单一职责原则
   - 优先使用组合而非继承
   - 复杂组件拆分为多个子组件
   - 提供合理的props和events接口

4. **类型安全**：
   - 为所有API响应定义类型
   - 使用泛型提高代码复用性
   - 利用TypeScript的类型推断能力

5. **性能优化**：
   - 组件按需加载
   - 图片资源优化
   - 防抖节流处理高频事件
   - 使用v-once和memo优化静态内容

本架构规范结合了Vue3的最佳实践，通过模块化设计实现了代码的高内聚低耦合，同时保持了良好的可扩展性和可维护性。开发团队应严格遵守此规范，并根据项目实际情况进行适当调整。