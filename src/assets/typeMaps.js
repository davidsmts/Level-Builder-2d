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

module.exports = {
  nameToInt_TypeMap,
  intToName_TypeMap
}
