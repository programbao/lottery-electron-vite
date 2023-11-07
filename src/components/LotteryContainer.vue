<template>
  <div id="container"></div>
</template>

<script setup>
import { onMounted, onBeforeMount, onBeforeUnmount, ref, getCurrentInstance } from 'vue'
import { useToast } from "vue-toastification";
import bus from '../libs/bus'
const toast = useToast();
import { lotteryDataStore } from '../store'
const basicData = lotteryDataStore();
import { shineCard, getCardWithParentHtml, createCardWithParentDom, random } from './handleElements'
let camera;
let scene;
let renderer;
let controls;
// let threeDCards = [];
let targets = {
  table: [],
  sphere: []
};
// 动画执行中
let isAnimating = false;
let rotateObj;

// let selectedCardIndex = [];
let rotate = false;
// 正在抽奖
// let isLotting = false;
// let currentLuckys = [];
let luckyUsersCard = {};
let prizeMark = null;


// let member = basicData.users.slice();
// let isBold = false;
// let showTable = basicData.leftUsers.length === basicData.users.length;
// let totalMember = member.length;
// let ROW_COUNT = basicData.rowCount
// let COLUMN_COUNT = basicData.columnCount;
// let HIGHLIGHT_CELL = [];
let member = basicData.users.slice();
let paramsFields = {
  threeDCards: [],
  selectedCardIndex: [],
  currentLuckys: [],
  member,
  isBold:  false,
  showTable: basicData.leftUsers.length === basicData.users.length,
  totalMember: member.length,
  ROW_COUNT: basicData.rowCount,
  COLUMN_COUNT: basicData.columnCount,
  HIGHLIGHT_CELL: [],
  // isLotting: false
}

