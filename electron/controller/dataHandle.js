

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
    let curData =  global.sharedObject.curData;
    let luckyData = global.sharedObject.luckyData;
    let errorData = global.sharedObject.errorData;
    curData.users = loadXML(path.join(dataBath, "data/users.xlsx"));
    
    curData.users_islam = loadXML(path.join(dataBath, "data/users_islam.xlsx"));
    curData.users_christian_catholic = loadXML(path.join(dataBath, "data/users_christian_catholic.xlsx"));
    curData.users_hinduism_buddhism_confucianism = loadXML(path.join(dataBath, "data/users_hinduism_buddhism_confucianism.xlsx"));
    // 重新洗牌
    shuffle(curData.users);
    shuffle(curData.users_islam);
    shuffle(curData.users_christian_catholic);
    shuffle(curData.users_hinduism_buddhism_confucianism);
    console.log(2222, '28304823加载')
    // 读取已经抽取的结果
    try {
      const tempData = await loadTempData();
      luckyData = tempData[0];
      errorData = tempData[1];
    } catch (err) {
      curData.leftUsers = Object.assign([], curData.users);
    }
    return curData;
  })
}
module.exports = {
  getStaticUsersData
};
