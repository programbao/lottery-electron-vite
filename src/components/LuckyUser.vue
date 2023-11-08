<template>
  <div 
    id="lucky-user-box"
    :style="{
      zIndex: basicData.isShowLuckyUser ? '400' : '-2',
    }"
    class="lucky-user-box">
    <div 
      :class="{
        'slide-in-right': basicData.isShowLuckyUser
      }"
      class="lucky-content" 
      :style="lucksContentStyle">
      <div 
        class="lucky-item" 
        v-for="(lucky, index) in currentLuckys" 
        v-html="getCardWithParentHtml(lucky, false, index, true, '', basicData, true)"
        :key="index">
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { lotteryDataStore } from '../store'
const basicData = lotteryDataStore();
import { getCardWithParentHtml } from './handleElements'

const luckysRowColObj = computed(() => {
  return basicData.luckysRowColObj;
});
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
    'overflow': 'hidden',
    'padding': '2px',
    'transition': 'opacity .3s ease-in-out',
    'width': `calc(calc(${columnCount * luckysRowColObj.tileSize}px  + '1px') + '12px')`
  }
});
const currentLuckys = ref([
  [
    5123072414,
    "镍铁事业部",
    "魏圆"
  ],
  [
    1422062812,
    "后勤部",
    "高金"
  ],
  [
    8230523005,
    "Civil Construction",
    "Ferdinand Delto Wattimena"
  ],
  [
    8221122035,
    "Civil Construction",
    "Ekhsan Rehalat"
  ],
  [
    "C8201102009",
    "Quality Control",
    "Muhammad Syamsul Ali, S.IP"
  ],
  [
    "C8201102009",
    "Quality Control",
    "Muhammad Syamsul Ali, S.IP"
  ]
]);
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
.lucky-item {
  margin: 10px;
}
.lucky-item .element {
  box-shadow: 0 0 12px rgba(253, 105, 0, 0.95) !important;
  border: 1px solid rgba(253, 105, 0, 0.5) !important;
  background-color: rgba(0,127,127,0.5077637237470506) !important;
}
.lucky-item .element:hover {
  border: 1px solid rgba(253, 105, 0, 0.95) !important;
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
</style>