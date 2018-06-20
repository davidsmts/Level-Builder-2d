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
const Menu = electron.Menu
const {dialog} = require("electron");

let mainWindow

function createWindow() {
  mainWindow = new BrowserWindow({ width: 1000, height: 600 })

  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, "index.html"),
    protocol: "file:",
    slashes: true
  }))

  mainWindow.openDevTools()

  const name = electron.app.getName()
  const template = [
    {
      label: name,
      submenu: [{
        label: "Open",
        click: _ => {
          console.log("open")
          openFileDialog()
        },
      }, {
        type: "separator"
      }, {
        label: "Quit",
        click: _ => { app.quit() },
        accelerator: "Cmd+Q"
      }]
    }
  ]
  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)

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

//  Opens File Dialog and messages all endpoints the new path
const openFileDialog = () => {
  dialog.showOpenDialog({
    properties: ['openDirectory']
  }, function (files) {
    if (files !== undefined) {
      console.log(files)
      const Path = files[0]
      //  ipc sends
    }
  })
}

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

ipcMain.on("clean-all", (event) => {
  console.log("clean-all main");
  cleanAllSpriteArrays();
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

const cleanAllSpriteArrays = () => {
  mainWindow.webContents.send('clean-all');
}
