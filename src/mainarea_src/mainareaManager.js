/**
* @Author: David Schmotz <David>
* @Date:   2018-05-05T19:22:51+02:00
* @Email:  davidschmotz@gmail.com
* @Filename: mainareaManager.js
 * @Last modified by:   David
 * @Last modified time: 2018-06-12T18:38:20+02:00
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


//  builds a json object of the provided information and turns it into an xml
const buildJsonObject = () => {
  const spritePositions = sketch.SpritePositions
  const spriteTypes = sketch.spriteTypes
  let obj = { elementCollection: {
    element: []
  }}
  for (let i = 0; i < spritePositions.length; i++) {
    //  calculate positions in unity dimension
    const dimension = sketch.CubeWidthAndHeight;
    const translatedX = spritePositions[i].x / dimension;
    const translatedY = spritePositions[i].y / dimension;
    let tempObj = {$:{
      id: i.toString(),
      prefab: 0,
      type: "normal_block",
      xPosition: translatedX.toString(),
      yPosition: translatedY.toString()
    }}
    obj.elementCollection.element.push(tempObj)
  }
  return obj
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
  changeBlockType
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
