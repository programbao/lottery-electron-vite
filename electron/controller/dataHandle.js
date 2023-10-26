

const dataBath = __dirname;
const { ipcMain } = require('electron')
const path = require('path')
const {
  loadXML,
  loadTempData,
  writeXML,
  saveDataFile,
  shuffle,
  saveErrorDataFile
} = require("./utils/help");
const getStaticUsersData = async () => {
  ipcMain.handle('getStaticUsersData', async (e, ...args) => {
    console.log("加载EXCEL数据文件");
    let sharedObject =  global.sharedObject;
    // let curData =  global.sharedObject.curData;
    // let luckyData = global.sharedObject.luckyData;
    // let errorData = global.sharedObject.errorData;
    sharedObject.curData.users = loadXML(path.join(dataBath, "data/users.xlsx"));
    
    sharedObject.curData.users_islam = loadXML(path.join(dataBath, "data/users_islam.xlsx"));
    sharedObject.curData.users_christian_catholic = loadXML(path.join(dataBath, "data/users_christian_catholic.xlsx"));
    sharedObject.curData.users_hinduism_buddhism_confucianism = loadXML(path.join(dataBath, "data/users_hinduism_buddhism_confucianism.xlsx"));
    // 重新洗牌
    shuffle(sharedObject.curData.users);
    shuffle(sharedObject.curData.users_islam);
    shuffle(sharedObject.curData.users_christian_catholic);
    shuffle(sharedObject.curData.users_hinduism_buddhism_confucianism);
    console.log(2222, '28304823加载')
    // 读取已经抽取的结果
    try {
      const tempData = await loadTempData();
      sharedObject.luckyData = tempData[0];
      sharedObject.errorData = tempData[1];
    } catch (err) {
      sharedObject.curData.leftUsers = Object.assign([], sharedObject.curData.users);
    }
    return sharedObject.curData;
  })
}
module.exports = {
  getStaticUsersData
};
