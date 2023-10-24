const { contextBridge, ipcRenderer } = require('electron')
const openDialog = async (data) => {
  let result = await ipcRenderer.invoke('open-dialog', data)
  return result;
}
contextBridge.exposeInMainWorld('myApi', {
  openDialog
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