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
// 暴露electron处理函数 渲染进程和主进程通信
contextBridge.exposeInMainWorld('myApi', {
  openDialog,
  getTempData,
  getStaticUsersData
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