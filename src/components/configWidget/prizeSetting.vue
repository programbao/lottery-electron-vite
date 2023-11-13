<template>
  <div class="prize-setting">
    <draggable
        :list="prizes"
        ghost-class="ghost"
        chosen-class="chosenClass"
        animation="300"
        item-key="type"
        class="draggable-box" 
        handle=".move-icon"
        v-if="prizes.length > 0"
      >
        <template #item="{ element  }">
          <div class="item-prize item" :key="element.type">
            <el-image
              :class="'el-image-' + element.index"
              style="width: 100px; height: 100px"
              :src="element.img"
              :zoom-rate="1.2"
              :max-scale="7"
              :min-scale="0.2"
              :preview-src-list="srcList"
              :initial-index="element.index"
              fit="contain"
            /> 
            <el-tooltip
              class="box-item"
              effect="dark"
              :content="element.text"
              placement="top-start"
            >
              <div class="prize-text">{{ element.text }}</div>
            </el-tooltip>
            <div class="mark-operation">
              <el-icon class="move-icon" size="23" color="#fff"><Switch /></el-icon>
              <div class="center-btn">
                <el-icon size="23" color="#fff"><EditPen /></el-icon>
                <el-icon @click="handlePictureCardPreview(element)" size="23" color="#fff"><ZoomIn /></el-icon>
                <el-icon @click="deletePrize(element)" size="23" color="#fff"><Delete /></el-icon>
              </div>
            </div>
          </div> 
        </template>
        <template #footer>
          <div class="item-prize add">
            <span class="symbol">+</span>
          </div>
        </template>
        
      </draggable>
   
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { lotteryDataStore } from '../../store'
import draggable from "vuedraggable";
import bus from '../../libs/bus'
const basicData = lotteryDataStore();
const prizes = ref([]);
const initHandlePrizes = () => {
  if (basicData.prizes && basicData.prizes.length > 0) {
    prizes.value = JSON.parse(JSON.stringify(basicData.prizes)).map((item, index) => {
      item.index = index;
      return item
    });
  }
}
// 图片列表
const srcList = computed(() => {
  let list = []
  for (let i = 0; i < prizes.value.length; i++) {
    list.push(prizes.value[i].img)
  }
  return list
});
const deletePrize = (element) => {
  prizes.value = prizes.value.filter(item => item.type !== element.type)
}
const handlePictureCardPreview = (element) => {
  console.log(document.querySelector(`.el-image-${element.index}`), 'document.querySelector(`.el-image-${element.index}`)document.querySelector(`.el-image-${element.index}`)')
  let elImageDom = document.querySelector(`.el-image-${element.index}`);
  elImageDom && elImageDom.children[0].click();
  // dialogImageUrl.value = element.img
  // dialogVisible.value = true
}
bus.on('initConfigDataEnd', initHandlePrizes)
onMounted(() => {
  initHandlePrizes();
})
</script>

<style lang="scss" scoped>
.prize-setting > div {
  display: flex;
  flex-wrap: wrap;
  padding: 20px;
  background-color: #f2fafe;
  border-radius: 10px;
}
.item-prize {
  margin: 0.95%;
  width: 13.5%;
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 5px;
  position: relative;
  height: 140px;
  .prize-text {
    // width: 100px;
    text-align: center;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    cursor: pointer;
  }
  &.add {
    border: 1px dashed #ccc;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 40px;
    font-weight: lighter;
    cursor: pointer;
  }
  &:hover {
    border-color: #409eff;
    .mark-operation {
      opacity: 1;
    }
  }
  .mark-operation{
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    opacity: 0;
    transition: opacity 0.3s;
    background-color: rgba(0, 0, 0, 0.5);
    .move-icon {
      position: absolute;
      top: 10px;
      left: 10px;
      cursor: move;
    }
    .center-btn {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      column-gap: 10px;
      justify-content: center;
      align-items: center;
      text-align: center;
      .el-icon {
        cursor: pointer;
      }
    }
  }
}
</style>