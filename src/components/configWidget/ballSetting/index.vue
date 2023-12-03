<template>
 <div class="lottery-layout">
    <div class="header-txt">球体相关动作设置</div>
    <div class="layout-form">
      <el-form
        ref="form"
        :model="ballConfig"
        label-width="auto"
        label-position="top"
        size="large"
      >
        <template 
          v-for="item in labelFieldArr" 
          :key="item.field">
          <el-form-item 
            v-if="item.field !== 'rotateLoop'"
            :label="item.label" 
            :prop="item.field">
            <el-input-number
              v-if="item.type === 'number'"
              v-model="ballConfig[item.field]"
              :step="item.step ? item.step : 1"
              controls-position="right"
              size="large"
            />
            <el-input 
              v-else 
              v-model="ballConfig[item.field]"></el-input>
          </el-form-item>
        </template>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
const ruleFormRef = ref()
const emit = defineEmits(['close', 'confirm']);
import { lotteryDataStore } from '../../../store'
const basicData = lotteryDataStore();

// 样式设置label
const labelFieldArr = [
  {
    label: '圆球比例',
    field: 'resolution',
    type: 'number',
    step: 0.1
  },
  {
    label: '是否循环旋转',
    field: 'rotateLoop',
    type: 'number'
  },
  {
    label: '抽奖旋转时间(毫秒ms)',
    field: 'rotateTime',
    type: 'number'
  },
  {
    label: '自动旋转时间(毫秒ms)',
    field: 'autoRotateTime',
    type: 'number'
  },
  {
    label: '相对左侧距离',
    field: 'ballRelativeLeftDistance'
  }
]
const ballConfig = ref({
  resolution: 1.1, // 当前圆球比例
  rotateLoop: 1000, // 是否循环旋转
  rotateTime: 3000, // 旋转时间,
  autoRotateTime: 60000, // 自动旋转时间
  ballRelativeLeftDistance: '27vw', // 相对左侧距离
})

onMounted(() => {
  ballConfig.value = JSON.parse(JSON.stringify(basicData.ballConfig))
})


// const validateForm = async () => {
//   if (!ruleFormRef.value) return
//   const isPass = await ruleFormRef.value.validate((valid, fields) => {
//     if (valid) {
//       return true
//     } else {
//       return false
//     }
//   })
//   return isPass
// }
defineExpose({
  ballConfig
})
</script>

<style lang="scss" scoped>
 .lottery-layout {
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
.tips {
  color: orange;
  font-weight: 700;
  margin-bottom: 20px;
}

</style>