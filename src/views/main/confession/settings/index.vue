<script setup lang="ts">
import { ref } from "vue";
let ROOTURL = import.meta.env.VITE_BASE_URL;
let ROUTERURL = "/main/confession/love";
const confessionName = ref<string>();
const confessingName = ref<string>();
const confessionUrl = ref<string>(ROOTURL + ROUTERURL);

const handleConfessing = (): void => {
  if (!confessionName.value) confessionUrl.value = "";
  if (confessingName.value) {
    confessionUrl.value =
      "?name=" + confessionName.value + "&confessing=" + confessingName.value;
  } else confessionUrl.value = "?name=" + confessionName.value;
  confessionUrl.value = encodeURI(ROOTURL + ROUTERURL + confessionUrl.value);
};
// 复制网址 copyUrl
const copyUrl = () => {
  navigator.clipboard.writeText(confessionUrl.value);
};
</script>
<template>
  <!-- 配置 -->
  <div class="confession-config">
    <div class="confession-name form__group field">
      <input
        type="input"
        id="confessionName"
        class="form__field form-input"
        v-model="confessionName"
        placeholder="请输入她/他的昵称"
      />
      <span class="input-border input-border-alt"></span>
      <label for="confessionName" class="form__label">请输入她/他的昵称</label>
    </div>
    <span class="confession-name-bar"></span>
    <div class="confessing-name form__group field">
      <input
        type="input"
        id="confessingName"
        class="form__field form-input"
        v-model="confessingName"
        placeholder="请输入您的昵称"
      />
      <span class="input-border input-border-alt"></span>
      <label for="confessingName" class="form__label">请输入您的昵称</label>
    </div>
    <span class="confession-name-bar"></span>
    <div class="btn-box">
      <el-button type="primary" @click="handleConfessing">确认无误生成链接</el-button>
    </div>
  </div>
  <!-- 结果框 -->
  <div class="result-box">
    <a class="result-box__link" :href="confessionUrl" target="_blank">{{
      confessionUrl
    }}</a>
    <div class="result-box__copy">
      <el-button type="primary" @click="copyUrl">复制</el-button>
    </div>
  </div>
</template>
<style scoped lang="scss">
.confession-config {
  display: flex;
  flex-direction: column;
  align-items: center;
  .confession-name-bar {
    height: 2px;
    width: 100%;
    padding: 10px 0;
  }
  .form__group {
    position: relative;
    padding: 20px 0 0;
    width: 100%;
    max-width: 180px;
    .form__field {
      font-family: inherit;
      width: 100%;
      border: none;
      outline: 0;
      color: #fff;
      background: transparent;
      transition: border-color 0.2s;
      height: 28px;
      font-size: 1.2rem;
      border-bottom: 2px solid #9b9b9b;
      &::placeholder {
        color: transparent;
      }

      &:focus {
        padding-bottom: 2px;
        font-weight: 700;
        border-width: 3px;
        border-image: linear-gradient(to right, #116399, #38caef);
        border-image-slice: 1;
      }

      &:required,
      &:invalid {
        box-shadow: none;
      }

      &:focus + .input-border-alt {
        width: 100%;
      }
    }
    .form__field:placeholder-shown ~ .form__label {
      font-size: 15px;
      cursor: text;
      top: 23px;
    }
    .form__label {
      position: absolute;
      top: 0;
      display: block;
      transition: 0.2s;
      font-size: 15px;
      color: #9b9b9b;
      pointer-events: none;
    }

    .form-input {
      &:focus ~ .form__label {
        position: absolute;
        top: 0;
        display: block;
        transition: 0.2s;
        font-size: 15px;
        color: var(--el-color-primary);
        font-weight: 700;
      }
    }
    .input-border {
      position: absolute;
      width: 0%;
      bottom: 0;
      left: 0;
    }

    .form-control {
      position: relative;
      --width-of-input: 300px;
    }

    .input-border-alt {
      height: 3px;
      background: linear-gradient(90deg, #ff6464 0%, #ffbf59 50%, #47c9ff 100%);
      transition: width 0.4s cubic-bezier(0.42, 0, 0.58, 1);
    }
  }
}
.result-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: calc(100vw - 20%);
  a {
    color: #fff;
    font-family: "宋体";
    position: relative;
    text-decoration: none;
    margin: 10px 0;

    &:before {
      content: "";
      position: absolute;
      left: 50%;
      bottom: -2px;
      width: 0;
      height: 2px;
      background: var(--el-color-primary);
      transition: all 0.3s;
    }
    &:hover:before {
      width: 100%;
      left: 0;
      right: 0;
    }
  }
}
</style>
