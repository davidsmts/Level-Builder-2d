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
const saveXML = () => {

  const path  = documents.currentPath + '/' + documents.currentDocumentName;
  console.log(path)
  const obj = buildJsonObject()
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
  const LevelHeight = sketch.LevelHeight

  let obj = { elementCollection: {
    element: []
  }}

  let {sortedPositions, sortedTypes} = sortVectors(spritePositions, spriteTypes, LevelHeight);
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
const sortVectors = (SpritePositions, SpriteTypes, LevelHeight) => {
  let sortedPositions = [];
  let sortedTypes = [];
  console.log(SpritePositions)
  for (let i=0; i<LevelHeight; i+=50) {
    for (let j=0; j<SpritePositions.length; j++) {
      position = SpritePositions[j];
      if (position.y == i) {
        console.log(i + " vs. " + position.y + " -> worked")
        sortedPositions.push(position);
        sortedTypes.push(SpriteTypes[j]);
      }
    }
  }
  return {sortedPositions, sortedTypes}
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
