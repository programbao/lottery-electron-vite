<template>
  <div class="qd-optiongroup-question" :class="uniId">
    <!--  分组  -->
    <transition-group
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
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import Option from './components/option.vue'
import Group from './components/group.vue'
import { ElMessage } from 'element-plus'
const optionList = ref([
  {
    option_value: '选项1',
    option_value_html: '<p>选项1</p>',
    option_identity: '98c22b7114274a0feda29034be2722f5',
  },
  {
    option_value: '选项2',
    option_value_html: '<p>选项2</p>',
    option_identity: '47479416e284803a9753a4bff1d5f9eb',
  },
  {
    option_value: '选项3',
    option_value_html: '<p>选项3</p>',
    option_identity: '131073a63a3cafd206d339e3e4573240',
  },
  {
    option_value: '选项4',
    option_value_html: '<p>选项4</p>',
    option_identity: 'ca2cc861f2584feef0538a361fbb65fc',
  },
  {
    option_value: '选项5',
    option_value_html: '<p>选项5</p>',
    option_identity: '132bf0f60ecf1efb4eb510b038ea9269',
  },
  {
    option_value: '选项6',
    option_value_html: '<p>选项6</p>',
    option_identity: '81c4530cc599311f04f7479276c5e5df',
  },
  {
    option_value: '选项7',
    option_value_html: '<p>选项7</p>',
    option_identity: '64368d3fd71b3989e22c74a03d22735a',
  }
])
const groupList = ref([
  {
    group_name: '分组一',
    group_name_html: '<p>分组一</p>',
    group_identity: 'a86cbf7122c55a54dbebd6c1acf919db',
    options: [],
    index: 0
  },
  {
    group_name: '分组二',
    group_name_html: '<p>分组二</p>',
    group_identity: 'fc4cb4b138c16157d71f26f990ab1410',
    options: [],
    index: 1
  }
])
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
</script>

<style lang="scss" scoped>
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
