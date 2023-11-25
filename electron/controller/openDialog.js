const { ipcMain, dialog } = require('electron')
const {
  loadXML,
  loadTempData,
  writeXML,
  saveDataFile,
  shuffle,
  saveErrorDataFile
} = require("./utils/help");
  let cwd = process.cwd(),
  dataBath = __dirname,
  curData = {},
  luckyData = {},
  errorData = [],
  defaultPage = `default data`;

function loadData(loadPath) {

  console.log("加载EXCEL数据文件");
  let cfgData = {};

  // curData.users = loadXML(path.join(cwd, "data/users.xlsx"));
  // curData.users = loadXML(path.join(dataBath, "data/users.xlsx"));
  // console.log(JSON.stringify(curData.users, '2384029834'))
  const users = loadXML(loadPath);
  if (!users) {
    dialog.showErrorBox("导入失败", 'excel表格内容不符合规范');
    return
  }
  curData.users = users
  console.log("加载EXCEL数据文件 - 完成");
  // console.log(JSON.stringify(curData.users, '2384029834'))

  // curData.users_islam = loadXML(path.join(dataBath, "data/users_islam.xlsx"));
  // curData.users_christian_catholic = loadXML(path.join(dataBath, "data/users_christian_catholic.xlsx"));
  // curData.users_hinduism_buddhism_confucianism = loadXML(path.join(dataBath, "data/users_hinduism_buddhism_confucianism.xlsx"));
  // 重新洗牌
  shuffle(curData.users);
  // 读取已经抽取的结果
  // loadTempData()
  //   .then(data => {
  //     luckyData = data[0];
  //     errorData = data[1];
  //   })
  //   .catch(data => {
  //     curData.leftUsers = Object.assign([], curData.users);
  //   });
}


const openDialog = (data) => {
  ipcMain.handle('open-dialog', async (e, ...args) => {
    try {
      const res = await dialog.showOpenDialog({
        // defaultPath: 'D:/Users/Desktop',
        filters: [
          {"name": "excel文件", extensions: ["xlsx", "xls"]},
        ]
      }) 
      loadData(res.filePaths[0])
    } catch (err) {
      dialog.showErrorBox("导入失败", err)
    }
    return curData;
  })
}

module.exports = openDialog