<script setup lang="ts"></script>
<template>
  <div class="main-content">
    <MeowCard>
      <div class="content">
        <div v-slide-in v-for="item in 100" class="card" :key="item"></div>
      </div>
    </MeowCard>
  </div>
</template>
<style scoped lang="scss">
.content {
  overflow-y: auto;
  .card {
    height: 200px;
    background-color: #000;
    margin: 10px;
  }
}
</style>
