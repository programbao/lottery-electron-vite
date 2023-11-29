<template>
  <div id="container"></div>
</template>

<script setup>
import { onMounted, onBeforeMount, onBeforeUnmount, ref, nextTick } from 'vue'
import { useToast } from "vue-toastification";
import bus from '../libs/bus'
const toast = useToast();
import { lotteryDataStore } from '../store'
const basicData = lotteryDataStore();
import { shineCard, getCardWithParentHtml, createCardWithParentDom, random, removeShineCard } from './handleElements'
import { ElMessage, ElLoading } from 'element-plus'
let camera;
let scene;
let renderer;
let controls;
let targets = {
  table: [],
  sphere: []
};
// 动画执行中
let isAnimating = false;
let rotateObj;

// let ROW_COUNT;
// let COLUMN_COUNT;

let paramsFields = {};
let animationId;
const animate = () => {
  // 让场景通过x轴或者y轴旋转
  // rotate && (scene.rotation.y += 0.088);
  animationId = requestAnimationFrame(animate);
  TWEEN.update();
  controls.update();
  // 渲染循环
  // render();
}
/**
 * 渲染地球等
 */

const transform = (targets, duration) => {
  isAnimating = true
  // TWEEN.removeAll();
  for (var i = 0; i < paramsFields.threeDCards.length; i++) {
    var object = paramsFields.threeDCards[i];
    var target = targets[i];
    // object.element.style.setProperty('position', 'absolute', 'important');
    new TWEEN.Tween(object.position)
      .to(
        {
          x: target.position.x,
          y: target.position.y,
          z: target.position.z
        },
        Math.random() * duration + duration
      )
      .easing(TWEEN.Easing.Exponential.InOut)
      .start();

    new TWEEN.Tween(object.rotation)
      .to(
        {
          x: target.rotation.x,
          y: target.rotation.y,
          z: target.rotation.z
        },
        Math.random() * duration + duration
      )
      .easing(TWEEN.Easing.Exponential.InOut)
      .start();
  }
  setTimeout(() => {
    isAnimating = false
  }, duration * 1.5)
  new TWEEN.Tween()
    .to({}, duration * 2)
    .onUpdate(render)
    .start().onComplete(() => {
    });
}

const render = () => {
  renderer.render(scene, camera);
}

const onWindowResize = () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  render();
}


