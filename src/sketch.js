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

 	p.setup = () => {
 		// Create the canvas
 	    p.createCanvas(p.windowWidth, p.windowHeight);
 		p.noLoop();
 	};

 	p.draw = () => {
 		p.background(200);

 		// Set colors
 		p.fill(204, 101, 192, 127);
 		p.stroke(127, 63, 120);

 		// A rectangle
 		p.rect(40, 120, 120, 40);
 		// An ellipse
 		p.ellipse(240, 240, 80, 80);
 		// A triangle
 		p.triangle(300, 100, 320, 100, 310, 80);

 		// A design for a simple flower
 		p.translate(580, 200);
 		p.noStroke();
 		for (var i = 0; i < 10; i ++) {
 			p.ellipse(0, 30, 20, 80);
 			p.rotate(p.PI / 5);
 		}
 	};

 	p.windowResized = () => {
 		p.resizeCanvas(p.windowWidth, p.windowHeight);
 	}
 }
