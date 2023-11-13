import { defineStore } from "pinia";
import bus from '../libs/bus'
export const lotteryDataStore = defineStore('LOTTERY', {
  state: () => {
    return {
      prizeConfig: {},
      prizes: [], //奖品信息
      users: [], //所有人员
      luckyUsers: {}, //已中奖人员
      leftUsers: [], //未中奖人员
      columnCount: 17, // 列数
      rowCount: 10, // 行数
      company: '',
      totalCards: 0, // 总牌数
      eachCount: [18, 10, 1, 1, 5, 3, 2, 10], // 每次抽取的奖品个数
      currentPrizeIndex: 0, // 当前抽取的奖品
      currentPrize: {}, // 当前抽取的奖品
      resolution: 1.1, // 当前圆球比例
      rotateLoop: 1000, // 是否循环旋转
      rotateTime: 3000, // 旋转时间
      lasetPrizeIndex: 0, // 上一次抽奖的奖品 - 切换奖项之后就会变化
      lastTimePrizeIndex: 0, // 上一次抽奖的奖品 - 真正开始下一个奖项抽奖才会变化
      isNextPrize: false, // 是否下一次抽奖
      isLotting: false, // 是否正在抽奖
      currentLuckys: [], // 当前中奖用户
      isShowLuckyUser: false, // 是否显示中奖用户
      isContinueLottery: false, // 是否继续抽奖
      isReLottery: false, // 是否重新抽奖
      isShowPrizeMark: false, // 是否显示奖品
      dialogStyle: {
        top: '15vh',
        left: '15%'
      },
      luckysRowColObj: {
        rowCount: 5,
        columnCount: 2,
        tileSize: 112,
        titleHeight: 32,
        type: 1 // 1 以列 为基准排列 2 以行 为基准排列 3 固定行列

      }, // 中奖行列对象
      containerConfigStyle: {
        scale: 0.5, // 容器卡片缩放比例
        top: '-23vh',
        left: '-8vw',
      },
      luckyCardConfigStyle: {
        cardWidth: "16vw", // 抽奖牌宽度
        cardHeight: "23vh", // 抽奖牌高度
        companyTop: 19, // 公司logo距离顶部的距离
        companyFontSize: 16, // 公司logo字体大小
        nameTop: '7vh', // 名称距离顶部的距离
        nameFontSize: 18, // 名称字体大小
        detailsBottom: '1vh', // 详情距离底部的距离
        detailsFontsize: 18, // 详情字体大小
      },
      cardConfigStyle: {
        cardWidth: "7vw", // 抽奖牌宽度
        cardHeight: "13vh", // 抽奖牌高度
        companyTop: 19, // 公司logo距离顶部的距离
        companyFontSize: 16, // 公司logo字体大小
        nameTop: '4vh', // 名称距离顶部的距离
        nameFontSize: 16, // 名称字体大小
        detailsBottom: '1vh', // 详情距离底部的距离
        detailsFontsize: 16, // 详情字体大小
      }
    }
  },

  getters: {

  },

  actions: {
    setPrizeConfig (config) {  // 注意，这里就不要写箭头函数了，不然 this 指向会出问题。
      this.prizeConfig = config
    },

    async initConfigData () {
      const usersData = await myApi.getStaticUsersData();
      const config = await myApi.getTempData();
      if (config) {
        // lotteryData.setPrizeConfig(config.prizeConfig);
        this.prizeConfig = config.prizeConfig
        this.prizes = config.prizeConfig.prizes;
      }
      // 抽奖用户
      Object.assign(this, usersData);
      // 总牌数
      this.totalCards = this.columnCount * this.rowCount;

      // 每次抽取的奖品个数
      // this.eachCount = this.prizes.map(prize => prize.count);
      // 中奖用户
      this.luckyUsers = config.luckyData;
      // 读取当前已设置的抽奖结果
      this.leftUsers = config.leftUsers;
      // 设置当前抽奖index
      let prizeIndex = this.prizes.length - 1;
      for (; prizeIndex > -1; prizeIndex--) {
        if (
          this.luckyUsers[this.prizes[prizeIndex].type] &&
          this.luckyUsers[this.prizes[prizeIndex].type].length >=
            this.prizes[prizeIndex].count
        ) {
          continue;
        }
        this.currentPrizeIndex = prizeIndex;
        this.lasetPrizeIndex = prizeIndex;
        this.lastTimePrizeIndex = prizeIndex;
        this.currentPrize = this.prizes[this.currentPrizeIndex];
        break;
      }

      bus.emit('initConfigDataEnd')
    }
  }
})
