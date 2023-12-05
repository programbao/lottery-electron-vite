<template>
  <div id="menu">
    <div 
      v-show="noHideBtn" 
      :class="{
        'slide-out-bottom': basicData.isEnterBgWall,
        'slide-in-bottom': !basicData.isEnterBgWall
      }"
      class="lottery-operation-btn"
      :style="operationBtnStyle">
      <div class="begin-lottery">
        <button class="btn" id="enter"  v-show="noBeginLottery" @click="enterLottery">
          {{ controlsBtnConfig.enter.chineseText }}
          <span v-if="controlsBtnConfig.enter.otherLanguagesText">
            <br/>
            {{ controlsBtnConfig.enter.otherLanguagesText }}
          </span>
        </button>
        <button 
          class="btn"
          id="showPrize" 
          @click="showPrize" 
          v-if="!noBeginLottery && isNextPrize && currentPrize">
          <div v-html="currentPrize.name">
          </div>
          <!-- <br/>奖项 undian selanjutnya -->
        </button>
        <button class="btn" id="lottery" v-show="!noBeginLottery && !isNextPrize" @click="beginLottery">
          {{ isLotting ? controlsBtnConfig.lotteryEnd.chineseText : isContinueLottery ?  controlsBtnConfig.continueLottery.chineseText : controlsBtnConfig.lottery.chineseText }}
          <span v-if="controlsBtnConfig.lotteryEnd.otherLanguagesText && isLotting">
            <br/>
            {{ controlsBtnConfig.lotteryEnd.otherLanguagesText }}
          </span>
          <span v-if="controlsBtnConfig.continueLottery.otherLanguagesText && isContinueLottery && !isLotting">
            <br/>
            {{ controlsBtnConfig.continueLottery.otherLanguagesText }}
          </span>
          <span v-if="controlsBtnConfig.lottery.otherLanguagesText && !isContinueLottery && !isLotting">
            <br/>
            {{ controlsBtnConfig.lottery.otherLanguagesText }}
          </span>
        </button>
      </div>
      <button 
        class="btn" 
        @click="reLottery"
        v-show="!noBeginLottery 
          && !isResetCurrentPrize
          && !isShowAllLuckys
          && !isLotting
          && !isFirstPrize">
          {{ (isNextPrize || isShowPrizeMark) ? controlsBtnConfig.lastRoundLottery.chineseText : controlsBtnConfig.reLottery.chineseText }}
          <!-- {{ (isNextPrize || isShowPrizeMark) ? 'Gambar ulang putaran sebelumnya' : 'Gambar ulang' }} -->
          <span v-if="controlsBtnConfig.lastRoundLottery.otherLanguagesText && (isNextPrize || isShowPrizeMark)">
            <br/>
            {{ controlsBtnConfig.lastRoundLottery.otherLanguagesText }}
          </span>
          <span v-if="controlsBtnConfig.reLottery.otherLanguagesText && !(isNextPrize || isShowPrizeMark)">
            <br/>
            {{ controlsBtnConfig.reLottery.otherLanguagesText }}
          </span>
      </button>
      <button id="showAllLucks" class="btn" v-if="!currentPrize"  @click="showAllLuckyUser('showAllLuckys')">
        {{ controlsBtnConfig.showAllLucks.chineseText }}
          <span v-if="controlsBtnConfig.showAllLucks.otherLanguagesText">
            <br/>
            {{ controlsBtnConfig.showAllLucks.otherLanguagesText }}
          </span>
      </button>
    </div>

    <!-- <button class="btn" id="configBtn" @click="toggleConfig">系统配置</button> -->
    <!-- 屏幕墙 -->
    <img
      class="screen-img"
      :style="{
        'z-index': isShowScreenImg ? 0 : -1
      }"
      :src="screenImg.fileUrl"
      :class="{
        'slit-in-diagonal-1': isShowScreenImg,
        'swing-out-top-bck': !isShowScreenImg
      }"/>
    <div 
      v-if="isTipsBottomBar" 
      @click="isTipsBottomBar = false"
      class="tips-bottom bounce-top-infinite">
      点击隐藏
      <el-icon :size="40"><CaretBottom /></el-icon>
    </div>
    <div
      ref="bottomBar"
      :class="{
        'to-long-show': isTipsBottomBar
      }"
      class="bottom-bar">
      <div class="quick-operation">
        <button class="btn" @click="bgWallClick">
          {{ controlsBtnConfig.bgWallClick.chineseText }}
          <span v-if="controlsBtnConfig.bgWallClick.otherLanguagesText">
            <br/>
            {{ controlsBtnConfig.bgWallClick.otherLanguagesText }}
          </span>
        </button>
        <button class="btn" @click="toggleScreenImg">
          {{ controlsBtnConfig.toggleScreenImg.chineseText }}
          <span v-if="controlsBtnConfig.toggleScreenImg.otherLanguagesText">
            <br/>
            {{ controlsBtnConfig.toggleScreenImg.otherLanguagesText }}
          </span>
        </button>
        <button class="btn" @click="showLotteryClick">
          {{ controlsBtnConfig.showLotteryClick.chineseText }}
          <span v-if="controlsBtnConfig.showLotteryClick.otherLanguagesText">
            <br/>
            {{ controlsBtnConfig.showLotteryClick.otherLanguagesText }}
          </span>
        </button>
      </div>
      <div class="setting">
        <button class="btn" @click="toggleSetting('usersSetting')">
          {{ controlsBtnConfig.toggleSettingUsersSetting.chineseText }}
          <span v-if="controlsBtnConfig.toggleSettingUsersSetting.otherLanguagesText">
            <br/>
            {{ controlsBtnConfig.toggleSettingUsersSetting.otherLanguagesText }}
          </span>
        </button>
        <button class="btn" @click="toggleSetting('prizeSetting')">
          {{ controlsBtnConfig.toggleSettingPrizeSetting.chineseText }}
          <span v-if="controlsBtnConfig.toggleSettingPrizeSetting.otherLanguagesText">
            <br/>
            {{ controlsBtnConfig.toggleSettingPrizeSetting.otherLanguagesText }}
          </span>
       </button>
        <button class="btn" @click="toggleSetting('cardSetting')">
          {{ controlsBtnConfig.toggleSettingCardSetting.chineseText }}
          <span v-if="controlsBtnConfig.toggleSettingCardSetting.otherLanguagesText">
            <br/>
            {{ controlsBtnConfig.toggleSettingCardSetting.otherLanguagesText }}
          </span>
       </button>
        <button class="btn" @click="toggleSetting('ballSetting')">
          {{ controlsBtnConfig.toggleSettingBallSetting.chineseText }}
          <span v-if="controlsBtnConfig.toggleSettingBallSetting.otherLanguagesText">
            <br/>
            {{ controlsBtnConfig.toggleSettingBallSetting.otherLanguagesText }}
          </span>
       </button>
        <button class="btn" @click="toggleSetting('controlsBtnSetting')">
          {{ controlsBtnConfig.toggleSettingControlsBtnSetting.chineseText }}
          <span v-if="controlsBtnConfig.toggleSettingControlsBtnSetting.otherLanguagesText">
            <br/>
            {{ controlsBtnConfig.toggleSettingControlsBtnSetting.otherLanguagesText }}
          </span>
       </button>
        <button class="btn" @click="toggleSetting('otherResourceSetting')">
          {{ controlsBtnConfig.toggleSettingOtherResourceSetting.chineseText }}
          <span v-if="controlsBtnConfig.toggleSettingOtherResourceSetting.otherLanguagesText">
            <br/>
            {{ controlsBtnConfig.toggleSettingOtherResourceSetting.otherLanguagesText }}
          </span>
       </button>
        <button class="btn lock-btn" @click="toggleSetting('secretSetting')"><el-icon :size="30"><Lock /></el-icon></button>
        <button class="btn lock-btn" @click="toggleSetting('openDevTools')"><el-icon :size="30"><SetUp /></el-icon></button>
      </div>
      <div class="other">
        <button :key="tipsOpenFileKey" class="btn bounce-top" @click="toggleSetting('checkFileList')">
          {{ controlsBtnConfig.toggleSettingCheckFileList.chineseText }}
          <span v-if="controlsBtnConfig.toggleSettingCheckFileList.otherLanguagesText">
            <br/>
            {{ controlsBtnConfig.toggleSettingCheckFileList.otherLanguagesText }}
          </span>
       </button>
        <button class="btn" @click="showAllLuckyUser">
          {{ controlsBtnConfig.showAllLuckyUser.chineseText }}
          <span v-if="controlsBtnConfig.showAllLuckyUser.otherLanguagesText">
            <br/>
            {{ controlsBtnConfig.showAllLuckyUser.otherLanguagesText }}
          </span>
       </button>
        <button id="save" class="fixed-btn btn" @click="exportData">
          {{ controlsBtnConfig.exportData.chineseText }}
          <span v-if="controlsBtnConfig.exportData.otherLanguagesText">
            <br/>
            {{ controlsBtnConfig.exportData.otherLanguagesText }}
          </span>
       </button>
        <button id="reset" class="fixed-btn btn" @click="resetCurrentPrizeBtnClick">
          {{ controlsBtnConfig.resetCurrentPrizeBtnClick.chineseText }}
          <span v-if="controlsBtnConfig.resetCurrentPrizeBtnClick.otherLanguagesText">
            <br/>
            {{ controlsBtnConfig.resetCurrentPrizeBtnClick.otherLanguagesText }}
          </span>
       </button>
        <button id="reset" class="fixed-btn btn" @click="resetBtnClick">
          {{ controlsBtnConfig.resetBtnClick.chineseText }}
          <span v-if="controlsBtnConfig.resetBtnClick.otherLanguagesText">
            <br/>
            {{ controlsBtnConfig.resetBtnClick.otherLanguagesText }}
          </span>
       </button>
        <button class="btn" id="fullScreen" @click="toggleFullScreen">
          {{ isFullScreen ? controlsBtnConfig.quitFullScreen.chineseText : controlsBtnConfig.enterFullScreen.chineseText }}
          <span v-if="controlsBtnConfig.quitFullScreen.otherLanguagesText && isFullScreen">
            <br/>
            {{ controlsBtnConfig.quitFullScreen.otherLanguagesText }}
          </span>
          <span v-if="controlsBtnConfig.enterFullScreen.otherLanguagesText && !isFullScreen">
            <br/>
            {{ controlsBtnConfig.enterFullScreen.otherLanguagesText }}
          </span>
        </button>
        <MusicBtn />
      </div>
    </div>

    <usersSettingDialog ref="usersSettingDialogRef" />
    <prizeSettingDialog ref="prizeSettingDialogRef" />
    <cardSettingDialog ref="cardSettingDialogRef" />
    <otherResourceSettingDialog ref="otherResourceSettingDialogRef" />
    <secretSettingDialog ref="secretSettingDialogRef" />
    <ballSettingDialog ref="ballSettingDialogRef" />
    <checkFileListDialog ref="checkFileListDialogRef" />
    <controlsBtnSettingDialog ref="controlsBtnSettingDialogRef" />
  </div>
