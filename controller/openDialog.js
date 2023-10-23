const { ipcMain, dialog } = require('electron')
const openDialog = (data) => {
  ipcMain.handle('open-dialog', (e, ...args) => {
    dialog.showOpenDialog()
  })
}

module.exports = openDialog