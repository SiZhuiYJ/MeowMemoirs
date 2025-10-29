# Vue 3 + TypeScript 模块化前端项目架构文档

## 项目概述

### 技术栈

- **框架**: Vue 3 + Composition API
- **语言**: TypeScript
- **状态管理**: Pinia (推荐) 或 Vuex
- **构建工具**: Vite
- **路由**: Vue Router 4
- **样式**: 可选 Tailwind CSS / SCSS
- **测试**: Vitest + Vue Test Utils

### 架构特点

- 🏗️ **模块化设计** - 基于功能的功能模块架构
- 🎯 **类型安全** - 完整的 TypeScript 支持
- 🔧 **可维护性** - 清晰的代码组织和分层
- 🧪 **可测试性** - 模块化的测试友好设计
- 🚀 **开发体验** - 优秀的开发工具和热重载
- 📦 **代码复用** - 高度的组件和逻辑复用

## 完整目录结构

```

project-root/
├── public/ # 静态资源目录
│ ├── favicon.ico
│ ├── logo.png
│ └── manifest.json
├── src/ # 源代码目录
│ ├── assets/ # 静态资源（经过构建处理）
│ │ ├── images/ # 图片资源
│ │ ├── styles/ # 全局样式
│ │ └── fonts/ # 字体文件
│ ├── components/ # 全局共享组件
│ ├── composables/ # 全局共享组合式函数
│ ├── config/ # 应用配置文件
│ ├── features/ # 功能模块（核心业务代码）
│ │ ├── auth/ # 认证功能模块
│ │ ├── user/ # 用户功能模块
│ │ ├── product/ # 产品功能模块
│ │ ├── order/ # 订单功能模块
│ │ └── dashboard/ # 仪表板功能模块
│ ├── layouts/ # 页面布局组件
│ ├── lib/ # 第三方库配置
│ ├── pages/ # 页面组件
│ ├── plugins/ # Vue 插件
│ ├── router/ # 路由配置
│ ├── services/ # 应用服务层
│ ├── stores/ # 全局状态管理
│ ├── test/ # 测试相关文件
│ ├── types/ # 全局类型定义
│ ├── utils/ # 工具函数
│ ├── App.vue # 根组件
│ └── main.ts # 应用入口
├── tests/ # 测试目录
├── docs/ # 项目文档
├── .env # 环境变量
├── .env.development # 开发环境变量
├── .env.production # 生产环境变量
├── package.json
├── tsconfig.json # TypeScript 配置
├── vite.config.ts # Vite 构建配置
├── vitest.config.ts # 测试配置
└── README.md

```

## 详细目录说明

### 1. 根目录核心结构

#### `src/assets/` - 静态资源

**用途**: 经过构建处理的静态资源文件

```

src/assets/
├── images/ # 图片资源
│ ├── icons/ # 图标
│ ├── logos/ # Logo
│ └── backgrounds/ # 背景图片
├── styles/ # 全局样式
│ ├── base.scss # 基础样式
│ ├── variables.scss # SCSS 变量
│ ├── mixins.scss # SCSS Mixins
│ └── global.css # 全局样式
└── fonts/ # 字体文件
├── inter/ # Inter 字体
└── material-icons/ # Material Icons

```

#### `src/components/` - 全局共享组件

**用途**: 整个应用复用的 UI 组件，遵循原子设计原则

```

src/components/
├── ui/ # 基础 UI 组件（原子级）
│ ├── BaseButton/
│ │ ├── BaseButton.vue
│ │ ├── BaseButton.stories.ts # Storybook 故事
│ │ └── index.ts
│ ├── BaseInput/
│ │ ├── BaseInput.vue
│ │ └── index.ts
│ ├── BaseModal/
│ │ ├── BaseModal.vue
│ │ └── index.ts
│ └── BaseTable/
│ ├── BaseTable.vue
│ └── index.ts
├── forms/ # 表单组件（分子级）
│ ├── FormInput/
│ ├── FormSelect/
│ └── FormDatePicker/
├── layout/ # 布局组件
│ ├── AppHeader/
│ ├── AppSidebar/
│ └── AppFooter/
├── feedback/ # 反馈组件
│ ├── LoadingSpinner/
│ ├── ErrorMessage/
│ └── SuccessMessage/
└── index.ts # 全局组件注册

```

**组件注册示例**:

