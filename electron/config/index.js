/**
 * 奖品设置
 * type: 唯一标识，0是默认特别奖的占位符，其它奖品不可使用
 * count: 奖品数量
 * title: 奖品描述
 * text: 奖品标题
 * img: 图片地址
 */
// const prizes = [
//   // {
//   //   type: 0,
//   //   count: 1000,
//   //   title: "",
//   //   text: "特别奖"
//   // },
//   // {
//   //   type: 1,
//   //   count: 2,
//   //   text: "特等奖",
//   //   title: "神秘大礼",
//   //   img: "../img/secrit.jpg"
//   // },
//   {
//     type: 1,
//     count: 18,
//     text: "Hadiah Utama PERJALANAN ROHANI - Umrah",
//     title: " 特等奖-朝觐",
//     img: "../img/flight.png"
//   },
//   {
//     type: 2,
//     count: 10,
//     text: "Hadiah Utama PERJALANAN ROHANI - Perjalanan keagamaan Kristen & Katolik ke Jerusalem",
//     title: "特等奖-耶路撒冷朝拜（基督教、天主教）",
//     img: "../img/flight.png"
//   },
//   {
//     type: 3,
//     count: 2,
//     text: "Hadiah Utama PERJALANAN ROHANI - Perjalanan keagamaan Hindu, Budha dan Khonghucu",
//     title: "特等奖-宗教信仰朝拜（印度教、佛教、孔教）",
//     img: "../img/flight.png"
//   }, 
//   {
//     type: 4,
//     count: 1,
//     text: "Hadiah pertama  一等奖",
//     title: "(Motor 摩托)",
//     img: "../img/motorcycle.png"
//   },
//   {
//     type: 5,
//     count: 5,
//     text: "Hadiah kedua  二等奖",
//     title: "(Mesin Cuci 洗衣机)",
//     img: "../img/washer.png"
//   },
//   {
//     type: 6,
//     count: 5,
//     text: "Hadiah ketiga  三等奖",
//     title: "(Kulkas 冰箱)",
//     img: "../img/refrigerator.png"
//   },
//   {
//     type: 7,
//     count: 5,
//     text: "Hadiah keempat  四等奖",
//     title: "(TV 电视)",
//     img: "../img/tv.png"
//   },
//   {
//     type: 8,
//     count: 15,
//     text: "Hadiah kelima  五等奖",
//     title: "(Gift Voucher Saldo Kartu ID Rp500.000 消费卡充值券)",
//     img: "../img/idCardRecharge.png"
//   }
// ];
const prizes = [
    {
    type: 1,
    count: 1,
    text: "Hadiah Utama PERJALANAN ROHANI",
    title: "特等奖",
    img: "./src/assets/img/gift.png"
  },
  {
    type: 2,
    count: 3,
    text: "Hadiah pertama  一等奖",
    title: "一等奖",
    img: "./src/assets/img/gift.png"
  },
  {
    type: 3,
    count: 5,
    text: "Hadiah kedua  二等奖",
    title: "二等奖",
    img: "./src/assets/img/gift.png"
  },
  {
    type: 4,
    count: 10,
    text: "Hadiah ketiga  三等奖",
    title: "三等奖",
    img: "./src/assets/img/gift.png"
  }
];
/**
 * 一次抽取的奖品个数与prizes对应
 */
// const EACH_COUNT = [18,10,2,1, 5, 5, 5, 15];
const EACH_COUNT = [1, 3, 5, 10];

/**
 * 卡片公司名称标识
 */
const COMPANY = "IWIP";

module.exports = {
  prizes,
  COMPANY
};
