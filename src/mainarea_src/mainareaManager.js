/**
* @Author: David Schmotz <David>
* @Date:   2018-05-05T19:22:51+02:00
* @Email:  davidschmotz@gmail.com
* @Filename: mainareaManager.js
 * @Last modified by:   David
 * @Last modified time: 2018-06-16T21:16:54+02:00
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
const VERSION = 1
const DefaultHeader = maps.DefaultHeader

//
const saveXML = () => {
  const path  = documents.currentPath + '/' + documents.currentDocumentName;
  console.log(path)
  let obj = buildJsonObject()
  console.log(obj)
  const builder = new xml2js.Builder()
  const xml = builder.buildObject(obj)
  console.log(xml)
  fs.writeFile(path, xml, (err) => {
    if (err) {
      console.log("Error saving the xml: " + err)
    }
    console.log("successfull save")
  })
}


//
const saveXMLV2 = () => {
  const path  = documents.currentPath + '/' + documents.currentDocumentName;
  console.log(path)
  let obj = buildJsonObjectV2()
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
  console.log("json builder: " + spritePositions.length + " and : " + spriteTypes.length)
  const LevelHeight = sketch.LevelHeight
  const LevelWidth = sketch.LevelWidth

  let obj = { elementCollection: {
    element: [],
    info: []
  }}

  let {sortedPositions, sortedTypes} = sortVectors(spritePositions, spriteTypes, LevelHeight, LevelWidth);
  spritePositions = sortedPositions
  spriteTypes = sortedTypes
  const dimension = sketch.CubeWidthAndHeight;

  for (let i = 0; i < spritePositions.length; i++) {
    //  calculate positions in unity dimension
    const translatedX = spritePositions[i].x / dimension;
    const translatedY = spritePositions[i].y / dimension;
    let block_attributes = maps.block_attributes[spriteTypes[i]];
    let tempObj = {$:{
      id: i.toString(),
      prefab: 0,
      type: spriteTypes[i],
      xPosition: translatedX.toString(),
      yPosition: translatedY.toString(),
      hitbox: block_attributes.hitbox
    }}

    obj.elementCollection.element.push(tempObj)
  }

  return obj
}


//  builds a json object of the provided information and turns it into an xml
const buildJsonObjectV2 = () => {
  let spritePositions = sketch.SpritePositions
  let spriteTypes = sketch.SpriteTypes
  console.log("json builder: " + spritePositions.length + " and : " + spriteTypes.length)
  const LevelHeight = sketch.LevelHeight
  const LevelWidth = sketch.LevelWidth
  var Header = renewHeader()
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

  let {sortedPositions, sortedTypes} = sortVectors(spritePositions, spriteTypes, LevelHeight, LevelWidth);
  spritePositions = sortedPositions
  spriteTypes = sortedTypes
  const dimension = sketch.CubeWidthAndHeight;

  for (let i = 0; i < spritePositions.length; i++) {
    //  calculate positions in unity dimension
    const translatedX = spritePositions[i].x / dimension;
    const translatedY = spritePositions[i].y / dimension;
    let block_attributes = maps.block_attributes[spriteTypes[i]];
    let tempObj = {
      id: i.toString(),
      prefab: 0,
      type: spriteTypes[i],
      xPosition: translatedX.toString(),
      yPosition: translatedY.toString(),
      hitbox: block_attributes.hitbox,
    }
    if (block_attributes.collection == "environment") {
      obj.collection.environment.element.push(tempObj)
    } else if (block_attributes.collection == "interactive") {
      obj.collection.interactive.object.push(tempObj)
    }
  }

  return obj
}


const renewHeader = () => {
  const LevelHeight = sketch.LevelHeight
  const LevelWidth = sketch.LevelWidth
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
  saveXMLV2,
  changeBlockType,
  changeZoom,
  clean
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
