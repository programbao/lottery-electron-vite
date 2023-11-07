<template>
  <div id="prizeBar">
    <div class="prize-mess">
      <label id="prizeType" class="prize-shine">{{currentPrize.text}}</label>
      <label id="prizeText" class="prize-shine">{{currentPrize.title}}</label>
      ，剩余<label id="prizeLeft" class="prize-shine">{{currentPrize.count}}</label>个
    </div>
    <ul class="prize-list">
      <li 
        v-for="item in prizes"
        :key="item.type"
        :id="'prize-item-' + item.type" 
        :class="[
          'prize-item', 
          item.type == currentPrize.type ? 'shine' : '' 
        ]">
            <div class="prize-img">
                <img :src="item.img" :alt="item.title">
            </div>
            <div class="prize-text">
              <h5 class="prize-title">{{item.text}} {{item.title}}</h5>
                <div class="prize-count">
                    <div class="progress">
                        <div 
                          :id="'prize-bar-' + item.type" 
                          class="progress-bar progress-bar-danger progress-bar-striped active" 
                          style="width: 100%;">
                        </div>
                    </div>
                    <div 
                      :id="'prize-count-' + item.type" 
                      class="prize-count-left">
                        {{item.count + "/" + item.count}}
                    </div>
                </div>
            </div>
        </li>`
    </ul>
  </div>
</template>

<script setup>
import { ref, onBeforeUnmount, onMounted, computed } from 'vue'
import bus from '../libs/bus'
import { lotteryDataStore } from '../store'
const basicData = lotteryDataStore();

// console.log(lotteryData, 'lotteryDatalotteryData')
const currentPrize = ref({});
const prizes = computed(() => {
  let prizes = basicData.prizeConfig.prizes;
  if (prizes) {
    currentPrize.value = prizes[prizes.length - 1]
  }
  return prizes
});
const setPrizeData = ({currentPrizeIndex, count, isInit}) => {
  let prizeElement = {};
  let currentPrize = basicData.prizes[currentPrizeIndex] ||  {
    type: -1,
    count: 0,
    text: "谢谢参与 undian telah selesai,terima kasih telah bergabung",
    title: "已结束",
    img: ""
  },
    type = currentPrize.type,
    elements = prizeElement[type],
    totalCount = currentPrize.count;

  if (!elements) {
    elements = {
      box: document.querySelector(`#prize-item-${type}`),
      bar: document.querySelector(`#prize-bar-${type}`),
      text: document.querySelector(`#prize-count-${type}`)
    };
    prizeElement[type] = elements;
  }

  if (!prizeElement.prizeType) {
    prizeElement.prizeType = document.querySelector("#prizeType");
    prizeElement.prizeLeft = document.querySelector("#prizeLeft");
    prizeElement.prizeText = document.querySelector("#prizeText");
  }

  if (isInit) {
    for (let i = prizes.length - 1; i > currentPrizeIndex; i--) {
      let type = prizes[i]["type"];
      document.querySelector(`#prize-item-${type}`).className =
        "prize-item done";
      document.querySelector(`#prize-bar-${type}`).style.width = "0";
      document.querySelector(`#prize-count-${type}`).textContent =
        "0" + "/" + prizes[i]["count"];
    }
  }

  if (basicData.lasetPrizeIndex !== currentPrizeIndex) {
    let lastPrize = basicData.prizes[basicData.lasetPrizeIndex],
      lastBox = document.querySelector(`#prize-item-${lastPrize.type}`);
    lastBox.classList.remove("shine");
    lastBox.classList.add("done");
    elements.box && elements.box.classList.add("shine");
    prizeElement.prizeType.textContent = currentPrize.text;
    prizeElement.prizeText.textContent = currentPrize.title;

    basicData.lasetPrizeIndex = currentPrizeIndex;
  }

  if (currentPrizeIndex < 0) {
    prizeElement.prizeType.textContent = "抽奖结束了，谢谢参与  undian telah selesai,terima kasih telah bergabung";
    prizeElement.prizeText.textContent = " ";
    prizeElement.prizeLeft.textContent = "";
    return;
  }

  count = totalCount - count;
  count = count < 0 ? 0 : count;
  let percent = (count / totalCount).toFixed(2);
  elements.bar && (elements.bar.style.width = percent * 100 + "%");
  elements.text && (elements.text.textContent = count + "/" + totalCount);
  prizeElement.prizeLeft.textContent = count;
};
const changePrize = () => {
  let luckys = basicData.currentPrize ? basicData.luckyUsers[basicData.currentPrize.type] : null;
  let luckyCount = (luckys ? luckys.length : 0) + (basicData.currentPrizeIndex >= 0 ? basicData.eachCount[basicData.currentPrizeIndex] : 0);
  // 修改左侧prize的数目和百分比
  setPrizeData({currentPrizeIndex: basicData.currentPrizeIndex, count: luckyCount});
}
const initHandlePrizeData = () => {
  const totalPrizeLen = basicData.prizeConfig.prizes.length - 1
  const currentIndex = basicData.currentPrizeIndex
  const needCount = totalPrizeLen - currentIndex
  let needChangeIndex = totalPrizeLen;
  const prizes = basicData.prizeConfig.prizes 
  for (let i = 0; i < needCount + 1; i++) {
    setPrizeData({ currentPrizeIndex: needChangeIndex, count: basicData.luckyUsers[prizes[needChangeIndex]["type"]].length })
    needChangeIndex -=1
  }
}
// 监听数据
// bus.on('initConfigDataEnd', initHandlePrizeData)
// onBeforeUnmount(() => {
//   bus.off('initConfigDataEnd', initHandlePrizeData)
// })
onMounted(() => {
  initHandlePrizeData();
})
bus.on('changePrize', changePrize)
bus.on('setPrizeData', setPrizeData)
</script>

