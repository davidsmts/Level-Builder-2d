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
const xml2js = require("xml2js");
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
  const builder = new xml2js.Builder()
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
  let spritePositions = sketch.SpritePositions
  let spriteTypes = sketch.SpriteTypes
  let Interactives = sketch.Interactives
  console.log("json builder: " + spritePositions.length + " and : " + spriteTypes.length)
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
  let {sortedPositions, sortedTypes} = sortVectors(spritePositions, spriteTypes, LevelHeight, LevelWidth);
  spritePositions = sortedPositions
  spriteTypes = sortedTypes
  console.log("after sorting: " + spritePositions.length + " and : " + spriteTypes.length)
  //  Fill Environment Elements
  for (let i = 0; i < spritePositions.length; i++) {
    let block_attributes = maps.block_attributes[spriteTypes[i]];
    //  calculate positions in unified dimension
    const translatedX = spritePositions[i].x / DIMENSION;
    const translatedY = spritePositions[i].y / DIMENSION;
    //  Prepare a temporary object
    let tempObj = Object.assign({},maps.DEFAULT_ELEMENT);
    tempObj.id = i.toString();
    tempObj.prefab = 0;
    tempObj.type = spriteTypes[i];
    tempObj.xPosition = translatedX.toString();
    tempObj.yPosition = translatedY.toString();
    tempObj.hitbox = block_attributes.hitbox;
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
//
const sortVectors = (SpritePositions, SpriteTypes, LevelHeight, LevelWidth) => {
  console.log(LevelHeight)
  let sortedPositions = [];
  let sortedTypes = [];
  for (let i=0; i<LevelHeight; i+=50) {
    let spritePositionsOfRowI = [];
    let spriteTypesOfRowI = [];
    //  Get all sprites with i's y-coordinate
    for (let j=0; j<SpritePositions.length; j++) {
      let position = SpritePositions[j];
      if (position.y == i) {
        //console.log(i + " vs. " + position.y + " -> worked")
        spritePositionsOfRowI.push(position);
        spriteTypesOfRowI.push(SpriteTypes[j]);
      }
    }

    let {xSortedPositions, xSortedTypes} = sortByX(LevelWidth, spritePositionsOfRowI, spriteTypesOfRowI)
    sortedPositions = sortedPositions.concat(xSortedPositions)
    sortedTypes = sortedTypes.concat(xSortedTypes)
  }

  return {sortedPositions, sortedTypes}
}


//
//
const sortByX = (LevelWidth, positions, types) => {
  let xSortedPositions = [];
  let xSortedTypes = [];

  //  Sort the sprites for the -> i y coordinate by their x value
  for (let x=0; x<LevelWidth; x+=50) {
    for (let j=0; j<positions.length; j++) {
      let position = positions[j];
      if (position.x == x) {
        //console.log(x + " vs. " + position.x + " -> worked")
        xSortedPositions.push(position);
        xSortedTypes.push(types[j]);
      }
    }
  }
  return {xSortedPositions, xSortedTypes}
}

const clean = () => {
  console.log("clean")
  ipcRenderer.send('clean-all');
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
  app,
  sketch,
}

// const xml =
// "<elementCollection>" +
// "<elements>" +
// "<xPosition>-5</xPosition>" +
// "<yPosition>-3</yPosition>" +
// "</elements" +
// "<elements>" +
// "<xPosition>5</xPosition>" +
// "<yPosition>3</yPosition>" +
// "</elements" +
// "</elementsCollection";
