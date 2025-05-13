<script setup>
import { onMounted, ref, getCurrentInstance, onUnmounted, reactive, watchEffect } from 'vue'
import { useDataStore, useSiteStore } from '@/stores/index'
import KoiUploadImage from '@/components/KoiUpload/Image.vue'
import useApiUrl from '@/plugins/useApiUrl'
const { getUserImgUrl } = useApiUrl()

const { proxy } = getCurrentInstance()

const userProfile = ref({})
const userDetails = ref({})
const userimg = ref('')
const userData = ref({})

// el-card标签选中name
const activeName = ref("first");
let pwdForm = ref({
    password: "",
    newPassword: "",
    confirmPassword: ""
});
/** 表单规则 */
const mineRules = reactive({
    rainbowId: [{ required: true, message: "请输入登录名称", trigger: "blur" }],
    userPhone: [{ required: true, message: "请输入手机号码", trigger: "blur" }]
});

/** 表单规则 */
const pwdRules = reactive({
    password: [{ required: true, message: "请输入旧密码", trigger: "change" }],
    newPassword: [{ required: true, message: "请输入新密码", trigger: "change" }],
    confirmPassword: [{ required: true, message: "请输入确认密码", trigger: "change" }]
});

onMounted(async () => {
    console.log(useDataStore().dataStore.userInfo.rainbowId)
    const res = await proxy.$api.getUserInfo(useDataStore().dataStore.userInfo.rainbowId)
    const user = await proxy.$api.getUserDetails(useDataStore().dataStore.userInfo.rainbowId)
    userProfile.value = res.userProfile
    userDetails.value = user.allusers
    userData.value = {
        ...userProfile.value,
        ...userDetails.value,
        userimg: getUserImgUrl({ RainbowID: userDetails.value.rainbowId, imageName: userDetails.value.userImg })
    }
})
</script>

