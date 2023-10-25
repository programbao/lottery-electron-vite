<template>
  <div id="menu">
     <div class="begin-lottery">
        <button id="enter">进入抽奖<br />masuk undian</button>
        <button id="lottery">
          开始抽奖 <br/> mulai undian
        </button>
     </div>
     <div id="lotteryBar" class="none">
       <!-- <button id="reLottery">重新抽奖</button> -->
       <div class="fixed-bar">
         <button id="save" class="fixed-btn">导出抽奖结果<br/> hasil undian</button>
         <button id="reset" class="fixed-btn">重置<br />mengatur ulang</button>
       </div>
     </div>
   </div>
</template>

<script setup>

</script>

<style lang="scss" scoped>
#menu {
  z-index: 400;
  position: fixed;
  top: 0;
  text-align: center;
}
#lottery {
  animation: breath 1.6s linear infinite;
  box-shadow: 0px 0px 15px rgb(127 255 255 / 75%);
  margin-top: 20px;
}
.begin-lottery {
  position: fixed;
  bottom: 20px;
  position: fixed;
  bottom: 20px;
  display: flex;
  flex-direction: column;
}
.fixed-bar {
  position: fixed;
  bottom: 20px;
  right: 20px;
}

button {
  color: rgba(127, 255, 255, 0.75);
  background: transparent;
  outline: 1px solid rgba(127, 255, 255, 0.75);
  border: 0;
  padding: 1.6vh 2vh;
  margin: 0 4.6vh;
  font-size: 2vh;
  font-weight: bold;
  cursor: pointer;
}

button:hover {
  background-color: rgba(0, 255, 255, 0.5);
}

button:active {
  color: #000000;
  background-color: rgba(0, 255, 255, 0.75);
}

</style>