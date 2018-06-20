/**
* @Author: David Schmotz <David>
* @Date:   2018-05-01T20:06:17+02:00
* @Email:  davidschmotz@gmail.com
* @Filename: sketch.js
* @Last modified by:   David
* @Last modified time: 2018-06-12T23:58:48+02:00
*/

//"use strict";

const xml2js = require("xml2js");
const fs = require('fs');
const {ipcRenderer} = require("electron");


//  global vars that are getting edited by outside
let CubeWidthAndHeight = 50;
let LevelWidth = 4000;
let LevelHeight = 5000;
let Path = "";
let SpritePositions = new Array();
let SpriteTypes = new Array();

const Level = (path) => {
  return new Promise((resolve, reject) => {
    //const path  = __dirname + '/output2.xml';
    console.log(path);
    const parser = new xml2js.Parser();
    fs.readFile(path, function(err, data) {
      parser.parseString(data, function (err, result) {
        console.dir(result)
        resolve(result)
      });
    });
  })
}



function sketch(p) {

  //  function dependant constants
  let NORMAL_BLOCK_COLOR;
  let BAD_BLOCK_COLOR;
  let FAST_BLOCK_COLOR;
  let BREAK_BLOCK_COLOR;

  //  constants
  const PARENT_ID = "p5Area";
  const CANVAS_CLASSNAME = "sketch";

  //  generel global vars
  let idCounter = 0;
  let canvas;
  let selectedBlockType = "normal_block";

  p.preload = () => {
    //initialising constants
    NORMAL_BLOCK_COLOR = p.color(204, 102, 0);
    WOOD_BLOCK_COLOR = p.color(210, 105, 30);
    STONE_BLOCK_COLOR = p.color(100, 100, 100);
    PLAYER_BLOCK_COLOR = p.color(0, 200, 0);
  }

  p.setup = () => {
    // Create the canvas
    canvas = p.createCanvas(LevelWidth, LevelHeight);
    canvas.parent(PARENT_ID);
    canvas.id(CANVAS_CLASSNAME);
    // const parentElement = document.getElementById(PARENT_ID);
    // parentElement.style.width = LevelWidth + "px";
    // parentElement.style.height = LevelHeight + "px";
    p.noLoop();
  };


  //
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
    for (var i=0; i<SpritePositions.length; i++) {
      p.push();
      let position = SpritePositions[i];
      let colorForBlock = currentColor(SpriteTypes[i]);
      p.fill(colorForBlock);
      p.rect(position.x, position.y, CubeWidthAndHeight, CubeWidthAndHeight);
      p.pop();
    }
  }

  p.mousePressed = () => {
    const mouse = p.createVector(p.mouseX, p.mouseY);
    const sketchElement = document.getElementById(CANVAS_CLASSNAME)
    const sketchPosition = p.createVector(sketchElement.offsetLeft, sketchElement.offsetTop)
    const sketchSize = p.createVector(sketchElement.width, sketchElement.height)
    console.log(mouse)
    if (rectContains(sketchPosition, sketchSize, mouse)) {
      console.log("in bound")
      handleBlock(mouse)
    } else {
      console.log("not in bounds")
    }
  }


  const currentColor = (type) => {
    switch (type) {
      case "normal_block":
      console.log("normal_blockkkkk");
      return NORMAL_BLOCK_COLOR;
      break;
      case "wood_block":
      console.log("wood_blockkkk");
      return WOOD_BLOCK_COLOR;
      break;
      case "stone_block":
      console.log("stone_blockkkk");
      return STONE_BLOCK_COLOR;
      break;
      case "player":
      console.log("playerrrr");
      return PLAYER_BLOCK_COLOR;
      break;
      default:
      console.log("!!!!!DEFAULT COLOR STATE!!!!!");
      return p.color(0,0,0);
      break;
    }
  }


  //
  const handleBlock = (point) => {
    const toRoundX = point.x % 50;
    const toRoundY = point.y % 50;
    const x = point.x - toRoundX;
    const y = point.y - toRoundY;
    const blockPosition = p.createVector(x,y);
    let {doesContain, index} = doSpritesContain(blockPosition)

    if (!doesContain) { //  doesnt already contain the block
      createNewBlock(blockPosition)
      console.log(selectedBlockType)
      //showContextMenu(point);
    } else {            //  already contains the block
      removeBlock(index)
    }
  }


  //  this function creates a new block at the given position
  //  blockPos : p.Vector2d => position(x and y) of the new block in pixels
  const createNewBlock = (blockPos) => {
    console.log("createNewBlock")
    //  Push Position
    SpritePositions.push(blockPos);
    //  Check for blocktype and save the type for the corresponding index
    console.log("pushing: " + selectedBlockType)
    SpriteTypes.push(selectedBlockType);
    console.log(SpriteTypes.length)
    console.log(SpritePositions.length)
    p.redraw();
  }


  //  this function creates a new block at the given position
  //  blockPos : p.Vector2d => position(x and y) of the new block in pixels
  const removeBlock = (index) => {
    console.log("removeBlock")
    SpritePositions.splice(index, 1)
    SpriteTypes.splice(index, 1)
    p.redraw();
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

      SpritePositions.push(vector)
      SpriteTypes.push(type)
    }
    console.log(SpritePositions)
    console.log(SpriteTypes)
    p.redraw();
  }


  //  Loops thorugh the elements of the received xml and pushes the Values into
  //  prepared arrays
  const interpretLevelObjectV2 = (obj) => {
    console.log("interpretLevelObjectV2")
    flushCurrentLevel();
    const elements = obj.elementCollection.element
    for (let element of elements) {
      element = element.$
      console.log(element.id)
      //  positions get multiplied by CubeWidthAndHeight because thats how we lay out the window
      const vector = p.createVector(element.xPosition*CubeWidthAndHeight, element.yPosition*CubeWidthAndHeight)
      const type = element.type

      SpritePositions.push(vector)
      SpriteTypes.push(type)
    }
    console.log(SpritePositions)
    console.log(SpriteTypes)
    p.redraw();
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

    if (pointToCheckFor.x > 0 && pointToCheckFor.y > 0) {
      return true
    }
    return false
  }


  //
  const doSpritesContain = (point) => {
    console.log("doSpritesContain")
    for (let i = 0; i < SpritePositions.length; i++) {
      const spritePosition = SpritePositions[i];
      if (spritePosition.x == point.x && spritePosition.y == point.y) {
        console.log("y")
        return {doesContain: true, index: i};
      }
    }
    console.log("n")
    return {doesContain: false, index: 0};
  }


  //
  //
  const flushCurrentLevel = () => {
    SpriteTypes.splice(0,SpriteTypes.length)
    SpritePositions.splice(0,SpritePositions.length)
  }


  //
  ipcRenderer.on('new-doc-sketch', (event, arg) => {
    console.log("sketch: " + arg)
    Level(arg).then((result) => {
      console.log(result);
      interpretLevelObjectV2(result)
    }, (err) => {
      console.log(err)
    })
  })


  //
  ipcRenderer.on('change-selected-block', (event, passedBlockType) => {
    console.log("change-selected-block: " + passedBlockType)
    selectedBlockType = passedBlockType
    console.log("selectedBlockType after: " + selectedBlockType)
  })

}
// END OF SKETCH



module.exports = {
  //  global vars that are getting edited by outside
  sketch,
  CubeWidthAndHeight,
  LevelWidth,
  LevelHeight,
  Level,
  Path,
  SpritePositions,
  SpriteTypes
}
