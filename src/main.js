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
      },{
        label: "Load backgrounds",
        click: _ => {
          console.log("backgrounds")
          selectBackgroundFolder()
        },
      }, {
        label: "New",
        click: _ => {
          console.log("new")
          newXmlFile()
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
      const Path = files[0]
      //  ipc sends
      console.log(Path)
      documents.currentPath = Path;
      currentDocumentPath(Path)
    }
  })
}


//  Opens File Dialog and messages all endpoints the new path
const selectBackgroundFolder = () => {
  dialog.showOpenDialog({
    properties: ['openDirectory']
  }, function (files) {
    if (files !== undefined) {
      const Path = files[0]
      //  ipc sends
      console.log("pfad: " + Path)
      currentBackgroundTexturesPath(Path)
    }
  })
}

//  creates a new xml Level File
const newXmlFile = () => {

}


//  ToDo: find a better describing comment here
//  Current Path and Current Document logic

const documents = {
  currentPath: "",
  currentDocumentName: "",
  currentFullPath: ""
}

let layer = 0


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

ipcMain.on("change-selected-background", (event, arg) => {
  console.log("main-change: " + arg);
  changeSelectedBackgroundTo(arg);
})


ipcMain.on("clean-all", (event) => {
  console.log("clean-all main");
  cleanAllSpriteArrays();
})

ipcMain.on("redraw-sketch", (event, width, height) => {
  console.log("clean-all main");
  redrawSketch(width, height);
})

ipcMain.on("changeSize-sketch", (event, width, height) => {
  console.log("clean-all main");
  changeSize(width, height);
})

ipcMain.on("changeZoom-sketch", (event, width, height) => {
  console.log("clean-all main");
  changeZoom(width, height);
})

ipcMain.on("change-layer", (event) => {
  console.log("change-layer main");
  changeLayer()
})

ipcMain.on("generelInputConfirm-sketch", (event, value) => {
  console.log("generelInputConfirm main");
  generelInputConfirm(value);
})


//
// FUNCTIONS
//


const changeLayer = () => {
  if (layer <= 1) {
    layer++
  } else {
    layer = 0
  }

  mainWindow.webContents.send('new-layer', layer)
}

const currentBackgroundTexturesPath = (bgPath) => {
  console.log("sending")
  mainWindow.webContents.send('bgPath', bgPath)
}

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

const changeSelectedBackgroundTo = (selectedBackground) => {
  mainWindow.webContents.send('change-selected-background', selectedBackground);
}

const cleanAllSpriteArrays = () => {
  mainWindow.webContents.send('clean-all');
}

const redrawSketch = () => {
  console.log("redraw-sketch main")
  mainWindow.webContents.send('redraw-sketch');
}

const changeSize = (width, height) => {
  console.log("changeSize main")
  mainWindow.webContents.send('changeSize-sketch', width, height);
}

const changeZoom = (newZoom) => {
  console.log("changeZoom main")
  mainWindow.webContents.send('changeZoom-sketch', newZoom);
}

const generelInputConfirm = (value) => {
  console.log("generelInputConfirm main")
  mainWindow.webContents.send('generelInputConfirm-sketch', value);
}
