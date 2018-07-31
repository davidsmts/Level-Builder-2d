/**
 * @Author: David Schmotz <David>
 * @Date:   2018-06-11T23:44:30+02:00
 * @Email:  davidschmotz@gmail.com
 * @Filename: nameToTypeMap.js
 * @Last modified by:   David
 * @Last modified time: 2018-06-12T23:22:41+02:00
 */

const nameToInt_TypeMap = () => {
  const map = {
    "normal_block" : 1,
    "wood_block" : 2,
    "stone_block" : 3,
    "player" : 4
  };
  return map
}

const intToName_TypeMap = () => {
  const map = {
    1:"normal_block",
    2:"wood_block",
    3:"stone_block",
    4:"player"
  };
  return map
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

const block_attributes = {
  normal_block : {
    id: 1,
    hitbox: true,
    color: "204;102;0",
    collection: "environment"
  },
  wood_block : {
    id: 2,
    hitbox: true,
    color: "210;105;30",
    collection: "environment"
  },
  stone_block : {
    id: 3,
    hitbox: true,
    color: "100;100;100",
    collection: "environment"
  },
  player : {
    id: 4,
    hitbox: false,
    color: "0;200;0",
    collection: "interactive"
  },
  opponent1 : {
    id: 5,
    hitbox: false,
    color: "0;0;0",
    collection: "interactive"
  },
  finish : {
    id: 6,
    hitbox: false,
    color: "255;0;0",
    collection: "interactive"
  }
}

module.exports = {
  nameToInt_TypeMap,
  intToName_TypeMap,
  block_attributes,
  DefaultHeader
}
