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

const importFile = () => {
  ipcMain.handle('importFile', async (e, ...args) => {
    let extensions = args[0]
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
    
        fs.copyFileSync(filePath, destPath)
    
        return url.pathToFileURL(destPath).href
      }
    } catch (err) {
      dialog.showErrorBox("导入失败")
    }
  })
}

module.exports = {
  importFile
}