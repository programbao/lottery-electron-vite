<template>
  <el-dialog
    class="base-modal-dialog isMoveDialog pointDialog"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :modal="false"
    :style="dialogStyle"
    v-model="dialogTableVisible"
    width="70%"
    title="系统配置">
    <div class="config-setting-list">
      <div class="item-setting" >
        <div class="setting-title">
          <div class="left">奖项设置</div>
          <!-- <div class="right">设置</div> -->
        </div>
        <prizeSetting />
      </div>
    </div>
  </el-dialog>
</template>

<script setup>
import { reactive, ref, onMounted, nextTick, computed } from 'vue'
import bus from '../../libs/bus'
import { initMoveEvent } from './moveEvent'
import { lotteryDataStore } from '../../store'
import prizeSetting from './prizeSetting.vue'
const basicData = lotteryDataStore();
const dialogTableVisible = ref(true)
const dialogStyle = computed(() => {
  return basicData.dialogStyle
});
const toggleConfig = () => {
  let isOpen = !dialogTableVisible.value
  dialogTableVisible.value = isOpen
  if (isOpen) {
    
  }
  if (!isFirstVisible && isOpen) {
    nextTick(() => {
      isFirstVisible = true;
      initMoveEvent(basicData)
    })
  }
}
let isFirstVisible = false;
bus.on('toggleConfig', toggleConfig)

const configList = [
  "奖项设置", // 替换 更新 上传奖项图片相关设置
  "卡片排列"
]

// onMounted(() => {
//   nextTick(() => {
//     console.log(1234567)
//     let el = document.querySelector(`.base-modal-dialog.isMoveDialog`)
//     console.log(el, '234243')
//     initMoveEvent()
//   })
// })
// const dialogMounted = () => {
//   console.log(1234566)
// }
</script>
<style lang="scss">
.base-modal-dialog.isMoveDialog {
  height: fit-content;
  box-shadow: 0px 2px 8px 0px rgba(51, 51, 51, 0.15);
  top: 15vh;
  // left: 20%;
  right: auto;
  bottom: auto;
  margin: 0 !important;
  // &.el-dialog {
  //   margin: auto;
  //   min-width: 100%;
  //   margin: 0 !important;
  // }
  .el-dialog__header {
    display: flex;
    align-items: center;
    border-bottom: 1px solid #e6e6e6;
    padding: 16px;
    cursor: move;
    .el-dialog__title {
      font-weight: 500;
      font-size: 16px;
      color: #303133;
      position: relative;
      left: 50%;
      transform: translateX(-50%);
    }
  }
}
.item-setting .setting-title {
    display: flex;
    justify-content: space-between;
    font-size: 16px;
    padding: 10px;
    font-weight: 700;
   .right {
    cursor: pointer;
    color: #409eff;
    font-size: 14px;
   }
}
</style>