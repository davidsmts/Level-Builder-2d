/**
* @Author: David Schmotz <David>
* @Date:   2018-05-05T20:27:20+02:00
* @Email:  davidschmotz@gmail.com
* @Filename: actions.js
 * @Last modified by:   David
 * @Last modified time: 2018-06-16T21:16:35+02:00
*/

const mainarea = require('./mainareaManager');
const maps = require('../assets/typeMaps');


const getGenerelInput = (type) => {
  let generelInputContainer = document.getElementById("generelInput_container");
  generelInputContainer.style.display = "inline-block"
  //  gets inpout values when confirm button is pressed and forwards them to the main proccess
  const generelInputConfirm_button = document.getElementById("generelInputConfirm_button");
  generelInputConfirm_button.addEventListener("click", () => {
    console.log("generelInputConfirm_button")
    let input = document.getElementById("generel_input")
    let inputString = input.value
    let inputInt = 0;
    try {
      inputInt = parseInt(inputString)
      console.log("input: " + inputInt)
      mainarea.generelInputConfirm(inputInt);
    } catch (err) {
      console.log("Couldnt parse your input as int : " + err);
      return;
    } finally {
      generelInputContainer.style.display = "none"
    }
  });
}

const changeSizeBut = document.getElementById("changeSizeBut");
changeSizeBut.addEventListener("click", () => {
  let changeSizeContainer = document.getElementById("size_container");
  changeSizeContainer.style.display = "inline-block"
});

const changeZoomBut = document.getElementById("changeZoomBut");
changeZoomBut.addEventListener("click", () => {
  console.log("changeZoom")
  let changeZoomContainer = document.getElementById("zoom_container");
  changeZoomContainer.style.display = "inline-block"
});

const saveBut = document.getElementById("saveBut");
saveBut.addEventListener("click", () => {
  mainarea.saveXML();
});

const cleanBut = document.getElementById("cleanBut");
cleanBut.addEventListener("click", () => {
  console.log("cleanBut")
  mainarea.clean();
});

const normal_block = document.getElementById("normal_block");
normal_block.addEventListener("click", () => {
  console.log("changeBlockType")
  mainarea.changeBlockType("normal_block");
});

const wood_block = document.getElementById("wood_block");
wood_block.addEventListener("click", () => {
  console.log("changeBlockType")
  mainarea.changeBlockType("wood_block");
});

const stone_block = document.getElementById("stone_block");
stone_block.addEventListener("click", () => {
  console.log("changeBlockType")
  mainarea.changeBlockType("stone_block");
});

const spawn_block = document.getElementById("spawn_block");
spawn_block.addEventListener("click", () => {
  console.log("changeBlockType")
  mainarea.changeBlockType("player");
});

const finish_block = document.getElementById("finish_block");
finish_block.addEventListener("click", () => {
  console.log("changeBlockType")
  mainarea.changeBlockType("finish");
});

const opponent1_block = document.getElementById("opponent1_block");
opponent1_block.addEventListener("click", () => {
  console.log("changeBlockType")
  mainarea.changeBlockType("opponent1");
});

const dirt_block = document.getElementById("dirt_block");
dirt_block.addEventListener("click", () => {
  console.log("changeBlockType")
  mainarea.changeBlockType("dirt_block");
});

const grass_block = document.getElementById("grass_block");
grass_block.addEventListener("click", () => {
  console.log("changeBlockType")
  mainarea.changeBlockType("grass_block");
});

const checkpoint = document.getElementById("checkpoint");
checkpoint.addEventListener("click", () => {
  console.log("changeBlockType")
  mainarea.changeBlockType("checkpoint");
});

//  gets inpout values when confirm button is pressed and forwards them to the main proccess
const changeSizeConfirm_button = document.getElementById("changeSizeConfirm_button");
changeSizeConfirm_button.addEventListener("click", () => {
  console.log("changeSizeConfirm_button")
  let widthInput = document.getElementById("width_input")
  let heightInput = document.getElementById("height_input")
  let widthString = widthInput.value
  let heightString = heightInput.value
  let widthInt = 0;
  let heightInt = 0;
  try {
    widthInt = parseInt(widthString)
    heightInt = parseInt(heightString)
    console.log("width: " + widthInt + ", height: " + heightInt)
    mainarea.changeSize(widthInt, heightInt);
  } catch (err) {
    console.log("Couldnt parse your input as int : " + err);
    return;
  } finally {
    let changeSizeContainer = document.getElementById("size_container");
    changeSizeContainer.style.display = "none"
  }
});

//  gets inpout values when confirm button is pressed and forwards them to the main proccess
const changeZoomConfirm_button = document.getElementById("changeZoomConfirm_button");
changeZoomConfirm_button.addEventListener("click", () => {
  console.log("changeZoomConfirm_button")
  let zoomInput = document.getElementById("zoom_input")
  let zoomString = zoomInput.value
  let zoomFloat = 0.0;
  try {
    zoomFloat = parseFloat(zoomString)
    console.log("zoom: " + zoomFloat)
    mainarea.changeZoom(zoomFloat);
  } catch (err) {
    console.log("Couldnt parse your input as float : " + err);
    return;
  } finally {
    let changeZoomContainer = document.getElementById("zoom_container");
    changeZoomContainer.style.display = "none"
  }
});

module.exports = {
  //  global vars that are getting edited by outside
  getGenerelInput
}
