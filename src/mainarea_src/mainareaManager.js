/**
* @Author: David Schmotz <David>
* @Date:   2018-05-05T19:22:51+02:00
* @Email:  davidschmotz@gmail.com
* @Filename: mainareaManager.js
 * @Last modified by:   David
 * @Last modified time: 2018-05-06T12:27:08+02:00
*/

const sketch = require("./sketch");
const p5 = require('p5');
const getXml = require("../file/readfile.js");
const setXml = require("../file/savefile.js");
const xml2js = require("xml2js");
const fs = require('fs');


//  Function that loads new xml and creates new sketch
function loadXML() {
  const path  = __dirname + '/output.xml';
  console.log(path)
  let xml;
  const parser = new xml2js.Parser();
  fs.readFile(path, function(err, data) {
    parser.parseString(data, function (err, result) {
      console.dir(result)
      sketch.Path = path;
      let app = new p5(sketch.sketch);
    });
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
