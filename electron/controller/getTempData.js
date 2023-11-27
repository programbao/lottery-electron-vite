const { ipcMain } = require('electron')
const {
  loadTempData,
} = require("./utils/help");

const getLeftUsers = (notRepeatForAllUser = true) => {
  const sharedObject = global.sharedObject
  let luckyData = sharedObject.luckyData;
  let errorData = sharedObject.errorData;
  let curData = sharedObject.curData;
  const groupList = sharedObject.cfg.groupList;
  //  记录当前已抽取的用户
  let lotteredUser = {};
  let lotteredUserByKeyMap = {};
  for (let key in luckyData) {
    if (!key) delete luckyData[key];
    luckyData[key] = luckyData[key].filter(item => item);
    let luckys = luckyData[key];
    lotteredUserByKeyMap[key] = {};
    luckys.forEach(item => {
      lotteredUser[item[0]] = true;
      lotteredUserByKeyMap[key][item[0]] = true
    });
  }
  // 记录当前已抽取但是不在线人员
  errorData.forEach(item => {
    lotteredUser[item[0]] = true;
  });
  // 所有名单不能重复
  if (notRepeatForAllUser) {
    Object.keys(curData).forEach(key => {
      if (!key) delete curData[key];
      if (!curData[key].filter) {
        console.log(curData[key])
      }
      curData[key] = curData[key].filter(user => !lotteredUser[user[0]]);
    })
  } else { // 只有关联的名单中不重复
    for (let key in luckyData) {
      const group = groupList.find(item => item.group_identity === key);
      curData[group.group_identity] = curData[group.group_identity].filter(user => {
        return !lotteredUserByKeyMap[key][user[0]];
      }) 
    }
  }

  
  return {
    luckyData,
    errorData,
    curData,
    // leftUsers
  }
}
const getTempData = () => {
  ipcMain.handle('getTempData', async (e, ...args) => {
    let sharedObject =  global.sharedObject;
    const prizeConfig = await loadTempData("prizesConfig.json");
    sharedObject.cfg = prizeConfig[0];
    const { luckyData, errorData, curData, leftUsers } = getLeftUsers();
    return {
      prizeConfig: prizeConfig[0],
      // leftUsers: leftUsers,
      curData,
      luckyData: luckyData
    }; 
  })
}


module.exports = {
  getTempData
};