const enterAnimate = (resetPrizeStatus = true) => {
  let containerDom = document.getElementById("container");
  // document.querySelector('.screen-card').style.display = 'none'
  bus.emit('adjuctScreenCardDisplay', 'none')
  containerDom.innerHTML = '';
  containerDom.style = '';
  camera = new THREE.PerspectiveCamera(
    40,
    window.innerWidth / window.innerHeight,
    1,
    10000
  );
  camera.position.z = 3000;
  scene = scene ? scene : new THREE.Scene();
  const ROW_COUNT = basicData.beforeLotteryLayout.rowCount;
  const COLUMN_COUNT = basicData.beforeLotteryLayout.columnCount;
  paramsFields.threeDCards = [];
  targets = {
    table: [],
    sphere: []
  };
  let index = 0;
  for (let i = 0; i < ROW_COUNT; i++) {
    if (index > paramsFields.totalMember - 1) break;
    for (let j = 0; j < COLUMN_COUNT; j++) {
      if (index > paramsFields.totalMember - 1) break;
      let isBold = paramsFields.HIGHLIGHT_CELL.includes(i + "-" + j);
      let user = paramsFields.member[index % paramsFields.totalMember];
      var element = createCardWithParentDom(
        user,
        isBold,
        index,
        paramsFields.showTable,
        `${i} - ${j}`,
        basicData
      );
      var object = new THREE.CSS3DObject(element);
      object.position.x = Math.random() * 4000 - 2000;
      object.position.y = Math.random() * 4000 - 2000;
      object.position.z = Math.random() * 4000 - 2000;
      scene.add(object);
      object.scale.set(1.5, 1.5, 1.5)
      paramsFields.threeDCards.push(object);
      index++;
    }
  }


  var vector = new THREE.Vector3();

  for (var i = 0, l = paramsFields.threeDCards.length; i < l; i++) {
    var phi = Math.acos(-1 + (2 * i) / l);
    var theta = Math.sqrt(l * Math.PI) * phi;
    var object = new THREE.Object3D();
    object.position.setFromSphericalCoords(800 * basicData.resolution, phi, theta);
    vector.copy(object.position).multiplyScalar(2);
    object.lookAt(vector);
    targets.sphere.push(object);
  }

  renderer = new THREE.CSS3DRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  // renderer.domElement.style = renderDomStyle;
  document.getElementById("container").appendChild(renderer.domElement);
  // // 创建和设置遮罩层
  controls = new THREE.TrackballControls(camera, renderer.domElement);
  controls.rotateSpeed = 0.5;
  controls.minDistance = 500;
  controls.maxDistance = 6000;
  controls.addEventListener("change", render);
  window.addEventListener("resize", onWindowResize, false);

  // 进入球体动画
  animate();
  transform(targets.sphere, 1500);
  if (resetPrizeStatus) {
    setTimeout(() => {
      basicData.isNextPrize = true
    }, 2000);
    // 触发通知处理进入抽奖结束时间
    bus.emit("enterLotteryEnd");
  }
}
// 清除销毁 three.js对象 相关绑定和处理对象
const cleanUp = () => {
  if (renderer) {
    controls.dispose(); // Dispose of the controls to prevent memory leaks

    // Remove all objects from the scene
    for (let i = scene.children.length - 1; i >= 0; i--) {
      const obj = scene.children[i];
      scene.remove(obj);
    }

    renderer.domElement.addEventListener('dblclick', null, false);
    window.removeEventListener('resize', onWindowResize, false);

    // Remove renderer and domElement
    document.getElementById('container').removeChild(renderer.domElement);
    renderer = null;
    // Set scene, camera, and other objects to null or undefined
    scene = null;
    camera = null;
    controls = null;
    cancelAnimationFrame(animationId);
    // Clean up any additional variables if necessary
    // otherVar = null;
  }
};

// 初始化卡片
const initCards = (isInit = true) => {
  document.querySelectorAll('.element').forEach(element => {
    paramsFields.threeDCards.push(element);
  })
}