<style lang="scss" scoped>
#prizeBar {
  position: fixed;
  left: 0;
  padding-left: 1.2vh;
  top: 1.2vh;
  z-index: 4;
}

.prize-list {
  position: fixed;
  top: 10vh;
  left: 20px;
  height: 90vh;
  overflow-y: auto;
  width: 25vw;
  padding: 0;
}
.prize-list::-webkit-scrollbar {
  display: none;
}
.prize-item {
  padding: 9px;
  margin: 20px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  flex-wrap: nowrap;
  background-color: rgba(0, 127, 127, 0.37);
  border: 1px solid rgba(127, 255, 255, 0.25);
  color: rgba(127, 255, 255, 0.75);
  width: 20vw;
  min-height: 15vh;
  box-sizing: border-box;
  transition: transform 1s ease-in;
}

.prize-item .prize-img {
  width: 8vh;
  height: 8vh;
  margin-right: 1.2vh;
  border-radius: 50%;
  background-color: #fff;
  text-shadow: 0 0 1vh rgba(0, 255, 255, 0.95);
  overflow: hidden;
}
#prize-item-1, #prize-item-2, #prize-item-3 {
  /* display: none; */
}
.prize-img img {
  width: 90%;
  height: 90%;
  position: relative;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.prize-text {
  flex: 1;
}

.prize-title {
  margin: 4px 0;
  font-size: 1vw;
}

.prize-count {
  padding: 4px 0;
  position: relative;
}

.prize-count .progress {
  height: 1.8vh;
  background: rgba(0, 0, 0, 0.5);
  padding: 1px;
  overflow: visible;
  border-radius: 1vh;
}

.progress .progress-bar {
  border-radius: 1.8vh;
  position: relative;
  animation: animate-positive 2s;
  background-color: #d9534f;
  height: 1.8vh;
  -webkit-transition: width 0.6s ease;
  -o-transition: width 0.6s ease;
  transition: width 0.6s ease;
}

.progress-bar.active {
  animation: reverse progress-bar-stripes 0.4s linear infinite,
    animate-positive 2s;
}

.progress-bar-striped {
  background-image: -webkit-linear-gradient(45deg,
      rgba(255, 255, 255, 0.15) 25%,
      transparent 25%,
      transparent 50%,
      rgba(255, 255, 255, 0.15) 50%,
      rgba(255, 255, 255, 0.15) 75%,
      transparent 75%,
      transparent);
  background-image: -o-linear-gradient(45deg,
      rgba(255, 255, 255, 0.15) 25%,
      transparent 25%,
      transparent 50%,
      rgba(255, 255, 255, 0.15) 50%,
      rgba(255, 255, 255, 0.15) 75%,
      transparent 75%,
      transparent);
  background-image: linear-gradient(45deg,
      rgba(255, 255, 255, 0.15) 25%,
      transparent 25%,
      transparent 50%,
      rgba(255, 255, 255, 0.15) 50%,
      rgba(255, 255, 255, 0.15) 75%,
      transparent 75%,
      transparent);
  -webkit-background-size: 8px 8px;
  background-size: 8px 8px;
}

@-webkit-keyframes animate-positive {
  0% {
    width: 0;
  }
}

@keyframes animate-positive {
  0% {
    width: 0;
  }
}

@-webkit-keyframes progress-bar-stripes {
  from {
    background-position: 8px 0;
  }

  to {
    background-position: 0 0;
  }
}

@-o-keyframes progress-bar-stripes {
  from {
    background-position: 8px 0;
  }

  to {
    background-position: 0 0;
  }
}

@keyframes progress-bar-stripes {
  from {
    background-position: 8px 0;
  }

  to {
    background-position: 0 0;
  }
}


.prize-count-left {
  position: absolute;
  color: #fff;
  right: 9px;
  font-size: 1vw;
  line-height: 1.6vh;
  top: 50%;
  transform: translateY(-50%);
}

.shine {
  box-shadow: 0 0 15px 0 rgba(0, 255, 255, 0.5);
  transform: scale(1.2);
  transform-origin: left center;
  position: relative;
  overflow: hidden;
}

.done {
  position: relative;
}

.done:after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  cursor: not-allowed;
}


