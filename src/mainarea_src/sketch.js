/**
* @Author: David Schmotz <David>
* @Date:   2018-05-01T20:06:17+02:00
* @Email:  davidschmotz@gmail.com
* @Filename: sketch.js
* @Last modified by:   David
* @Last modified time: 2018-06-12T23:58:48+02:00
*/

//"use strict";

const xml2json = require("xml2json");
const fs = require('fs');
const {ipcRenderer} = require("electron");


//  global vars that are getting edited by outside aka. public smh
const STANDARD_ZOOM = 50;
let CubeWidthAndHeight = STANDARD_ZOOM;
let CurrentZoomLevel = 1.0;
let LevelWidth = 1000;
let LevelHeight = 1000;
let Path = "";
let SpritePositions = new Array();
let SpriteTypes = new Array();
var Header = new Array();

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

const Level2 = (path) => {
  return new Promise((resolve, reject) => {
    //const path  = __dirname + '/output2.xml';
    console.log(path);
    fs.readFile(path, function(err, data) {
      var options = {
        object: true,
        reversible: false,
        coerce: false,
        sanitize: true,
        trim: true,
        arrayNotation: false,
        alternateTextNode: false
      };
      let json = xml2json.toJson(data, options)
      resolve(json)
    });
  })
}



function sketch(p) {

  //  function dependant constants
  let NORMAL_COLOR;
  let WOOD_COLOR;
  let STONE_COLOR;
  let PLAYER_COLOR;
  let FINISH_COLOR;
  let OPPONENT1_COLOR;

  //  constants
  const PARENT_ID = "p5Area";
  const CANVAS_CLASSNAME = "sketch";

  //  generel global vars
  let idCounter = 0;
  let canvas;
  let selectedBlockType = "normal_block";

  p.preload = () => {
    //initialising constants
    NORMAL_COLOR = p.color(204, 102, 0);
    WOOD_COLOR = p.color(210, 105, 30);
    STONE_COLOR = p.color(100, 100, 100);
    PLAYER_COLOR = p.color(0, 200, 0);
    FINISH_COLOR = p.color(255, 0, 0);
    OPPONENT1_COLOR = p.color(0, 0, 0);
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
    console.log("draw: " + LevelHeight + " - " + LevelWidth)
    //  Draw Vertical Lines
    for (var i=0; i<LevelWidth; i+=CubeWidthAndHeight) {
      p.line(i, 0, i, LevelHeight);
    }
    //  Draw Horizontal Lines
    for (var i=0; i<LevelHeight; i+=CubeWidthAndHeight) {
      p.line(0, i, LevelWidth, i);
    }
    //  Draw Blocks
    for (var i=0; i<SpritePositions.length; i++) {
      p.push();
      let position = SpritePositions[i];
      let colorForBlock = currentColor(SpriteTypes[i]);
      p.fill(colorForBlock);
      //  renderPosition is the position at which the cube is to be displayed in the Builder
      //  because the position is 50:1 while we actually need it to be zoom:1
      let renderPosition = p.createVector(position.x * CurrentZoomLevel, position.y * CurrentZoomLevel)
      p.rect(renderPosition.x, renderPosition.y, CubeWidthAndHeight, CubeWidthAndHeight);
      p.pop();
    }
  }

  //  Called when you press anything on the Electron Window what means that everything outside
  //  the sketch has to be catched
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
      return NORMAL_COLOR;
      break;
      case "wood_block":
      return WOOD_COLOR;
      break;
      case "stone_block":
      return STONE_COLOR;
      break;
      case "player":
      return PLAYER_COLOR;
      break;
      case "finish":
      return FINISH_COLOR;
      break;
      case "OPPONENT1":
      return OPPONENT1_COLOR;
      break;
      default:
      console.log("!!!!!DEFAULT COLOR STATE!!!!!");
      return p.color(0,0,0);
      break;
    }
  }


  //
  const handleBlock = (point) => {
    const renderedPoint = p.createVector(point.x * CurrentZoomLevel, point.y * CurrentZoomLevel)
    const toRoundX = renderedPoint.x % 50;
    const toRoundY = renderedPoint.y % 50;
    const x = renderedPoint.x - toRoundX;
    const y = renderedPoint.y - toRoundY;
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
    flushCurrentLevel();
    const elements = obj.elementCollection.elements
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


  //  Loops thorugh the elements of the received xml and pushes the Values into
  //  prepared arrays
  const interpretLevelObjectV2 = (obj) => {
    console.log("interpretLevelObjectV2")
    console.log(obj)
    const elements = obj.collection.elements.element
    let header = obj.collection.header.info
    for (let info of header) {
      Header.push(info);
    }
    width = parseInt(Header[0].value)
    height = parseInt(Header[1].value)
    changeSizeOfWorkspace(width, height)
    for (let element of elements) {
      console.log(element.id[0])
      //  positions get multiplied by CubeWidthAndHeight because thats how we lay out the window
      const vector = p.createVector(element.xPosition*CubeWidthAndHeight, element.yPosition*CubeWidthAndHeight)
      const type = element.type
      SpritePositions.push(vector)
      SpriteTypes.push(type)
    }
    console.log(Header)
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


  //  checks if the SpritePositions Array contains the passed point
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
    p.redraw();
  }


  //
  const changeSizeOfWorkspace = (width, height) => {
    LevelWidth = width
    LevelHeight = height
    p.resizeCanvas(width, height)
    p.redraw();
  }


  //
  ipcRenderer.on('new-doc-sketch', (event, arg) => {
    console.log("sketch: " + arg)
    Level2(arg).then((result) => {
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


  //
  ipcRenderer.on('clean-all', (event) => {
    console.log("clean-all sketch")
    flushCurrentLevel();
    console.log(SpritePositions)
    p.redraw();
  })


  //
  ipcRenderer.on('redraw-sketch', (event) => {
    console.log("redraw-sketch sketch")
    p.redraw();
  })


  //
  ipcRenderer.on('changeSize-sketch', (event, width, height) => {
    console.log("changeSize sketch")
    changeSizeOfWorkspace(width, height)
  })

  //
  ipcRenderer.on('changeZoom-sketch', (event, newZoom) => {
    console.log("changeZoom sketch")
    CubeWidthAndHeight = STANDARD_ZOOM * newZoom
    CurrentZoomLevel = newZoom
    p.redraw();
  })

}
// END OF SKETCH



module.exports = {
  //  global vars that are getting edited by outside
  sketch,
  CubeWidthAndHeight,
  LevelWidth,
  LevelHeight,
  Header,
  Level,
  Path,
  SpritePositions,
  SpriteTypes,
}
