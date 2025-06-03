<script setup lang="ts">
import useApiUrl from "@/libs/useApiUrl";
const { getLocalImgUrl } = useApiUrl();
import { useRouter } from "vue-router";
const router = useRouter();
function goHome() {
  router.push("/home/index");
}
function outLogin() {
  router.push("/login");
}
</script>

<template>
  <div class="main-error">
    <MeowCard>
      <el-empty
        :image-size="200"
        :image="getLocalImgUrl('Erorr.jpg')"
        description="无权限访问"
        style="width: 100%"
      >
        <div>
          <el-button @click="goHome" type="primary">返回首页</el-button>
          <el-button @click="outLogin" type="danger">退出登录</el-button>
        </div>
      </el-empty>
    </MeowCard>
  </div>
</template>
<style scoped lang="scss"></style>
