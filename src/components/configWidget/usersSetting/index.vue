<template>
  <div class="users-setting">
    <draggableGroup
      @change="onChange" 
    />
  </div>
</template>

<script setup>
import draggableGroup from './draggableGroup/index.vue'

const onChange = () => {}
</script>

<style lang="scss" scoped>

</style>