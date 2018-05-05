/**
* @Author: David Schmotz <David>
* @Date:   2018-05-01T20:06:17+02:00
* @Email:  davidschmotz@gmail.com
* @Filename: sketch.js
* @Last modified by:   David
* @Last modified time: 2018-05-01T20:25:03+02:00
*/

'use strict';

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

  p.setup = () => {
    // Create the canvas
    canvas = p.createCanvas(p.windowWidth, p.windowHeight);
    canvas.parent(PARENT_ID);

    //initialising constants
    NORMAL_BLOCK_COLOR = color(204, 102, 0);
    BAD_BLOCK_COLOR = color(20, 102, 0);
    FAST_BLOCK_COLOR = color(204, 12, 0);
    BREAK_BLOCK_COLOR = color(204, 102, 100);
    p.noLoop();
  };

  p.draw = () => {
    p.background(200);

  };

  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
  }
}
