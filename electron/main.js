const { app, BrowserWindow, protocol } = require('electron')
const path = require('path')
const WinState = require('electron-win-state').default;
const NODE_ENV = process.env.NODE_ENV

// 全局变量
global.sharedObject = {
  curData: {},
  luckyData: {},
  errorData: [],
  defaultPage: `default data`,
}

const openDialog = require('./controller/openDialog')
const { getTempData } = require('./controller/getTempData')
const { getStaticUsersData, setData, resetData } = require('./controller/dataHandle')


const createWindow = () => {
  const winState = new WinState({
    defaultWidth: 1000,
    defaultHeight: 800
  })
  const win = new BrowserWindow({
    // width: 1000,
    // height: 800,
    ...winState.winOptions,
    webPreferences: {
      preload: path.join(__dirname, './preload.js'),
      webSecurity: false, // 取消跨域
      // nodeIntegration: true, // v5版本开始需要加多这一行
      // contextIsolation: false, // v12版本需要加多这一行
      // enableRemoteModule:true //v10版本 打开remote模块
    }
  })
  winState.manage(win);
  console.log(NODE_ENV, 'NODE_ENVNODE_ENVNODE_ENV')
  win.loadURL(
    NODE_ENV === 'development' ?
    'http://localhost:5173' : 
    `file://${path.join(__dirname, "../dist/index.html")}`
  );
  if (NODE_ENV === 'development') {
    win.webContents.openDevTools();
  }

  app.on('activate', function() {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })

  // 打开dialog
  openDialog();

  // 获取奖品配置
  getTempData();

  // 获取静态用户数据
  getStaticUsersData();

  // 设置和保存数据 
  setData();

  // 重置数据
  resetData();
}

app.whenReady().then(() => {
  createWindow();
})

app.on('window-all-closed', function() {
  if (process.platform !== 'darwin') app.quit();
})
app.on('ready', () => {
  protocol.registerFileProtocol('file', (request, callback) => {
    const filePath = path.normalize(request.url.replace(/^file:\/\//, ''));
    callback({ path: filePath });
  });
});