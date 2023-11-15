const { ipcMain, BrowserWindow  } = require('electron')
let cwd = path.join(__dirname, "data");
// 当前全屏状态
let isFullScreen = false;
const toggleFullScreen = (data) => {
 // 获取当前窗口 
 const win = BrowserWindow.getFocusedWindow();

 ipcMain.handle('toggleFullScreen', async () => {
   
   // 切换全屏状态
   isFullScreen = !isFullScreen;
   win.setFullScreen(isFullScreen);

   return isFullScreen;
 })
}

/**
 * 写入文件
 * @param {*} data
 */
function saveDataFile(data) {
  data = JSON.stringify(data, "", 2);

  if (!fs.existsSync(cwd)) {
    fs.mkdirSync(cwd);
  }

  return new Promise((resolve, reject) => {
    fs.writeFile(path.join(cwd, "prizesConfig.json"), data, err => {
      if (err) {
        reject(err);
        return;
      }
      resolve();
      console.log("数据写入成功");
    });
  });
}
const loadFile = () => {
  new Promise((resolve, reject) => {
    fs.readFile(path.join(cwd, "prizesConfig.json"), "utf8", (err, data) => {
      if (err) {
        resolve({});
        return;
      }
      resolve(JSON.parse(data));
    });
  })
}
const savePrizesConfig = () => {
  ipcMain.handle('savePrizesConfig', async () => {
   
   
  })
}

module.exports = {
  toggleFullScreen,
  savePrizesConfig
}