```typescript
// src/components/index.ts
import BaseButton from "./ui/BaseButton/BaseButton.vue";
import BaseInput from "./ui/BaseInput/BaseInput.vue";

export { BaseButton, BaseInput };

// 自动全局注册（可选）
export const registerGlobalComponents = (app: any) => {
  app.component("BaseButton", BaseButton);
  app.component("BaseInput", BaseInput);
};
```

#### `src/composables/` - 全局共享组合式函数

**用途**: 跨功能复用的业务逻辑封装

```
src/composables/
├── api/                        # API 相关
│   ├── useApi.ts               # 通用 API 调用
│   └── useFetch.ts             # 数据获取逻辑
├── state/                      # 状态管理
│   ├── useLocalStorage.ts      # 本地存储
│   ├── useSessionStorage.ts    # 会话存储
│   └── useGlobalState.ts       # 全局状态
├── ui/                         # UI 相关
│   ├── useTheme.ts             # 主题切换
│   ├── useModal.ts             # 模态框管理
│   └── useToast.ts             # 消息提示
├── utilities/                  # 工具类
│   ├── useDebounce.ts          # 防抖
│   ├── useThrottle.ts          # 节流
│   └── useClipboard.ts         # 剪贴板
└── index.ts                    # 统一导出
```

**组合式函数示例**:

```typescript
// src/composables/api/useApi.ts
import { ref } from "vue";

export const useApi = <T>() => {
  const data = ref<T | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const execute = async (url: string, options?: RequestInit) => {
    loading.value = true;
    error.value = null;

    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      data.value = await response.json();
    } catch (err) {
      error.value = err instanceof Error ? err.message : "An error occurred";
    } finally {
      loading.value = false;
    }
  };

  return {
    data,
    loading,
    error,
    execute,
  };
};
```

#### `src/config/` - 应用配置

**用途**: 应用程序的配置文件和常量定义

```
src/config/
├── app.ts                      # 应用基础配置
├── api.ts                      # API 端点配置
├── theme.ts                    # 主题配置
├── constants.ts                # 常量定义
├── routes.ts                   # 路由配置
└── environment.ts              # 环境配置
```

**配置示例**:

```typescript
// src/config/app.ts
export const appConfig = {
  name: "My App",
  version: "1.0.0",
  locale: "zh-CN",
  supportedLocales: ["zh-CN", "en-US"],
  apiTimeout: 10000,
  features: {
    darkMode: true,
    pwa: true,
    analytics: false,
  },
};

// src/config/api.ts
export const apiConfig = {
  baseURL: import.meta.env.VITE_API_BASE_URL || "https://api.example.com",
  endpoints: {
    auth: {
      login: "/auth/login",
      register: "/auth/register",
      logout: "/auth/logout",
    },
    user: {
      profile: "/user/profile",
      preferences: "/user/preferences",
    },
  },
  timeout: 10000,
};
```

### 2. 功能模块结构 (`features/`)

**核心概念**: 每个功能模块都是一个自包含的业务单元，包含该功能的所有相关代码。

#### 功能模块模板结构

```
src/features/
├── {feature-name}/              # 功能模块目录
│   ├── api/                     # 功能API调用
│   ├── components/              # 功能专用组件
│   ├── composables/             # 功能专用组合式函数
│   ├── stores/                  # 功能状态管理
│   ├── types/                   # 功能类型定义
│   ├── utils/                   # 功能工具函数
│   ├── constants/               # 功能常量
│   ├── __tests__/               # 功能测试文件
│   └── index.ts                 # 模块入口（公共API）
```

#### 认证功能模块示例 (`auth`)

```
src/features/auth/
├── api/
│   ├── authApi.ts               # 认证API
│   ├── userApi.ts               # 用户API
│   └── index.ts
├── components/
│   ├── LoginForm/
│   │   ├── LoginForm.vue
│   │   ├── LoginForm.stories.ts
│   │   └── index.ts
│   ├── RegisterForm/
│   │   ├── RegisterForm.vue
│   │   └── index.ts
│   ├── UserProfile/
│   │   ├── UserProfile.vue
│   │   └── index.ts
│   └── index.ts
├── composables/
│   ├── useAuth.ts               # 认证状态逻辑
│   ├── useUserPermissions.ts    # 权限检查
│   ├── useUserProfile.ts        # 用户资料
│   └── index.ts
├── stores/
│   ├── authStore.ts             # 认证状态
│   ├── userStore.ts             # 用户状态
│   └── index.ts
├── types/
│   ├── auth.types.ts            # 认证类型
│   ├── user.types.ts            # 用户类型
│   └── index.ts
├── utils/
│   ├── authHelpers.ts           # 认证工具函数
│   ├── permissionUtils.ts       # 权限工具函数
│   └── index.ts
├── constants/
│   ├── auth.constants.ts        # 认证常量
│   └── index.ts
├── __tests__/                   # 测试目录
│   ├── authStore.spec.ts
│   ├── useAuth.spec.ts
│   └── LoginForm.spec.ts
└── index.ts                     # 模块入口
```