</template>

<script setup>
import { ref, onBeforeMount, onBeforeUnmount, computed, nextTick } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import MusicBtn from "./MusicBtn.vue";
import bus from '../libs/bus'
import { useToast } from "vue-toastification";
const toast = useToast();
import { lotteryDataStore } from '../store'
import usersSettingDialog from "../components/configWidget/usersSetting/dialog.vue"
import prizeSettingDialog from "../components/configWidget/prizeSetting/dialog.vue"
import cardSettingDialog from "../components/configWidget/cardSetting/dialog.vue"
import secretSettingDialog from "../components/configWidget/secretSetting/dialog.vue"
import otherResourceSettingDialog from "../components/configWidget/otherResourceSetting/dialog.vue"
import ballSettingDialog from "../components/configWidget/ballSetting/dialog.vue"
import checkFileListDialog from "../components/configWidget/checkFileList/dialog.vue"
import controlsBtnSettingDialog from "../components/configWidget/controlsBtnSetting/dialog.vue"
const operationBtnStyle = ref({});

// 打开设置
const usersSettingDialogRef = ref();
const prizeSettingDialogRef = ref();
const cardSettingDialogRef = ref();
const otherResourceSettingDialogRef = ref();
const secretSettingDialogRef = ref();
const ballSettingDialogRef = ref();
const checkFileListDialogRef = ref();
const controlsBtnSettingDialogRef = ref();
const toggleSetting = (settingStr) => {
  switch (settingStr) {
    case 'usersSetting':
      usersSettingDialogRef.value.toggleConfig()
      break;
    case 'prizeSetting':
      prizeSettingDialogRef.value.toggleConfig()
      break;
    case 'cardSetting':
      cardSettingDialogRef.value.toggleConfig()
      break;
    case 'otherResourceSetting': 
      otherResourceSettingDialogRef.value.toggleConfig()
      break;
    case 'secretSetting':
      secretSettingDialogRef.value.toggleConfig()
      break;
    case 'ballSetting':
      ballSettingDialogRef.value.toggleConfig()
      break;
    case 'openDevTools':
      myApi.openDevTools();
      break;
    case 'checkFileList': // 显示文件列表
      checkFileListDialogRef.value.toggleConfig()
      break;
    case 'controlsBtnSetting': 
      controlsBtnSettingDialogRef.value.toggleConfig()
      break;
    default:
      break;
  }
}

