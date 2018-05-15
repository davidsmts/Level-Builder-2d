/**
* @Author: David Schmotz <David>
* @Date:   2018-05-05T19:22:51+02:00
* @Email:  davidschmotz@gmail.com
* @Filename: mainareaManager.js
 * @Last modified by:   David
 * @Last modified time: 2018-05-15T18:32:33+02:00
*/

const sketch = require("./sketch");
const p5 = require('p5');
const getXml = require("../file/readfile.js");
const setXml = require("../file/savefile.js");
const xml2js = require("xml2js");
const fs = require('fs');


//  Function that loads new xml and creates new sketch
// const loadXML = () => {
//   const path  = __dirname + '/output2.xml';
//   console.log(path)
//   let xml;
//   const parser = new xml2js.Parser();
//   fs.readFile(path, function(err, data) {
//     parser.parseString(data, function (err, result) {
//       console.dir(result)
//       sketch.Path = path;
//       let app = new p5(sketch.sketch);
//     });
//   });
// }

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
    let tempObj = {$:{
      id: i.toString(),
      prefab: "0",
      type: "sprite",
      xPosition: spritePositions[i].x.toString(),
      yPosition: spritePositions[i].y.toString()
    }}
    obj.elementCollection.element.push(tempObj)
  }
  return obj
}

ipcRenderer.on('new-doc-sketch', (event, arg) => {
  sketch.Path = path;
  let app = new p5(sketch.sketch);
})

module.exports = {
  loadXML,
  saveXML
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
