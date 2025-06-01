<script setup lang="ts"></script>
<template>
  <div class="starry-sky">
    <div class="layer1"></div>
    <div class="layer2"></div>
    <div class="layer3"></div>
    <div class="layer4"></div>
    <div class="layer5"></div>
    <div class="title">Starry sky</div>
  </div>
</template>
<style scoped lang="scss">
.title {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 50px;
  color: white;
  text-shadow: 0 0 10px #fff, 0 0 20px #fff, 0 0 30px #fff, 0 0 40px #fff, 0 0 50px #fff,
    0 0;
}
@function star($n) {
  $result: "#{random(100)}vw #{random(100)}vh #fff";
  @for $i from 2 through $n {
    $result: "#{$result},#{random(100)}vw #{random(100)}vh #fff";
  }
  @return unquote($result);
}
.starry-sky {
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  padding: 0;
  margin: 0;
  background-color: #000;
  $n: 5;
  $duration: 400s;
  $count: 1000;
  @for $i from 1 through $n {
    $duration: floor($duration / $n);
    $count: floor($count / $n);
    .layer#{$i} {
      position: fixed;
      width: #{$i}px;
      height: #{$i}px;
      border-radius: 50%;
      box-shadow: star($count);
      animation: moveUp $duration linear infinite;
      &::after {
        content: " ";
        position: inherit;
        top: 100vh;
        left: 0;
        width: inherit;
        height: inherit;
        border-radius: inherit;
        box-shadow: inherit;
      }
    }
  }
}
@keyframes moveUp {
  to {
    transform: translateY(-100vh);
  }
}
</style>
