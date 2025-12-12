# Vue 3 模块化项目架构与编码规范文档

## 一、架构核心思想

### 1.1 特性模块化 (Feature-Based Architecture)
**核心原则**：以业务功能/特性为核心组织代码结构，而非技术角色（组件、工具等）。

**优势**：
- **高内聚低耦合**：相关功能代码集中管理，减少模块间依赖
- **可维护性**：功能模块独立，便于重构、测试和团队协作
- **可复用性**：模块可作为独立单元在不同项目中复用
- **清晰的边界**：明确的功能边界，减少代码冲突

### 1.2 分层架构设计
```
应用层 (App)
    ↓
特性模块层 (Features) ←→ 公共共享层 (Shared)
    ↓
基础设施层 (Core/Infrastructure)
```

## 二、目录结构详解

### 2.1 完整的项目结构
```
src/
├── features/             # 特性模块目录 (核心)
│── components/           # 全局通用组件
│── composables/          # 全局组合式函数
│── utils/                # 全局工具函数
│── constants/            # 全局常量
│── types/                # 全局类型定义
│── styles/               # 全局样式
├── core/                 # 核心基础设施
│   ├── api/              # API 客户端配置
│   └── i18n/             # 国际化
│── config/               # 应用配置
│── router/               # 路由配置
├── layouts/              # 布局组件
├── pages/                # 页面组件
├── App.vue               # 根组件
└── main.ts               # 应用入口
```

### 2.2 Features 目录详细规范

```typescript
// features/user/ 用户模块示例
user/
├── api/
│   ├── user-api.ts          # 用户相关API调用
│   └── types.ts             # API相关类型定义
├── components/
│   ├── UserAvatar.vue      # 用户头像组件
│   ├── UserList.vue        # 用户列表组件
│   └── UserForm.vue        # 用户表单组件
├── composables/
│   ├── useUser.ts          # 用户相关逻辑组合
│   └── useUserPermissions.ts
├── stores/
│   └── userStore.ts        # 用户状态管理
├── types/
│   ├── user.types.ts       # 用户模块类型定义
│   └── index.ts
├── utils/
│   ├── user-helpers.ts     # 用户相关工具函数
│   └── user-validators.ts  # 用户数据验证
├── constants/
│   └── user.constants.ts   # 用户模块常量
├── __tests__/
│   ├── userStore.spec.ts
│   └── UserForm.spec.ts
└── index.ts                # 模块公共API出口
```

## 三、编码规范

### 3.1 Vue 组件规范

