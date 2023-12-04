const { app, BrowserWindow, protocol, Menu } = require('electron')
const path = require('path')
const WinState = require('electron-win-state').default;
const NODE_ENV = process.env.NODE_ENV

// 全局变量
global.sharedObject = {
  curData: {},
  luckyData: {},
  errorData: [],
  defaultPage: `default data`,
  cfg: {},
  win: null
}

const openDialog = require('./controller/openDialog')
const { getTempData } = require('./controller/getTempData')
const { getStaticUsersData, setData, resetData, resetOneRoundLuckyData, handleExportData, getSaveExcelFileInfoList, openFileOrFolder } = require('./controller/dataHandle')
const { toggleFullScreen, savePrizesConfig, openDevTools } = require('./controller/systemEventHandle')
const { importFile } = require('./controller/prizesConfigHandle')
const createWindow = () => {
  const winState = new WinState({
    // defaultWidth: 1000,
    // defaultHeight: 800
  })
  const win = new BrowserWindow({
    // width: 1000,
    // height: 800,
    ...winState.winOptions,
    // frame: false, // 隐藏窗口的默认操作菜单
    // icon: path.join(__dirname, 'path/to/your/icon.png'), // 设置程序图标
    title: 'Your App Title', // 设置标题
    webPreferences: {
      preload: path.join(__dirname, './preload.js'),
      webSecurity: false, // 取消跨域
      // nodeIntegration: true, // v5版本开始需要加多这一行
      // contextIsolation: false, // v12版本需要加多这一行
      // enableRemoteModule:true //v10版本 打开remote模块
    }
  })

  winState.manage(win);
  // 最大化
  win.maximize()
  win.show() 

  // Alt + Enter 切换全屏
  win.on('keyup', (e) => {
    if(e.altKey && e.key === 'Enter') {
      win.setFullScreen(!win.isFullScreen()); 
    }
  });

  // 窗口恢复正常大小事件
  win.on('unmaximize', () => {
    winState.isMaximized = false;
  });
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
  // global.sharedObject.win = win;

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

  // 重置当前或上一轮奖项所有中奖名单
  resetOneRoundLuckyData();

  // 获取导出文件列表
  getSaveExcelFileInfoList();

  // 打开文件/文件夹
  openFileOrFolder();

  // 处理数据导出
  handleExportData();

  // 全屏切换
  toggleFullScreen();

  // 导入文件
  importFile();

  // 保存配置文件
  savePrizesConfig();

  // 打开开发者工具
  openDevTools();
}

app.whenReady().then(() => {
  createWindow();
})

app.on('window-all-closed', function() {
  if (process.platform !== 'darwin') app.quit();
})
app.on('ready', () => {
  Menu.setApplicationMenu(null);
  protocol.registerFileProtocol('file', (request, callback) => {
    const filePath = path.normalize(request.url.replace(/^file:\/\//, ''));
    callback({ path: filePath });
  });
});