/**
* @Author: David Schmotz <David>
* @Date:   2018-05-05T19:22:51+02:00
* @Email:  davidschmotz@gmail.com
* @Filename: mainareaManager.js
 * @Last modified by:   David
 * @Last modified time: 2018-06-11T23:17:34+02:00
*/

const sketch = require("./sketch");
const p5 = require('p5');
const getXml = require("../file/readfile.js");
const setXml = require("../file/savefile.js");
const xml2js = require("xml2js");
const fs = require('fs');
const {ipcRenderer} = require("electron");

const app = new p5(sketch.sketch);

//
const saveXML = () => {

  const path  = __dirname + '/output2.xml';
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
      prefab: "0",
      type: "sprite",
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
