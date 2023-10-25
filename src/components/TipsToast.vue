<template>
  <div class="qipao-container"></div>
</template>

<script setup>

</script>

<style lang="scss" scoped>
.qipao-container {
  position: fixed;
  right: 0;
  top: 10vh;
  bottom: 1vh;
  width: 25vw;
  z-index: 20;
}

.qipao {
  width: 100%;
  padding: 1.8vh 1.4vh;
  line-height: 1.414;
  margin: 4px 0;
  box-sizing: border-box;
  font-size: 24px;
  background-color: rgba(0, 0, 0, 0.99);
  color: rgba(127, 255, 255, 0.75);
}
</style>