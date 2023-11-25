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

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import Option from './components/option.vue'
import Group from './components/group.vue'
// import dragAndDrop from './dragAndDrop.js'
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
let uniId = '';
uniId = uniqueId('uniClass_')
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




// ####### 拖拽分组功能

const position = { elx: 0, ely: 0, touchx: 0, touchy: 0 }
const excludesClasses = ['zoom-img']
let DRAG = ''
let DROP = ''
let expireTimer = ''
let copyEl = ''
let draggingOptionIdentity = null
let dragover = -1
onMounted(() => {
  initDragAndDrop({
      drag: `.${uniId} .option-container-inner .qd-option-item`,
      drop: `.${uniId} .qd-optiongroup-item`
    })
})

onBeforeUnmount(() => {
  onBeforeDestory()
})
// option动画完成再initDragAndDrop
const onOptionTransitionend = () => {
  initDragAndDrop({
    drag: `.${uniId} .option-container-inner .qd-option-item`,
    drop: `.${uniId} .qd-optiongroup-item`
  })
}
// 初始化监听dom的事件
const initDragAndDrop = ({ drag, drop }) => {
  DRAG = drag
  DROP = drop
  const els = document.querySelectorAll(drag)
  for (let [index, el] of els.entries()) {
    if (el.startFn) continue
    el.option = props.optionList[index]
    // 这样写是为了能传参的前提下还能正确remove掉event
    el.startFn = evt => onTouchStart(el, evt)
    el.addEventListener('mousedown', el.startFn)
  }
}
// 销毁前清除监听
const onBeforeDestory = () => {
  if (!DRAG) return
  const els = document.querySelectorAll(DRAG)
  for (let el of els) {
    el.removeEventListener('mousedown', el.startFn)
  }
}
const onTouchStart = (el, evt) => {
  // 防止还没归位就创建了新的，导致旧的无法清除
  // 某些class排除在外，不触发
  const hasExcludeEl = (evt.path || evt.composedPath()).some(s => excludesClasses.some(className => {
    return className.includes(s.className) && s.className
  }))
  if (copyEl || hasExcludeEl) {
    return
  }
  evt.preventDefault()
  el.endFn = evt => onTouchEnd(el, evt)
  el.moveFn = evt => onTouchMove(el, evt)
  document.addEventListener('mousemove', el.moveFn)
  document.addEventListener('mouseup', el.endFn)
  // 按住有50ms了，才认为用户希望拖拽该元素
  expireTimer = setTimeout(() => {
    // 拖拽中的option
    draggingOptionIdentity = el.option.option_identity
    // 创建跟随手指的选项dom
    createdDragingEl(el)
    // 更新位置
    setPosition(evt, el)
  }, 50)
}
const onTouchEnd = (el, evt) => {
  // 按住有50ms了，才认为用户希望拖拽该元素
  clearTimeout(expireTimer)
  // 清除绑定在元素上的事件
  document.removeEventListener('mouseup', el.endFn)
  document.removeEventListener('mousemove', el.moveFn)
  // 判断是否在group内并进行进一步动作
  judge(el, evt, 'end').then(res => {
    const { clear } = res || {}
    if (clear) {
      // 清除copy出来拖拽的dom
      clearCopyDom()
    }
  })
}
const onTouchMove = (el, evt) => {
  if (copyEl) {

    // 主要用于设置拖拽中的样式、拖拽中经过drop group区域的样式
    judge(el, evt, 'move')
  } else {
    
    // 如果没有cpoyEl代表还没超过50ms就移动了，就手动touchEnd结束这次拖拽事件
    onTouchEnd(el, evt)
  }
}
// 设置copyEl位置
const setPosition = (evt, el) => {
  const { clientX, clientY } = evt
  if (copyEl) {
    // 有el代表是一次setPosition
    if (el) {
      const { x, y } = el.getBoundingClientRect()
      // 记录初始的el位置
      position.elx = x
      position.ely = y
      // 记录初始的手指touch位置
      position.touchx = clientX
      position.touchy = clientY
      // 一开始直接创建在原位
      copyEl.style.transform = `translate(${x + 'px'}, ${y + 'px'})`
    } else {
      const { touchx, touchy, elx, ely } = position
      // 初始el位置 + 这次touchmove到的位置 - 初始的touch位置 = 这次应该移动到的位置
      copyEl.style.transform = `translate(${elx + clientX - touchx + 'px'}, ${ely + clientY - touchy + 'px'})`
    }
  }
  return {
    x: clientX,
    y: clientY
  }
}
// 重置位置，使其取消拖动时回到选项原位
const restPosition = (el) => {
  return new Promise(resolve => {
    // 添加动画样式
    copyEl.classList.add('transition')
    // 去除拖拽中的样式
    copyEl.classList.remove('dragging-style')
    const { x, y, width, height } = el.getBoundingClientRect()
    const { x: copyX, y: copyY } = copyEl.getBoundingClientRect()
    copyEl.transitionendFn = () => {
      copyEl.removeEventListener('transitionend', copyEl.transitionendFn)
      // 找准动画帧resolve，防止卡顿
      requestAnimationFrame(resolve)
    }
    copyEl.addEventListener('transitionend', copyEl.transitionendFn)
    // 回到初始位置
    copyEl.style.transform = `translate(${x + 'px'}, ${y + 'px'})`
    // 重置回原来的宽高，防止抖动
    copyEl.style.width = `${width}px`
    copyEl.style.height = `${height}px`
    // 如果在原地没动的话，不会触发transitionend，所以直接resolve了
    if (copyX === x && copyY === y) {
      resolve()
    }
  })
}
// 拖拽进不预设选项的putarea的抛入动画的额外处理，其它通用抛入动画走putInAnimate
const putAreaAnimate = async (el, cancel) => {
  if (cancel) {
    // 如果设置组名时取消了，就让选项回到原位
    await restPosition(el)
  } else {
    // 如果创建了分组，就把当前选项丢入创建后的分组
    await putInAnimate()
  }
  // put的动画完成或者restPosition的动画完成后，就清除掉clone出来的dom
  clearCopyDom()
}
// 清除copy出来拖拽的dom
const clearCopyDom = () => {
  copyEl?.remove()
  copyEl = null
  draggingOptionIdentity = null
}
// 通用的选项抛入group的动画
const putInAnimate = (el) => {
  if (!el) {
    const identity = groupList[groupList.length - 1].group_identity
    el = $refs['group' + identity] && $refs['group' + identity][0]?.$el
  }
  const { x, y, width, height } = el.getBoundingClientRect()
  // 找准putarea的中心点
  const position = {
    x: x + width / 2,
    y: y + height / 2
  }
  return new Promise(resolve => {
    // transition css
    copyEl.classList.add('transition')
    // 选项拖拽中样式
    copyEl.classList.remove('dragging-style')
    // translate到中心点并形成动画transition
    copyEl.style.transform = `translate(calc(-50% + ${position.x}px), calc(-50% + ${position.y}px)) scale(0.5)`
    setTimeout(() => {
      // todo，动画完成后回调，懒得用transitionend事件了，直接用settimeout，以后发现时机不对的话可以改成事件监听再resolve
      resolve()
    }, 300)
  })
}
// 创建拖拽跟随手指的dom
const createdDragingEl = (el) => {
  copyEl = el.cloneNode(true)
  copyEl.classList.add('dragging-position', 'dragging-style', 'dragging-flag')
  document.body.appendChild(copyEl)
}
// 判断是否位于group的putarea
const judge = async (el, evt, type) => {
  if (!copyEl) {
    return
  }
  const { x, y } = setPosition(evt)
  // 查看当前position有哪些el
  const els = document.elementsFromPoint(x, y)
  const dropEls = document.querySelectorAll(DROP)
  // 当前将要put进入的group area
  let dropEl
  for (let dEl of dropEls) {
    for (let el of els) {
      if (el === dEl) {
        dropEl = dEl
        break
      }
    }
  }
  // 判断是否在putarea内
  if (dropEl) {
    const groupIndex = Number(dropEl.dataset.groupindex)
    // 设置当前移动到了哪个group上
    dragover = groupIndex
    if (type === 'end') {
      // 如果投入到了非模板提示分组中，就直接执行抛入动画
      if (groupIndex !== -1) {
        await putInAnimate(dropEl)
      }
      // 数据处理
      onChange({
        groupIndex,
        option: el.option,
        // 如果投入到了模板提示分组中，需要弹框后，根据选择的取消或者确定，来决定是投进建好的分组还是reset回原位
        // 直接把当前的el bind进去，相当于一个偏函数，具体调用流程可以看addGroupDialog
        callback: putAreaAnimate.bind(this, el),
        mode: groupIndex === -1 ? 'addGroup' : 'add'
      })
      // 清空dragover状态
      dragover = -1
    }
    // 如果投入到了模板提示分组中，需要把选项暂时固定住不清空，等上面传的callback来执行清空逻辑
    return { clear: groupIndex !== -1 }
  } else {
    // 清空dragover状态
    dragover = -1
    if (type === 'end') {
      // 回到原位
      await restPosition(el)
      // 清空clone出来的dom
      return { clear: true }
    }
  }
}
</script>

<style lang="scss" scoped>
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
  .qd-optiongroup-item {
    border: 1px solid #3e6fff;
  }
}

.drag-over {
  transform: scale(1.05);
  .qd-optiongroup-item {
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
  .qd-optiongroup-item {
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