const findCurrentLotteryGroup = () => {
  // 找到要展示的member
  const currentPrize = basicData.currentPrize;
  const userGroup = basicData.groupList.find(group => group.options.includes(currentPrize.type));
  console.log(userGroup)
  if (!userGroup) {
    return;
  }
  return userGroup;
}
const initParamsFieldsData = (userGroup) => {
  let isPass = true
  basicData.currentLotteryGroup = userGroup || {};
  const member = JSON.parse(JSON.stringify(basicData.memberListData[userGroup.group_identity] || []));
  if (member.length <= 0) {
    ElMessage({
      type: 'error',
      message: `未找到${basicData.currentPrize.name}的抽奖人员名单,请检查人员名单和奖项关联设置情况`
    })
    bus.emit('groupListSetting')
    isPass = false
  }
  paramsFields = {
    threeDCards: [],
    selectedCardIndex: [],
    member,
    isBold:  false,
    showTable: true,
    totalMember: member.length,
    HIGHLIGHT_CELL: [],
  }
  return isPass
}
const initHandleData = () => {
  cleanUp();
  // 找到要展示的member
  const userGroup = findCurrentLotteryGroup();
  if (!userGroup) {
    ElMessage({
      type: 'error',
      message: `未找到${basicData.currentPrize.name}的抽奖人员名单,请检查人员名单和奖项关联设置情况`
    })
    return
  }
  initParamsFieldsData(userGroup);
  initCards();
  // animate();
  // 随机切换背景和人员信息
  // shineCard(basicData, paramsFields);
}
// 球体旋转
const rotateBall = () => {
  return new Promise((resolve, reject) => {
    scene.rotation.y = 0;
    rotateObj = new TWEEN.Tween(scene.rotation);
    rotateObj
      .to(
        {
          y: Math.PI * 6 * basicData.rotateLoop
        },
        basicData.rotateTime * basicData.rotateLoop
      )
      .onUpdate(render)
      // .easing(TWEEN.Easing.Linear)
      .start()
      .onStop(() => {
        scene.rotation.y = 0;
        resolve();
      })
      .onComplete(() => {
        resolve();
      });
  });
}
/**
 * 抽奖
 */
 const lottery = () => {
  if (basicData.isNextPrize) return;
  basicData.isLotting = true;
  rotateBall().then(() => {
    // 将之前的记录置空
    basicData.currentLuckys = [];
    paramsFields.selectedCardIndex = [];
    // 当前同时抽取的数目,当前奖品抽完还可以继续抽，但是不记录数据
    let perCount = basicData.eachCount[basicData.currentPrizeIndex];
    let luckyData = basicData.luckyUsers[basicData.currentPrize.type];
    let leftCount = paramsFields.totalMember;
    let leftPrizeCount = basicData.currentPrize.count - (luckyData ? luckyData.length : 0);

    if (leftCount < perCount) {
      toast.error("剩余参与抽奖人员不足，现在重新设置所有人员可以进行二次抽奖！  Jumlah orang yang tersisa untuk berpartisipasi dalam lotere tidak mencukupi. Sekarang setel ulang semua orang untuk membuat lotere kedua!");
      perCount = leftCount
      return
    }
    for (let i = 0; i < perCount; i++) {
      let luckyId = random(leftCount);
      basicData.currentLuckys.push(paramsFields.member.splice(luckyId, 1)[0]);
      leftCount--;
      leftPrizeCount--;
      // let cardIndex = random(basicData.totalCards);
      // while (selectedCardIndex.includes(cardIndex)) {
      //   cardIndex = random(basicData.totalCards);
      // }
      // paramsFields.selectedCardIndex.push(cardIndex);
      if (leftPrizeCount === 0) {
        break;
      }
    }

    // 动画结束处理相关状态
    setTimeout(() => {
      basicData.isLotting = false;
      // 改变奖品状态
      // changePrize();
      // if (!basicData.isReLottery) {
        bus.emit('changePrize')
      // }
      basicData.isReLottery = false
      changePrizeStatus();
      // basicData.currentPrizeIndex--;
      // basicData.currentPrize = basicData.prizes[basicData.currentPrizeIndex];
      // setTimeout(() => {
      //   bus.emit('setPrizeData', {
      //     currentPrizeIndex: basicData.currentPrizeIndex,
      //     count: 0,
      //     isInit: true
      //   })
      // }, 200)
      // basicData.isNextPrize = true;
    }, 500)
    // 抽中之后要处理的事
    basicData.isShowLuckyUser = true;
    console.log(basicData.currentLuckys);
    // selectCard();
  });
}
const changePrizeStatus = () => {
  let type = basicData.currentPrize.type,
    curLucky = basicData.luckyUsers[type] || [];

  curLucky = curLucky.concat(basicData.currentLuckys);
  basicData.luckyUsers[type] = curLucky;
  basicData.lastTimePrizeIndex = basicData.currentPrizeIndex;
  if (basicData.currentPrize.count <= curLucky.length) {
    basicData.currentPrizeIndex--;
    basicData.currentPrize = basicData.prizes[basicData.currentPrizeIndex];
    setTimeout(() => {
      bus.emit('setPrizeData', {
        currentPrizeIndex: basicData.currentPrizeIndex,
        count: 0,
        isInit: true
      })
    }, 200)
    basicData.isNextPrize = true;
    // if (currentPrizeIndex <= -1) {
    //   currentPrizeIndex = 0;
    // }
    // currentPrize = basicData.prizes[currentPrizeIndex];
  }
}
/**
 * 保存上一次的抽奖结果
 */
const saveData = () => {
  if (!basicData.currentPrize) {
    //若奖品抽完，则不再记录数据，但是还是可以进行抽奖
    return Promise.resolve();
  }
  let type = basicData.prizes[basicData.lastTimePrizeIndex]['type']
  if (basicData.currentLuckys.length > 0) {
    // todo 添加数据保存机制，以免服务器挂掉数据丢失
    return myApi.setData(type, JSON.stringify(basicData.currentLuckys));
  }
  return Promise.resolve();
}