<template>
    <!-- 过渡动画 -->
    <transition name="zoom-fade">
        <div class="container">
            <el-row :gutter="20">
                <el-col :span="6" :xs="24">
                    <el-card>
                        <div class="text-13px text-#303133 dark:text-#E5EAF3">
                            <div class="flex flex-justify-center">
                                <KoiUploadImage v-model:imageUrl="userData.userimg">
                                    <template #content>
                                        <el-icon>
                                            <Avatar />
                                        </el-icon>
                                        <span>请上传头像</span>
                                    </template>
                                </KoiUploadImage>
                            </div>
                            <div class="flex flex-justify-between flex-wrap mt-20px p-y-12px">
                                <div class="flex flex-items-center">
                                    <el-icon size="15">
                                        <UserFilled />
                                    </el-icon>
                                    <div class="p-l-2px">登录名称</div>
                                </div>
                                <div v-text="userData.rainbowId"></div>
                            </div>
                            <div class="flex flex-justify-between flex-wrap p-y-12px">
                                <div class="flex flex-items-center">
                                    <el-icon size="15">
                                        <User />
                                    </el-icon>
                                    <div class="p-l-2px">用户名称</div>
                                </div>
                                <div v-text="userData.userName"></div>
                            </div>
                            <div class="flex flex-justify-between flex-wrap p-y-12px">
                                <div class="flex flex-items-center">
                                    <el-icon size="15">
                                        <Iphone />
                                    </el-icon>
                                    <div class="p-l-2px">手机号码</div>
                                </div>
                                <div v-text="userData.userPhone"></div>
                            </div>
                            <div class="flex flex-justify-between flex-wrap p-y-12px">
                                <div class="flex flex-items-center">
                                    <el-icon size="15">
                                        <Message />
                                    </el-icon>
                                    <div class="p-l-2px">用户邮箱</div>
                                </div>
                                <div v-text="userData.userEmail"></div>
                            </div>
                            <div class="flex flex-justify-between flex-wrap p-y-12px">
                                <div class="flex flex-items-center">
                                    <el-icon size="15">
                                        <Postcard />
                                    </el-icon>
                                    <div class="p-l-2px">所属部门</div>
                                </div>
                                <div v-text="userData.deptName"></div>
                            </div>
                            <div class="flex flex-justify-between flex-wrap p-y-12px">
                                <div class="flex flex-items-center">
                                    <el-icon size="15">
                                        <Collection />
                                    </el-icon>
                                    <div class="p-l-2px">所属角色</div>
                                </div>
                                <div v-text="userData.roleName"></div>
                            </div>
                            <div class="flex flex-justify-between flex-wrap p-y-12px">
                                <div class="flex items-center">
                                    <el-icon size="15">
                                        <Calendar />
                                    </el-icon>
                                    <div class="p-l-2px">创建日期</div>
                                </div>
                                <div v-text="userData.dateTime"></div>
                            </div>
                        </div>
                    </el-card>
                </el-col>
                <el-col :span="18" :xs="24">
                    <el-card :body-style="{ 'padding-top': '6px' }">
                        <el-tabs v-model="activeName">
                            <el-tab-pane label="基本资料" name="first">
                                <el-form ref="mineFormRef" :rules="mineRules" :model="userData" label-width="80px"
                                    status-icon>
                                    <el-row>
                                        <el-col :sm="{ span: 24 }" :xs="{ span: 24 }">
                                            <el-form-item label="登录名称" prop="loginName">
                                                <el-input v-model="userData.rainbowId" placeholder="请输入登录名称"
                                                    clearable />
                                            </el-form-item>
                                        </el-col>
                                        <el-col :sm="{ span: 24 }" :xs="{ span: 24 }">
                                            <el-form-item label="手机号码" prop="phone">
                                                <el-input v-model="userData.userPhone" placeholder="请输入手机号码"
                                                    clearable />
                                            </el-form-item>
                                        </el-col>
                                        <el-col :sm="{ span: 24 }" :xs="{ span: 24 }">
                                            <el-form-item label="邮箱" prop="email">
                                                <el-input v-model="userData.userEmail" placeholder="请输入邮箱" clearable />
                                            </el-form-item>
                                        </el-col>
                                        <el-col :sm="{ span: 24 }" :xs="{ span: 24 }">
                                            <el-form-item label="性别" prop="sex">
                                                <el-radio-group v-model="userData.sex" placeholder="请选择性别">
                                                    <el-radio :value="0" border>男</el-radio>
                                                    <el-radio :value="1" border>女</el-radio>
                                                    <el-radio :value="2" border>未知</el-radio>
                                                </el-radio-group>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :sm="{ span: 24 }" :xs="{ span: 24 }" class="mt-6px">
                                            <el-form-item>
                                                <el-button type="primary" plain @click="() => { }">保存</el-button>
                                                <el-button type="danger" plain @click="() => { }">重置</el-button>
                                            </el-form-item>
                                        </el-col>
                                    </el-row>
                                </el-form>
                                {{ userData }}
                            </el-tab-pane>
                            <el-tab-pane label="修改密码" name="second">
                                <el-form ref="pwdFormRef" :rules="pwdRules" :model="pwdForm" label-width="80px"
                                    status-icon>
                                    <el-row>
                                        <el-col :sm="{ span: 24 }" :xs="{ span: 24 }">
                                            <el-form-item label="密码" prop="password">
                                                <el-input v-model="pwdForm.password" placeholder="请输入旧密码" show-password
                                                    clearable />
                                            </el-form-item>
                                        </el-col>
                                        <el-col :sm="{ span: 24 }" :xs="{ span: 24 }">
                                            <el-form-item label="新密码" prop="newPassword">
                                                <el-input v-model="pwdForm.newPassword" placeholder="请输入新密码"
                                                    show-password clearable />
                                            </el-form-item>
                                        </el-col>
                                        <el-col :sm="{ span: 24 }" :xs="{ span: 24 }">
                                            <el-form-item label="确认密码" prop="confirmPassword">
                                                <el-input v-model="pwdForm.confirmPassword" placeholder="请输入确认密码"
                                                    show-password clearable />
                                            </el-form-item>
                                        </el-col>
                                        <el-col :sm="{ span: 24 }" :xs="{ span: 24 }" class="mt-6px">
                                            <el-form-item>
                                                <el-button type="primary" plain @click="() => { }">保存</el-button>
                                                <el-button type="danger" plain @click="() => { }">重置</el-button>
                                            </el-form-item>
                                        </el-col>
                                    </el-row>
                                </el-form>
                                {{ pwdForm }}
                            </el-tab-pane>
                        </el-tabs>
                    </el-card>
                </el-col>
            </el-row>
        </div>
    </transition>
</template>

<style scoped lang="scss">
.container {
    padding: 4px;
    width: 100%;
    height: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
}

.p-y-12px {
    padding-top: 12px;
    padding-bottom: 12px;
}

.flex-justify-between,
[flex-justify-between=""] {
    justify-content: space-between;
}

.flex-wrap {
    flex-wrap: wrap;
}

.flex,
[flex=""] {
    display: flex;
}

.mt-20px {
    margin-top: 20px;
}

.flex-items-center,
.items-center,
[flex-items-center=""] {
    align-items: center;
}

.flex-justify-center,
[flex-justify-center=""] {
    justify-content: center;
}
</style>
