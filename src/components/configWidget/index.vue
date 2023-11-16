<template>
  <el-dialog
    class="base-modal-dialog isMoveDialog pointDialog"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :modal="false"
    :show-close="false"
    :style="dialogStyle"
    v-model="dialogTableVisible"
    width="70%"
    title="系统配置">
    <template #header>
      <slot name="title"><span class="title-text">系统配置</span></slot>
      <div class="title-btn confirm-btn" type="confirm" @click="confirm">
        <div class="label label-confirm"></div>
        确认
      </div>
      <div class="title-btn cancel-btn" type="cancel"  @click="dialogTableVisible = false" >
        <div class="label label-cancel"></div>
        取消
      </div>
    </template>
    <div class="config-setting-list">
      <div class="item-setting" >
        <div class="setting-title">
          <div class="left">奖项设置</div>
          <!-- <div class="right">设置</div> -->
        </div>
        <prizeSetting 
          @cutPrize="cutPrize"
          @addPrize="addPrize"
          ref="prizeSettingRef" />
      </div>
    </div>
  </el-dialog>
</template>

<script setup>
import { ref, onMounted, nextTick, computed } from 'vue'
import { ElMessage } from 'element-plus'
import bus from '../../libs/bus'
import { initMoveEvent } from './moveEvent'
import { lotteryDataStore } from '../../store'
import prizeSetting from './prizeSetting/index.vue'
const basicData = lotteryDataStore();
const dialogTableVisible = ref(false)
const dialogStyle = computed(() => {
  return basicData.dialogStyle
});
let cutNum = 0;
let addNum = 0;
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
// 删除奖项
const cutPrize = () => {
  cutNum++
}
const addPrize = () => {
  addNum++
}
const configList = [
  "奖项设置", // 替换 更新 上传奖项图片相关设置
  "卡片排列"
]
const prizeSettingRef = ref();
const confirm = async () => {
  console.log(cutNum, 'cutNumcutNum')
  const prizesData = JSON.parse(JSON.stringify(prizeSettingRef.value.prizes));
  // 删除不必存的字段
  const excludeFields = ['index', 'isHasLucky'];
  prizesData.forEach((prize) => {
    excludeFields.forEach((key) => {
      delete prize[key];
    })
  })
  const prizesDataStr = JSON.stringify(prizesData);
  if (prizesDataStr === JSON.stringify(basicData.prizes)) {
    dialogTableVisible.value = false;
    return
  }
  const isPass = await myApi.savePrizesConfig(prizesDataStr);
  if (isPass) {
    basicData.prizes = prizesData;
    dialogTableVisible.value = false;
    basicData.currentPrizeIndex = basicData.currentPrizeIndex - cutNum + addNum;
    basicData.eachCount = basicData.prizes.map(prize => prize.eachCount);
    ElMessage({
      message: '设置成功',
      type: 'success',
    })
  } else {
    ElMessage.error('设置失败')
  }
}

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
  .el-dialog__body {
    padding-top: 0px;
  }
}
.item-setting .setting-title {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    padding: 10px;
    font-weight: 700;
   .right {
    cursor: pointer;
    color: #409eff;
    font-size: 14px;
   }
}
.el-dialog__header {
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
</style>