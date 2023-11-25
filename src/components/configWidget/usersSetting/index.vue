<template>
  <div class="users-setting">
    <draggableGroup
      :optionList="ungroupedOptionList"
      :groupList="groupList"
      @change="onChange" 
    />
  </div>
</template>

<script setup>
import draggableGroup from './draggableGroup/index.vue'
const ungroupedOptionList = [
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
]
const groupList = [
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
]
const onChange = () => {}
</script>

<style lang="scss" scoped>

</style>