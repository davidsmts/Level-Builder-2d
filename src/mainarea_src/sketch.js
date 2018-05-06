/**
* @Author: David Schmotz <David>
* @Date:   2018-05-01T20:06:17+02:00
* @Email:  davidschmotz@gmail.com
* @Filename: sketch.js
 * @Last modified by:   David
 * @Last modified time: 2018-05-06T12:27:19+02:00
*/

const xml2js = require("xml2js");
const fs = require('fs');

'use strict';

//  global vars that are getting edited by outside
let CubeWidthAndHeight = 50;
let LevelWidth = 1000;
let LevelHeight = 3000;
let Path = "";

const Level = () => {
  const path  = __dirname + '/output.xml';
  console.log(path)
  let xml;
  const parser = new xml2js.Parser();
  fs.readFile(path, function(err, data) {
    parser.parseString(data, function (err, result) {
      console.dir(result)
      return result;
    });
  });
}

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
    let xml = Level();
    console.log(xml);
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
  };
/*
  //System function
  p.mousePressed = () => {
    var mouse = p.createVector(mouseX, mouseY);
    var indexArr = coordinateToIndex(mouse);
    if (p.mouse.x>0 && p.mouse.y>0) {
      var toRoundX = mouse.x % 50;
      var toRoundY = mouse.y % 50;
      var x = mouse.x - toRoundX;
      var y = mouse.y - toRoundY;
      //openMenu(p.createVector(x,y));
      p.fill(NORMAL_BLOCK_COLOR);
      p.rect(x,y,50,50);
      spritePositions.push(p.createVector(x/50,y/50));
    }
  }
  */
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
