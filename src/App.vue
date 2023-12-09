<script setup>
import { onMounted, ref, nextTick } from 'vue'
import BgBox from './components/BgBox.vue'
import LotteryContainer from './components/LotteryContainer.vue'
import OperationBtn from './components/OperationBtn.vue'
import PrizeBar from './components/PrizeBar.vue'
import PrizeMark from './components/PrizeMark.vue'
import LuckyUser from './components/LuckyUser.vue'
import ShowAllLuckyUser from './components/ShowAllLuckyUser.vue'
// import ConfigDialog from "./components/configWidget/index.vue"
import ScreenCard from './components/ScreenCard.vue'
// 引入store
import { lotteryDataStore } from './store'
const lotteryData = lotteryDataStore()
import GoDB from 'godb'
const operationDB = new GoDB('operationDB') // 连接数据库
window.operationLogTable = operationDB.table('operation_log') // 获取数据表
console.log(window.operationLogTable, 'window.operation_log')
// console.log(window.operationLogTable.getAll(), 'window.operation_log')
// window.operationLogTable.getAll().then((res) => {
//         console.log(res, 'window.operationLogTable.getAll()window.operationLogTable.getAll()')
// })
// import introJs from 'intro.js'
const isLoadingFinish = ref(false)
onMounted(async () => {
  await lotteryData.initConfigData()
  const loadingBoxDom = document.querySelector('.loading-box')
  // loadingBoxDom.style.opacity = 0.4
  loadingBoxDom.style.zIndex = -5
  setTimeout(() => {
    isLoadingFinish.value = true
    setTimeout(() => {
      // 新手指引
      nextTick(() => {
        let isIntroFirstScreen = localStorage.getItem("isIntroFirstScreen")
        if (isIntroFirstScreen && isIntroFirstScreen === "true") return
        introJs()
          .setOptions({
                overlayOpacity: 0.9,
                exitOnOverlayClick: false,
                exitOnEsc: false,
            steps: [
              {
                title: '欢迎使用抽奖系统',
                intro: '欢迎使用抽奖系统! 👋'
              },
              {
                element: document.querySelector('.prizes-empty-tips'),
                intro: '这是屏幕提示'
              },
              {
                title: '互动操作区',
                element: document.querySelector('.bottom-bar'),
                intro: `
                  <ul>
                    <li>1. 该程序能使用的功能</li>
                    <li>2. 一些必用的设置需知道："奖项设置","名单设置","导出抽奖结果","全屏"</li>
                  </ul>
                `
              },
              {
                title: '屏幕/背景图切换',
                element: document.querySelector('.bottom-bar .quick-operation'),
                intro: `
                  <ul>
                    <li>背景墙：该功能会把奖项和旋转人员名单隐藏，显示背景图</li>
                    <li>屏幕墙：该功能会把背景图、奖项和旋转人员名单隐藏，显示在最上面；图片可和背景图一样，也可不一样，根据实际需求来使用</li>
                    <li>展示奖项：该功能会显示出奖项和抽奖人员</li>
                  </ul> 
                `
              },
              {
                title: '抽奖设置',
                element: document.querySelector('.bottom-bar .setting'),
                intro: `
                  <ul>
                        <li><strong style="color:red">奖项设置</strong>: 管理奖项设置。<br>
                                <ul>
                                <li><strong>功能</strong>:
                                        <ul>
                                        <li>增加奖项：添加新的奖项。</li>
                                        <li>删除奖项：移除现有的奖项。</li>
                                        <li>修改奖项：编辑现有奖项的名称或描述。</li>
                                        </ul>
                                </li>
                                </ul>
                        </li>
                        <li><strong style="color:red">名单设置</strong>: 用于管理参与抽奖的名单。</li> 
                        <li><strong>卡片设置</strong>: 管理显示卡片的设置。</li> 
                        <li><strong>球体设置</strong>: 定制球体效果的设置。</li> 
                        <li><strong>文案设置</strong>: 管理文案显示的设置。</li> 
                        <li><strong>其他资源设置</strong>: 管理其他资源的设置，（用于更换背景、屏幕图以及音乐文件）。</li> 
                        <li><strong>操作日志</strong>: 记录操作日志。</li> 
                  </ul> 
                `
              },
              {
                title: '名单与导出',
                element: document.querySelector('.bottom-bar .other'),
                intro: `<ul>
                                <li><strong style="color:red">导出抽奖结果</strong>: 将抽奖结果导出为文件。</li>
                                <li><strong style="color:red">全屏</strong>: 展示界面全屏。</li>
                                <li><strong>文件列表</strong>: 查看上传的文件列表。</li> 
                                <li><strong>展示中奖名单</strong>: 展示当前中奖名单。</li> 
                                <li><strong>重置当前/上一轮奖项中奖名单</strong>: 重置当前或上一轮的中奖名单。</li> 
                                <li><strong>重置所有中奖名单</strong>: 重置所有中奖名单记录。</li> 
                        </ul>
                `
              },
              {
                title: '隐藏操作区',
                element: document.querySelector('.tips-bottom'),
                intro: '可隐藏操作区, 避免影响抽奖操作'
              }
            ]
          }) // 确认完毕之后执行的事件
            .onbeforeexit(() => {
              localStorage.setItem("isIntroFirstScreen", "true")
            })
          .start()
      })
    }, 500)
  }, 500)
})
</script>

