<template>
  <div 
    id="lucky-user-box"
    :style="luckyUserBoxStyle"
    class="lucky-user-box">
    <div 
      :class="{
        'slide-in-right': basicData.isShowLuckyUser,
        'slide-out-left': !basicData.isShowLuckyUser
      }"
      class="lucky-content" 
      :style="lucksContentStyle">
      <div class="split-box"></div>
      <div 
        v-for="(lucky, index) in currentLuckys" 
        class="lucky-item element" 
        :style="{
          width: luckyCardConfigStyle.cardWidth,
          height: luckyCardConfigStyle.cardHeight,
        }"
        :key="index">
        <div 
          class="company"
          v-if="luckyCardConfigStyle.logo"
          :style="{
            top: luckyCardConfigStyle.companyTop,
            'font-size': luckyCardConfigStyle.companyFontSize
          }">
          <div class="image-text-container">
            <img 
              :src="luckyCardConfigStyle.logo" 
              :style="{
                width: luckyCardConfigStyle.imgWidth,
                height: luckyCardConfigStyle.imgHeight,
                objectFit: 'contain'
              }">
          </div>
        </div>
        <div 
          class="avatar"
          style="height: 100%;
            display: flex;
            position: relative;
            justify-content: center;
            align-items: center;
            z-index: -1">
          <div style="width: 100%;height: 100%;background-color: rgba(0,0,0,0.1);position: absolute;top: 0;left:0;"></div>
        </div>
        <div 
          :style="{
            'width': '100%',
            'top': luckyCardConfigStyle.nameTop,
            'font-size': luckyCardConfigStyle.nameFontSize,
            'line-height': luckyCardConfigStyle.nameFontSize
          }" class="name">
          {{lucky[2]}}
        </div>
        <div 
          :style="{
            bottom: luckyCardConfigStyle.detailsBottom,
            fontSize: luckyCardConfigStyle.detailsFontSize,
            lineHeight: luckyCardConfigStyle.detailsFontSize
          }"
          class="details">
            <span class="cardIdTxt" :id="'card-' + lucky[0]">{{lucky[0]}}</span>
            <div :style="{height: 'calc(' + luckyCardConfigStyle.detailsFontSize + ' + -4px)'}"></div>
            <span id="user-dept">{{lucky[1]}}</span>
        </div>
      </div>
      <div class="split-box"></div>
    </div>
    <button class="btn closeBtn" @click="closeBtn">
      Close
    </button>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { lotteryDataStore } from '../store'
const basicData = lotteryDataStore();

const luckyCardConfigStyle = computed(() => {
  return basicData.luckyCardConfigStyle;
})

const luckysRowColObj = computed(() => {
  return basicData.luckysRowColObj;
});
const luckyUserBoxStyle = ref({
  'z-index': '-2',
})
let showTimer = null;
// 控制入场和退场动画
watch(
  () => basicData.isShowLuckyUser,
  () => {
    clearTimeout(showTimer);
    if (basicData.isShowLuckyUser) {
      showTimer = setTimeout(() => {
        luckyUserBoxStyle.value['z-index'] = '400'
      });
    } else {
      showTimer = setTimeout(() => {
        luckyUserBoxStyle.value['z-index'] = '-2'
      }, 400);
    }
  }
)
const lucksContentStyle = computed(() => {
  const type = luckysRowColObj.type;
  let rowCount = luckysRowColObj.rowCount;
  let columnCount = luckysRowColObj.columnCount;
  if (type == 1) {
    rowCount = Math.ceil(currentLuckys.length / columnCount)
  }
  switch (type) {
    case 1:
      rowCount = Math.ceil(currentLuckys.length / columnCount)
      break;
    case 2:
      columnCount = Math.ceil(currentLuckys.length / rowCount)
      break;
    default:
      break;
  }
  return {
    'display': 'flex',
    'flex-wrap': 'wrap',
    'height': `calc(${rowCount * luckysRowColObj.tileSize}px)`,
    'justify-content': 'center',
    'margin-bottom': '8px',
    'opacity': basicData.isShowLuckyUser ? '0' : '1',
    'overflow': 'auto',
    'padding': '2px',
    'transition': 'opacity .3s ease-in-out',
    'width': `calc(calc(${columnCount * luckysRowColObj.tileSize}px  + '1px') + '12px')`,
    'max-height': '100vh',
    'max-width': '100vw'
  }
});
const currentLuckys = computed(() => {
  return basicData.currentLuckys;
});
const closeBtn = () => {
  basicData.isShowLuckyUser = false;
}
// const currentLuckys = computed(() => {
//   return basicData.currentLuckys;
// });
</script>

<style lang="scss">
.lucky-user-box {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.9);
  z-index: -2;
  transition: all .2s;
  display: flex;
  justify-content: center;
  align-items: center;
  /* display: none; */
}
.lucky-content::-webkit-scrollbar {
  display: none;
}
.lucky-item {
  margin: 10px;
}
.lucky-item {
  box-shadow: 0 0 12px rgba(253, 105, 0, 0.95) !important;
  border: 1px solid rgba(253, 105, 0, 0.5) !important;
  background-color: rgba(0,127,127,0.5077637237470506) !important;
}
.lucky-item:hover {
  border: 1px solid rgba(253, 105, 0, 0.95) !important;
}
.closeBtn {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 1.5vh;
  padding: 1vh 2vw;
  margin: 0;
}

.split-box {
  width: 100vw;
  height: 50px;
}
.slide-in-right {
	-webkit-animation: slide-in-right 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
	        animation: slide-in-right 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
}
@-webkit-keyframes slide-in-right {
  0% {
    -webkit-transform: translateX(1000px);
            transform: translateX(1000px);
    opacity: 0;
  }
  100% {
    -webkit-transform: translateX(0);
            transform: translateX(0);
    opacity: 1;
  }
}
@keyframes slide-in-right {
  0% {
    -webkit-transform: translateX(1000px);
            transform: translateX(1000px);
    opacity: 0;
  }
  100% {
    -webkit-transform: translateX(0);
            transform: translateX(0);
    opacity: 1;
  }
}
.slide-out-left {
	-webkit-animation: slide-out-left 0.5s cubic-bezier(0.550, 0.085, 0.680, 0.530) both;
	        animation: slide-out-left 0.5s cubic-bezier(0.550, 0.085, 0.680, 0.530) both;
}
 @-webkit-keyframes slide-out-left {
  0% {
    -webkit-transform: translateX(0);
            transform: translateX(0);
    opacity: 1;
  }
  100% {
    -webkit-transform: translateX(-1000px);
            transform: translateX(-1000px);
    opacity: 0;
  }
}
@keyframes slide-out-left {
  0% {
    -webkit-transform: translateX(0);
            transform: translateX(0);
    opacity: 1;
  }
  100% {
    -webkit-transform: translateX(-1000px);
            transform: translateX(-1000px);
    opacity: 0;
  }
}

</style>