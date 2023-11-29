<template>
  <div id="menu">
    <div v-show="noHideBtn" class="lottery-operation-btn">
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
        v-show="!noBeginLottery 
          && !isLotting
          && !isFirstPrize">
          {{ (isNextPrize || isShowPrizeMark) ? '重新抽取上一轮' : '重新抽奖' }}<br />
          {{ (isNextPrize || isShowPrizeMark) ? 'Gambar ulang putaran sebelumnya' : 'Gambar ulang' }}
      </button>
      <button id="showAllLucks" class="btn" v-show="!currentPrize">
        展示全部中奖名单<br/>daftar nama pemenang
      </button>
    </div>

    <button class="btn" id="configBtn" @click="toggleConfig">系统配置</button>
    <div
      ref="bottomBar"
      class="bottom-bar">
      <button class="btn" @click="toggleSetting('usersSetting')">名单设置</button>
      <button class="btn" @click="toggleSetting('prizeSetting')">奖项设置</button>
      <button class="btn">卡片设置</button>
      <button class="btn">展示中奖名单</button>
      <button id="save" class="fixed-btn btn" @click="exportData">导出抽奖结果<br/> hasil undian</button>
      <button id="reset" class="fixed-btn btn" @click="resetBtnClick">重置<br />mengatur ulang</button>
      <button class="btn" id="fullScreen" @click="toggleFullScreen">{{ isFullScreen ? '退出全屏' : '全屏' }}</button>
      <MusicBtn />
    </div>


    <usersSettingDialog ref="usersSettingDialogRef" />
    <prizeSettingDialog ref="prizeSettingDialogRef" />
  </div>
</template>

<script setup>
import { ref, onBeforeMount, onBeforeUnmount, computed, nextTick } from 'vue'
import MusicBtn from "./MusicBtn.vue";
import bus from '../libs/bus'
import { lotteryDataStore } from '../store'
import usersSettingDialog from "../components/configWidget/usersSetting/dialog.vue"
import prizeSettingDialog from "../components/configWidget/prizeSetting/dialog.vue"

// 打开设置
const usersSettingDialogRef = ref();
const prizeSettingDialogRef = ref();

const toggleSetting = (settingStr) => {
  switch (settingStr) {
    case 'usersSetting':
      usersSettingDialogRef.value.toggleConfig()
      break;
    case 'prizeSetting':
      prizeSettingDialogRef.value.toggleConfig()
      break;
    default:
      break;
  }
}


const basicData = lotteryDataStore();
const bottomBar = ref();
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
  if (userGroup) {
    const member = basicData.memberListData[userGroup.group_identity]
    if (!member || member.length <= 0) {
      isHideCommonBtn.value = true
    } else {
      isHideCommonBtn.value = false
    }
  } else {
    isHideCommonBtn.value = true
  }
}
let showBarTimer = null;
let debounceTimer = null
let isEnterBar = false
const mousemoveEvent = (event) => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    const mouseY = event.clientY;
    const windowHeight = window.innerHeight;
    const bottomOffset = 10; // 底部操作栏高度
    // 如果鼠标位置在窗口底部一定范围内，则显示操作栏
    clearTimeout(showBarTimer);
    if (mouseY > windowHeight - bottomOffset) {
      // isHover = true 
      bottomBar.value.classList.add('active');
    } else {
      showBarTimer = setTimeout(() => {
        if (!isEnterBar) {
          bottomBar.value.classList.remove('active');
        }
      }, 500); 
    }
  }, 50)
}
const mouseleaveEvent = () => {
  clearTimeout(showBarTimer);
  setTimeout(() => {
    if (!isEnterBar) {
      bottomBar.value.classList.remove('active');
    }
  }, 200)
}
const barMouseenter = () => {
  isEnterBar = true
}
const barMouseleave = () => {
  isEnterBar = false
  clearTimeout(showBarTimer);
  showBarTimer = setTimeout(() => {
    if (!isEnterBar) {
      bottomBar.value.classList.remove('active');
    }
  }, 500);
}
onBeforeMount(() => {
  bus.on('enterLotteryEnd', handleEnterLotteryEnd);
  handleHideCommonBtn();
  bus.on('groupListSetting', handleHideCommonBtn);
  // 监听鼠标移动事件
  document.addEventListener('mousemove', mousemoveEvent);
  document.addEventListener('mouseleave', mouseleaveEvent);
  nextTick(() => {
    bottomBar.value.addEventListener('mouseenter', barMouseenter)
    bottomBar.value.addEventListener('mouseleave', barMouseleave)

  })
})
onBeforeUnmount(() => {
  bus.off('enterLotteryEnd', handleEnterLotteryEnd)
  document.removeEventListener('mousemove', mousemoveEvent);
  document.removeEventListener('mouseleave', mouseleaveEvent);
  bottomBar.value.removeEventListener('mouseenter', barMouseenter)
  bottomBar.value.removeEventListener('mouseleave', barMouseleave)
})
</script>

