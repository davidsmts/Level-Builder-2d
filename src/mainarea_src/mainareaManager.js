/**
* @Author: David Schmotz <David>
* @Date:   2018-05-05T19:22:51+02:00
* @Email:  davidschmotz@gmail.com
* @Filename: mainareaManager.js
 * @Last modified by:   David
 * @Last modified time: 2018-05-05T22:45:44+02:00
*/

const sketch = require("./sketch");
const p5 = require('p5');
const getXml = require("../file/readfile.js");
const setXml = require("../file/savefile.js");

//  Function that loads new xml and creates new sketch
function loadXML() {
  const path  = __dirname + '/output.xml';
  console.log(path)
  getXml.getJsonFromXmlAtPath(path).then((result) => {
    console.log(xml);
    sketch.level = xml;
    let app = new p5(sketch.sketch);
  });
}

const widthBut = document.getElementById("changeWidthBut");
widthBut.addEventListener("click", () => {
  loadXML();
});

//  Function that creates new default xml





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
