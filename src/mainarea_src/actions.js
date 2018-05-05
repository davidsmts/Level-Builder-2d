/**
 * @Author: David Schmotz <David>
 * @Date:   2018-05-05T20:27:20+02:00
 * @Email:  davidschmotz@gmail.com
 * @Filename: actions.js
 * @Last modified by:   David
 * @Last modified time: 2018-05-05T20:28:08+02:00
 */

const widthBut = document.getElementById("changeWidthBut");
widthBut.addEventListener("click", () => {
  console.log("here");
  console.log(sketch);
  console.log(sketch.sketch);
  console.log(sketch.LevelWidth);
  sketch.LevelWidth = 4000;
});
