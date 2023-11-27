<template>
  <div class="screen-card"
    :style="renderDomStyle">
    <div 
      v-for="index in totalCard"
      :id="'card-' + index" 
      class="element" 
      :style="{
        width: cardConfigStyle.cardWidth,
        height: cardConfigStyle.cardHeight,
        backgroundRepeat: 'no-repeat',
        backgroundSize: '100% 120%',
        backgroundPosition: 'center center',
        backgroundColor: 'rgba(0,127,127,' + (Math.random() * 0.7 + 0.25) + ')'
      }">
      <div 
        class="company"
        v-if="cardConfigStyle.logo"
        :style="{
          top: cardConfigStyle.companyTop,
          'font-size': cardConfigStyle.companyFontSize
        }">
        <div class="image-text-container">
          <img 
            :src="cardConfigStyle.logo" 
            :style="{
              width: cardConfigStyle.imgWidth,
              height: cardConfigStyle.imgHeight,
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
          'top': cardConfigStyle.nameTop,
          'font-size': cardConfigStyle.nameFontSize,
          'line-height': cardConfigStyle.nameFontSize
        }" class="name">
        {{getUser(index)[2]}}
      </div>
      <div 
        :style="{
          bottom: cardConfigStyle.detailsBottom,
          fontSize: cardConfigStyle.detailsFontSize,
          lineHeight: cardConfigStyle.detailsFontSize
        }"
        class="details">
          <span class="cardIdTxt" :id="'card-' + getUser(index)[0]">{{getUser(index)[0]}}</span>
          <div :style="{height: 'calc(' + cardConfigStyle.detailsFontSize + ' + -4px)'}"></div>
          <span id="user-dept">{{getUser(index)[1]}}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, nextTick } from 'vue'
import { lotteryDataStore } from '../store'
const basicData = lotteryDataStore();
import bus from '../libs/bus'


const cardConfigStyle = computed(() => {
  return basicData.cardConfigStyle;
})
const member = computed(() => {
  const memberListData = basicData.memberListData
  const currentLotteryGroup = basicData.currentLotteryGroup
  return memberListData[currentLotteryGroup.group_identity]
})
const totalCard = computed(() => {
  const { columnCount, rowCount } = basicData.beforeLotteryLayout
  let total = rowCount * columnCount; 
  if (member.value && total > member.value.length) {
    total = member.value.length
  }
  return  total;
})

const renderDomStyle = computed(() => {
  const { rowCount, columnCount, rowGap, columnGap, scale, top, left } = basicData.beforeLotteryLayout;
  return `
    grid-template-columns: repeat(${columnCount}, 1fr);
    grid-template-rows: repeat(${rowCount}, 1fr);  
    grid-row-gap: ${rowGap};
    grid-column-gap: ${columnGap};
    top: ${top};
    left: ${left};
    position: fixed;
    display: grid;
  `
})

const toAnimate = () => {
    anime({
    targets: ".screen-card",
    scale: [0, basicData.beforeLotteryLayout.scale],
    easing: 'cubicBezier(0.250, 0.460, 0.450, 0.940)',
    duration: 400
  })
}
const getUser = (index) => {
  let user = {};
  const memberVal = member.value
  if (memberVal) user = memberVal[index % member.value.length] || {}
  return user
}
bus.on('handleBeforeLotteryLayoutSetting', toAnimate)
bus.on('resetBtnClick', toAnimate)
onMounted(() => {
  nextTick(() => {
    toAnimate()
  })
})
</script>

<style lang="scss" scoped>
.screen-card {
  z-index: 3;
  position: fixed;
  top: 0;
  left: 0;
  .details {
    width: 100%;
  }
}
</style>