<template>
  <div v-if="isLoadingFinish">
    <LotteryContainer />
    <OperationBtn />
    <PrizeBar />
    <PrizeMark />
    <LuckyUser />
    <ShowAllLuckyUser />
    <!-- <ConfigDialog /> -->
    <ScreenCard />
    <BgBox />
    <!-- <button @click="importFile">导入</button> -->
  </div>
</template>

<style scoped>
html,
body {
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
<style>
.el-dialog {
  max-width: 950px;
}
#lucky-close-icon {
  position: fixed;
  right: 20px;
  top: 20px;
  font-size: 2.5vh;
  padding: 1vh 2vw;
  margin: 0;
  color: rgba(127, 255, 255, 0.75);
  z-index: 1000;
}

.slide-out-top {
  -webkit-animation: slide-out-top 0.5s cubic-bezier(0.55, 0.085, 0.68, 0.53)
    both;
  animation: slide-out-top 0.5s cubic-bezier(0.55, 0.085, 0.68, 0.53) both;
}
@keyframes slide-out-top {
  0% {
    -webkit-transform: translateY(0);
    transform: translateY(0);
    opacity: 1;
  }
  100% {
    -webkit-transform: translateY(-1000px);
    transform: translateY(-1000px);
    opacity: 0;
  }
}
.slide-out-left {
  -webkit-animation: slide-out-left 0.5s cubic-bezier(0.55, 0.085, 0.68, 0.53)
    both;
  animation: slide-out-left 0.5s cubic-bezier(0.55, 0.085, 0.68, 0.53) both;
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
.slide-out-right {
  -webkit-animation: slide-out-right 0.5s cubic-bezier(0.55, 0.085, 0.68, 0.53)
    both;
  animation: slide-out-right 0.5s cubic-bezier(0.55, 0.085, 0.68, 0.53) both;
}
@keyframes slide-out-right {
  0% {
    -webkit-transform: translateX(0);
    transform: translateX(0);
    opacity: 1;
  }
  100% {
    -webkit-transform: translateX(1000px);
    transform: translateX(1000px);
    opacity: 0;
  }
}
.slide-out-bottom {
  -webkit-animation: slide-out-bottom 0.5s cubic-bezier(0.55, 0.085, 0.68, 0.53)
    both;
  animation: slide-out-bottom 0.5s cubic-bezier(0.55, 0.085, 0.68, 0.53) both;
}
@keyframes slide-out-bottom {
  0% {
    -webkit-transform: translateY(0);
    transform: translateY(0);
    opacity: 1;
  }
  100% {
    -webkit-transform: translateY(1000px);
    transform: translateY(1000px);
    opacity: 0;
  }
}

.slide-in-top {
  -webkit-animation: slide-in-top 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
  animation: slide-in-top 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
}
@keyframes slide-in-top {
  0% {
    -webkit-transform: translateY(-1000px);
    transform: translateY(-1000px);
    opacity: 0;
  }
  100% {
    -webkit-transform: translateY(0);
    transform: translateY(0);
    opacity: 1;
  }
}

.slide-in-right {
  -webkit-animation: slide-in-right 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)
    both;
  animation: slide-in-right 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
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

.slide-in-left {
  -webkit-animation: slide-in-left 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)
    both;
  animation: slide-in-left 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
}
@keyframes slide-in-left {
  0% {
    -webkit-transform: translateX(-1000px);
    transform: translateX(-1000px);
    opacity: 0;
  }
  100% {
    -webkit-transform: translateX(0);
    transform: translateX(0);
    opacity: 1;
  }
}

.slide-in-bottom {
  -webkit-animation: slide-in-bottom 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)
    both;
  animation: slide-in-bottom 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
}
@keyframes slide-in-bottom {
  0% {
    -webkit-transform: translateY(1000px);
    transform: translateY(1000px);
    opacity: 0;
  }
  100% {
    -webkit-transform: translateY(0);
    transform: translateY(0) translateX(-30%);
    opacity: 1;
  }
}

