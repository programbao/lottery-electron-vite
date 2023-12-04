<template>
  <el-dialog
    class="base-modal-dialog isMoveDialog"
    :class="dialogKeyStr"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :modal="false"
    :show-close="false"
    :style="dialogStyle"
    v-model="dialogTableVisible"
    width="70%"
    >
    <template #header>
      <slot name="title"><span class="title-text">文件列表</span></slot>
      <!-- <div class="title-btn confirm-btn" type="confirm" @click="confirm">
        <div class="label label-confirm"></div>
        确认
      </div> -->
      <div class="title-btn cancel-btn" type="cancel"  @click="dialogTableVisible = false">
        <div class="label label-cancel"></div>
        关闭
      </div>
    </template>
    <!-- <div class="setting-content"> -->
      <checkFileList 
        :key="dialogTableVisible"
        ref="checkFileListRef" />
    <!-- </div> -->
  </el-dialog>
</template>

<script setup>
import { ref, nextTick, computed } from 'vue'
import { ElMessage } from 'element-plus'
import bus from '../../../libs/bus'
import { initMoveEvent } from '../moveEvent'
import { lotteryDataStore } from '../../../store'
import checkFileList from './index.vue'
const basicData = lotteryDataStore();
const dialogTableVisible = ref(false);
const dialogKeyStr = 'checkFileList';
const dialogStyle = computed(() => {
  return basicData['dialogStyle_' + dialogKeyStr] || basicData.dialogStyle
});
let isFirstVisible = false;
const toggleConfig = () => {
  let isOpen = !dialogTableVisible.value
  dialogTableVisible.value = isOpen
  if (!isFirstVisible && isOpen) {
    nextTick(() => {
      isFirstVisible = true;
      initMoveEvent(basicData, dialogKeyStr)
    })
  }
}

// 暴露属性
defineExpose({
  toggleConfig
})
</script>