#### 单文件组件结构
```vue
<!-- UserForm.vue -->
<template>
  <form 
    class="user-form"
    @submit.prevent="handleSubmit"
  >
    <div class="form-group">
      <label for="username">用户名</label>
      <input
        id="username"
        v-model="formData.username"
        type="text"
        class="form-input"
        :class="{ 'is-invalid': errors.username }"
      />
      <div 
        v-if="errors.username"
        class="error-message"
      >
        {{ errors.username }}
      </div>
    </div>
    <button 
      type="submit"
      class="btn btn-primary"
      :disabled="isSubmitting"
    >
      {{ isSubmitting ? '提交中...' : '提交' }}
    </button>
  </form>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useUser } from '../composables/useUser'
import type { UserFormData } from '../types/user.types'

// Props 定义
interface Props {
  userId?: number
  initialData?: Partial<UserFormData>
}

const props = withDefaults(defineProps<Props>(), {
  userId: undefined,
  initialData: () => ({})
})

// Emits 定义
const emit = defineEmits<{
  (e: 'success', user: UserFormData): void
  (e: 'cancel'): void
}>()

// 状态定义
const { createUser, updateUser } = useUser()
const isSubmitting = ref(false)

const formData = reactive<UserFormData>({
  username: props.initialData.username || '',
  email: props.initialData.email || '',
  role: props.initialData.role || 'user'
})

const errors = reactive<Record<string, string>>({})

// Computed
const isEditMode = computed(() => !!props.userId)
const submitButtonText = computed(() => 
  isEditMode.value ? '更新用户' : '创建用户'
)

// 方法
const validateForm = (): boolean => {
  Object.keys(errors).forEach(key => delete errors[key])
  
  if (!formData.username.trim()) {
    errors.username = '用户名不能为空'
    return false
  }
  
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    errors.email = '邮箱格式不正确'
    return false
  }
  
  return true
}

const handleSubmit = async () => {
  if (!validateForm()) return
  
  isSubmitting.value = true
  try {
    if (isEditMode.value && props.userId) {
      await updateUser(props.userId, formData)
    } else {
      await createUser(formData)
    }
    emit('success', { ...formData })
  } catch (error) {
    console.error('提交失败:', error)
  } finally {
    isSubmitting.value = false
  }
}

const resetForm = () => {
  Object.assign(formData, {
    username: '',
    email: '',
    role: 'user'
  })
  Object.keys(errors).forEach(key => delete errors[key])
}

// 暴露给父组件的方法
defineExpose({
  resetForm
})
</script>

<style lang="scss" scoped>
.user-form {
  max-width: 500px;
  margin: 0 auto;
  padding: 20px;
  background: var(--color-bg-card);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  .form-group {
    margin-bottom: 20px;

    label {
      display: block;
      margin-bottom: 6px;
      font-weight: 500;
      color: var(--color-text-primary);
    }

    .form-input {
      width: 100%;
      padding: 10px 12px;
      border: 1px solid var(--color-border);
      border-radius: 4px;
      font-size: 14px;
      transition: border-color 0.3s ease;

      &:focus {
        outline: none;
        border-color: var(--color-primary);
        box-shadow: 0 0 0 2px rgba(var(--color-primary-rgb), 0.1);
      }

      &.is-invalid {
        border-color: var(--color-error);
      }
    }

    .error-message {
      margin-top: 4px;
      font-size: 12px;
      color: var(--color-error);
    }
  }

  .btn {
    padding: 10px 24px;
    border: none;
    border-radius: 4px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;

    &-primary {
      background-color: var(--color-primary);
      color: white;

      &:hover:not(:disabled) {
        background-color: var(--color-primary-dark);
      }

      &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }
    }
  }
}
</style>
```

### 3.2 TypeScript 类型规范

```typescript
// features/user/types/user.types.ts

// 基础类型定义
export interface User {
  id: number
  username: string
  email: string
  role: UserRole
  avatar?: string
  createdAt: string
  updatedAt: string
}

// 枚举类型
export enum UserRole {
  ADMIN = 'admin',
  EDITOR = 'editor',
  USER = 'user',
  GUEST = 'guest'
}

// 表单数据类型
export interface UserFormData {
  username: string
  email: string
  role: UserRole
  avatar?: string
}

// 查询参数类型
export interface UserQueryParams {
  page?: number
  limit?: number
  search?: string
  role?: UserRole
  sortBy?: 'createdAt' | 'username'
  order?: 'asc' | 'desc'
}

// 响应数据类型
export interface UserListResponse {
  users: User[]
  total: number
  page: number
  limit: number
}

// Props 类型
export interface UserListProps {
  initialUsers?: User[]
  loading?: boolean
  selectable?: boolean
}

// Emits 类型
export interface UserListEmits {
  (e: 'select', user: User): void
  (e: 'edit', userId: number): void
  (e: 'delete', userId: number): void
}

// Store 状态类型
export interface UserState {
  users: User[]
  currentUser: User | null
  loading: boolean
  error: string | null
}
```

### 3.3 Pinia Store 规范