.shine span {
  position: absolute;
  display: block
}

.shine span:nth-child(1) {
  top: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, transparent, #03e9f4);
  animation: animate1 1s linear infinite
}

@keyframes animate1 {
  0% {
    left: -100%
  }

  50%,
  100% {
    left: 100%
  }
}

.shine span:nth-child(2) {
  top: -100%;
  right: 0;
  width: 2px;
  height: 100%;
  background: linear-gradient(180deg, transparent, #03e9f4);
  animation: animate2 1s linear infinite;
  animation-delay: .25s
}

@keyframes animate2 {
  0% {
    top: -100%
  }

  50%,
  100% {
    top: 100%
  }
}

.shine span:nth-child(3) {
  bottom: 0;
  right: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(270deg, transparent, #03e9f4);
  animation: animate3 1s linear infinite;
  animation-delay: .50s
}

@keyframes animate3 {
  0% {
    right: -100%
  }

  50%,
  100% {
    right: 100%
  }
}

.shine span:nth-child(4) {
  bottom: -100%;
  left: 0;
  width: 2px;
  height: 100%;
  background: linear-gradient(360deg, transparent, #03e9f4);
  animation: animate4 1s linear infinite;
  animation-delay: .75s
}

@keyframes animate4 {
  0% {
    bottom: -100%
  }

  50%,
  100% {
    bottom: 100%
  }
}


.shine.prize-item {
  /* width: 24vh; */
  margin: 1.8vh 0;
}

.prize-mess {
  color: #fff;
  line-height: 5vh;
  font-size: 1.6vh;
  margin: 2.4vh 0;
}

.prize-shine {
  font-size: 4vh;
  font-weight: bold;
  color: #db5c58;
  vertical-align: middle;
  padding: 0 6px;
}
</style>