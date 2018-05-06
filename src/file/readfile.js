/**
* @Author: David Schmotz <David>
* @Date:   2018-05-05T20:34:03+02:00
* @Email:  davidschmotz@gmail.com
* @Filename: readfile.js
 * @Last modified by:   David
 * @Last modified time: 2018-05-05T22:46:12+02:00
*/

const xml2js = require("xml2js");
const fs = require('fs');

const getJsonFromXmlAtPath = (path) => {
  let xml;
  const parser = new xml2js.Parser();
  fs.readFile(path, function(err, data) {
    parser.parseString(data, function (err, result) {
      console.dir(result)
      return Promise.resolve(result);
    });
  });
};

module.exports = {
  getJsonFromXmlAtPath
}
