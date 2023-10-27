<template>
  <div id="container"></div>
</template>

<script setup>
import { onMounted, onBeforeMount, onBeforeUnmount, ref } from 'vue'
import { useToast } from "vue-toastification";
import bus from '../libs/bus'
const toast = useToast();
import { lotteryDataStore } from '../store'
const basicData = lotteryDataStore();
import { createCard, getCardHTML, getCardWithParentHtml } from './handleElements'
let camera;
let scene;
let renderer;
let controls;
let threeDCards = [];
let targets = {
  table: [],
  sphere: []
};
// 动画执行中
let isAnimating = false;
let rotateObj;

let selectedCardIndex = [];
let rotate = false;
// 正在抽奖
let isLotting = false;
let currentLuckys = [];
let luckyUsersCard = {};
let prizeMark = null;
let isNextPrize = false;



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
let cameraStyle = '';
 const transformEntry = (targets, duration) => {
  isAnimating = true
  setTimeout(() => {
    isAnimating = false
  }, duration * 1.5)
   let containerConfigStyle = basicData.containerConfigStyle;
  console.log(renderer.domElement, 'renderer.domElementrenderer.domElement')
  let containerDom = renderer.domElement.children[0]
  cameraStyle = containerDom.style;
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
  new TWEEN.Tween()
    .to({}, duration * 2)
    .onUpdate(render)
    .start().onComplete(() => {
      console.log("渲染完成", '23424')
        // document.querySelectorAll('.element').forEach(element => {
  //   console.log(element, 'elementelementelement')
  //     var object = new THREE.CSS3DObject(element);
  //     object.position.x = Math.random() * 4000 - 2000;
  //     object.position.y = Math.random() * 4000 - 2000;
  //     object.position.z = Math.random() * 4000 - 2000;
  //     scene.add(object);
  //     threeDCards.push(object);
  // })

    });
}
const transform = (targets, duration) => {
  isAnimating = true
  // TWEEN.removeAll();
  for (var i = 0; i < threeDCards.length; i++) {
    var object = threeDCards[i];
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
      console.log("渲染完成", '23424')
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
      // btns.enter.classList.remove("none");
      // btns.lotteryBar.classList.add("none");
      transformEntry(targets.table, 1500);
      console.log(camera, 'cameracameracamera', scene)
      break;
    default:
      animate();
      // btns.enter.classList.add("none");
      // btns.lotteryBar.classList.remove("none");
      transform(targets.sphere, 1500);
      setTimeout(() => {
        isNextPrize = true
        if (basicData.currentPrizeIndex === basicData.prizes.length - 1) {
          // btns.lottery.innerHTML = "第一个奖项<br />undian pertama"
        } else {
          // btns.lottery.innerHTML = "下一个奖项<br/>undian selanjutnya";
          basicData.currentPrizeIndex--;
          basicData.currentPrize = basicData.prizes[basicData.currentPrizeIndex];
          // if (currentPrizeIndex <= 2) {
          //   //进入特等奖抽取 
          //   document.querySelectorAll("[id^='prize-item']").forEach(prizeDom => {
          //     prizeDom.style.display = "none"
          //     if (["prize-item-1", "prize-item-2","prize-item-3"].includes(prizeDom.id)) {
          //       prizeDom.style.display = "block";
          //     }
          //   })
          // }
          // setPrizeData(basicData.currentPrizeIndex, 0, true);
        }
      }, 2000);
      break;
  }
}

const render = () => {
  renderer.render(scene, camera);
}
const showUsers = ref([]);


