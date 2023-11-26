const { ipcMain, dialog } = require('electron')
const {
  loadXML,
  loadTempData,
  writeXML,
  saveDataFile,
  shuffle,
  saveErrorDataFile
} = require("./utils/help");
const path = require('path')
const dbPath = path.join(__dirname, '../assets/img')
const url = require('url');
const fs = require("fs");

const loadData = (loadPath) => {
  const users = loadXML(loadPath);
  if (!users) {
    dialog.showErrorBox("导入失败", 'excel表格内容不符合规范');
    return false
  }
  // 重新洗牌
  shuffle(users);
  return users
}

const importFile = () => {
  ipcMain.handle('importFile', async (e, ...args) => {
    let sharedObject =  global.sharedObject;
    let extensions = args[0]
    let userName = args[1]
    if (!extensions) {
      extensions = []
    } else {
      extensions = JSON.parse(extensions)
    }
    console.log(extensions, 'extensionsextensions')
    try {
      const res = await dialog.showOpenDialog({
        // defaultPath: 'D:/Users/Desktop',
        filters: [
          {"name": "选择文件", extensions},
        ]
      }) 
      if (!res.canceled) {

        const filePath = res.filePaths[0]
    
        const fileName = path.basename(filePath)
        const destPath = path.join(dbPath, fileName)
        let users;
        if (userName) {
          const isHasGroup = sharedObject.cfg.groupList.some(item => item.group_name === fileName);
          if (!isHasGroup) {
            users = loadData(filePath)
            if (users) {
              sharedObject.curData[userName] = users
            } else {
              return false
            }
          }
        }
        fs.copyFileSync(filePath, destPath)
    
        return {
          savePath: destPath,
          fileUrl: url.pathToFileURL(destPath).href,
          fileName: fileName,
          users
        }
      }
    } catch (err) {
      dialog.showErrorBox("导入失败")
    }
  })
}

module.exports = {
  importFile
}