/**
* @Author: David Schmotz <David>
* @Date:   2018-05-05T19:22:51+02:00
* @Email:  davidschmotz@gmail.com
* @Filename: mainareaManager.js
 * @Last modified by:   David
 * @Last modified time: 2018-08-27T19:28:28+02:00
*/

const sketch = require("./sketch");
const p5 = require('p5');
const getXml = require("../file/readfile.js");
const setXml = require("../file/savefile.js");
const xml2json = require("xml2json");
const fs = require('fs');
const {ipcRenderer} = require("electron");
const maps = require('../assets/typeMaps');

const app = new p5(sketch.sketch);
const documents = {
  currentPath: "",
  currentDocumentName: "",
  currentFullPath: ""
}
const VERSION = 2


//
const saveXML = () => {
  const path  = documents.currentPath + '/' + documents.currentDocumentName;
  console.log(path)
  let obj = buildJsonObject()
  console.log(obj)
  const xml = xml2json.toXml(obj)
  console.log(xml)
  fs.writeFile(path, xml, (err) => {
    if (err) {
      console.log("Error saving the xml: " + err)
    }
    console.log("successfull save")
  })
}


//  builds a json object of the provided information and turns it into an xml
const buildJsonObject = () => {
  let sprites = sketch.Sprites
  let Interactives = sketch.Interactives
  console.log("json builder: " + sprites.length)
  const DIMENSION = sketch.CubeWidthAndHeight;
  const LevelHeight = sketch.LevelHeight
  const LevelWidth = sketch.LevelWidth

  //  Fill Header
  var Header = renewHeader(DIMENSION)
  let obj = { collection: {
    header: {
      info: Header
    },
    environment: {
      element: []
    },
    interactive: {
      object: []
    }
  }}

  //  Prepare Environment Elements
  let sortedSprites = sortVectors(sprites, LevelHeight, LevelWidth);
  sprites = sortedSprites
  console.log("after sorting: " + sprites.length)
  console.log(sprites)
  //  Fill Environment Elements
  for (let i = 0; i < sprites.length; i++) {
    let block_attributes = maps.block_attributes[sprites[i].type];
    //  calculate positions in unified dimension
    const translatedX = sprites[i].position.x / DIMENSION;
    const translatedY = sprites[i].position.y / DIMENSION;
    //  Prepare a temporary object
    let tempObj = Object.assign({},maps.DEFAULT_ELEMENT);
    tempObj.id = i.toString();
    tempObj.prefab = 0;
    tempObj.type = sprites[i].type;
    tempObj.xPosition = translatedX.toString();
    tempObj.yPosition = translatedY.toString();
    tempObj.zPosition = sprites[i].layer
    tempObj.hitbox = block_attributes.hitbox;
    if (tempObj.zPosition != 0) {
      tempObj.hitbox = false;
    }
    //  Add tempObj to environment container
    obj.collection.environment.element.push(tempObj)
  }

  console.log(obj.collection.environment.element)

  //  Fill Interactives
  for (let i = 0; i < Interactives.length; i++) {
    let Interactive = Interactives[i]
    let block_attributes = maps.block_attributes[Interactive.type];
    //  calculate positions in unified dimension
    const translatedX = Interactive.position.x / DIMENSION;
    const translatedY = Interactive.position.y / DIMENSION;
    //  Prepare a temporary object
    let tempObj = Object.assign({},maps.DEFAULT_OBJECT);
    tempObj.id = i.toString();
    tempObj.prefab = 0;
    tempObj.type = Interactive.type;
    tempObj.xPosition = translatedX.toString();
    tempObj.yPosition = translatedY.toString();
    tempObj.hitbox = block_attributes.hitbox;
    tempObj.additionals = Interactive.additionals;
    if (tempObj.additionals != undefined) {
      for (let additional of tempObj.additionals) {
        additional.xPosition = additional.xPosition / DIMENSION
        additional.yPosition = additional.yPosition / DIMENSION
        if (additional.value == null || additional.value == undefined) {
          additional.value = ""
        }
      }
    }
    //  Add tempObj to environment container
    obj.collection.interactive.object.push(tempObj)
  }
  console.log(obj)
  return obj
}


const renewHeader = (dimension) => {
  const LevelHeight = sketch.LevelHeight / dimension
  const LevelWidth = sketch.LevelWidth / dimension
  var Header = sketch.Header
  console.log(sketch)
  if (Header == undefined || Header == null || Header.length < 3) {
    console.log("undefined")
    Header = DefaultHeader
  }
  console.log(Header)

  Header[0].value = VERSION.toString()
  Header[1].value = LevelWidth.toString()
  Header[2].value = LevelHeight.toString()
  return Header
}


//
//  SORT FUNCTIONS
//

//  sorts the vectors b y-coordinate and then calls the below function to
//  sort by x as well
//  returns sorted Sprite Array
const sortVectors = (Sprites, LevelHeight, LevelWidth) => {
  console.log(LevelHeight)
  let sortedSprites = new Array()
  for (let i=0; i<LevelHeight; i+=50) {
    let spritesOfRowI = new Array();
    //  Get all sprites with i's y-coordinate
    for (let j=0; j<Sprites.length; j++) {
      if (Sprites[j].position.y == i) {
        //console.log(i + " vs. " + position.y + " -> worked")
        spritesOfRowI.push(Sprites[j]);
      }
    }

    let xSortedSprites = sortByX(LevelWidth, spritesOfRowI)
    sortedSprites = sortedSprites.concat(xSortedSprites)
  }

  return sortedSprites
}


//  gets called by the above sort function to sort by x after the vectors
//  have been classified by y
//
const sortByX = (LevelWidth, Sprites) => {
  let xSortedSprites = new Array();
  //  Sort the sprites for the -> i y coordinate by their x value
  for (let x=0; x<LevelWidth; x+=50) {
    for (let j=0; j<Sprites.length; j++) {
      if (Sprites[j].position.x == x) {
        xSortedSprites.push(Sprites[j]);
      }
    }
  }
  return xSortedSprites
}



//

const clean = () => {
  console.log("clean")
  ipcRenderer.send('clean-all');
}

const changeLayer = () => {
  ipcRenderer.send('change-layer');
}

const changeBlockType = (selectedBlockType) => {
  ipcRenderer.send('change-selected-block', selectedBlockType);
}

//
const redrawSketch = () => {
  console.log("redrawSketch mainareaManager")
  ipcRenderer.send('redraw-sketch');
}

//
const changeSize = (width, height) => {
  console.log("change Size mainareaManager")
  ipcRenderer.send('changeSize-sketch', width, height);
}

//
const changeZoom = (zoom) => {
  console.log("change zoom mainareaManager")
  ipcRenderer.send('changeZoom-sketch', zoom);
}

//
const generelInputConfirm = (inputInt) => {
  console.log("change zoom mainareaManager")
  ipcRenderer.send('generelInputConfirm-sketch', inputInt);
}

ipcRenderer.on('new-doc-sketch', (event, path) => {
  console.log("mainarea creates sketch");
})


ipcRenderer.on('new-doc-mainareaManager', (event, documentsOfMain) => {
  console.log("mainarea receives new doc");
  documents.currentPath = documentsOfMain.currentPath;
  documents.currentFullPath = documentsOfMain.currentFullPath;
  documents.currentDocumentName = documentsOfMain.currentDocumentName;
})


module.exports = {
  changeSize,
  saveXML,
  changeBlockType,
  generelInputConfirm,
  changeZoom,
  clean,
  changeLayer
}
