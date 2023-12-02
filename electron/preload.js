const { contextBridge, ipcRenderer } = require('electron')
const openDialog = async (data) => {
  let result = await ipcRenderer.invoke('open-dialog', data)
  return result;
}
const getTempData = async () => {
  let result = await ipcRenderer.invoke('getTempData')
  return result
}
const getStaticUsersData = async () => {
  let result = await ipcRenderer.invoke('getStaticUsersData')
  return result
}
// 保存数据
const setData = async (...args) => {
  let result = await ipcRenderer.invoke('setData', ...args)
  return result
}

// 重置数据
const resetData = async (...args) => {
  let result = await ipcRenderer.invoke('resetData', ...args)
  return result
}

// 处理数据导出
const handleExportData = async (...args) => {
  let result = await ipcRenderer.invoke('handleExportData', ...args)
  return result
}

// 全屏切换
const toggleFullScreen = async (...args) => {
  let result = await ipcRenderer.invoke('toggleFullScreen', ...args)
  return result
}

// 保存抽奖配置
const savePrizesConfig = async (...args) => {
  let result = await ipcRenderer.invoke('savePrizesConfig', ...args)
  return result
}

// 导入文件
const importFile = async (...args) => {
  let result = await ipcRenderer.invoke('importFile', ...args)
  return result
}

// 打开开发者工具
const openDevTools = async (...args) => {
  let result = await ipcRenderer.invoke('openDevTools', ...args)
  return result
}

// 暴露electron处理函数 渲染进程和主进程通信
contextBridge.exposeInMainWorld('myApi', {
  openDialog,
  getTempData,
  getStaticUsersData,
  setData,
  resetData,
  handleExportData,
  toggleFullScreen,
  importFile,
  savePrizesConfig,
  openDevTools
})
window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector);
    if (element) element.innerText = text;
  }

  for(const dependency of ['chrome', 'node', 'electron']) {
    replaceText(`${dependency}-version`, process.versions[dependency])
  }

})