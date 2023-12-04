import { defineStore } from "pinia";
import bus from '../libs/bus'
export const lotteryDataStore = defineStore('LOTTERY', {
  state: () => {
    return {
      prizeConfig: {},
      prizes: [], //奖品信息
      users: [], //所有人员
      luckyUsers: {}, //已中奖人员
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
      isEnterLottery: false, // 是否进入抽奖
      isEnterBgWall: false, // 是否进入背景墙
      isShowAllLuckyUser: false,// 是否显示全部中奖用户
      
      secretUsers: [], // 保密用户 - 内置中奖名单
      dialogStyle: {
        top: '4vh',
        left: '15%'
      },
      otherResource:{
        screenImg: {
          fileUrl: '',
          fileName: ''
        },
        bgImg: {
          fileUrl: '',
          fileName: ''
        },
        musicFile: {
          fileUrl: '',
          fileName: ''
        }
      },
      currentLotteryGroup: {},
      memberListData: {}, // 抽奖人员名单数据 -- 未中奖人员
      originMemberListData: {}, // 原数据名单
      groupList: [], // 人员名单配置
      ballConfig: {
        resolution: 1.1, // 当前圆球比例
        rotateLoop: 1000, // 是否循环旋转
        rotateTime: 3000, // 旋转时间,
        autoRotateTime: 60000, // 自动旋转时间
        ballRelativeLeftDistance: '27vw', // 相对左侧距离
      },
      prizesBarStyle: { // 奖品栏样式
        barBoxWidth: '25vw',
        prizeBoxWidth: '20vw',
        prizeBoxMinHeight: '15vh',
        prizeSpace: '20px',
        prizeFontSize: '1vw',
        progressHeight: '1.8vh',
        progressFontSize: '1vw',
        imgGutterWidth: '8vh',
        imgGutterHeight: '8vh',
        currentPrizeScale: 1.2
      },
      beforeLotteryLayout: {
        columnCount: 17, // 列数
        rowCount: 10, // 行数
        rowGap: '10px', // 行间距
        columnGap: '10px', // 列间距
        scale: 0.5, // 容器卡片缩放比例
        top: '17vh',
        left: '27vw',
      },
      luckysRowColObj: {
        rowCount: 5,
        columnCount: 2,
        rowGap: '10px',
        columnGap: '10px', // 列间距
        type: 1 // 1 以列 为基准排列 2 以行 为基准排列 3 固定行列
      }, // 中奖行列对象
      luckyCardConfigStyle: {
        cardWidth: "16vw", // 抽奖牌宽度
        cardHeight: "23vh", // 抽奖牌高度
        logo: "",
        companyTop: '19px', // 公司logo距离顶部的距离
        companyFontSize: '16px', // 公司logo字体大小
        nameTop: '7vh', // 名称距离顶部的距离
        nameFontSize: '18px', // 名称字体大小
        detailsBottom: '1vh', // 详情距离底部的距离
        detailsFontSize: '18px', // 详情字体大小
        imgWidth: '100%',
        imgHeight: '10px'
      },
      cardConfigStyle: {
        cardWidth: "3vw", // 抽奖牌宽度
        cardHeight: "6vh", // 抽奖牌高度
        logo: "",
        companyTop: '0.05vh', // 公司logo距离顶部的距离
        companyFontSize: '8px', // 公司logo字体大小
        nameTop: '1.5vh', // 名称距离顶部的距离
        nameFontSize: '8px', // 名称字体大小
        detailsBottom: '0.1vh', // 详情距离底部的距离
        detailsFontSize: '8px', // 详情字体大小
        imgWidth: '100%',
        imgHeight: '10px'
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
        Object.assign(this, config.prizeConfig);
      }
      // 抽奖用户
      // Object.assign(this, usersData);
      this.memberListData = config.curData
      this.originMemberListData = usersData;
      // 总牌数
      this.totalCards = this.beforeLotteryLayout.columnCount * this.beforeLotteryLayout.rowCount;

      // 每次抽取的奖品个数
      this.eachCount = this.prizes.map(prize => prize.eachCount);
      // 中奖用户
      this.luckyUsers = config.luckyData;

      // 球体距离左边间距
      window.ballRelativeLeftDistance = this.ballConfig.ballRelativeLeftDistance
      // 读取当前已设置的抽奖结果
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
        if (prizeIndex !== this.prizes.length - 1) {
          this.lastTimePrizeIndex = this.prizes.length - 1;
        }
        this.currentPrize = this.prizes[this.currentPrizeIndex];
        break;
      }

      bus.emit('initConfigDataEnd')
    }
  }
})
