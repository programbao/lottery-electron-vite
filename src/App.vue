<script setup>
import { onMounted } from "vue"
import BgBox from "./components/BgBox.vue";
import LotteryContainer from "./components/LotteryContainer.vue";
import MusicBtn from "./components/MusicBtn.vue";
import OperationBtn from "./components/OperationBtn.vue";
import PrizeBar from "./components/PrizeBar.vue";
import PrizeMark from "./components/PrizeMark.vue";
import LuckyUser from "./components/LuckyUser.vue"
import ConfigDialog from "./components/ConfigDialog.vue"
// 引入store
import { lotteryDataStore } from './store'
const lotteryData = lotteryDataStore();
const importFile = async () => {
  console.log('执行导入操作')
  let userData = await myApi.openDialog()
  console.log(userData, 'userData')
}

onMounted(async () => {
  lotteryData.initConfigData();
  // 处理初始化数据
  // const config = await myApi.getTempData();
  // if (config) {
  //   lotteryData.setPrizeConfig(config.prizeConfig);
  //   lotteryData.prizes = config.prizeConfig.prizes;
  // }
  // const usersData = await myApi.getStaticUsersData();
  // // 抽奖用户
  // lotteryData.users = usersData;
})

</script>

<template>
  <div>
    <BgBox />
    <LotteryContainer />
    <MusicBtn />
    <OperationBtn />
    <PrizeBar />
    <PrizeMark />
    <LuckyUser />
    <ConfigDialog />
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
