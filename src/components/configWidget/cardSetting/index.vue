<template>
  <div class="card-setting">
    <!-- <div class="title">排列设置</div> -->
    <div class="before-lottery-layout">
      <div class="header-txt">抽奖前卡片排列及位置</div>
      <div class="tips" v-if="isEnterLottery">已进入抽奖，不能修改</div> 
      <div class="layout-form">
        <el-form
          ref="form"
          :model="beforeLotteryLayout"
          label-width="auto"
          label-position="top"
          size="large"
        >
          <el-form-item v-for="item in layoutFormArr" :key="item.field" :label="item.label" :prop="item.field">
            <el-input-number
              :disabled="isEnterLottery"
              v-if="item.type === 'number'"
              v-model="beforeLotteryLayout[item.field]"
              :step="item.step ? item.step : 1"
              controls-position="right"
              size="large"
            />
            <el-input 
              v-else 
              :disabled="isEnterLottery"
              v-model="beforeLotteryLayout[item.field]"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="before-lottery-layout">
      <div class="header-txt">卡片样式设置</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { lotteryDataStore } from '../../../store'
const basicData = lotteryDataStore();

const layoutFormArr = ref([
  {
    label: '行数',
    field: 'rowCount',
    type: 'number'
  },
  {
    label: '列数',
    field: 'columnCount',
    type: 'number'
  },
  {
    label: '距离左侧位置',
    field: 'left',
  },
  {
    label: '距离顶部位置',
    field: 'top',
  },
  {
    label: '行间距',
    field: 'rowGap',
  },
  {
    label: '列间距',
    field: 'columnGap'
  },
  {
    label: '缩放',
    field: 'scale',
    type: 'number',
    step: '0.1'
  }
])
const beforeLotteryLayout = ref({
  rowCount: 3,
  rowCount: 3,
  rowGap: '10px', // 行间距
  columnGap: '10px', // 列间距
  scale: 0.5, 
  left: 10,
  top: 10
})
const isEnterLottery = computed(() => {
  return basicData.isEnterLottery
})
onMounted(() => {
  beforeLotteryLayout.value = JSON.parse(JSON.stringify(basicData.beforeLotteryLayout))
})
// 暴露属性
defineExpose({
  beforeLotteryLayout
})
</script>

<style lang="scss" scoped>
.card-setting {
  background-color: #f2fafe;
  border-radius: 10px;
  padding: 20px;
  .tips {
    color: orange;
    font-weight: 700;
    margin-bottom: 20px;
  }
  .title {
    font-weight: 500;
    font-size: 14px;
    text-align: left;
    padding-bottom: 10px;
  }
  .before-lottery-layout {
    .header-txt {
      text-indent: 10px;
      color: #fff;
      margin: 15px 0;
      background: linear-gradient(90deg,#656a79,#f2fafe);
      border-radius: 6px;
      line-height: 32px;
      text-align: left;
    }
    &:first-child {
      .header-txt {
        margin-top: 0;
      }
    }
  }
  .layout-form {
    .el-form {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 20px;
      .el-form-item--large {
        margin-bottom: 0px;
        > label {
          margin-bottom: 0;
        }
      }
    }
  }
}
</style>
<style lang="scss">
.layout-form {
  .el-input-group__append {
    padding: 0 10px;
  } 
}
</style>