```typescript
// features/user/stores/userStore.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User, UserQueryParams, UserFormData } from '../types/user.types'
import { userApi } from '../api/user-api'
import { useNotification } from '@/shared/composables/useNotification'

export const useUserStore = defineStore('user', () => {
  // State
  const users = ref<User[]>([])
  const currentUser = ref<User | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  
  // Getters
  const adminUsers = computed(() => 
    users.value.filter(user => user.role === 'admin')
  )
  
  const totalUsers = computed(() => users.value.length)
  
  const getUserById = computed(() => (id: number) => 
    users.value.find(user => user.id === id)
  )
  
  // Actions
  const fetchUsers = async (params?: UserQueryParams) => {
    isLoading.value = true
    error.value = null
    
    try {
      const response = await userApi.getUsers(params)
      users.value = response.data.users
      return response.data
    } catch (err: any) {
      error.value = err.message || '获取用户列表失败'
      useNotification().error(error.value)
      throw err
    } finally {
      isLoading.value = false
    }
  }
  
  const fetchUserById = async (id: number) => {
    isLoading.value = true
    try {
      const response = await userApi.getUserById(id)
      currentUser.value = response.data
      return response.data
    } catch (err: any) {
      error.value = err.message || '获取用户详情失败'
      throw err
    } finally {
      isLoading.value = false
    }
  }
  
  const createUser = async (userData: UserFormData) => {
    try {
      const response = await userApi.createUser(userData)
      users.value.push(response.data)
      useNotification().success('用户创建成功')
      return response.data
    } catch (err: any) {
      useNotification().error('用户创建失败')
      throw err
    }
  }
  
  const updateUser = async (id: number, userData: Partial<UserFormData>) => {
    try {
      const response = await userApi.updateUser(id, userData)
      const index = users.value.findIndex(user => user.id === id)
      if (index !== -1) {
        users.value[index] = { ...users.value[index], ...response.data }
      }
      if (currentUser.value?.id === id) {
        currentUser.value = { ...currentUser.value, ...response.data }
      }
      useNotification().success('用户更新成功')
      return response.data
    } catch (err: any) {
      useNotification().error('用户更新失败')
      throw err
    }
  }
  
  const deleteUser = async (id: number) => {
    try {
      await userApi.deleteUser(id)
      users.value = users.value.filter(user => user.id !== id)
      useNotification().success('用户删除成功')
    } catch (err: any) {
      useNotification().error('用户删除失败')
      throw err
    }
  }
  
  // 重置状态
  const reset = () => {
    users.value = []
    currentUser.value = null
    error.value = null
  }
  
  return {
    // State
    users,
    currentUser,
    isLoading,
    error,
    
    // Getters
    adminUsers,
    totalUsers,
    getUserById,
    
    // Actions
    fetchUsers,
    fetchUserById,
    createUser,
    updateUser,
    deleteUser,
    reset
  }
})
```

### 3.4 API 层规范

```typescript
// features/user/api/user-api.ts
import axios from 'axios'
import type { 
  User, 
  UserFormData, 
  UserQueryParams, 
  UserListResponse 
} from '../types/user.types'

// 创建实例（支持拦截器配置）
const userApi = axios.create({
  baseURL: '/api/v1/users',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器
userApi.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => Promise.reject(error)
)

// 响应拦截器
userApi.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // 处理未授权
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export const userApi = {
  // 获取用户列表
  async getUsers(params?: UserQueryParams) {
    return userApi.get<UserListResponse>('/', { params })
  },
  
  // 获取单个用户
  async getUserById(id: number) {
    return userApi.get<User>(`/${id}`)
  },
  
  // 创建用户
  async createUser(data: UserFormData) {
    return userApi.post<User>('/', data)
  },
  
  // 更新用户
  async updateUser(id: number, data: Partial<UserFormData>) {
    return userApi.patch<User>(`/${id}`, data)
  },
  
  // 删除用户
  async deleteUser(id: number) {
    return userApi.delete(`/${id}`)
  },
  
  // 批量操作
  async batchDelete(ids: number[]) {
    return userApi.post('/batch-delete', { ids })
  }
}

// 类型导出文件
// features/user/api/types.ts
export type { 
  User, 
  UserFormData, 
  UserQueryParams, 
  UserListResponse 
} from '../types/user.types'
```

### 3.5 Composable 规范

