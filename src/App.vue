<script setup>
import { onMounted, ref } from "vue"
import BgBox from "./components/BgBox.vue";
import LotteryContainer from "./components/LotteryContainer.vue";
import OperationBtn from "./components/OperationBtn.vue";
import PrizeBar from "./components/PrizeBar.vue";
import PrizeMark from "./components/PrizeMark.vue";
import LuckyUser from "./components/LuckyUser.vue"
import ConfigDialog from "./components/configWidget/index.vue"
import ScreenCard from "./components/ScreenCard.vue"
// 引入store
import { lotteryDataStore } from './store'
const lotteryData = lotteryDataStore();
const importFile = async () => {
  console.log('执行导入操作')
  let userData = await myApi.openDialog()
  console.log(userData, 'userData')
}
const isLoadingFinish = ref(false)
onMounted(async () => {
  await lotteryData.initConfigData();
  const loadingBoxDom = document.querySelector('.loading-box');
  // loadingBoxDom.style.opacity = 0.4
  loadingBoxDom.style.zIndex = -5
  setTimeout(() => {
    isLoadingFinish.value = true
  }, 500)
})

</script>

<template>
  <div v-if="isLoadingFinish">
    <BgBox />
    <LotteryContainer />
    <OperationBtn />
    <PrizeBar />
    <PrizeMark />
    <LuckyUser />
    <ConfigDialog />
    <ScreenCard />
    <!-- <button @click="importFile">导入</button> -->
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