/**
 * 重置抽奖牌内容
 */
const resetCard = (duration = 500, model) => {
  if (basicData.currentLuckys.length === 0) {
    return Promise.resolve();
  }
  // debugger
  paramsFields.selectedCardIndex.forEach(index => {
    let object = paramsFields.threeDCards[index],
      target = targets.sphere[index];

    new TWEEN.Tween(object.position)
      .to(
        {
          x: -10000,
          y: -10000,
          z: -10000
        },
        Math.random() * duration + duration
      )
      .easing(TWEEN.Easing.Exponential.InOut)
      .start();

    new TWEEN.Tween(object.rotation)
      .to(
        {
          x: target.rotation.x,
          y: target.rotation.y,
          z: target.rotation.z
        },
        Math.random() * duration + duration
      )
      .easing(TWEEN.Easing.Exponential.InOut)
      .start();
  });

  return new Promise((resolve, reject) => {
    new TWEEN.Tween(this)
      .to({}, duration * 2)
      .onUpdate(render)
      .start()
      .onComplete(() => {
        paramsFields.selectedCardIndex.forEach(index => {
          let object = paramsFields.threeDCards[index];
          if (!object)  {
            // debugger
            return
          }
          // debugger
          if(object.element.classList.value.includes("prize") && model === "lottery") {
            // object.element.remove();
            scene.remove(object);
            paramsFields.threeDCards[index] = null
            basicData.totalCards--;
            // console.log(object.element, 'object.element')
          } else {
            object.element.classList.remove("prize");
          }
        });
        paramsFields.threeDCards = paramsFields.threeDCards.filter(item => item)
        // if (model === "lottery") {
        //   currentLuckys = []
        // }
      });
    setTimeout(() => {
      resolve();
    }, duration * 1)
  });
}