```typescript
// features/user/composables/useUser.ts
import { ref, computed } from 'vue'
import { useUserStore } from '../stores/userStore'
import type { UserFormData, UserQueryParams } from '../types/user.types'

export function useUser() {
  const userStore = useUserStore()
  
  // 本地状态
  const searchKeyword = ref('')
  const selectedRole = ref<string | null>(null)
  
  // 计算属性
  const filteredUsers = computed(() => {
    let filtered = userStore.users
    
    if (searchKeyword.value) {
      const keyword = searchKeyword.value.toLowerCase()
      filtered = filtered.filter(user => 
        user.username.toLowerCase().includes(keyword) ||
        user.email.toLowerCase().includes(keyword)
      )
    }
    
    if (selectedRole.value) {
      filtered = filtered.filter(user => user.role === selectedRole.value)
    }
    
    return filtered
  })
  
  // 方法
  const loadUsers = async (params?: UserQueryParams) => {
    return await userStore.fetchUsers(params)
  }
  
  const createNewUser = async (userData: UserFormData) => {
    return await userStore.createUser(userData)
  }
  
  const updateUserById = async (id: number, userData: Partial<UserFormData>) => {
    return await userStore.updateUser(id, userData)
  }
  
  const deleteUserById = async (id: number) => {
    return await userStore.deleteUser(id)
  }
  
  const resetFilters = () => {
    searchKeyword.value = ''
    selectedRole.value = null
  }
  
  return {
    // 状态
    users: userStore.users,
    currentUser: userStore.currentUser,
    isLoading: userStore.isLoading,
    error: userStore.error,
    searchKeyword,
    selectedRole,
    
    // 计算属性
    filteredUsers,
    adminUsers: userStore.adminUsers,
    totalUsers: userStore.totalUsers,
    
    // 方法
    loadUsers,
    createNewUser,
    updateUserById,
    deleteUserById,
    resetFilters,
    getUserById: userStore.getUserById
  }
}
```

### 3.6 模块入口文件

```typescript
// features/user/index.ts
export { default as UserAvatar } from './components/UserAvatar.vue'
export { default as UserList } from './components/UserList.vue'
export { default as UserForm } from './components/UserForm.vue'

export { useUserStore } from './stores/userStore'
export { useUser } from './composables/useUser'

export { userApi } from './api/user-api'

export type {
  User,
  UserRole,
  UserFormData,
  UserQueryParams
} from './types/user.types'

export * from './constants/user.constants'
export * from './utils/user-helpers'
```

## 四、样式规范

### 4.1 SCSS 架构

```scss
// shared/styles/
├── _variables.scss     # 设计变量
├── _mixins.scss       # 混合宏
├── _functions.scss    # 函数
├── _reset.scss        # 重置样式
├── _base.scss         # 基础样式
├── _utilities.scss    # 工具类
└── main.scss          # 主入口文件
```

### 4.2 CSS 变量定义

```scss
// _variables.scss
:root {
  // 颜色系统
  --color-primary: #409eff;
  --color-primary-light: #79bbff;
  --color-primary-dark: #337ecc;
  --color-success: #67c23a;
  --color-warning: #e6a23c;
  --color-error: #f56c6c;
  --color-info: #909399;
  
  // 文字颜色
  --color-text-primary: #303133;
  --color-text-regular: #606266;
  --color-text-secondary: #909399;
  --color-text-placeholder: #c0c4cc;
  
  // 边框颜色
  --color-border: #dcdfe6;
  --color-border-light: #e4e7ed;
  --color-border-lighter: #ebeef5;
  
  // 背景颜色
  --color-bg: #f5f7fa;
  --color-bg-card: #ffffff;
  --color-bg-overlay: rgba(0, 0, 0, 0.5);
  
  // 字体
  --font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  --font-size-base: 14px;
  --font-size-small: 12px;
  --font-size-large: 16px;
  
  // 间距
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 12px;
  --spacing-lg: 16px;
  --spacing-xl: 24px;
  
  // 边框半径
  --border-radius-base: 4px;
  --border-radius-small: 2px;
  --border-radius-round: 20px;
  --border-radius-circle: 50%;
  
  // 阴影
  --box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  --box-shadow-light: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  
  // 过渡
  --transition-duration: 0.3s;
  --transition-function: ease-in-out;
  
  // z-index 层级
  --z-index-dropdown: 1000;
  --z-index-sticky: 1020;
  --z-index-fixed: 1030;
  --z-index-modal-backdrop: 1040;
  --z-index-modal: 1050;
  --z-index-popover: 1060;
  --z-index-tooltip: 1070;
}
```