#### 功能模块内部详细实现

##### `features/auth/api/` - API 层

```typescript
// features/auth/api/authApi.ts
import { apiClient } from "@/services/api/httpClient";
import type { LoginData, RegisterData, AuthResponse } from "../types";

export const authApi = {
  async login(credentials: LoginData): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(
      "/auth/login",
      credentials
    );
    return response.data;
  },

  async register(userData: RegisterData): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(
      "/auth/register",
      userData
    );
    return response.data;
  },

  async logout(): Promise<void> {
    await apiClient.post("/auth/logout");
  },

  async refreshToken(): Promise<{ token: string }> {
    const response = await apiClient.post<{ token: string }>("/auth/refresh");
    return response.data;
  },
};

// features/auth/api/index.ts
export { authApi } from "./authApi";
```

##### `features/auth/composables/` - 业务逻辑层

```typescript
// features/auth/composables/useAuth.ts
import { ref, computed } from "vue";
import { authApi } from "../api";
import { useAuthStore } from "../stores";
import type { LoginData, RegisterData, User } from "../types";

export const useAuth = () => {
  const authStore = useAuthStore();
  const loading = ref(false);
  const error = ref<string | null>(null);

  const user = computed(() => authStore.user);
  const isAuthenticated = computed(() => authStore.isAuthenticated);

  const login = async (credentials: LoginData): Promise<void> => {
    loading.value = true;
    error.value = null;

    try {
      const response = await authApi.login(credentials);
      authStore.setUser(response.user);
      authStore.setToken(response.token);
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Login failed";
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const register = async (userData: RegisterData): Promise<void> => {
    loading.value = true;
    error.value = null;

    try {
      const response = await authApi.register(userData);
      authStore.setUser(response.user);
      authStore.setToken(response.token);
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Registration failed";
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await authApi.logout();
    } finally {
      authStore.clearAuth();
    }
  };

  return {
    // State
    user,
    isAuthenticated,
    loading: computed(() => loading.value),
    error: computed(() => error.value),

    // Actions
    login,
    register,
    logout,
  };
};

// features/auth/composables/index.ts
export { useAuth } from "./useAuth";
export { useUserPermissions } from "./useUserPermissions";
```

##### `features/auth/stores/` - 状态管理层

```typescript
// features/auth/stores/authStore.ts
import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { User } from "../types";

export const useAuthStore = defineStore("auth", () => {
  // State
  const user = ref<User | null>(null);
  const token = ref<string | null>(null);

  // Getters
  const isAuthenticated = computed(() => !!token.value);
  const userId = computed(() => user.value?.id || null);
  const userRole = computed(() => user.value?.role || null);

  // Actions
  const setUser = (newUser: User) => {
    user.value = newUser;
  };

  const setToken = (newToken: string) => {
    token.value = newToken;
    // 存储到 localStorage
    localStorage.setItem("auth_token", newToken);
  };

  const clearAuth = () => {
    user.value = null;
    token.value = null;
    localStorage.removeItem("auth_token");
  };

  // 初始化时从 localStorage 恢复 token
  const initialize = () => {
    const savedToken = localStorage.getItem("auth_token");
    if (savedToken) {
      token.value = savedToken;
      // 这里可以添加验证 token 有效性的逻辑
    }
  };

  return {
    // State
    user,
    token,

    // Getters
    isAuthenticated,
    userId,
    userRole,

    // Actions
    setUser,
    setToken,
    clearAuth,
    initialize,
  };
});

// features/auth/stores/index.ts
export { useAuthStore } from "./authStore";
```

##### `features/auth/types/` - 类型定义层

```typescript
// features/auth/types/auth.types.ts
export interface User {
  id: number;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export type UserRole = "admin" | "user" | "moderator";

export interface LoginData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  agreeToTerms: boolean;
}

export interface AuthResponse {
  user: User;
  token: string;
  expiresIn: number;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

// features/auth/types/index.ts
export type {
  User,
  UserRole,
  LoginData,
  RegisterData,
  AuthResponse,
  AuthState,
} from "./auth.types";
```

##### `features/auth/index.ts` - 模块入口

