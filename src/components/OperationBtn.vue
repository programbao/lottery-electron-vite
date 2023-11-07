<template>
  <div id="menu">
      <div class="begin-lottery">
        <button id="enter"  v-show="noBeginLottery" @click="enterLottery">进入抽奖<br />masuk undian</button>
        <button id="showPrize" @click="showPrize" v-show="!noBeginLottery && isShowPrizeBtn">
          {{ currentPrize.text }}
          <!-- <br/>奖项 undian selanjutnya -->
        </button>
        <button id="lottery" v-show="!noBeginLottery && !isShowPrizeBtn" @click="beginLottery">
          {{ isLotting ? '结束抽奖' : '开始抽奖' }} <br/> {{ isLotting ? 'mulai undian' : 'undian selesai' }}
        </button>
      </div>
      <button id="reLottery" v-show="!noBeginLottery && !isShowPrizeBtn">重新抽奖</button>
      <button id="showAllLucks">
        展示全部中奖名单<br/>daftar nama pemenang
      </button>
      <div id="lotteryBar" class="none">
        <div class="fixed-bar">
          <button id="save" class="fixed-btn">导出抽奖结果<br/> hasil undian</button>
          <button id="reset" class="fixed-btn">重置<br />mengatur ulang</button>
        </div>
      </div>
   </div>
</template>

<script setup>
import { ref, onBeforeMount, onBeforeUnmount, computed } from 'vue'
import bus from '../libs/bus'
import { lotteryDataStore } from '../store'
const basicData = lotteryDataStore();
const isShowPrizeBtn = ref(true);
// console.log(lotteryData, 'lotteryDatalotteryData')
const currentPrize = computed(() => {
  return basicData.currentPrize;
});
const isLotting = computed(() => {
  return basicData.isLotting;
})
const noBeginLottery = ref(true)
const enterLottery = () => {
  bus.emit('enterLottery')
}
const handleEnterLotteryEnd = () => {
  noBeginLottery.value = false
}
const beginLottery = () => {
  bus.emit('beginLottery')
}
const showPrize = () => {
  bus.emit('showPrize')
}
const showPrizeEnd = () => {
  isShowPrizeBtn.value = false
}
onBeforeMount(() => {
  bus.on('enterLotteryEnd', handleEnterLotteryEnd)
  bus.on('showPrizeEnd', showPrizeEnd)
})
onBeforeUnmount(() => {
  bus.off('enterLotteryEnd', handleEnterLotteryEnd)
})
</script>

<style lang="scss" scoped>
#menu {
  z-index: 400;
  position: fixed;
  top: 0;
  text-align: center;
}
#lottery {
  animation: breath 1.6s linear infinite;
  box-shadow: 0px 0px 15px rgb(127 255 255 / 75%);
  margin-top: 20px;
}
.begin-lottery {
  position: fixed;
  bottom: 20px;
  display: flex;
  flex-direction: column;
}
#reLottery {
  position: fixed;
  bottom: 20px;
  display: flex;
  flex-direction: column;
  margin-left: 50px;
  left: 60%;
}
.fixed-bar {
  position: fixed;
  bottom: 20px;
  right: 20px;
}

button {
  color: rgba(127, 255, 255, 0.75);
  background: transparent;
  outline: 1px solid rgba(127, 255, 255, 0.75);
  border: 0;
  padding: 1vh;
  margin: 0 4.6vh;
  font-size: 1.2vh;
  font-weight: bold;
  cursor: pointer;
}

button:hover {
  background-color: rgba(0, 255, 255, 0.5);
}

button:active {
  color: #000000;
  background-color: rgba(0, 255, 255, 0.75);
}

</style>