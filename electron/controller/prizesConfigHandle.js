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

// const isBuild = process.env.NODE_ENV === 'production'

const dbPath = path.join(__dirname, '../assets')
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
    console.log(args, 'argsargs')
    let extensions = args[0]
    let userName = args[1]
    let lotteryCount = args[2]
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
        const saveFolderPath = path.join(dbPath);
        let users;
        if (userName) {
          users = loadData(filePath)
          if (users && !userName.includes('secret_users_')) {
            sharedObject.curData[userName] = users
          }
          if (lotteryCount && users.length > Number(lotteryCount)) {
            dialog.showErrorBox("导入失败", `您导入的人员名单有${users.length}个，内置中奖人数不能大于总奖项数量 ${lotteryCount}个`);
            return false
          }
          // 判断工号不能为空和重复
          if (users && userName.includes('secret_users_')) {
            const handleIdSet = new Set();
            for (const item of data) {
              if (!Array.isArray(item) || item.length !== 3) {
                dialog.showErrorBox("导入失败", 'excel格式有误')
                return false;
              }
              const [id, department, name] = item;
              // 验证工号是否唯一和不能为空
              if (!id || handleIdSet.has(id+'') || idSet.has(id+'')) {
                dialog.showErrorBox("导入失败", `工号 ${id} 重复或为空`);
                return false;
              }
              handleIdSet.add(id+'');
            }
          }

          // const isHasGroup = sharedObject.cfg.groupList && sharedObject.cfg.groupList.some(item => item.group_name === fileName);
          // if (!isHasGroup) {
          //   users = loadData(filePath)
          //   if (users) {
          //     sharedObject.curData[userName] = users
          //   } else {
          //     return false
          //   }
          // }
        }
        fs.copyFileSync(filePath, destPath)
    
        return {
          savePath: destPath,
          saveFolderPath: saveFolderPath,
          fileUrl: url.pathToFileURL(destPath).href,
          fileName: fileName,
          users
        }
      }
    } catch (err) {
      console.log(err, '23480928342')
      dialog.showErrorBox("导入失败", err)
    }
  })
}

module.exports = {
  importFile
}