```typescript
// features/auth/index.ts
// 公共 API - 只导出允许外部访问的内容

// Components
export { default as LoginForm } from "./components/LoginForm/LoginForm.vue";
export { default as RegisterForm } from "./components/RegisterForm/RegisterForm.vue";
export { default as UserProfile } from "./components/UserProfile/UserProfile.vue";

// Composables
export { useAuth } from "./composables/useAuth";
export { useUserPermissions } from "./composables/useUserPermissions";

// Stores
export { useAuthStore } from "./stores/authStore";

// Types
export type {
  User,
  UserRole,
  LoginData,
  RegisterData,
  AuthResponse,
} from "./types";
```

### 3. 其他重要目录

#### `src/services/` - 应用服务层

**用途**: 共享的应用服务和数据提供者

```
src/services/
├── api/                          # API 服务
│   ├── httpClient.ts             # HTTP 客户端
│   ├── interceptors.ts           # 请求拦截器
│   └── errorHandler.ts           # 错误处理
├── storage/                      # 存储服务
│   ├── localStorage.ts
│   ├── sessionStorage.ts
│   └── indexedDB.ts
├── auth/                         # 认证服务
│   ├── tokenService.ts
│   └── permissionService.ts
├── notification/                 # 通知服务
│   ├── toastService.ts
│   └── pushService.ts
└── index.ts
```

**服务示例**:

```typescript
// src/services/api/httpClient.ts
import axios from "axios";
import { apiConfig } from "@/config/api";

export const httpClient = axios.create({
  baseURL: apiConfig.baseURL,
  timeout: apiConfig.timeout,
  headers: {
    "Content-Type": "application/json",
  },
});

// 请求拦截器
httpClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 响应拦截器
httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // 处理未授权错误
      localStorage.removeItem("auth_token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);
```

#### `src/stores/` - 全局状态管理

**用途**: 全局状态存储，管理跨功能的状态

```
src/stores/
├── appStore.ts                   # 应用全局状态
├── uiStore.ts                    # UI 状态管理
├── notificationStore.ts          # 通知状态
└── index.ts
```

**全局 Store 示例**:

```typescript
// src/stores/appStore.ts
import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useAppStore = defineStore("app", () => {
  // State
  const isLoading = ref(false);
  const pageTitle = ref("");
  const sidebarCollapsed = ref(false);
  const currentTheme = ref<"light" | "dark">("light");

  // Getters
  const appVersion = computed(() => import.meta.env.VITE_APP_VERSION);

  // Actions
  const setLoading = (loading: boolean) => {
    isLoading.value = loading;
  };

  const setPageTitle = (title: string) => {
    pageTitle.value = title;
    document.title = `${title} - My App`;
  };

  const toggleSidebar = () => {
    sidebarCollapsed.value = !sidebarCollapsed.value;
  };

  const toggleTheme = () => {
    currentTheme.value = currentTheme.value === "light" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", currentTheme.value);
  };

  return {
    // State
    isLoading,
    pageTitle,
    sidebarCollapsed,
    currentTheme,

    // Getters
    appVersion,

    // Actions
    setLoading,
    setPageTitle,
    toggleSidebar,
    toggleTheme,
  };
});
```

#### `src/types/` - 全局类型定义

**用途**: 共享的 TypeScript 类型定义

```
src/types/
├── global.d.ts                   # 全局类型声明
├── api.types.ts                  # API 响应类型
├── common.types.ts               # 通用类型
├── vue.d.ts                      # Vue 类型扩展
└── index.ts
```

**类型定义示例**:

```typescript
// src/types/api.types.ts
export interface ApiResponse<T = any> {
  data: T;
  message: string;
  success: boolean;
  timestamp: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiError {
  code: string;
  message: string;
  details?: any;
}

// src/types/vue.d.ts
declare module "vue" {
  interface ComponentCustomProperties {
    $filters: {
      formatDate: (date: string | Date) => string;
      formatCurrency: (amount: number) => string;
    };
  }
}
```

#### `src/utils/` - 工具函数

**用途**: 共享的 utility 函数

```
src/utils/
├── helpers/                      # 辅助函数
│   ├── date.ts                   # 日期处理
│   ├── string.ts                 # 字符串处理
│   ├── number.ts                 # 数字处理
│   ├── validation.ts             # 验证函数
│   └── object.ts                 # 对象处理
├── constants/                    # 常量
│   ├── routes.ts                 # 路由常量
│   ├── app.ts                    # 应用常量
│   └── regex.ts                  # 正则表达式
├── formatters/                   # 格式化函数
│   ├── dateFormatter.ts
│   ├── currencyFormatter.ts
│   └── numberFormatter.ts
└── index.ts
```