const waitHandleEvent = () => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve()
    }, 2000)
  }) 
}
// 重新/切换设置抽奖名单
const switchLotteryMemberData = (userGroup, resetPrizeStatus = true) => {
  basicData.currentLotteryGroup = userGroup;
  const isPass = initParamsFieldsData(userGroup);
  adjustCardConfigStyleSetting(resetPrizeStatus);
  return isPass
}
const lotteryActiveFn = async () => {
  if (!basicData.currentPrize) {
    resetCard(500).then(res => {
      // showAllPrizes();
      bus.emit('showAllPrizes')
    })
    toast.info(`抽奖已结束，谢谢参与 undian telah selesai,terima kasih telah bergabung`, { 
      duration: 3000
    });
    document.querySelector("#lottery").remove();
    return
  }
  if (paramsFields.threeDCards.length <= 0) {
    toast.error("剩余参与抽奖人员不足，现在重新设置所有人员可以进行二次抽奖！");
    return;
  }
  basicData.isLotting = true
  // paramsFields.isLotting = true;
  //更新剩余抽奖数目的数据显示
  if (!basicData.isNextPrize) {
    // 清除当前看见奖项
    // prizeMark.innerHTML = ''
    bus.emit('hidePrizeMark')
    // 隐藏抽奖名单
    basicData.isShowLuckyUser = false;
    // 每次抽奖前先保存上一次的抽奖数据
    await saveData();
    // 判断是否要切换抽奖 人员名单
    if (basicData.currentLotteryGroup) {
      const type = basicData.currentPrize.type;
      const userGroup = basicData.groupList.find(group => group.options.includes(type));
      if (userGroup.group_identity !== basicData.currentLotteryGroup.group_identity) {
        const loading = ElLoading.service({
          lock: true,
          text: '人员名单有变动,正在切换抽奖人员',
          background: 'rgba(0, 0, 0, 0.7)',
        })
        // basicData.currentLotteryGroup = userGroup || {};
        const isPass = switchLotteryMemberData(userGroup, false);
        // resetBallCards(basicData.users_hinduism_buddhism_confucianism);
        await waitHandleEvent();
        loading.close();
        if (!isPass) {
          return
        }
      }
    }

    // 抽奖
    lottery("lottery");
    toast.info(`正在抽取[${basicData.currentPrize.title}],调整好姿势  penghargaan sedang diundi,silahkan persiapkan diri`, { 
      timeout: 2000
    });
    return
  }
  resetCard(500, "lottery").then(async res => {
    if (basicData.isNextPrize) {
      // 入场下一个奖项
      bus.emit('showPrize')
      // 隐藏抽奖名单
      basicData.isShowLuckyUser = false;
      // 每次抽奖前先保存上一次的抽奖数据
      await saveData();
      basicData.isLotting = false;
      return
    }
     // 隐藏抽奖名单
     basicData.isShowLuckyUser = false;
    // 每次抽奖前先保存上一次的抽奖数据
    await saveData();
    // 抽奖
    lottery("lottery");
    toast.info(`正在抽取[${basicData.currentPrize.title}],调整好姿势  penghargaan sedang diundi,silahkan persiapkan diri`, { 
      timeout: 2000
    });
  });
}
const beginLottery = () => {
  if (isAnimating) {
    toast.info(`请等待动画加载完成  harap tunggu hingga animasi dimuat`, { 
      timeout: 2000
    });
    return
  }
  // 如果正在抽奖，则禁止一切操作
  if (basicData.isLotting) {
    rotateObj.stop();
    // if (e.target.id === "lottery") {
    //   rotateObj.stop();
    //   // btns.lottery.innerHTML = "开始抽奖 <br/> mulai undian";
    // } else {
    //   toast.info("正在抽奖，抽慢一点点～～  sedang diundi,undian perlahan~~");
    // }
    bus.emit('lotteryActive');
    return false;
  }
  lotteryActiveFn();
}
const resetBtnClick = async () => {
  basicData.currentLuckys = [];
  basicData.luckyUsers = {};
  basicData.currentPrizeIndex = basicData.prizes.length - 1;
  basicData.currentPrize = basicData.prizes[basicData.currentPrizeIndex];
  basicData.isShowLuckyUser = false;
  basicData.isContinueLottery = false
  // document.getElementById("container").classList.remove('slide-in-fwd-center');
  // document.querySelector('.screen-card').style.display = 'grid'
  bus.emit('adjuctScreenCardDisplay', 'grid')
  bus.emit('hidePrizeMark');
  // 移除闪烁定时器
  removeShineCard();
  initHandleData();
  bus.emit('resetPrizes');
  await myApi.resetData();
  rotateObj && rotateObj.stop();
}
// 移除当前中奖人员
const removeLuckyUser = () => {
  let type = basicData.currentPrize.type;
  let currentLuckys = basicData.currentLuckys.map(item => item[0]); // 提取currentLuckys的第一个元素

  if (basicData.luckyUsers[type]) {
    basicData.luckyUsers[type] = basicData.luckyUsers[type].filter(user => {
      return !currentLuckys.some(current => current === user[0]);
    });
  }
};
const reLottery = () => {
  basicData.isReLottery = true;
  basicData.isNextPrize = false
  if (basicData.currentPrizeIndex !== basicData.lastTimePrizeIndex) {
    basicData.currentPrizeIndex = basicData.lastTimePrizeIndex;
    basicData.currentPrize = basicData.prizes[basicData.currentPrizeIndex];
  }
  removeLuckyUser();
  lottery();
}

