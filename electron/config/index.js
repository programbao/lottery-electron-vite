/**
 * 奖品设置
 * type: 唯一标识，0是默认特别奖的占位符，其它奖品不可使用
 * count: 奖品数量
 * title: 奖品描述
 * text: 奖品标题
 * img: 图片地址
 */
const path = require('path')
const prefixPath = '../assets/img/'
const basePath = path.join(__dirname, prefixPath)
const url = require('url');
const { nanoid } = require('nanoid')
const prizes = [
  {
    type: nanoid(),
    count: 18,
    eachCount: 18,
    name: "特等奖 Hadiah Utama PERJALANAN ROHANI - Umrah",
    otherName: " 特等奖-朝觐",
    img: url.pathToFileURL(path.join(basePath, `flight.png`)).href
  },
  {
    type: nanoid(),
    count: 10,
    eachCount: 10,
    name: "特等奖 Hadiah Utama PERJALANAN ROHANI - Perjalanan keagamaan Kristen & Katolik ke Jerusalem",
    otherName: "特等奖-耶路撒冷朝拜（基督教、天主教）",
    img: url.pathToFileURL(path.join(basePath, `flight.png`)).href
  },
  {
    type: nanoid(),
    count: 2,
    eachCount: 2,
    name: "特等奖 Hadiah Utama PERJALANAN ROHANI - Perjalanan keagamaan Hindu, Budha dan Khonghucu",
    otherName: "特等奖-宗教信仰朝拜（印度教、佛教、孔教）",
    img: url.pathToFileURL(path.join(basePath, `flight.png`)).href
  }, 
  {
    type: nanoid(),
    count: 1,
    eachCount: 1,
    name: "Hadiah pertama 一等奖",
    otherName: "(Motor 摩托)",
    img: url.pathToFileURL(path.join(basePath, `motorcycle.png`)).href
  },
  {
    type: nanoid(),
    count: 5,
    eachCount: 2,
    name: "Hadiah kedua 二等奖",
    otherName: "(Mesin Cuci 洗衣机)",
    img: url.pathToFileURL(path.join(basePath, `washer.png`)).href
  },
  {
    type: nanoid(),
    count: 5,
    eachCount: 5,
    name: "Hadiah ketiga 三等奖",
    otherName: "(Kulkas 冰箱)",
    img: url.pathToFileURL(path.join(basePath, `refrigerator.png`)).href
  },
  {
    type: nanoid(),
    count: 5,
    eachCount: 3,
    name: "Hadiah keempat 四等奖",
    otherName: "(TV 电视)",
    img: url.pathToFileURL(path.join(basePath, `tv.png`)).href
  },
  {
    type: nanoid(),
    count: 15,
    eachCount: 5,
    name: "Hadiah kelima 五等奖",
    otherName: "(Gift Voucher Saldo Kartu ID Rp500.000 消费卡充值券)",
    img: url.pathToFileURL(path.join(basePath, `idCardRecharge.png`)).href
  }
];

/**
 * 卡片公司名称标识
 */
const COMPANY = "IWIP";

module.exports = {
  prizes,
  COMPANY
};