**工具函数示例**:

```typescript
// src/utils/helpers/date.ts
import { format, formatDistanceToNow, parseISO } from "date-fns";

export const formatDate = (
  date: string | Date,
  formatStr = "yyyy-MM-dd"
): string => {
  if (!date) return "";
  const dateObj = typeof date === "string" ? parseISO(date) : date;
  return format(dateObj, formatStr);
};

export const timeAgo = (date: string | Date): string => {
  if (!date) return "";
  const dateObj = typeof date === "string" ? parseISO(date) : date;
  return formatDistanceToNow(dateObj, { addSuffix: true });
};

export const isValidDate = (date: any): boolean => {
  return date instanceof Date && !isNaN(date.getTime());
};
```

## 开发指南

### 1. 创建新功能模块

**步骤 1: 创建模块结构**

```bash
mkdir -p src/features/new-feature/{api,components,composables,stores,types,utils,constants,__tests__}
```

**步骤 2: 实现模块核心文件**

```typescript
// features/new-feature/index.ts
// 导出公共 API
export { default as NewComponent } from "./components/NewComponent/NewComponent.vue";
export { useNewFeature } from "./composables/useNewFeature";
export { useNewFeatureStore } from "./stores/newFeatureStore";
export type { NewFeatureType } from "./types";
```

**步骤 3: 在应用中使用**

```typescript
// 在页面或组件中
import { useNewFeature, NewComponent } from "@/features/new-feature";
```

### 2. Hook 存放规则

#### 功能特定的 Hook

**位置**: `features/[feature-name]/composables/`

- 只在特定功能模块内部使用
- 包含特定业务逻辑
- 命名以 `use` 开头，驼峰命名

```typescript
// ✅ 正确 - 功能特定的 Hook
features / auth / composables / useAuth.ts;
features / user / composables / useUserProfile.ts;
features / cart / composables / useCart.ts;

// ❌ 避免 - 过于通用的命名
features / auth / composables / useApi.ts; // 应该放在全局 composables
```

#### 全局共享的 Hook

**位置**: `src/composables/`

- 在多个功能或整个应用中复用
- 与具体业务无关的工具性逻辑
- 提供通用的数据处理能力

```typescript
// ✅ 正确 - 全局共享的 Hook
src / composables / useApi.ts;
src / composables / useLocalStorage.ts;
src / composables / useDebounce.ts;

// ❌ 避免 - 包含业务逻辑
src / composables / useUserAuth.ts; // 应该放在 features/auth/composables
```

### 3. 组件开发规范

#### 组件命名

```typescript
// 全局基础组件
BaseButton.vue;
BaseInput.vue;
BaseModal.vue;

// 功能特定组件
UserProfile.vue;
ProductCard.vue;
OrderSummary.vue;

// 组合组件
UserProfileEditor.vue;
ProductListWithFilter.vue;
```

#### 组件 Props 定义

```typescript
<script setup lang="ts">
interface Props {
  // 必填属性
  title: string
  items: Array<any>

  // 可选属性
  loading?: boolean
  maxItems?: number

  // 复杂属性
  config?: {
    sortable: boolean
    filterable: boolean
  }
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  maxItems: 10,
  config: () => ({
    sortable: true,
    filterable: false
  })
})
</script>
```

### 4. 测试策略

#### 单元测试结构

```
src/features/auth/__tests__/
├── composables/
│   ├── useAuth.spec.ts
│   └── useUserPermissions.spec.ts
├── stores/
│   └── authStore.spec.ts
└── components/
    └── LoginForm.spec.ts
```

#### 测试示例

```typescript
// features/auth/__tests__/useAuth.spec.ts
import { describe, it, expect, vi } from "vitest";
import { useAuth } from "../composables/useAuth";
import { useAuthStore } from "../stores/authStore";

// Mock 依赖
vi.mock("../stores/authStore");
vi.mock("../api/authApi");

describe("useAuth", () => {
  it("should login successfully", async () => {
    const { login, loading, error } = useAuth();

    expect(loading.value).toBe(false);

    const loginPromise = login({
      email: "test@example.com",
      password: "password",
    });

    expect(loading.value).toBe(true);

    await loginPromise;

    expect(loading.value).toBe(false);
    expect(error.value).toBeNull();
  });
});
```

