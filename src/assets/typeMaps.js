/**
* @Author: David Schmotz <David>
* @Date:   2018-06-11T23:44:30+02:00
* @Email:  davidschmotz@gmail.com
* @Filename: nameToTypeMap.js
 * @Last modified by:   David
 * @Last modified time: 2018-09-21T21:53:03+02:00
*/

const DEFAULT_HEADER_ELEMENT = {
  name: "",
  value: "",
  description: "",
  type: ""
}

const DefaultHeader = [
  {
    name: "version",
    value: "",
    description: "Identifier for the xmls structure",
    type: "int"
  },{
    name: "levelwidth",
    value: "",
    description: "Obvious",
    type: "int"
  },{
    name: "levelheight",
    value: "",
    description: "Obvious",
    type: "int"
  }
]

const DEFAULT_ELEMENT = {
  id: "",
  prefab: 0,
  type: "",
  xPosition: "",
  yPosition: "",
  hitbox: false,
}

const DEFAULT_OBJECT = {
  id: "",
  prefab: 0,
  type: "",
  xPosition: "",
  yPosition: "",
  hitbox: false,
  addtionals: [],
}

const block_attributes = {
  normal_block : {
    id: 1,
    name: "normal_block",
    hitbox: true,
    color: "204;102;0",
    collection: "environment",
    hasImage: false
  },
  wood_block : {
    id: 2,
    name: "wood_block",
    hitbox: true,
    color: "210;105;30",
    collection: "environment",
    hasImage: true,
    imagePath: "assets/textures/wood.png"
  },
  stone_block : {
    id: 3,
    name: "stone_block",
    hitbox: true,
    color: "100;100;100",
    collection: "environment",
    hasImage: true,
    imagePath: "assets/textures/stone.png"
  },
  player : {
    id: 4,
    name: "player",
    hitbox: false,
    color: "0;200;0",
    collection: "interactive",
    hasAdditionals: false,
    isAdditional: false,
    hasImage: false
  },
  opponent1 : {
    id: 5,
    name: "opponent1",
    hitbox: false,
    color: "0;0;0",
    collection: "interactive",
    hasAdditionals: true,
    isAdditional: false,
    hasImage: false
  },
  finish : {
    id: 6,
    name: "finish",
    hitbox: false,
    color: "255;0;0",
    collection: "interactive",
    hasAdditionals: false,
    isAdditional: false,
    hasImage: false
  },
  waypoint : {
    id: 7,
    name: "waypoint",
    hitbox: false,
    color: "126, 51, 212",
    collection: "interactive",
    hasAdditionals: false,
    isAdditional: true,
    hasImage: false,
    draw: true,
    maxOccurence: 2
  },
  grass_block : {
    id: 8,
    name: "grass_block",
    hitbox: true,
    color: "",
    collection: "environment",
    hasAdditionals: false,
    isAdditional: false,
    hasImage: true,
    imagePath: "assets/textures/grass.png"
  },
  dirt_block : {
    id: 9,
    name: "dirt_block",
    hitbox: true,
    color: "",
    collection: "environment",
    hasAdditionals: false,
    isAdditional: false,
    hasImage: true,
    imagePath: "assets/textures/dirt.png"
  },
  checkpoint : {
    id: 10,
    name: "checkpoint",
    hitbox: false,
    color: "",
    collection: "interactive",
    hasAdditionals: true,
    isAdditional: false,
    hasImage: false,
    imagePath: "assets/textures/dirt.png",
    draw: true
  },
  order : {
    id: 11,
    name: "order",
    hitbox: false,
    color: "",
    collection: "interactive",
    hasAdditionals: false,
    isAdditional: true,
    hasImage: false,
    imagePath: "",
    draw: false,
    maxOccurence: 1
  }
}


const DEFAULT_ADDITIONAL = {
  type: "",
  xPosition: 0,
  yPosition: 0,
  pointsTo: "",
  poinstToType: "",
  value: "",
  draw: false
}

const DEFAULT_LOCAL_INTERACTIVE = {
  position: 0,
  type: "",
  additionals: new Array()
}

const ACTION_MENU = {
  opponent1: ["Waypoint", "Set Radius"],
  checkpoint: ["Set Order"]
}

module.exports = {

  block_attributes,
  DefaultHeader,
  DEFAULT_ELEMENT,
  DEFAULT_OBJECT,
  DEFAULT_LOCAL_INTERACTIVE,
  ACTION_MENU,
  DEFAULT_HEADER_ELEMENT
}
