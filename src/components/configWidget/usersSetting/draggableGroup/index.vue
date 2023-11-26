<template>
  <div class="qd-optiongroup-question">
    <el-button class="upload-users-btn" @click="uploadUsers">上传人员名单</el-button>
    <!--  分组  -->
    <transition-group
      v-if="groupList.length"
      class="group-container"
      tag="div"
      name="opacity-list"
      @before-enter="isEnterMode = true"
      @after-enter="isEnterMode = false"
    >
      <Group
        :ref="'group' + group.group_identity"
        :groupInfo="group"
        v-for="(group, index) of groupList"
        :showType="1"
        :length="groupList.length"
        :key="group.group_identity"
        :optionsMap="optionsMap"
        :class="{ dragging: isSelectMode, 'drag-over': group.isSelected }"
        @click.native="onGroupClick({ group, index })"
        @optionCancel="optionCancel"
      ></Group>
    </transition-group>
    <div class="no-data-tips" v-else>
      请上传人员名单
    </div>
    <div class="relate-box" v-if="isSelectMode">
      <el-button type="primary" plain @click="confirmRelated">确认关联</el-button>
      <el-button plain @click="cancelSelect">取消</el-button>
    </div>
    <!--  选项  -->
    <div class="option-container">
      <transition-group
        class="option-container-inner"
        tag="div"
        name="flip-list"
      >
        <Option
          v-for="(option, index) of optionList"
          :option="option"
          :key="index"
          :class="option.isSelected ? 'dragging-style' : ''"
          @click="optionClick(option)"
        ></Option>
      </transition-group>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
import Option from './components/option.vue'
import Group from './components/group.vue'
import { ElMessage } from 'element-plus'
import { nanoid } from 'nanoid';
import { lotteryDataStore } from '../../../../store'
const basicData = lotteryDataStore();
const optionList = ref([])
const groupList = ref([])
watch(() => basicData.prizes, () => {
  handleOptionList();
})
const handleOptionList = () => {
  let arr = [];
  basicData.prizes.forEach(item => {
    const option = optionList.value.find(option => option.option_identity === item.type) || {};
    arr.push(Object.assign(option, {
      option_value: item.name,
      option_identity: item.type
    }))
  })
  console.log(arr, 'arrarrarr')
  optionList.value = arr
  console.log(optionList, 'optionList.value')
}
// 页面初始化
onMounted(() => {
  nextTick(() => {
    groupList.value = JSON.parse(JSON.stringify(basicData.groupList)) 
    handleOptionList();
  })
})


const optionsMap = computed(() => {
  const map = {}
  optionList.value.forEach(item => {
    map[item.option_identity] = item
  })
  return map;
})
const optionClick = (option) => {
  if (option.related_group) return
  option.isSelected = !option.isSelected
  const group = groupList.value.find(item => item.isSelected)
  if (group) {
    group.options = group.options.filter(identity => optionsMap.value[identity].related_group)
    group.options = group.options.concat(optionList.value.filter(item => item.isSelected).map(item => item.option_identity));
  }
}
const isSelectMode = computed(() => {
  return optionList.value.some(item => item.isSelected)
})
const onGroupClick = ({ group, index }) => {
  if (!group) return
  groupList.value.forEach(item => {
    if (item.group_identity !== group.group_identity) {
      item.isSelected = false
    }
    item.options = item.options.filter(identity => optionsMap.value[identity].related_group)
  })
  group.isSelected = !group.isSelected
  if (group.isSelected) {
    group.options = group.options.concat(optionList.value.filter(item => item.isSelected).map(item => item.option_identity));
  }
}
const cancelSelect = () => {
  optionList.value.forEach(item => {
    item.isSelected = false
  })
  groupList.value.forEach(item => {
    item.isSelected = false
    item.options = item.options.filter(identity => optionsMap.value[identity].related_group)
  })
}
const confirmRelated = () => {
  const group = groupList.value.find(item => item.isSelected)
  if (group) {
    optionList.value.forEach(item => {
      if (item.isSelected) {
        item.related_group = group.group_identity
        item.isSelected = false
      }
    })
    group.isSelected = false
  } else {
    ElMessage({
      message: '请选择关联分组和选项',
      type: 'warning',
    })
  }
}
// 取消选择/关联
const optionCancel = (emitObj) => {
  const { option, groupIdentity } = emitObj
  const handleOption = optionList.value.find(item => item.option_identity === option.option_identity)
  handleOption.related_group = ""
  handleOption.isSelected = false

  const group = groupList.value.find(item => item.group_identity === groupIdentity)
  if (group) {
    group.options = group.options.filter(identity => identity !== option.option_identity)
  }
}
// 上传人员名单
const uploadUsers = async () => {
  try {
    const group_identity = `users_${nanoid()}`;
    const { fileUrl, savePath, fileName } = await myApi.importFile(JSON.stringify(["xlsx", "xls"]), group_identity);
    const isHasGroup = groupList.value.some(item => item.group_name === fileName);
    if (isHasGroup) {
      ElMessage({
        type: 'warning',
        message: '该分组名称，已存在在分组中'
      })
      return
    }
    const addGroup = {
      group_name: fileName,
      fileUrl,
      savePath,
      group_identity: group_identity,
      options: [],
      index: 0
    }
    groupList.value.push(addGroup)
    addGroup.index = groupList.value.length - 1
  } catch (error) {
    ElMessage({
      type: 'error',
      message: '上传失败',
    })
  }
}
</script>

<style lang="scss" scoped>
.no-data-tips {
  margin-bottom: 20px;
  color: orange;
  font-weight: 700;
}
.upload-users-btn {
  margin: 10px 16px;
}
.relate-box {
  margin: 10px 0 10px;
}
.flip-list-move {
  transition: transform 0.3s ease;
}

.flip-list-leave-active {
  position: absolute;
}

.opacity-list-leave-to {
  opacity: 0;
  transform: translateX(-100vw);
}

.opacity-list-leave-active {
  position: absolute;
  transition: all 0.3s linear;
}

.qd-optiongroup-question {
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  .group-container {
    padding: 0 16px 4px;
    display: flex;
    flex-wrap: wrap;
  }

  .option-container {
    padding: 20px 16px;
    flex: 1;
    overflow: auto;
    background: #fff;
    border-radius: 12px 12px 0 0;
    .option-container-inner {
      display: flex;
      flex-wrap: wrap;
    }
  }
}
.dragging {
  ::v-deep(.qd-optiongroup-item) {
    border: 1px solid #409eff;
  }
}
.dragging.isSelected {
  ::v-deep(.qd-optiongroup-item) {
    // border: 1px solid orange;
  } 
}

.drag-over {
  transform: scale(1.05);
  ::v-deep(.qd-optiongroup-item) {
    border: 2px solid #409eff;
    box-shadow: 0 4px 8px 0 rgba(50, 152, 255, 0.5);
    // .information {
    //   display: none;
    // }
    // .content-title {
    //   border-bottom: none;
    // }
    // .content-tags {
    //   display: none;
    // }
    // .dragover-tips {
    //   display: flex;
    // }
  }
}

.column4.drag-over {
  ::v-deep(.qd-optiongroup-item) {
    .information {
      display: flex;
    }
  }
}

.option-hidden {
  visibility: hidden;
}

.no-transition {
  transition: unset !important;
}
</style>