## 最佳实践

### 1. 代码组织原则

#### 单一职责原则

```typescript
// ✅ 正确 - 每个文件只负责一个明确的功能
// useAuth.ts - 只处理认证逻辑
// authStore.ts - 只管理认证状态
// authApi.ts - 只处理认证 API 调用

// ❌ 避免 - 一个文件包含多个不相关的功能
// auth.ts - 包含认证逻辑、状态管理、API 调用
```

#### 依赖方向规则

```typescript
// ✅ 正确 - 依赖方向从具体到抽象
// components/ → composables/ → stores/ → api/ → types/

// ❌ 避免 - 循环依赖
// components/ ←→ composables/
```

### 2. 性能优化建议

#### 组件懒加载

```typescript
// 路由懒加载
const LoginPage = () => import("@/pages/LoginPage.vue");
const DashboardPage = () => import("@/pages/DashboardPage.vue");

// 组件懒加载
const HeavyComponent = defineAsyncComponent(
  () => import("@/components/HeavyComponent.vue")
);
```

#### 组合式函数优化

```typescript
// 使用 computed 和 watchEffect 优化响应式
const useOptimizedComposable = () => {
  const data = ref([]);
  const searchQuery = ref("");

  // ✅ 使用 computed 缓存计算结果
  const filteredData = computed(() =>
    data.value.filter((item) => item.name.includes(searchQuery.value))
  );

  // ✅ 使用 watchEffect 自动跟踪依赖
  watchEffect(() => {
    if (searchQuery.value) {
      // 执行搜索逻辑
    }
  });

  return { data, searchQuery, filteredData };
};
```

### 3. 错误处理策略

#### 全局错误处理

```typescript
// src/utils/errorHandler.ts
export const handleError = (error: unknown, context?: string) => {
  console.error(`[Error${context ? ` in ${context}` : ""}]`, error);

  if (error instanceof Error) {
    // 发送到错误监控服务
    sendToErrorMonitoring(error);

    // 显示用户友好的错误消息
    showErrorMessage(getUserFriendlyMessage(error));
  }
};

// 在组合式函数中使用
const useSafeComposable = () => {
  const execute = async () => {
    try {
      // 业务逻辑
    } catch (error) {
      handleError(error, "useSafeComposable");
    }
  };

  return { execute };
};
```

## 项目配置

### Vite 配置示例

```typescript
// vite.config.ts
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
      "@components": resolve(__dirname, "src/components"),
      "@composables": resolve(__dirname, "src/composables"),
      "@features": resolve(__dirname, "src/features"),
      "@stores": resolve(__dirname, "src/stores"),
      "@types": resolve(__dirname, "src/types"),
      "@utils": resolve(__dirname, "src/utils"),
    },
  },
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: "dist",
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["vue", "vue-router", "pinia"],
          ui: ["element-plus", "ant-design-vue"],
        },
      },
    },
  },
});
```

### TypeScript 配置

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "preserve",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@components/*": ["src/components/*"],
      "@composables/*": ["src/composables/*"],
      "@features/*": ["src/features/*"],
      "@stores/*": ["src/stores/*"],
      "@types/*": ["src/types/*"],
      "@utils/*": ["src/utils/*"]
    }
  },
  "include": ["src/**/*.ts", "src/**/*.d.ts", "src/**/*.tsx", "src/**/*.vue"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

## 总结

这个项目架构提供了：

### 🎯 核心优势

1. **模块化开发** - 功能模块独立，便于团队分工协作
2. **类型安全** - 完整的 TypeScript 支持，提高代码质量
3. **可维护性** - 清晰的代码组织和分层，便于维护
4. **可测试性** - 模块化的测试友好设计
5. **代码复用** - 高度的组件和逻辑复用
6. **可扩展性** - 易于添加新功能和扩展现有功能

### 🚀 适用场景

- 中大型企业级应用
- 需要长期维护的项目
- 团队协作开发
- 需要高度可测试性的项目
- 复杂的状态管理需求

### 📈 扩展建议

- 考虑集成微前端架构
- 添加性能监控和错误追踪
- 实现完整的 CI/CD 流水线
- 添加代码生成工具提高开发效率

这种架构经过实践验证，能够有效管理前端项目的复杂度，提高开发效率和代码质量，是构建现代化 Vue.js 应用的理想选择。

```

这个详细的 Markdown 文档提供了完整的前端项目架构说明，包括目录结构、代码示例、最佳实践和配置指南，可以作为团队开发参考文档使用。
```
