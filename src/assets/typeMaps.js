/**
* @Author: David Schmotz <David>
* @Date:   2018-06-11T23:44:30+02:00
* @Email:  davidschmotz@gmail.com
* @Filename: nameToTypeMap.js
* @Last modified by:   David
* @Last modified time: 2018-06-12T23:22:41+02:00
*/

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
    collection: "environment"
  },
  wood_block : {
    id: 2,
    name: "wood_block",
    hitbox: true,
    color: "210;105;30",
    collection: "environment"
  },
  stone_block : {
    id: 3,
    name: "stone_block",
    hitbox: true,
    color: "100;100;100",
    collection: "environment"
  },
  player : {
    id: 4,
    name: "player",
    hitbox: false,
    color: "0;200;0",
    collection: "interactive",
    hasAdditionals: false,
    isAdditional: false
  },
  opponent1 : {
    id: 5,
    name: "opponent1",
    hitbox: false,
    color: "0;0;0",
    collection: "interactive",
    hasAdditionals: true,
    isAdditional: false
  },
  finish : {
    id: 6,
    name: "finish",
    hitbox: false,
    color: "255;0;0",
    collection: "interactive",
    hasAdditionals: false,
    isAdditional: false
  },
  waypoint : {
    id: 7,
    name: "waypoint",
    hitbox: false,
    color: "126, 51, 212",
    collection: "interactive",
    hasAdditionals: false,
    isAdditional: true
  }
}


const DEFAULT_ADDITIONAL = {
  type: "",
  xPosition: 0,
  yPosition: 0,
  pointsTo: "",
  poinstToType: ""
}

module.exports = {

  block_attributes,
  DefaultHeader,
  DEFAULT_ELEMENT,
  DEFAULT_OBJECT
}