### 4.3 组件样式示例

```scss
// 用户卡片组件样式
.user-card {
  position: relative;
  padding: var(--spacing-lg);
  background: var(--color-bg-card);
  border: 1px solid var(--color-border-light);
  border-radius: var(--border-radius-base);
  transition: all var(--transition-duration) var(--transition-function);
  
  &:hover {
    box-shadow: var(--box-shadow-light);
    transform: translateY(-2px);
  }
  
  &__header {
    display: flex;
    align-items: center;
    margin-bottom: var(--spacing-md);
    
    .avatar {
      width: 40px;
      height: 40px;
      margin-right: var(--spacing-md);
      border-radius: var(--border-radius-circle);
      overflow: hidden;
      
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
    
    .title {
      flex: 1;
      margin: 0;
      font-size: var(--font-size-large);
      font-weight: 600;
      color: var(--color-text-primary);
    }
  }
  
  &__content {
    margin-bottom: var(--spacing-md);
    
    .description {
      margin: 0;
      font-size: var(--font-size-base);
      color: var(--color-text-regular);
      line-height: 1.5;
    }
  }
  
  &__footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: var(--spacing-md);
    border-top: 1px solid var(--color-border-lighter);
    
    .meta {
      font-size: var(--font-size-small);
      color: var(--color-text-secondary);
    }
    
    .actions {
      display: flex;
      gap: var(--spacing-sm);
      
      .btn {
        padding: var(--spacing-xs) var(--spacing-sm);
        font-size: var(--font-size-small);
        
        &--icon {
          width: 28px;
          height: 28px;
          padding: 0;
          border-radius: var(--border-radius-circle);
        }
      }
    }
  }
  
  // 修饰符
  &--compact {
    padding: var(--spacing-md);
    
    .user-card__header {
      margin-bottom: var(--spacing-sm);
    }
  }
  
  &--highlight {
    border-color: var(--color-primary-light);
    background: linear-gradient(135deg, #f0f9ff 0%, #ffffff 100%);
  }
}

// 暗色主题适配
@media (prefers-color-scheme: dark) {
  .user-card {
    background: var(--color-bg-dark);
    border-color: var(--color-border-dark);
    
    &:hover {
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.3);
    }
  }
}

// 响应式设计
@include respond-to('mobile') {
  .user-card {
    &__footer {
      flex-direction: column;
      gap: var(--spacing-md);
      align-items: flex-start;
    }
  }
}
```

## 五、测试规范

### 5.1 组件测试示例

```typescript
// features/user/__tests__/UserForm.spec.ts
import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import UserForm from '../components/UserForm.vue'
import { createTestingPinia } from '@pinia/testing'

describe('UserForm', () => {
  const defaultProps = {
    userId: 1,
    initialData: {
      username: 'testuser',
      email: 'test@example.com',
      role: 'user'
    }
  }
  
  const mountComponent = (props = {}) => {
    return mount(UserForm, {
      global: {
        plugins: [createTestingPinia({
          createSpy: vi.fn
        })]
      },
      props: {
        ...defaultProps,
        ...props
      }
    })
  }
  
  it('正确渲染表单字段', () => {
    const wrapper = mountComponent()
    
    expect(wrapper.find('#username').exists()).toBe(true)
    expect(wrapper.find('#email').exists()).toBe(true)
    expect(wrapper.find('button[type="submit"]').exists()).toBe(true)
  })
  
  it('表单验证失败时显示错误信息', async () => {
    const wrapper = mountComponent({
      initialData: { username: '', email: '' }
    })
    
    await wrapper.find('form').trigger('submit.prevent')
    
    expect(wrapper.find('.error-message').exists()).toBe(true)
    expect(wrapper.find('.is-invalid').exists()).toBe(true)
  })
  
  it('成功提交表单时触发success事件', async () => {
    const wrapper = mountComponent()
    
    // 设置表单数据
    await wrapper.find('#username').setValue('newuser')
    await wrapper.find('#email').setValue('new@example.com')
    
    await wrapper.find('form').trigger('submit.prevent')
    
    expect(wrapper.emitted('success')).toBeTruthy()
  })
  
  it('在编辑模式下显示更新按钮', () => {
    const wrapper = mountComponent({ userId: 1 })
    const button = wrapper.find('button[type="submit"]')
    
    expect(button.text()).toContain('更新')
  })
  
  it('在创建模式下显示创建按钮', () => {
    const wrapper = mountComponent({ userId: undefined })
    const button = wrapper.find('button[type="submit"]')
    
    expect(button.text()).toContain('创建')
  })
})
```

