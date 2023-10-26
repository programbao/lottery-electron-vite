const cfg = require("../config");
const { ipcMain } = require('electron')

let luckyData = global.sharedObject.luckyData;
let errorData = global.sharedObject.errorData;
let curData = global.sharedObject.curData;
const getLeftUsers = () => {
  //  记录当前已抽取的用户
  let lotteredUser = {};
  for (let key in luckyData) {
    let luckys = luckyData[key];
    luckys.forEach(item => {
      lotteredUser[item[0]] = true;
    });
  }
  // 记录当前已抽取但是不在线人员
  errorData.forEach(item => {
    lotteredUser[item[0]] = true;
  });

  let leftUsers = Object.assign([], curData.users);
  leftUsers = leftUsers.filter(user => {
    return !lotteredUser[user[0]];
  });
  curData.leftUsers = leftUsers;
}
const getTempData = () => {
  ipcMain.handle('getTempData', async (e, ...args) => {
    getLeftUsers();
    return {
      prizeConfig: cfg,
      leftUsers: curData.leftUsers,
      luckyData: luckyData
    }; 
  })
}


module.exports = {
  getTempData
};
