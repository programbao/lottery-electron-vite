<template>
    <el-form
      label-position="right"
      label-width="100px"
      :model="formLabelAlign"
      style="max-width: 90%"
      :rules="rules"
      ref="ruleFormRef"
    >
      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item label="背景墙图片" prop="bgImg">
            <div class="upload add" @click="importFile('bgImg')">
              <el-image
                v-if="formLabelAlign.bgImg"
                :src="formLabelAlign.bgImg"
                :zoom-rate="1.2"
                :max-scale="7"
                :min-scale="0.2"
                :initial-index="0"
                fit="contain"
              /> 
              <span v-else class="symbol">+</span>
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="屏幕墙图片" prop="screenImg">
            <div class="upload add" @click="importFile('screenImg')">
              <el-image
                v-if="formLabelAlign.screenImg"
                :src="formLabelAlign.screenImg"
                :zoom-rate="1.2"
                :max-scale="7"
                :min-scale="0.2"
                :initial-index="0"
                fit="contain"
              /> 
              <span v-else class="symbol">+</span>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item label="音乐文件" prop="musicFile">
            <div
              v-if="formLabelAlign.musicFile"
              :src="formLabelAlign.musicFile">
              请上传音频 
            </div>
            <el-button type="primary">请上传音频</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
</template>

<script setup>
import { ref, onMounted } from 'vue'
const ruleFormRef = ref()
const emit = defineEmits(['close', 'confirm']);
import { lotteryDataStore } from '../../../store'
const basicData = lotteryDataStore();
const rules = {
  bgImg: [
    {
      required: true,
      message: '请上传图片',
      trigger: 'blur',
    },
  ],
  screenImg: [
    {
      required: true,
      message: '请上传图片',
      trigger: 'blur',
    },
  ],
  musicFile: [
  {
      required: true,
      message: '请上传音频',
      trigger: 'blur',
    },
  ]
}
onMounted(() => {
  formLabelAlign.value = JSON.parse(JSON.stringify(basicData.otherResource))
})
const formLabelAlign = ref({
  screenImg: '',
  bgImg: '',
})
const importFile = async (key) => {
  let { fileUrl } = await myApi.importFile(JSON.stringify(['jpg', 'jpeg', 'png', 'gif', 'bmp']));
  if (fileUrl) {
    formLabelAlign.value[key] = fileUrl
  }
}
defineExpose({
  formLabelAlign
})
</script>

<style lang="scss" scoped>
.tips {
  color: orange;
  font-weight: 700;
  margin-bottom: 20px;
  // text-align: left;
  // padding-left: 30px;
}
.upload {
  // margin: 0.90%;
  width: 100%;
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 5px;
  position: relative;
  height: 200px;
  .el-image {
    width: 100%;
    height: 100%;
  }
  &:hover {
    border-color: #409eff;
    .mark-operation {
      opacity: 1;
    }
  }
}
.add {
  border: 1px dashed #ccc;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 40px;
  font-weight: lighter;
  cursor: pointer;
}
</style>