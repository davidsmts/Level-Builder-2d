/**
* @Author: David Schmotz <David>
* @Date:   2018-05-01T19:19:10+02:00
* @Email:  davidschmotz@gmail.com
* @Filename: main.js
 * @Last modified by:   David
 * @Last modified time: 2018-06-12T18:35:57+02:00
*/

const electron = require("electron")
const app = electron.app
const BrowserWindow = electron.BrowserWindow
const path = require('path')
const url = require('url')
const ipcMain = electron.ipcMain

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

//  ToDo: find a better describing comment here
//  Current Path and Current Document logic

const documents = {
  currentPath: "",
  currentDocumentName: "",
  currentFullPath: ""
}

ipcMain.on("new-path", (event, arg) => {
  console.log("main: " + arg)
  documents.currentPath = arg;
})

ipcMain.on("new-doc-main", (event, arg) => {
  console.log("main: " + arg);
  documents.currentDocumentName = arg;
  const fullpath = documents.currentPath + "/" + documents.currentDocumentName;
  documents.currentFullPath = fullpath;
  openNewDocument(fullpath);
})

ipcMain.on("giveme-currentDocumentPath", (event, arg) => {
  console.log("main: " + arg);
  currentDocumentPath(fullpath);
})

ipcMain.on("change-selected-block", (event, arg) => {
  console.log("main-change: " + arg);
  changeSelectedBlockTo(arg);
})

const currentDocumentPath = (currentDocumentPath) => {
  mainWindow.webContents.send('givingyou-currentDocumentPath', currentDocumentPath);
}

const openNewDocument = (pathToNewDocument) => {
  mainWindow.webContents.send('new-doc-sketch', pathToNewDocument);
  mainWindow.webContents.send('new-doc-mainareaManager', documents);
}

const changeSelectedBlockTo = (selectedBlockType) => {
  mainWindow.webContents.send('change-selected-block', selectedBlockType);
}
