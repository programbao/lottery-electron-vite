<template>
  <div id="menu">
    <span v-show="noHideBtn">
      <div class="begin-lottery">
        <button class="btn" id="enter"  v-show="noBeginLottery" @click="enterLottery">进入抽奖<br />masuk undian</button>
        <button 
          class="btn"
          id="showPrize" 
          @click="showPrize" 
          v-show="!noBeginLottery && isNextPrize">
          <div v-html="currentPrize.name">
          </div>
          <!-- <br/>奖项 undian selanjutnya -->
        </button>
        <button class="btn" id="lottery" v-show="!noBeginLottery && !isNextPrize" @click="beginLottery">
          {{ isLotting ? '结束抽奖' : isContinueLottery ? '继续抽奖' : '开始抽奖' }} <br/> {{ isLotting ? 'mulai undian' : 'undian selesai' }}
        </button>
      </div>
      <button 
        class="btn" 
        @click="reLottery"
        id="reLottery" 
        v-show="!noBeginLottery 
          && !isLotting
          && !isFirstPrize">
          {{ (isNextPrize || isShowPrizeMark) ? '重新抽取上一轮' : '重新抽奖' }}<br />
          {{ (isNextPrize || isShowPrizeMark) ? 'Gambar ulang putaran sebelumnya' : 'Gambar ulang' }}
      </button>
      <button id="showAllLucks" class="btn" v-show="!currentPrize">
        展示全部中奖名单<br/>daftar nama pemenang
      </button>
      <div id="lotteryBar" class="none">
        <div class="fixed-bar">
          <button id="save" class="fixed-btn btn" @click="exportData">导出抽奖结果<br/> hasil undian</button>
          <button id="reset" class="fixed-btn btn" @click="resetBtnClick">重置<br />mengatur ulang</button>
        </div>
      </div>
      <button class="btn" id="fullScreen" @click="toggleFullScreen">{{ isFullScreen ? '退出全屏' : '全屏' }}</button>
    </span>

    <button class="btn" id="configBtn" @click="toggleConfig">系统配置</button>
  </div>
</template>

<script setup>
import { ref, onBeforeMount, onBeforeUnmount, computed, watch } from 'vue'
import bus from '../libs/bus'
import { lotteryDataStore } from '../store'
const basicData = lotteryDataStore();
// const isShowPrizeBtn = ref(true);
// console.log(lotteryData, 'lotteryDatalotteryData')
const currentPrize = computed(() => {
  return basicData.currentPrize;
});
const isNextPrize = computed(() => {
  return basicData.isNextPrize;
})
const isLotting = computed(() => {
  return basicData.isLotting;
});
const isContinueLottery = computed(() => {
  return basicData.isContinueLottery;
})
const isShowPrizeMark = computed(() => {
  return basicData.isShowPrizeMark;
})
const isHideCommonBtn = ref(false);
const noHideBtn = computed(() => {
  let noHide = true;
  if (basicData.isShowLuckyUser) {
    noHide = false;
  }
  if (isHideCommonBtn.value) {
    noHide = false
  }
  return noHide;
})
const isFirstPrize = ref(true);
const noBeginLottery = ref(true);
const isFullScreen = ref(false)
const enterLottery = () => {
  bus.emit('enterLottery')
  basicData.isEnterLottery = true
}
const handleEnterLotteryEnd = () => {
  noBeginLottery.value = false
}
const beginLottery = () => {
  bus.emit('beginLottery')
  isFirstPrize.value = false
}
const showPrize = () => {
  bus.emit('showPrize')
}
const reLottery = () => {
  bus.emit('reLottery')
  bus.emit('hidePrizeMark');
}

// const showPrizeEnd = () => {
//   isShowPrizeBtn.value = false
// }
const findCurrentLotteryGroup = () => {
  // 找到要展示的member
  const currentPrize = basicData.currentPrize;
  const userGroup = basicData.groupList.find(group => group.options.includes(currentPrize.type));
  if (!userGroup) {
    return;
  }
  return userGroup;
}

const toggleFullScreen = async () => {
  let fullScreenStatus = await myApi.toggleFullScreen();
  isFullScreen.value = fullScreenStatus;
}
const exportData = () => {
  bus.emit('exportData')
}
const resetBtnClick = () => {
  bus.emit('resetBtnClick')
  noBeginLottery.value = true;
  basicData.isEnterLottery = true
}
const toggleConfig = () => {
  bus.emit('toggleConfig')
}
const handleHideCommonBtn = () => {
  const userGroup = findCurrentLotteryGroup();
  if (!userGroup) {
    isHideCommonBtn.value = true
  } else {
    isHideCommonBtn.value = false
  }
}

onBeforeMount(() => {
  bus.on('enterLotteryEnd', handleEnterLotteryEnd)
  handleHideCommonBtn();
  bus.on('groupListSetting', handleHideCommonBtn)
  // bus.on('showPrizeEnd', showPrizeEnd)
})
onBeforeUnmount(() => {
  bus.off('enterLotteryEnd', handleEnterLotteryEnd)
})
</script>

<style lang="scss">
#menu {
  z-index: 401;
  position: fixed;
  top: 0;
  text-align: center;
}
#lottery {
  animation: breath 1.6s linear infinite;
  box-shadow: 0px 0px 15px rgb(127 255 255 / 75%);
  margin-top: 20px;
}
.begin-lottery, #showAllLucks {
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
#fullScreen {
  position: fixed;
  right: 30px;
  top: 20vh;
  right: 4vh;
  z-index: 5;
}
#configBtn {
  position: fixed;
  right: 30px;
  bottom: 20px;
  right: 4vh;
  z-index: 5;
  min-width: 90px;
    min-height: 47px;
}
.fixed-bar {
  position: fixed;
  bottom: 20px;
  right: 200px;
}

.btn {
  color: rgba(127, 255, 255, 0.75);
  background: transparent;
  outline: 1px solid rgba(127, 255, 255, 0.75);
  border: 0;
  padding: 1vh;
  margin: 0 0.6vh;
  font-size: 1.2vh;
  font-weight: bold;
  cursor: pointer;
}

.btn:hover {
  background-color: rgba(0, 255, 255, 0.5);
}

.btn:active {
  color: #000000;
  background-color: rgba(0, 255, 255, 0.75);
}
</style>