// 导出数据
const exportData = () => {
  saveData().then(async res => {
    let result = await myApi.handleExportData(); 
    console.log(result)
  })
}
const adjustCardConfigStyleSetting = (resetPrizeStatus = true) => {
  if (!basicData.isEnterLottery) return
  // 移除闪烁定时器
  removeShineCard();
  cleanUp();
  enterAnimate(resetPrizeStatus);
}
// bus.on('initConfigDataEnd', initHandleData)
// 处理人员名单变化处理
const groupListSetting = () => {
  const userGroup = findCurrentLotteryGroup();
  if (!userGroup && basicData.isEnterLottery) {
    // 移除闪烁定时器
    removeShineCard();
    cleanUp();
    bus.emit('adjuctScreenCardDisplay', 'grid')
  } else {
    if (userGroup && basicData.currentLotteryGroup.group_identity !== userGroup.group_identity) {
      switchLotteryMemberData(userGroup);
      // basicData.currentLotteryGroup = userGroup;
      // initParamsFieldsData(userGroup);
      // adjustCardConfigStyleSetting();
    }
  }
  basicData.currentLotteryGroup = userGroup || {};
}
bus.on('enterLottery', enterAnimate)
bus.on('beginLottery', beginLottery)
bus.on('resetBtnClick', resetBtnClick)
bus.on('reLottery', reLottery)
bus.on('exportData', exportData)
bus.on('cardConfigStyleSetting', adjustCardConfigStyleSetting)
bus.on('groupListSetting', groupListSetting)
onBeforeUnmount(() => {
  // bus.off('initConfigDataEnd', initHandleData)
  bus.off('enterLottery', enterAnimate)
  bus.off('beginLottery', beginLottery)
  bus.off('resetBtnClick', resetBtnClick)
  bus.off('reLottery', reLottery)
  bus.off('exportData', exportData)
  bus.off('cardConfigStyleSetting', adjustCardConfigStyleSetting)
})
onMounted(() => {
  nextTick(() => {
    initHandleData();
  })
})
</script>

<style lang="scss" scoped>
.none {
  display: none;
}

#container {
  z-index: 3;
  position: fixed;
  top: 0;
  left: 0;
}

#container.prize .element:not(.prize) {
  opacity: 0.50;
  transition: opacity 0.3s;
}

</style>
<style>
.element {
  box-shadow: 0 0 12px rgba(0, 255, 255, 0.5);
  border: 1px solid rgba(127, 255, 255, 0.25);
  text-align: center;
  cursor: default;
  transition: background-color 0.3s ease-in;
  position: relative;
}

.element:hover {
  box-shadow: 0 0 12px rgba(0, 255, 255, 0.75);
  border: 1px solid rgba(127, 255, 255, 0.75);
}

.element .company {
  position: absolute;
  right: 0;
  width: 100%;
  color: rgba(127, 255, 255, 0.75);
}

.element .name {
  position: absolute;
  /*top: 5.0vh;
  left: 0;
  right: 0;
  font-size: 3vh;
  */
  font-weight: bold;
  color: rgba(255, 255, 255, 0.75);
  text-shadow: 0 0 0vh rgba(0, 255, 255, 0.95);
}

.element .details {
  width: 100%;
  position: absolute;
 /* bottom: 1.2vh;
  left: 0;
  right: 0;
  font-size: 2.0vh;
 */
  color: rgba(127, 255, 255, 0.75);
}
.highlight {
  background-color: rgba(253, 105, 0, 0.95) !important;
  box-shadow: 0 0 12px rgba(253, 105, 0, 0.95);
  border: 1px solid rgba(253, 105, 0, 0.25);
}
.highlight .company,
.highlight .name,
.highlight .details {
  color: rgba(255, 255, 255, 0.85);
}

/*
.slide-in-fwd-center {
	-webkit-animation: slide-in-fwd-center 0.4s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
	        animation: slide-in-fwd-center 0.4s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
}
@-webkit-keyframes slide-in-fwd-center {
  0% {
    -webkit-transform: translateZ(-1400px) scale(0);
            transform: translateZ(-1400px) scale(0);
    opacity: 0;
  }
  100% {
    -webkit-transform: translateZ(0) scale(0.5);
            transform: translateZ(0) scale(0.5);
    opacity: 1;
  }
}
@keyframes slide-in-fwd-center {
  0% {
    -webkit-transform: translateZ(-1400px) scale(0);
            transform: translateZ(-1400px) scale(0);
    opacity: 0;
  }
  100% {
    -webkit-transform: translateZ(0) scale(0.5);
            transform: translateZ(0) scale(0.5);
    opacity: 1;
  }
}
*/
</style>