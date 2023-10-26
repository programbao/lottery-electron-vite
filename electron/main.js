const { app, BrowserWindow } = require('electron')
const path = require('path')

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
const { getStaticUsersData } = require('./controller/dataHandle')


const createWindow = () => {
  const win = new BrowserWindow({
    width: 1000,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, './preload.js'),
      // webSecurity: false, // 取消跨域
      // nodeIntegration: true, // v5版本开始需要加多这一行
      // contextIsolation: false, // v12版本需要加多这一行
      // enableRemoteModule:true //v10版本 打开remote模块
    }
  })
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
}

app.whenReady().then(() => {
  createWindow();
})

app.on('window-all-closed', function() {
  if (process.platform !== 'darwin') app.quit();
})