const enterAnimate = () => {
  document.getElementById("container").innerHTML = '';
  let member = basicData.users.slice();
  let showCards = [];
  let length = member.length;
  let isBold = false;
  let showTable = basicData.leftUsers.length === basicData.users.length;
  let index = 0;
  let totalMember = member.length;
  let ROW_COUNT = basicData.rowCount
  let COLUMN_COUNT = basicData.columnCount;
  let HIGHLIGHT_CELL = [];
  threeDCards = [];
  for (let i = 0; i < ROW_COUNT; i++) {
    if (index > totalMember - 1) break;
    for (let j = 0; j < COLUMN_COUNT; j++) {
      if (index > totalMember - 1) break;
      isBold = HIGHLIGHT_CELL.includes(i + "-" + j) && isInit;
      let user = member[index % length];
      var element = createCard(
        user,
        isBold,
        index,
        showTable,
        `${i} - ${j}`,
        basicData
      );
      var object = new THREE.CSS3DObject(element);
      object.position.x = Math.random() * 4000 - 2000;
      object.position.y = Math.random() * 4000 - 2000;
      object.position.z = Math.random() * 4000 - 2000;
      scene.add(object);
      threeDCards.push(object);

      // 这个是设置间距的 卡片之间的间距 距离
      // var object = new THREE.Object3D();
      // object.position.x = j * 162 - position.x;
      // object.position.y = -(i * 165) + position.y;
      // targets.table.push(object);
      index++;
    }
  }

  // sphere

  var vector = new THREE.Vector3();

  for (var i = 0, l = threeDCards.length; i < l; i++) {
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
  // let prizeMarkDom = createElement();
  // prizeMarkDom.id = "prize-mark";
  // document.getElementById("container").appendChild(prizeMarkDom);
  // prizeMarkDom.style = ``

  controls = new THREE.TrackballControls(camera, renderer.domElement);
  controls.rotateSpeed = 0.5;
  controls.minDistance = 500;
  controls.maxDistance = 6000;
  controls.addEventListener("change", render);

  // isInit && bindEvent();
  switchScreen("lottery");

}

let containerHtml = '';
const initCards = (isInit = true) => {
  let member = basicData.users.slice();
  let showCards = [];
  let length = member.length;
  let isBold = false;
  let showTable = basicData.leftUsers.length === basicData.users.length;
  let index = 0;
  let totalMember = member.length;
  let ROW_COUNT = basicData.rowCount
  let COLUMN_COUNT = basicData.columnCount;
  let HIGHLIGHT_CELL = [];
    // 设置初始卡片上下左右距离 间距
  // let position = {
  //   x: (108 * basicData.columnCount + 700) / 2,
  //   y: (152 * ROW_COUNT - 20) / 2
  // };
  camera = new THREE.PerspectiveCamera(
    40,
    window.innerWidth / window.innerHeight,
    1,
    10000
  );
  camera.position.z = 3000;

  scene = scene ? scene : new THREE.Scene();

  for (let i = 0; i < ROW_COUNT; i++) {
    if (index > totalMember - 1) break;
    for (let j = 0; j < COLUMN_COUNT; j++) {
      if (index > totalMember - 1) break;
      isBold = HIGHLIGHT_CELL.includes(i + "-" + j) && isInit;
      let user = member[index % length];
      // var element = createCard(
      //   user,
      //   isBold,
      //   index,
      //   showTable,
      //   `${i} - ${j}`,
      //   basicData
      // );
      // showUsers.value.push(element)
      containerHtml += getCardWithParentHtml(
        user,
        isBold,
        index,
        showTable,
        `${i} - ${j}`,
        basicData
      );
      // three变化卡片
      // var object = new THREE.CSS3DObject(element);
      // object.position.x = Math.random() * 4000 - 2000;
      // object.position.y = Math.random() * 4000 - 2000;
      // object.position.z = Math.random() * 4000 - 2000;
      // scene.add(object);
      // threeDCards.push(object);
      // // 这个是设置间距的 卡片之间的间距 距离
      // var object = new THREE.Object3D();
      // object.position.x = j * 162 - position.x;
      // object.position.y = -(i * 165) + position.y;
      // targets.table.push(object);
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
    // console.log(element, 'elementelementelement')
    //   var object = new THREE.CSS3DObject(element);
    //   object.position.x = Math.random() * 4000 - 2000;
    //   object.position.y = Math.random() * 4000 - 2000;
    //   object.position.z = Math.random() * 4000 - 2000;
    //   scene.add(object);
      threeDCards.push(element);
  })
  
  // sphere

  // var vector = new THREE.Vector3();

  // for (var i = 0, l = threeDCards.length; i < l; i++) {
  //   var phi = Math.acos(-1 + (2 * i) / l);
  //   var theta = Math.sqrt(l * Math.PI) * phi;
  //   var object = new THREE.Object3D();
  //   object.position.setFromSphericalCoords(800 * basicData.resolution, phi, theta);
  //   vector.copy(object.position).multiplyScalar(2);
  //   object.lookAt(vector);
  //   targets.sphere.push(object);
  // }
  // renderer = new THREE.CSS3DRenderer();
  // renderer.setSize(window.innerWidth, window.innerHeight);
  // document.getElementById("container").appendChild(renderer.domElement);

  // // 创建和设置遮罩层
  // let prizeMarkDom = createElement();
  // prizeMarkDom.id = "prize-mark";
  // document.getElementById("container").appendChild(prizeMarkDom);
  // prizeMarkDom.style = ``

  // controls = new THREE.TrackballControls(camera, renderer.domElement);
  // controls.rotateSpeed = 0.5;
  // controls.minDistance = 500;
  // controls.maxDistance = 6000;
  // controls.addEventListener("change", render);

  // isInit && bindEvent();

  // if (showTable && isInit) {
    // switchScreen("enter");
  // } else if (isInit) {
    // switchScreen("lottery");
  // }
  setTimeout(() => {
    enterAnimate();
  }, 3000)
}

/**
 * 随机抽奖
 */
const random = (num) => {
  // Math.floor取到0-num-1之间数字的概率是相等的
  return Math.floor(Math.random() * num);
}
/**
 * 随机切换背景和人员信息
 */
/**
 * 切换名牌背景
 */
 function shine(cardIndex, color) {
  if (!threeDCards[cardIndex]) {
    // debugger
  }
  let card = threeDCards[cardIndex].element ? threeDCards[cardIndex].element : threeDCards[cardIndex];
  // card.style.backgroundImage = "url(" + '../img/huawei.png' + ") no-repeat center center";
  card.style.backgroundColor =
    color || "rgba(0,127,127," + (Math.random() * 0.7 + 0.25) + ")";
}
/**
 * 切换名牌人员信息
 */
const changeCard = (cardIndex, user) => {
  if (user) {
    if (currentLuckys.some(arr => arr[0] === user[0])) {
      return;
    }
    let card = threeDCards[cardIndex].element ? threeDCards[cardIndex].element : threeDCards[cardIndex];
    if (card.classList.value.includes("prize")) {
      return
    }
    let curCardId = card.querySelector('.cardIdTxt').id 
    if (('card-' + user[0]) != curCardId) {
      card.innerHTML = getCardHTML(user, basicData);
    }
  }
}
const shineCard = () => {
  let maxCard = 20,
    maxUser;
  let shineCard = 10 + random(maxCard);
  setInterval(() => {
    // 正在抽奖停止闪烁
    // if (isLotting || currentPrizeIndex < 7 || prizeMark.style.zIndex === '6') {
    //   return;
    // }
    if (isLotting || basicData.currentPrizeIndex < 2) {
      return;
    }
    maxUser = basicData.leftUsers.length;
    for (let i = 0; i < shineCard; i++) {
      let index = random(maxUser),
        cardIndex = random(basicData.totalCards);
      // 当前显示的已抽中名单不进行随机切换
      if (selectedCardIndex.includes(cardIndex)) {
        continue;
      }
      shine(cardIndex);
      // console.log(cardIndex, index, basicData.leftUsers, '22222');
      changeCard(cardIndex, basicData.leftUsers[index]);
    }
  }, 500);
}


const initHandleData = () => {
  initCards();
  // animate();
  // 随机切换背景和人员信息
  shineCard();
}
bus.on('initConfigDataEnd', initHandleData)
onBeforeUnmount(() => {
  bus.off('initConfigDataEnd', initHandleData)
})
// onBeforeMount(() => {
// })
// onMounted(() => {
//   // 初始化所有抽奖卡片
// })
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
  position: relative !important;
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