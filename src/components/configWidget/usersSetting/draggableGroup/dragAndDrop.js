const position = { elx: 0, ely: 0, touchx: 0, touchy: 0 }
const excludesClasses = ['zoom-img']
export default {
  data () {
    return {
      DRAG: '',
      DROP: '',
      expireTimer: null,
      copyEl: null,
      draggingOptionIdentity: null,
      dragover: -1
    }
  },
  mounted () {
    this.initDragAndDrop({
      drag: `.${this.uniId} .option-container-inner .qd-option-item`,
      drop: `.${this.uniId} .qd-optiongroup-item`
    })
  },
  beforeDestroy () {
    this.onBeforeDestory()
  },
  methods: {
    // option动画完成再initDragAndDrop
    onOptionTransitionend () {
      this.initDragAndDrop({
        drag: `.${this.uniId} .option-container-inner .qd-option-item`,
        drop: `.${this.uniId} .qd-optiongroup-item`
      })
    },
    // 初始化监听dom的事件
    initDragAndDrop ({ drag, drop }) {
      this.DRAG = drag
      this.DROP = drop
      const els = document.querySelectorAll(drag)
      for (let [index, el] of els.entries()) {
        if (el.startFn) continue
        el.option = this.optionList[index]
        // 这样写是为了能传参的前提下还能正确remove掉event
        el.startFn = evt => this.onTouchStart(el, evt)
        el.addEventListener('mousedown', el.startFn)
      }
    },
    // 销毁前清除监听
    onBeforeDestory () {
      if (!this.DRAG) return
      const els = document.querySelectorAll(this.DRAG)
      for (let el of els) {
        el.removeEventListener('mousedown', el.startFn)
      }
    },
    onTouchStart (el, evt) {
      // 防止还没归位就创建了新的，导致旧的无法清除
      // 某些class排除在外，不触发
      const hasExcludeEl = (evt.path || evt.composedPath()).some(s => excludesClasses.some(className => {
        return className.includes(s.className) && s.className
      }))
      if (this.copyEl || hasExcludeEl) {
        return
      }
      evt.preventDefault()
      el.endFn = evt => this.onTouchEnd(el, evt)
      el.moveFn = evt => this.onTouchMove(el, evt)
      document.addEventListener('mousemove', el.moveFn)
      document.addEventListener('mouseup', el.endFn)
      // 按住有50ms了，才认为用户希望拖拽该元素
      this.expireTimer = setTimeout(() => {
        // 拖拽中的option
        this.draggingOptionIdentity = el.option.option_identity
        // 创建跟随手指的选项dom
        this.createdDragingEl(el)
        // 更新位置
        this.setPosition(evt, el)
      }, 50)
    },
    onTouchEnd (el, evt) {
      // 按住有50ms了，才认为用户希望拖拽该元素
      clearTimeout(this.expireTimer)
      // 清除绑定在元素上的事件
      document.removeEventListener('mouseup', el.endFn)
      document.removeEventListener('mousemove', el.moveFn)
      // 判断是否在group内并进行进一步动作
      this.judge(el, evt, 'end').then(res => {
        const { clear } = res || {}
        if (clear) {
          // 清除copy出来拖拽的dom
          this.clearCopyDom()
        }
      })
    },
    onTouchMove (el, evt) {
      if (this.copyEl) {

        // 主要用于设置拖拽中的样式、拖拽中经过drop group区域的样式
        this.judge(el, evt, 'move')
      } else {
        
        // 如果没有cpoyEl代表还没超过50ms就移动了，就手动touchEnd结束这次拖拽事件
        this.onTouchEnd(el, evt)
      }
    },
    // 设置copyEl位置
    setPosition (evt, el) {
      const { clientX, clientY } = evt
      if (this.copyEl) {
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
          this.copyEl.style.transform = `translate(${x + 'px'}, ${y + 'px'})`
        } else {
          const { touchx, touchy, elx, ely } = position
          // 初始el位置 + 这次touchmove到的位置 - 初始的touch位置 = 这次应该移动到的位置
          this.copyEl.style.transform = `translate(${elx + clientX - touchx + 'px'}, ${ely + clientY - touchy + 'px'})`
        }
      }
      return {
        x: clientX,
        y: clientY
      }
    },
    // 重置位置，使其取消拖动时回到选项原位
    restPosition (el) {
      return new Promise(resolve => {
        // 添加动画样式
        this.copyEl.classList.add('transition')
        // 去除拖拽中的样式
        this.copyEl.classList.remove('dragging-style')
        const { x, y, width, height } = el.getBoundingClientRect()
        const { x: copyX, y: copyY } = this.copyEl.getBoundingClientRect()
        this.copyEl.transitionendFn = () => {
          this.copyEl.removeEventListener('transitionend', this.copyEl.transitionendFn)
          // 找准动画帧resolve，防止卡顿
          requestAnimationFrame(resolve)
        }
        this.copyEl.addEventListener('transitionend', this.copyEl.transitionendFn)
        // 回到初始位置
        this.copyEl.style.transform = `translate(${x + 'px'}, ${y + 'px'})`
        // 重置回原来的宽高，防止抖动
        this.copyEl.style.width = `${width}px`
        this.copyEl.style.height = `${height}px`
        // 如果在原地没动的话，不会触发transitionend，所以直接resolve了
        if (copyX === x && copyY === y) {
          resolve()
        }
      })
    },
    // 拖拽进不预设选项的putarea的抛入动画的额外处理，其它通用抛入动画走putInAnimate
    async putAreaAnimate (el, cancel) {
      if (cancel) {
        // 如果设置组名时取消了，就让选项回到原位
        await this.restPosition(el)
      } else {
        // 如果创建了分组，就把当前选项丢入创建后的分组
        await this.putInAnimate()
      }
      // put的动画完成或者restPosition的动画完成后，就清除掉clone出来的dom
      this.clearCopyDom()
    },
    // 清除copy出来拖拽的dom
    clearCopyDom () {
      this.copyEl?.remove()
      this.copyEl = null
      this.draggingOptionIdentity = null
    },
    // 通用的选项抛入group的动画
    putInAnimate (el) {
      if (!el) {
        const identity = this.groupList[this.groupList.length - 1].group_identity
        el = this.$refs['group' + identity] && this.$refs['group' + identity][0]?.$el
      }
      const { x, y, width, height } = el.getBoundingClientRect()
      // 找准putarea的中心点
      const position = {
        x: x + width / 2,
        y: y + height / 2
      }
      return new Promise(resolve => {
        // transition css
        this.copyEl.classList.add('transition')
        // 选项拖拽中样式
        this.copyEl.classList.remove('dragging-style')
        // translate到中心点并形成动画transition
        this.copyEl.style.transform = `translate(calc(-50% + ${position.x}px), calc(-50% + ${position.y}px)) scale(0.5)`
        setTimeout(() => {
          // todo，动画完成后回调，懒得用transitionend事件了，直接用settimeout，以后发现时机不对的话可以改成事件监听再resolve
          resolve()
        }, 300)
      })
    },
    // 创建拖拽跟随手指的dom
    createdDragingEl (el) {
      this.copyEl = el.cloneNode(true)
      this.copyEl.classList.add('dragging-position', 'dragging-style', 'dragging-flag')
      document.body.appendChild(this.copyEl)
    },
    // 判断是否位于group的putarea
    async judge (el, evt, type) {
      if (!this.copyEl) {
        return
      }
      const { x, y } = this.setPosition(evt)
      // 查看当前position有哪些el
      const els = document.elementsFromPoint(x, y)
      const dropEls = document.querySelectorAll(this.DROP)
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
        this.dragover = groupIndex
        if (type === 'end') {
          // 如果投入到了非模板提示分组中，就直接执行抛入动画
          if (groupIndex !== -1) {
            await this.putInAnimate(dropEl)
          }
          // 数据处理
          this.onChange({
            groupIndex,
            option: el.option,
            // 如果投入到了模板提示分组中，需要弹框后，根据选择的取消或者确定，来决定是投进建好的分组还是reset回原位
            // 直接把当前的el bind进去，相当于一个偏函数，具体调用流程可以看addGroupDialog
            callback: this.putAreaAnimate.bind(this, el),
            mode: groupIndex === -1 ? 'addGroup' : 'add'
          })
          // 清空dragover状态
          this.dragover = -1
        }
        // 如果投入到了模板提示分组中，需要把选项暂时固定住不清空，等上面传的callback来执行清空逻辑
        return { clear: groupIndex !== -1 }
      } else {
        // 清空dragover状态
        this.dragover = -1
        if (type === 'end') {
          // 回到原位
          await this.restPosition(el)
          // 清空clone出来的dom
          return { clear: true }
        }
      }
    }
  }
}