const animate = () => {
  // 让场景通过x轴或者y轴旋转
  // rotate && (scene.rotation.y += 0.088);
  requestAnimationFrame(animate);
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
function switchScreen(type) {
  if (isAnimating) {
    toast.info("请等待动画加载完成  harap tunggu hingga animasi dimuat");
    return
  }
  // debugger
  switch (type) {
    case "enter":
      break;
    default:
      animate();
      transform(targets.sphere, 1500);
      setTimeout(() => {
        basicData.isNextPrize = true
        if (basicData.currentPrizeIndex === basicData.prizes.length - 1) {
        } else {
          basicData.currentPrizeIndex--;
          basicData.currentPrize = basicData.prizes[basicData.currentPrizeIndex];
        }
      }, 2000);
      break;
  }
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
const enterAnimate = () => {
  document.getElementById("container").innerHTML = '';
  camera = new THREE.PerspectiveCamera(
    40,
    window.innerWidth / window.innerHeight,
    1,
    10000
  );
  camera.position.z = 3000;
  scene = scene ? scene : new THREE.Scene();

  paramsFields.threeDCards = [];
  let index = 0;
  for (let i = 0; i < paramsFields.ROW_COUNT; i++) {
    if (index > paramsFields.totalMember - 1) break;
    for (let j = 0; j < paramsFields.COLUMN_COUNT; j++) {
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
  document.getElementById("container").appendChild(renderer.domElement);
  // // 创建和设置遮罩层
  controls = new THREE.TrackballControls(camera, renderer.domElement);
  controls.rotateSpeed = 0.5;
  controls.minDistance = 500;
  controls.maxDistance = 6000;
  controls.addEventListener("change", render);
  switchScreen("lottery");
  // 触发通知处理进入抽奖结束时间
  bus.emit("enterLotteryEnd");
  window.addEventListener("resize", onWindowResize, false);
}

let containerHtml = '';

// 初始化卡片
const initCards = (isInit = true) => {
  let index = 0;

  for (let i = 0; i < paramsFields.ROW_COUNT; i++) {
    if (index > paramsFields.totalMember - 1) break;
    for (let j = 0; j < paramsFields.COLUMN_COUNT; j++) {
      if (index > paramsFields.totalMember - 1) break;
      let isBold = paramsFields.HIGHLIGHT_CELL.includes(i + "-" + j) && isInit;
      let user = paramsFields.member[index % paramsFields.totalMember];
      containerHtml += getCardWithParentHtml(
        user,
        isBold,
        index,
        paramsFields.showTable,
        `${i} - ${j}`,
        basicData
      );
      index++;
    }
  }
  let containerConfigStyle = basicData.containerConfigStyle;
  renderer = new THREE.CSS3DRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.getElementById("container").appendChild(renderer.domElement);
  let containerDom = renderer.domElement;
  containerDom.innerHTML = containerHtml;
  containerDom.style = `
    grid-template-columns: repeat(${basicData.columnCount}, 1fr);
    grid-template-rows: repeat(${basicData.rowCount}, 1fr);  
    grid-row-gap: 20px;
    grid-column-gap: 20px;
    transform: scale(${containerConfigStyle.scale});
    top: ${containerConfigStyle.top};
    left: ${containerConfigStyle.left};
    position: fixed;
    display: grid;
  `
  document.querySelectorAll('.element').forEach(element => {
    paramsFields.threeDCards.push(element);
  })
}


const initHandleData = () => {
  member = basicData.users.slice();
  paramsFields = {
    threeDCards: [],
    selectedCardIndex: [],
    currentLuckys: [],
    member,
    isBold:  false,
    showTable: basicData.leftUsers.length === basicData.users.length,
    totalMember: member.length,
    ROW_COUNT: basicData.rowCount,
    COLUMN_COUNT: basicData.columnCount,
    HIGHLIGHT_CELL: [],
    // isLotting: false
  }
  initCards();
  // animate();
  // 随机切换背景和人员信息
  shineCard(basicData, paramsFields);
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
  rotateBall().then(() => {
    // 将之前的记录置空
    paramsFields.currentLuckys = [];
    paramsFields.selectedCardIndex = [];
    // 当前同时抽取的数目,当前奖品抽完还可以继续抽，但是不记录数据
    let perCount = basicData.eachCount[basicData.currentPrizeIndex];
    let luckyData = basicData.luckyUsers[basicData.currentPrize.type];
    let leftCount = basicData.leftUsers.length;
    let leftPrizeCount = basicData.currentPrize.count - (luckyData ? luckyData.length : 0);

    if (leftCount < perCount) {
      toast.error("剩余参与抽奖人员不足，现在重新设置所有人员可以进行二次抽奖！  Jumlah orang yang tersisa untuk berpartisipasi dalam lotere tidak mencukupi. Sekarang setel ulang semua orang untuk membuat lotere kedua!");
      // basicData.leftUsers = basicData.users.slice();
      // leftCount = basicData.leftUsers.length;
      perCount = leftCount
      return
    }
    for (let i = 0; i < perCount; i++) {
      let luckyId = random(leftCount);
      paramsFields.currentLuckys.push(basicData.leftUsers.splice(luckyId, 1)[0]);
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
      console.log(paramsFields.currentLuckys, 'selectedCardIndexselectedCardIndex')
      basicData.isLotting = false;
      // 改变奖品状态
      // changePrize();
      bus.emit('changePrize')
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
    }, 500)
    // 抽中之后要处理的事
    // console.log(currentLuckys);
    // selectCard();
  });
}



/**
 * 重置抽奖牌内容
 */
const resetCard = (duration = 500, model) => {
  if (paramsFields.currentLuckys.length === 0) {
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


const lotteryActiveFn = () => {
  if (!basicData.currentPrize) {
    resetCard(500).then(res => {
      // showAllPrizes();
      bus.emit('showAllPrizes')
    })
    toast.info(`抽奖已结束，谢谢参与 undian telah selesai,terima kasih telah bergabung`);
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
    // 抽奖
    lottery("lottery");
    toast.info(`正在抽取[${basicData.currentPrize.title}],调整好姿势  penghargaan sedang diundi,silahkan persiapkan diri`);
    return
  }
  resetCard(500, "lottery").then(res => {
    if (basicData.isNextPrize) {
      // 重置选择抽奖名单
      // if (currentPrizeIndex >= 0 && currentPrizeIndex <= 2) {
      //   switch (currentPrizeIndex) {
      //     case 2:
      //       resetBallCards(basicData.users_hinduism_buddhism_confucianism);
      //       break;
      //     case 1:
      //       resetBallCards(basicData.users_christian_catholic);
      //       break;
      //     case 0:
      //       resetBallCards(basicData.users_islam);
      //       break;
      //     default:
      //       break;
      //   }
      // }
      // 入场下一个奖项
      bus.emit('showPrize')
      basicData.isLotting = false
      return
    }
    // 抽奖
    lottery("lottery");
    toast.info(`正在抽取[${basicData.currentPrize.title}],调整好姿势  penghargaan sedang diundi,silahkan persiapkan diri`);
  });
}
const beginLottery = () => {
  if (isAnimating) {
    toast.info(`请等待动画加载完成  harap tunggu hingga animasi dimuat`);
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
// 监听数据
bus.on('initConfigDataEnd', initHandleData)
bus.on('enterLottery', enterAnimate)
bus.on('beginLottery', beginLottery)
onBeforeUnmount(() => {
  bus.off('initConfigDataEnd', initHandleData)
  bus.off('enterLottery', enterAnimate)
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
  top: 0.5vh;
  right: 0;
  width: 100%;
  font-size: 2vh;
  color: rgba(127, 255, 255, 0.75);
}

.element .name {
  position: absolute;
  top: 5.0vh;
  left: 0;
  right: 0;
  font-size: 3vh;
  font-weight: bold;
  color: rgba(255, 255, 255, 0.75);
  text-shadow: 0 0 0vh rgba(0, 255, 255, 0.95);
}

.element .details {
  position: absolute;
  bottom: 1.2vh;
  left: 0;
  right: 0;
  font-size: 2.0vh;
  color: rgba(127, 255, 255, 0.75);
}
</style>