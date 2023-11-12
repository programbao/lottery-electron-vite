<template>
  <div class="prize-setting">
    <div class="item-prize" v-for="(prize, index) in prizes">
      <el-image
        style="width: 100px; height: 100px"
        :src="prize.img"
        :zoom-rate="1.2"
        :max-scale="7"
        :min-scale="0.2"
        :preview-src-list="srcList"
        :initial-index="index"
        fit="cover"
      /> 
      <el-tooltip
        class="box-item"
        effect="dark"
        :content="prize.text"
        placement="top-start"
      >
        <div class="prize-text">{{ prize.text }}</div>
      </el-tooltip>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { lotteryDataStore } from '../../store'
const basicData = lotteryDataStore();
const prizes = computed(() => basicData.prizes);
const srcList = computed(() => {
  let list = []
  for (let i = 0; i < prizes.value.length; i++) {
    list.push(prizes.value[i].img)
  }
  return list
});
</script>

<style lang="scss" scoped>
.prize-setting {
  display: flex;
  flex-wrap: wrap;
}
.item-prize {
  padding: 20px;
  .prize-text {
    width: 100px;
    text-align: center;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    cursor: pointer;
  }
}
</style>