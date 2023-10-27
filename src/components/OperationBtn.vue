<template>
  <div id="menu">
     <div class="begin-lottery">
        <button id="enter"  v-show="noBeginLottery" @click="enterLottery">进入抽奖<br />masuk undian</button>
        <button id="lottery" v-show="!noBeginLottery" @click="beginLottery">
          开始抽奖 <br/> mulai undian
        </button>
     </div>
     <button id="reLottery" v-show="!noBeginLottery">重新抽奖</button>
     <div id="lotteryBar" class="none">
       <div class="fixed-bar">
         <button id="save" class="fixed-btn">导出抽奖结果<br/> hasil undian</button>
         <button id="reset" class="fixed-btn">重置<br />mengatur ulang</button>
       </div>
     </div>
   </div>
</template>

<script setup>
import { ref, onBeforeMount, onBeforeUnmount } from 'vue'
import bus from '../libs/bus'

const noBeginLottery = ref(true)
const enterLottery = () => {
  bus.emit('enterLottery')
}
const handleEnterLotteryEnd = () => {
  noBeginLottery.value = false
  console.log(noBeginLottery.value, '28309482034880958290358')
}
const beginLottery = () => {
  bus.emit('beginLottery')
}
onBeforeMount(() => {
  bus.on('enterLotteryEnd', handleEnterLotteryEnd)
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