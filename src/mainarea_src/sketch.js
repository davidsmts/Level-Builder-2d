/**
* @Author: David Schmotz <David>
* @Date:   2018-05-01T20:06:17+02:00
* @Email:  davidschmotz@gmail.com
* @Filename: sketch.js
 * @Last modified by:   David
 * @Last modified time: 2018-05-11T18:41:57+02:00
*/


'use strict';

const xml2js = require("xml2js");
const fs = require('fs');
const {ipcRenderer} = require("electron")


//  global vars that are getting edited by outside
let CubeWidthAndHeight = 50;
let LevelWidth = 1000;
let LevelHeight = 3000;
let Path = "";

const Level = new Promise((resolve, reject) => {
  const path  = __dirname + '/output.xml';
  console.log(path);
  const parser = new xml2js.Parser();
  fs.readFile(path, function(err, data) {
    parser.parseString(data, function (err, result) {
      console.dir(result)
      resolve(result)
    });
  });
})

const sketch = (p) => {

  //  function dependant constants
  let NORMAL_BLOCK_COLOR;
  let BAD_BLOCK_COLOR;
  let FAST_BLOCK_COLOR;
  let BREAK_BLOCK_COLOR;

  //  constants
  const PARENT_ID = "p5Area";

  //  generel global vars
  let spritePositions = new Array();
  let idCounter = 0;
  let canvas;

  p.preload = () => {
    //initialising constants
    NORMAL_BLOCK_COLOR = p.color(204, 102, 0);
    BAD_BLOCK_COLOR = p.color(20, 102, 0);
    FAST_BLOCK_COLOR = p.color(204, 12, 0);
    BREAK_BLOCK_COLOR = p.color(204, 102, 100);
  }

  p.setup = () => {
    // Create the canvas
    canvas = p.createCanvas(LevelWidth, LevelHeight);
    canvas.parent(PARENT_ID);

  };

  p.draw = () => {
    p.background(200);
    p.fill(255);
    for (var i=0; i<LevelHeight; i+=CubeWidthAndHeight) {
      p.line(i, 0, i, LevelHeight);
    }
    for (var i=0; i<LevelWidth; i+=CubeWidthAndHeight) {
      p.line(0, i, LevelWidth, i);
    }
    for (let position of spritePositions) {
      p.fill(NORMAL_BLOCK_COLOR);
      p.rect(position.x, position.y, 50, 50);
    }
  }

  p.mousePressed = () => {
    console.log("press")
    console.log(p)
    let p5AreaPosition = document.getElementById("p5Area")
    console.log(p5AreaPosition)
  }

  ipcRenderer.on('new-doc-sketch', (event, arg) => {
    console.log("sketch: " + arg)
    Level.then((result) => {
      console.log(result);
      interpretLevelObject(result)
    }, (err) => {
      console.log(err)
    })
  })

  const interpretLevelObject = (obj) => {
    console.log("interpretLevelObject")
    const elements = obj.elementCollection.elements[0].element
    for (let element of elements) {
      console.log(element.id[0])
      //  positions get multiplied by CubeWidthAndHeight because thats how we lay out the window
      let vector = p.createVector(element.xPosition[0]*CubeWidthAndHeight, element.yPosition[0]*CubeWidthAndHeight)
      spritePositions.push(vector)
    }
    console.log(spritePositions)
  }

}

module.exports = {
  //  global vars that are getting edited by outside
  sketch,
  CubeWidthAndHeight,
  LevelWidth,
  LevelHeight,
  Level,
  Path
}
