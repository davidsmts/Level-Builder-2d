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
const maps = require('../assets/typeMaps');
const BLOCK_ATTRIBUTES = maps.block_attributes


//  global vars that are getting edited by outside aka. public smh
const STANDARD_ZOOM = 50;
let CubeWidthAndHeight = STANDARD_ZOOM;
let CurrentZoomLevel = 1.0;
let LevelWidth = 1000;
let LevelHeight = 1000;
let Path = "";
let SpritePositions = new Array();
let SpriteTypes = new Array();
let Interactives = new Array();
var Header = new Array();


const Level = (path) => {
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
  let WAYPOINT_COLOR;

  //  constants
  const PARENT_ID = "p5Area";
  const CANVAS_CLASSNAME = "sketch";

  //  generel global vars
  let opponentIdCounter = 0;
  let canvas;
  let selectedBlockType = "normal_block";
  let waypointLogic = {
    createdBlocksCounter: 0,
    preWaypointBlockType: "",
    opponentsId: 0
  }

  p.preload = () => {
    //initialising constants
    NORMAL_COLOR = p.color(204, 102, 0);
    WOOD_COLOR = p.color(210, 105, 30);
    STONE_COLOR = p.color(100, 100, 100);
    PLAYER_COLOR = p.color(0, 200, 0);
    FINISH_COLOR = p.color(255, 0, 0);
    OPPONENT1_COLOR = p.color(0, 0, 0);
    WAYPOINT_COLOR = p.color(126, 51, 212);
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
  }


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

    //  Draw Interactives
    for (let interactive of Interactives) {
      p.push();
      let colorForBlock = currentColor(interactive.Type);
      p.fill(colorForBlock);
      //  renderPosition is the position at which the cube is to be displayed in the Builder
      //  because the position is 50:1 while we actually need it to be zoom:1
      let renderPosition = p.createVector(interactive.position.x * CurrentZoomLevel, interactive.position.y * CurrentZoomLevel)
      p.rect(renderPosition.x, renderPosition.y, CubeWidthAndHeight, CubeWidthAndHeight);
      if (interactive.additionals.length >= 1) {
        for (let addtional of interactive.additionals) {
          let colorForBlock = currentColor(additional.Type);
          p.fill(colorForBlock);
          let renderPosition = p.createVector(additional.xPosition * CurrentZoomLevel, additional.yPosition * CurrentZoomLevel)
          p.ellipse(renderPosition.x, renderPosition.y, CubeWidthAndHeight/2, CubeWidthAndHeight/2);
        }
      }
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


  //
  const handleBlock = (point) => {
    const renderedPoint = p.createVector(point.x * CurrentZoomLevel, point.y * CurrentZoomLevel)
    const toRoundX = renderedPoint.x % 50;
    const toRoundY = renderedPoint.y % 50;
    const x = renderedPoint.x - toRoundX;
    const y = renderedPoint.y - toRoundY;
    const blockPosition = p.createVector(x,y);
    let {doesContain, index, collection} = doesPointExist(blockPosition)
    //  Waypoints must be set over other blocks as well
    if (selectedBlockType == "waypoint") {
      createNewBlock(blockPosition)
      return;
    }

    if (!doesContain) { //  doesnt already contain the block
      createNewBlock(blockPosition)
    } else {            //  already contains the block
      if (collection = "Object") {
        handleExistingObjectClick(blockPosition, index)
      } else if (collection = "Element") {
        removeElement(index);
      } else {
        console.log("unknown collection returned in handleBlock");
      }
    }
  }


  //  this function creates a new block at the given position
  //  blockPos : p.Vector2d => position(x and y) of the new block in pixels
  const createNewBlock = (blockPos) => {
    console.log("createNewBlock")
    let attributes = BLOCK_ATTRIBUTES[selectedBlockType]
    if (attributes.collection == "environment") {
      createEnvironment(blockPos)
    } else if (attributes.collection == "interactive") {
      if (attributes.isAdditional) {
        createAdditional(blockPos)
      } else {
        createInteractive(blockPos)
      }
    } else {
      console.log("unknown collection")
    }
    p.redraw();
  }

  //  Creates a new Interactive at the given position
  const createInteractive = (position) => {
    console.log(position)
    Interactives.Positions.push(position)
    Interactives.Types.push(selectedBlockType)
  }

  //  Creates new environment element at given position with currently selectedBlockType
  const createEnvironment = (position) => {
    SpritePositions.push(position);
    console.log("pushing: " + selectedBlockType)
    SpriteTypes.push(selectedBlockType);
    console.log(SpriteTypes.length)
    console.log(SpritePositions.length)
  }

  //  Creates a new Additional for an Interactive, that is saved in the waypointLogic,
  //  at the given position
  //
  const createAdditional = (position) => {
    console.log(position)
    let id = waypointLogic.opponentsId
    let additional = maps.DEFAULT_ADDITIONAL
    additional.type = selectedBlockType
    additional.xPosition = position.x
    additional.yPosition = position.y
    additional.pointsTo = id
    additional.pointsToType = Interactives[id].Type
    Interactives[id].Additionals.push(additional)
    waypointLogic.createdBlocksCounter++;
    if (waypointLogic.createdBlocksCounter >= 2) {
      selectedBlockType = waypointLogic.preWaypointBlockType
      waypointLogic.createdBlocksCounter = 0
    }
  }

  //  This function is called to decide wether or not to add additionals when
  //  the object is clicked.
  //
  const handleExistingObjectClick = (position, index) => {
    console.log("handleExistingObjectClick")
    let typeAttributes = maps.block_attributes[Interactives[i].Type]
    if (typeAttributes.hasAdditionals) {
      removeWaypointsFor(index)
      waypointLogic.createdBlocksCounter = 0
      waypointLogic.preWaypointBlockType = selectedBlockType
      waypointLogic.opponentsId = index
      selectedBlockType = "waypoint"
    } else {
      removeObject(index)
    }
  }

  //
  //
  const removeElement = (index) => {
    console.log("removeElement")
    SpritePositions.splice(index, 1)
    SpriteTypes.splice(index, 1)
    p.redraw();
  }

  //
  //
  const removeObject = (index) => {
    console.log("removeObject")
    Interactives.splice(index, 1)
    p.redraw();
  }

  //  Function removes Waypoints from the Additionals array of the Interactive Object
  //  at the given index. It does so by looping over the array until it finds an additional
  //  with the type: waypoint. The iterator variable "i" has to be decremented by one in
  //  that case because otherwise you would either leave out an element because the
  //  next element is now at the current "i" value which is going to be inceremented by one
  //  in the next iteration, or you could get an error because you ran out of the array if the
  //  deleted element was the last one.
  //
  const removeWaypointsFor = (index) => {
    console.log("removeWaypointsFor")
    let additionals = Interactives[index].Additionals
    for (let i = 0; i < additionals.length; i++) {
      if (additionals[i].type == "waypoint") {
        additionals.splice(i, 1);
        i--;
      }
    }
  }

  //
  //
  const interpretLevelBroker = (obj) => {
    SpritePositions.splice(0, SpritePositions.length)
    SpriteTypes.splice(0, SpriteTypes.length)
    try {
      let versionStr = obj.collection.header.info[0].value
      console.log(versionStr)
      switch (versionStr) {
        case "1":
        interpretLevelObject(obj);
        break;
        default:
        console.log("!!CAN'T READ LEVEL VERSION!!")
        interpretOldLevelObject(obj)
        break;
      }
    } catch (err) {
      console.log("Error: " + err)
      interpretOldLevelObject(obj)
    }
  }


  //  Loops thorugh the elements of the received xml and pushes the Values into
  //  prepared arrays
  const interpretLevelObject = (obj) => {
    console.log("interpretLevelObjectV2")
    console.log(obj)
    //  Merge different element collections
    let elements = mergeElements(obj)
    //  Read Header
    let header = obj.collection.header.info
    handleHeader(header)
    //  Fill Sprites with the parsed elements
    handleElements(elements)
    p.redraw()
  }

  //
  const interpretOldLevelObject = (obj) => {
    let elements = obj.elementCollection.element
    handleElements(elements)
    p.redraw()
  }

  const mergeElements = (obj) => {
    let environment = obj.collection.environment.element
    let interactive = obj.collection.interactive.object
    if (environment == undefined || environment == null) {
      return interactive
    }
    if (interactive == undefined || interactive == null) {
      return environment
    }
    let elements = environment.concat(interactive)
    return elements
  }

  const handleHeader = (header) => {
    Header.splice(0, Header.length)
    for (let info of header) {
      Header.push(info);
    }
    //  Adjust p5 Workspace to Header Values
    LevelWidth = parseInt(Header[1].value)
    LevelHeight = parseInt(Header[2].value)
    changeSizeOfWorkspace(LevelWidth, LevelHeight)
  }

  //
  const handleElements = (elements) => {
    for (let element of elements) {
      //  positions get multiplied by CubeWidthAndHeight because thats how we lay out the window
      const vector = p.createVector(element.xPosition*CubeWidthAndHeight, element.yPosition*CubeWidthAndHeight)
      const type = element.type
      SpritePositions.push(vector)
      SpriteTypes.push(type)
    }
    console.log(Header)
    console.log(SpritePositions)
    console.log(SpriteTypes)
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


  //  checks if any Element Container contains the passed point
  const doesPointExist = (point) => {
    console.log("doesPointExist")
    for (let i = 0; i < SpritePositions.length; i++) {
      const spritePosition = SpritePositions[i];
      if (spritePosition.x == point.x && spritePosition.y == point.y) {
        console.log("y")
        return {doesContain: true, index: i, container: "Elements"};
      }
    }
    console.log("not in sprites")
    for (let i = 0; i < Interactives.length; i++) {
      const position = Interactives[i].position;
      if (position.x == point.x && position.y == point.y) {
        console.log("y")
        return {doesContain: true, index: i, container: "Objects"};
      }
    }
    console.log("not in interactives")
    return {doesContain: false, index: 0, container: "none"};
  }


  //
  //
  const flushCurrentLevel = () => {
    SpriteTypes.splice(0, SpriteTypes.length)
    SpritePositions.splice(0, SpritePositions.length)
    Interactives.splice(0, Interactives.length)
    p.redraw();
  }


  //
  const changeSizeOfWorkspace = (width, height) => {
    LevelWidth = width
    LevelHeight = height
    module.exports.LevelWidth = width
    module.exports.LevelHeight = height
    p.resizeCanvas(width, height);
    p.redraw();
  }


  //
  ipcRenderer.on('new-doc-sketch', (event, arg) => {
    console.log("sketch: " + arg)
    Level(arg).then((result) => {
      console.log(result);
      interpretLevelBroker(result)
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
      case "waypoint":
      return WAYPOINT_COLOR;
      break;
      default:
      console.log("!!!!!DEFAULT COLOR STATE!!!!!");
      return p.color(0,0,0);
      break;
    }
  }

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
  Interactives
}
