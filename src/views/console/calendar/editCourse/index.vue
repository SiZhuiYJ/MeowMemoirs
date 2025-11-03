<script setup lang="ts"></script>
<template>
    <el-row :gutter="5">
        <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
            <el-card class="card-main" shadow="hover">
            </el-card>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
            <el-card class="card-main" shadow="hover">
            </el-card>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6" class="d-2">
            <el-card class="card-main" shadow="hover">
            </el-card>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6" style="padding-bottom: 0px;">
            <el-card class="card-main" shadow="hover">
            </el-card>
        </el-col>
    </el-row>
</template>
<style scoped lang="scss">
.card-main {
    border-radius: 0.375rem;
    height: calc(100vh - 132px);
}

.el-col {
    @media (max-width: 1200px) {
        padding-bottom: 6px;
    }
}

.d-2 {
    @media (min-width: 768px) and (max-width: 1200px) {
        padding-bottom: 0px;
    }
}
</style>