<style lang="scss">
// 底部控制bar
.bottom-bar {
  position: fixed;
  bottom: -70px; /* 隐藏操作栏 */
  left: 0;
  right: 0;
  height: 70px;
  background-color: rgba(0,0,0,0.9);
  transition: bottom 0.3s ease-out; /* 过渡动画 */
  z-index: 100;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.bottom-bar.active {
  bottom: 0; /* 显示操作栏 */
}
.lottery-operation-btn {
  position: fixed;
  display: flex;
  bottom: 20px;
}

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
// .begin-lottery, #showAllLucks {
//   position: fixed;
//   bottom: 20px;
//   display: flex;
//   flex-direction: column;
// }
#reLottery {
  position: fixed;
  bottom: 20px;
  display: flex;
  flex-direction: column;
  margin-left: 50px;
  left: 60%;
}
// #fullScreen {
//   position: fixed;
//   right: 30px;
//   top: 20vh;
//   right: 4vh;
//   z-index: 5;
// }
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
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.btn:hover {
  background-color: rgba(0, 255, 255, 0.5);
}

.btn:active {
  color: #000000;
  background-color: rgba(0, 255, 255, 0.75);
}
</style>

<style lang="scss">
.base-modal-dialog.isMoveDialog {
  height: fit-content;
  box-shadow: 0px 2px 8px 0px rgba(51, 51, 51, 0.15);
  right: auto;
  bottom: auto;
  margin: 0 !important;
  .el-dialog__header {
    display: flex;
    align-items: center;
    border-bottom: 1px solid #e6e6e6;
    padding: 16px;
    cursor: move;
    margin: 0;
    .el-dialog__title {
      font-weight: 500;
      font-size: 16px;
      color: #303133;
      position: relative;
      left: 50%;
      transform: translateX(-50%);
    }

    .title-text {
      margin-right: auto;
      font-weight: 600;
      color: #000;
    }
    .title-btn {
      font-size: 14px;
      display: inline-flex;
      cursor: pointer;
      align-items: center;
      font-size: 12px;
      font-weight: 500;
      box-shadow: 0px 2px 4px 0px rgba(44,39,56,0.08), 0px 1px 2px 0px rgba(44,39,56,0.00); 
      background-color: #d7dbe6;
      border: 1px solid transparent;
      border-radius: 14px;
      padding: 4px;
      padding-right: 10px;
      .label {
        width: 20px;
        height: 20px;
        background: #2e3644;
        border-radius: 50%;
        position: relative;
        margin-right: 8px;
        display: inline-flex;
        justify-content: center;
        align-items: center;
        &.label-confirm {
          &::before {
            content: "";
            width: 8px;
            height: 8px;
            border: 2px solid #2FCBB1;
            border-radius: 50%;
          }
        }
        &.label-cancel {
          &::before {
            content: "✕";
            color: #ff6666;
            margin: 2px 0px 0px 1px;
          }
        }
      }

      &:hover {
        background-color: #c0c7d6;
      }
      &:active {
        background-color: #c0c7d6;
        border-color: #366FFF;
      }
      + .title-btn {
        margin-left: 8px;
      }
    }
  }
  .el-dialog__body {
    max-height: 80vh;
    overflow-y: auto;
    &::-webkit-scrollbar{
      width: 8px;
    }
    &::-webkit-scrollbar-track{
      background: rgb(239, 239, 239);
      border-radius:2px;
    }
    &::-webkit-scrollbar-thumb{
      background: #bfbfbf;
      border-radius:10px;
    }
    &::-webkit-scrollbar-thumb:hover{
      background: #333;
    }
  }
  .setting-content {
    background-color: #f2fafe;
    border-radius: 10px;
    padding: 20px;
  }
}
</style>