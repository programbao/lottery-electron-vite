<template>
  <!-- <el-dialog
    v-model="dialogVisible"
    width="50%"
    :close-on-click-modal="false"
    title="奖项编辑">
    
  </el-dialog> -->
  <lt-dialog
    :visible="dialogVisible"
    :title="openType === 'add' ? '新增奖项' : '编辑奖项'"
    @close="dialogVisible = false"
    @confirm="confirm">
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
          <el-form-item label="名称" prop="name">
            <el-input v-model="formLabelAlign.name" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="其他语言名称" prop="otherName">
            <el-input v-model="formLabelAlign.otherName" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item label="抽取总数" prop="count">
            <el-input-number
              v-model="formLabelAlign.count"
              :min="1"
              controls-position="right"
              size="large"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="每轮抽取数" prop="eachCount">
            <el-input-number
              v-model="formLabelAlign.eachCount"
              :min="1"
              controls-position="right"
              size="large"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="24">
          <el-form-item label="图片" prop="img">
            <div class="upload add" @click="importFile">
              <el-image
                v-if="formLabelAlign.img"
                :src="formLabelAlign.img"
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
    </el-form>
  </lt-dialog>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import ltDialog from '../../common/lt-dialog.vue'

const props = defineProps({
  editDialogVisible: {
    type: Boolean,
    required: true,
  },
  editData: {
    type: Object,
    required: true
  },
  openType: {
    type: String,
    required: true
  }
});
const ruleFormRef = ref()
const emit = defineEmits(['close', 'confirm']);
const dialogVisible = computed({
  get() {
    return props.editDialogVisible
  },
  set() {
    emit('close', false)
  }
})
const checkEachCount = (rule, value, callback) => {
  if (!value) {
    return callback(new Error('请输入抽取数量'))
  } 
  if (value > formLabelAlign.value.count) {
    callback(new Error('不能大于抽取总数'))
  } else {
    callback()
  }
}
const rules = {
  count: [
    {
      required: true,
      message: '请输入抽取数量',
      trigger: 'blur',
    },
  ],
  eachCount: [
    {
      required: true,
      validator: checkEachCount,
      trigger: 'blur',
    },
  ], 
  name: [
    {
      required: true,
      message: '请输入名称',
      trigger: 'blur',
    },
  ],
  img: [
    {
      required: true,
      message: '请上传图片',
      trigger: 'blur',
    },
  ]
}

const formLabelAlign = ref({
  count: 0,
  eachCount: 0,
  name: "",
  otherName: "",
  img: ''
})
watch(
  () => props.editDialogVisible,
  () => {
    if (props.editDialogVisible) {
      formLabelAlign.value = JSON.parse(JSON.stringify(props.editData))
      if (formLabelAlign.eachCount === undefined) {
        formLabelAlign.value.eachCount = formLabelAlign.value.count
      }
    }
  }
);

const importFile = async () => {
  let fileUrl = await myApi.importFile(JSON.stringify(['jpg', 'jpeg', 'png', 'gif', 'bmp']));
  if (fileUrl) {
    formLabelAlign.value.img = fileUrl
  }
}
const confirm = async () => {
  if (!ruleFormRef.value) return
  await ruleFormRef.value.validate((valid, fields) => {
    if (valid) {
      console.log('submit!')
      emit('confirm', formLabelAlign.value)
      emit('close', false)
    } else {
      console.log('error submit!', fields)
    }
  })
}
</script>

<style lang="scss" scoped>
.upload {
  // margin: 0.90%;
  width: 33.5%;
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 5px;
  position: relative;
  height: 140px;
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