.slit-in-diagonal-1 {
  -webkit-animation: slit-in-diagonal-1 0.45s ease-out both;
  animation: slit-in-diagonal-1 0.45s ease-out both;
}
@keyframes slit-in-diagonal-1 {
  0% {
    -webkit-transform: translateZ(-800px) rotate3d(1, 1, 0, 90deg);
    transform: translateZ(-800px) rotate3d(1, 1, 0, 90deg);
    -webkit-animation-timing-function: ease-in;
    animation-timing-function: ease-in;
    opacity: 0;
  }
  54% {
    -webkit-transform: translateZ(-160px) rotate3d(1, 1, 0, 87deg);
    transform: translateZ(-160px) rotate3d(1, 1, 0, 87deg);
    -webkit-animation-timing-function: ease-in-out;
    animation-timing-function: ease-in-out;
    opacity: 1;
  }
  100% {
    -webkit-transform: translateZ(0) rotate3d(1, 1, 0, 0);
    transform: translateZ(0) rotate3d(1, 1, 0, 0);
    -webkit-animation-timing-function: ease-out;
    animation-timing-function: ease-out;
  }
}
.swing-out-top-bck {
  -webkit-animation: swing-out-top-bck 0.45s
    cubic-bezier(0.6, -0.28, 0.735, 0.045) both;
  animation: swing-out-top-bck 0.45s cubic-bezier(0.6, -0.28, 0.735, 0.045) both;
}
@keyframes swing-out-top-bck {
  0% {
    -webkit-transform: rotateX(0deg);
    transform: rotateX(0deg);
    -webkit-transform-origin: top;
    transform-origin: top;
    opacity: 1;
  }
  100% {
    -webkit-transform: rotateX(-100deg);
    transform: rotateX(-100deg);
    -webkit-transform-origin: top;
    transform-origin: top;
    opacity: 0;
  }
}

.bounce-top {
  -webkit-animation: bounce-top 1s 3 both;
  animation: bounce-top 1s 3 both;
}
@keyframes bounce-top {
  0% {
    -webkit-transform: translateY(-45px);
    transform: translateY(-45px);
    -webkit-animation-timing-function: ease-in;
    animation-timing-function: ease-in;
    opacity: 1;
  }
  24% {
    opacity: 1;
  }
  40% {
    -webkit-transform: translateY(-24px);
    transform: translateY(-24px);
    -webkit-animation-timing-function: ease-in;
    animation-timing-function: ease-in;
  }
  65% {
    -webkit-transform: translateY(-12px);
    transform: translateY(-12px);
    -webkit-animation-timing-function: ease-in;
    animation-timing-function: ease-in;
  }
  82% {
    -webkit-transform: translateY(-6px);
    transform: translateY(-6px);
    -webkit-animation-timing-function: ease-in;
    animation-timing-function: ease-in;
  }
  93% {
    -webkit-transform: translateY(-4px);
    transform: translateY(-4px);
    -webkit-animation-timing-function: ease-in;
    animation-timing-function: ease-in;
  }
  25%,
  55%,
  75%,
  87% {
    -webkit-transform: translateY(0px);
    transform: translateY(0px);
    -webkit-animation-timing-function: ease-out;
    animation-timing-function: ease-out;
  }
  100% {
    -webkit-transform: translateY(0px);
    transform: translateY(0px);
    -webkit-animation-timing-function: ease-out;
    animation-timing-function: ease-out;
    opacity: 1;
  }
}

.bounce-top-infinite {
  -webkit-animation: bounce-top-infinite 4s infinite alternate both;
  animation: bounce-top-infinite 4s infinite alternate both;
}
@keyframes bounce-top-infinite {
  0% {
    -webkit-transform: translateY(-45px);
    transform: translateY(-45px);
    -webkit-animation-timing-function: ease-in;
    animation-timing-function: ease-in;
    opacity: 1;
  }
  24% {
    opacity: 1;
  }
  40% {
    -webkit-transform: translateY(-24px);
    transform: translateY(-24px);
    -webkit-animation-timing-function: ease-in;
    animation-timing-function: ease-in;
  }
  65% {
    -webkit-transform: translateY(-12px);
    transform: translateY(-12px);
    -webkit-animation-timing-function: ease-in;
    animation-timing-function: ease-in;
  }
  82% {
    -webkit-transform: translateY(-6px);
    transform: translateY(-6px);
    -webkit-animation-timing-function: ease-in;
    animation-timing-function: ease-in;
  }
  93% {
    -webkit-transform: translateY(-4px);
    transform: translateY(-4px);
    -webkit-animation-timing-function: ease-in;
    animation-timing-function: ease-in;
  }
  25%,
  55%,
  75%,
  87% {
    -webkit-transform: translateY(0px);
    transform: translateY(0px);
    -webkit-animation-timing-function: ease-out;
    animation-timing-function: ease-out;
  }
  100% {
    -webkit-transform: translateY(0px);
    transform: translateY(0px);
    -webkit-animation-timing-function: ease-out;
    animation-timing-function: ease-out;
    opacity: 1;
  }
}
</style>
