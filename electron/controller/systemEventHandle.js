const { ipcMain, BrowserWindow  } = require('electron')
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

module.exports = {
  toggleFullScreen
}