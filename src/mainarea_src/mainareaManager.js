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
const fs = require('fs');
const {ipcRenderer} = require("electron");
const maps = require('../assets/typeMaps');

const app = new p5(sketch.sketch);

const nameToInt_TypeMap = maps.nameToInt_TypeMap;
const intToName_TypeMap = maps.intToName_TypeMap;
const documents = {
  currentPath: "",
  currentDocumentName: "",
  currentFullPath: ""
}

//
const changeSize = () => {
  console.log("change Size")
  sketch.LevelWidth = 4000
  sketch.LevelHeight = 4000
  ipcRenderer.send('redraw-sketch', 4000, 4000);
}

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
const changeZoom = () => {
  const {dialog} = require('electron').remote
  console.log(dialog.showOpenDialog({properties: ['openFile', 'openDirectory', 'multiSelections']}))
}


//  builds a json object of the provided information and turns it into an xml
const buildJsonObject = () => {
  let spritePositions = sketch.SpritePositions
  let spriteTypes = sketch.SpriteTypes
  console.log("json builder: " + spritePositions.length + " and : " + spriteTypes.length)
  const LevelHeight = sketch.LevelHeight
  const LevelWidth = sketch.LevelWidth

  let obj = { elementCollection: {
    element: []
  }}

  let {sortedPositions, sortedTypes} = sortVectors(spritePositions, spriteTypes, LevelHeight, LevelWidth);
  spritePositions = sortedPositions
  spriteTypes = sortedTypes
  const dimension = sketch.CubeWidthAndHeight;

  for (let i = 0; i < spritePositions.length; i++) {
    //  calculate positions in unity dimension
    const translatedX = spritePositions[i].x / dimension;
    const translatedY = spritePositions[i].y / dimension;
    let tempObj = {$:{
      id: i.toString(),
      prefab: 0,
      type: spriteTypes[i],
      xPosition: translatedX.toString(),
      yPosition: translatedY.toString()
    }}
    obj.elementCollection.element.push(tempObj)
  }
  return obj
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
