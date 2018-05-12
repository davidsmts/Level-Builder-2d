/**
* @Author: David Schmotz <David>
* @Date:   2018-05-01T20:06:17+02:00
* @Email:  davidschmotz@gmail.com
* @Filename: sketch.js
 * @Last modified by:   David
 * @Last modified time: 2018-05-12T16:35:26+02:00
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
  const CANVAS_CLASSNAME = "sketch";

  //  generel global vars
  let spritePositions = new Array();
  let spriteTypes = new Array();
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
    canvas.id(CANVAS_CLASSNAME);
  };

  p.draw = () => {
    p.background(200);
    p.fill(255);
    //  Draw Vetical Lines
    for (var i=0; i<LevelHeight; i+=CubeWidthAndHeight) {
      p.line(i, 0, i, LevelHeight);
    }
    //  Draw Horizontal Lines
    for (var i=0; i<LevelWidth; i+=CubeWidthAndHeight) {
      p.line(0, i, LevelWidth, i);
    }
    //  Draw Blocks
    for (let position of spritePositions) {
      p.fill(NORMAL_BLOCK_COLOR);
      p.rect(position.x, position.y, CubeWidthAndHeight, CubeWidthAndHeight);
    }
  }

  p.mousePressed = () => {
    const mouse = p.createVector(p.mouseX, p.mouseY);
    const sketchElement = document.getElementById(CANVAS_CLASSNAME)
    const sketchPosition = p.createVector(sketchElement.offsetLeft, sketchElement.offsetTop)
    const sketchSize = p.createVector(sketchElement.width, sketchElement.height)

    if (rectContains(sketchPosition, sketchSize, mouse)) {
      console.log("in bound")
      createNewBlock(mouse)
    }
  }

  //  this function creates a new block at the given position
  //  blockPos : p.Vector2d => position(x and y) of the new block in pixels
  const createNewBlock = (blockPos) => {
    const toRoundX = blockPos.x % 50;
    const toRoundY = blockPos.y % 50;
    const x = blockPos.x - toRoundX;
    const y = blockPos.y - toRoundY;
    console.log(blockPos)
    spritePositions.push(p.createVector(x/50,y/50));
  }

  //  Loops thorugh the elements of the received xml and pushes the Values into
  //  prepared arrays
  const interpretLevelObject = (obj) => {
    console.log("interpretLevelObject")
    const elements = obj.elementCollection.elements[0].element
    for (let element of elements) {
      console.log(element.id[0])
      //  positions get multiplied by CubeWidthAndHeight because thats how we lay out the window
      const vector = p.createVector(element.xPosition[0]*CubeWidthAndHeight, element.yPosition[0]*CubeWidthAndHeight)
      const type = element.type[0]

      spritePositions.push(vector)
      spriteTypes.push(type)
    }
    console.log(spritePositions)
    console.log(spriteTypes)
  }

  //  this function checks if the given rectangle contains the given point
  //  rectPosition    : p.Vector2d => Position(x and y) of the rectangle
  //  rectPosition    : p.Vector2d => size(width and height) of the rectangle
  //  pointToCheckFor : p.Vector2d => Position of the rectangle
  const rectContains = (rectPosition, rectSize, pointToCheckFor) => {
    const upperVerticalBound = rectPosition.y
    const lowerVerticalBound = rectPosition.y + rectSize.y
    const leftHorizontalBound = rectPosition.x
    const rightHorizontalBound = rectPosition.x + rectSize.x

    if (pointToCheckFor.x > leftHorizontalBound && pointToCheckFor.x < rightHorizontalBound && pointToCheckFor.y > upperVerticalBound && pointToCheckFor.y < lowerVerticalBound) {
      return true
    }
    return false
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