const isShowAllLuckys = ref(false);
const showAllLuckyUser = (isShowAllLuckysKey) => {
  basicData.isShowAllLuckyUser = true
  if (isShowAllLuckysKey === 'showAllLuckys') {
    isShowAllLuckys.value = true
  }
}
const tipsOpenFileKey = ref(0);

// 图片相关设置
const isShowScreenImg = ref(false)
const bgWallClick = () => {
  basicData.isEnterBgWall = true
  isShowScreenImg.value = false
}
const showLotteryClick = () => {
  basicData.isEnterBgWall = false
  isShowScreenImg.value = false
}
const screenImg = computed(() => {
  return basicData.otherResource.screenImg
})
const toggleScreenImg = (bool) => {
  isShowScreenImg.value = true
}

const basicData = lotteryDataStore();
const controlsBtnConfig = computed(() => {
  return basicData.controlsBtnConfig
})
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
  if (basicData.isShowLuckyUser || basicData.isShowAllLuckyUser) {
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
const isResetCurrentPrize = ref(false)
const enterLottery = () => {
  bus.emit('enterLottery')
  basicData.isEnterLottery = true
  isResetCurrentPrize.value = false
}
const handleEnterLotteryEnd = () => {
  noBeginLottery.value = false
}
const beginLottery = () => {
  if (basicData.isAnimating) {
    toast.info(`请等待动画加载完成  harap tunggu hingga animasi dimuat`, { 
      timeout: 2000
    });
    return
  }
  bus.emit('beginLottery')
  isFirstPrize.value = false
  isResetCurrentPrize.value = false
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
  if (!basicData.currentPrize) return
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
  tipsOpenFileKey.value = new Date().getTime();
}

const resetCurrentPrizeBtnClick = () => {
  ElMessageBox.confirm(
    '当前中奖记录都将被清空，确认要重置吗?',
    '警告',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(() => {
      bus.emit('resetCurrentPrizeBtnClick')
      ElMessage({
        type: 'success',
        message: '当前奖项已重置成功',
      })
      isResetCurrentPrize.value = true
    }) 
}
const resetBtnClick = () => {
  ElMessageBox.confirm(
    '所有中奖记录都将被清空，确认要重置吗? 系统将会导出历史中奖记录，请注意查看文件列表',
    '警告',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(() => {
      bus.emit('resetBtnClick')
      noBeginLottery.value = true;
      basicData.isEnterLottery = true
      exportData();
      ElMessage({
        type: 'success',
        message: '重置成功',
      })
    })
}
// const toggleConfig = () => {
//   bus.emit('toggleConfig')
// }
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
const isTipsBottomBar = ref(true);
const mousemoveEvent = (event) => {
  if (isTipsBottomBar.value) return
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    const mouseY = event.clientY;
    const windowHeight = window.innerHeight;
    const bottomOffset = 15; // 底部操作栏高度
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
  if (isTipsBottomBar.value) return
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
  if (isTipsBottomBar.value) return
  isEnterBar = false
  clearTimeout(showBarTimer);
  showBarTimer = setTimeout(() => {
    if (!isEnterBar) {
      bottomBar.value.classList.remove('active');
    }
  }, 500);
}
let adjustBtnTimer = null;
// 调整抽奖动作按钮
const adjustLotteryActionBtn = () => {
  clearTimeout(adjustBtnTimer);
  adjustBtnTimer = setTimeout(() => {
    const bottomCardDom = document.querySelector("#card-0");
    if (!bottomCardDom) {
      operationBtnStyle.value.left = '60%';
    } else {
      operationBtnStyle.value.left = bottomCardDom.getBoundingClientRect().x + 'px'
    }
  }, 500)
}
onBeforeMount(() => {
  bus.on('enterLotteryEnd', handleEnterLotteryEnd);
  handleHideCommonBtn();
  bus.on('groupListSetting', handleHideCommonBtn);
  bus.on('adjustLotteryActionBtn', adjustLotteryActionBtn);
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
// 提示底部bar
.tips-bottom {
  position: fixed;
  right: 10px;
  bottom: 70px;
  color: rgba(127, 255, 255, 0.75);
  display: flex;
}
// 底部控制bar
.bottom-bar {
  position: fixed;
  bottom: -80px; /* 隐藏操作栏 */
  left: 0;
  right: 0;
  height: 80px;
  background-color: rgba(0,0,0,0.9);
  transition: bottom 0.3s ease-out; /* 过渡动画 */
  z-index: 100;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  box-sizing: border-box;
  padding: 7px 0;
  > div {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding: 0 10px;
    border-right: 1px solid rgba(127, 255, 255, 0.75);

    flex-wrap: wrap;
    overflow-y: auto;
    height: 100%;
    
    > .btn, .music {
      margin: 5px;
    }

    &::-webkit-scrollbar{
      width: 5px;
    }
    &::-webkit-scrollbar-track{
      // background: rgb(239, 239, 239);
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
  .setting {
    .lock-btn {

    }
  }
}

.bottom-bar.active {
  bottom: 0; /* 显示操作栏 */
}
.bottom-bar.to-long-show {
  bottom: 0;
}
.lottery-operation-btn {
  position: fixed;
  display: flex;
  bottom: 20px;
  left: 60%;
  transition: all .2s;
}
.screen-img {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  object-fit: cover;
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
  // margin-top: 20px;
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
  // font-size: 1.2vh;
  font-size: 1.14vh;
  font-weight: bold;
  cursor: pointer;
  height: 50px;
  // display: flex;
  // justify-content: center;
  // align-items: center;
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
      display: flex;
      align-items: center;
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