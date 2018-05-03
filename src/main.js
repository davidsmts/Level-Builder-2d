/**
* @Author: David Schmotz <David>
* @Date:   2018-05-01T19:19:10+02:00
* @Email:  davidschmotz@gmail.com
* @Filename: main.js
 * @Last modified by:   David
 * @Last modified time: 2018-05-03T13:00:13+02:00
*/

const electron = require("electron")
const app = electron.app
const BrowserWindow = electron.BrowserWindow
const path = require('path')
const url = require('url')

let mainWindow

function createWindow() {
  mainWindow = new BrowserWindow({ width: 1000, height: 600 })

  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, "index.html"),
    protocol: "file:",
    slashes: true
  }))

  mainWindow.openDevTools()

  mainWindow.on("closed", _ => {
    mainWindow = null
  })
}

app.on("ready", createWindow)

app.on("window-all-closed", function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on("activate", function () {
  if (mainWindow === null) {
    createWindow()
  }
})
