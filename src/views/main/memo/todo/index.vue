<script lang="ts" setup>

</script>



<template>
  <div class="iframe-container">

  </div>
</template>



<style scoped lang="scss">
.iframe-container {
  position: relative;
  width: 100vw;
  height: 100vh;
}



.christmas-tree {
  width: 100%;
  height: 100%;
  border: none;



  &.hidden {
    opacity: 0;
  }
}



.loading,
.error {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 20px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 8px;
  text-align: center;
}



.error {
  color: #f56c6c;
}



.retry-btn {
  margin-top: 10px;
  padding: 8px 16px;
  background: #409eff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;



  &:hover {
    background: #66b1ff;
  }
}
</style>