## 六、开发约定

### 6.1 命名规范
- **文件命名**: kebab-case (`user-form.vue`)
- **组件命名**: PascalCase (`UserForm`)
- **组合式函数**: camelCase (`useUser`)
- **Store**: camelCase (`userStore`)
- **常量**: UPPER_SNAKE_CASE (`USER_ROLES`)
- **类型**: PascalCase (`UserFormData`)

### 6.2 导入顺序规范
```typescript
// 1. 外部依赖
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'

// 2. 内部依赖（按层级）
import { userApi } from '../api/user-api'
import type { User } from '../types/user.types'
import { useNotification } from '@/shared/composables/useNotification'

// 3. 本地模块
import { validateEmail } from '../utils/user-helpers'
```

### 6.3 提交规范
```bash
feat(user): 添加用户表单组件
fix(auth): 修复登录验证问题
docs: 更新API文档
style: 调整用户列表样式
refactor(user-store): 重构用户状态管理
test: 添加用户表单测试
chore: 更新依赖包
```

### 6.4 模块间通信规范

```typescript
// 模块间通信示例
// features/user/composables/useUser.ts
import { useNotification } from '@/shared/composables/useNotification'
import { useRouter } from 'vue-router'

export function useUser() {
  const notification = useNotification()
  const router = useRouter()
  
  const handleUserCreated = async (userData: UserFormData) => {
    try {
      await createUser(userData)
      notification.success('用户创建成功')
      router.push('/users')
    } catch (error) {
      notification.error('创建失败')
    }
  }
}
```

## 七、最佳实践

### 7.1 性能优化
1. **组件懒加载**
```typescript
const UserList = defineAsyncComponent(() =>
  import('./components/UserList.vue')
)
```

2. **状态管理优化**
```typescript
// 使用 computed 缓存计算结果
const activeUsers = computed(() => 
  users.value.filter(user => user.status === 'active')
)

// 避免不必要的响应式
const staticConfig = {
  pageSize: 20,
  maxRetry: 3
}
```

### 7.2 错误处理
```typescript
// 统一错误处理
export function useErrorHandler() {
  const handleApiError = (error: any) => {
    if (axios.isAxiosError(error)) {
      switch (error.response?.status) {
        case 401:
          // 处理未授权
          break
        case 404:
          // 处理资源不存在
          break
        case 500:
          // 处理服务器错误
          break
        default:
          // 处理其他错误
      }
    }
    console.error('API Error:', error)
  }
  
  return { handleApiError }
}
```

### 7.3 代码复用
```typescript
// 基础表单逻辑复用
export function useForm<T extends Record<string, any>>(initialData: T) {
  const formData = reactive<T>({ ...initialData })
  const errors = reactive<Record<string, string>>({})
  const isSubmitting = ref(false)
  
  const validate = (rules: ValidationRules) => {
    // 验证逻辑
  }
  
  const reset = () => {
    Object.assign(formData, initialData)
    Object.keys(errors).forEach(key => delete errors[key])
  }
  
  return {
    formData,
    errors,
    isSubmitting,
    validate,
    reset
  }
}
```

## 总结

这种架构模式的核心优势在于：

1. **关注点分离**：每个功能模块独立完整，便于理解和维护
2. **团队协作**：不同团队可以并行开发不同功能模块
3. **代码复用**：模块可以轻松移植到其他项目
4. **可测试性**：模块边界清晰，便于编写单元测试
5. **渐进式开发**：可以逐步添加新功能模块而不影响现有代码

通过遵循这些规范和最佳实践，可以建立一个可维护、可扩展且高效的Vue 3项目架构。