<script setup>
import BgBox from "./components/BgBox.vue";
import LotteryContainer from "./components/LotteryContainer.vue";
import MusicBtn from "./components/MusicBtn.vue";
import OperationBtn from "./components/OperationBtn.vue";
import PrizeBar from "./components/PrizeBar.vue";
import PrizeMark from "./components/PrizeMark.vue";
const getUsers = (users) => {
  console.log(users, 'users---')
}
const importFile = async () => {
  console.log('执行导入操作')
  let userData = await myApi.openDialog()
  console.log(userData, 'userData')
}
</script>

<template>
  <div>
    <BgBox />
    <LotteryContainer />
    <MusicBtn />
    <OperationBtn />
    <PrizeBar />
    <PrizeMark />
    <button @click="importFile">导入</button>
    
  </div>
</template>

<style scoped>
html,body {
  overflow: hidden;
}
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
