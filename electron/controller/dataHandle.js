

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
const setLucky = async (type, data) => {
  let sharedObject =  global.sharedObject;
  if (sharedObject.luckyData[type]) {
    sharedObject.luckyData[type] = sharedObject.luckyData[type].concat(data);
  } else {
    sharedObject.luckyData[type] = Array.isArray(data) ? data : [data];
  }

  return saveDataFile(sharedObject.luckyData);
}

const setData = async () => {
  ipcMain.handle('setData', async (e, ...args) => {
    const type = args[0];
    const data = JSON.parse(args[1]);
    const res = await setLucky(type, data);
    console.log(res, 'setData-----')
  })
}

const handleResetData = async () => {
  let sharedObject =  global.sharedObject;
  sharedObject.luckyData = {};
  sharedObject.errorData = [];
  await saveDataFile(sharedObject.luckyData);
}
const resetData = async () => {
  ipcMain.handle('resetData', async (e, ...args) => {
    let isTrue = true
    try {
      await handleResetData();
    } catch (error) {
      isTrue = false
    }
    return isTrue;
  })
}
const hanldeExportDataFn = async () => {
  let outData = [["工号", "DEPT部门", "NAMA 姓名"]];
  let sharedObject =  global.sharedObject;
  
  sharedObject.cfg.prizes.forEach(item => {
    outData.push([item.text]);
    outData = outData.concat(sharedObject.luckyData[item.type] || []);
  });
  let result = {};
  writeXML(outData, "/抽奖结果.xlsx")
    .then(dt => {
      // res.download('/抽奖结果.xlsx');
      result = {
        type: "success",
        url: "抽奖结果.xlsx"
      };
      console.log(`导出数据成功！`);
    })
    .catch(err => {
      result = {
        type: "error",
        error: err.error
      };
      console.log(`导出数据失败！`);
    });
}
const handleExportData = async () => {
  ipcMain.handle('handleExportData', async (e, ...args) => {
    let result = {};
    try {
      result = await hanldeExportDataFn();
    } catch (error) {
      console.log(error, '2348092384')
    }
    return result; 
  })
}
module.exports = {
  getStaticUsersData,
  setData,
  resetData,
  handleExportData
};
