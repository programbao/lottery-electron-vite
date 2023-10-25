<template>
  <div class="canvas-box">
    <!-- <canvas id="canvas">你的浏览器不支持canvas</canvas> -->
    <img style="
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          object-fit: cover;
      " src="../assets/img/bg1.jpg" class="img-bg"/>
    <div style="
      background: rgba(0, 0, 0, 0.3);
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;"
      class="mark"></div>
  </div>
</template>

<script setup>

</script>

<style lang="scss" scoped>
.canvas-box {
  position: fixed;
  left: 0;
  top: 0;
  z-index: -1;
  overflow: hidden;
}
</style>