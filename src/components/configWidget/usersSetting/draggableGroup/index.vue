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
        :class="{ dragging: draggingOptionIdentity, 'drag-over': dragover === index, 'no-transition': isEnterMode }"
        @click.native="onGroupClick({ group, index })"
      ></Group>
    </transition-group>

    <!--  选项  -->
    <div class="option-container">
      <transition-group
        class="option-container-inner"
        tag="div"
        name="flip-list"
        @after-enter="onOptionTransitionend"
        @after-leave="onOptionTransitionend"
      >
        <Option
          v-for="(option, index) of optionList"
          :option="option"
          :key="index"
        ></Option>
      </transition-group>
    </div>


  </div>
</template>

<script>
import { ref } from 'vue'
import Option from './components/option.vue'
import Group from './components/group.vue'
import dragAndDrop from './dragAndDrop.js'
import uniqueId from 'lodash/uniqueId.js'
  // mixins: [dragAndDrop]
const props = defineProps({
  groupList: {
    type: Array,
    default: () => []
  },
  optionList: {
    type: Array,
    default: () => []
  },
})
const isEnterMode = ref(false)
const uniId = ref()
uniId.value = uniqueId('uniClass_')
const groupContentDialog = ref()
const onGroupClick = (param) => {
  groupContentDialog.value.showDialog(param)
}
const onDeleteClick = (callback) => {
  // this.$refs.actionSheet.showActionsheet(callback)
}
const onChange = ({ groupIndex, option, callback, options, group, mode }) => {
  if (mode === 'addGroup') {
  
  } else if (mode === 'add' && groupIndex > -1) {
  } else if (['editGroup', 'deleteGroup'].includes(mode)) {
  }
}
</script>

<style lang="less" scoped>
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
  /deep/ .qd-optiongroup-item {
    border: 1px solid #3e6fff;
  }
}

.drag-over {
  transform: scale(1.05);
  /deep/ .qd-optiongroup-item {
    border: 2px solid #3e6fff;
    box-shadow: 0 4px 8px 0 rgba(50, 152, 255, 0.5);
    .information {
      display: none;
    }
    .content-title {
      border-bottom: none;
    }
    .content-tags {
      display: none;
    }
    .dragover-tips {
      display: flex;
    }
  }
}

.column4.drag-over {
  /deep/ .qd-optiongroup-item {
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
