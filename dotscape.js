// drawingPauseds are used to track each set of dots
let drawingPaused = 0;
let username;
let appStarted = 0;

//track touches
let tracker = 0;

let type = 'linear';
let typeBool = 1; // 0 is linear, 1 is polar

// dot tracking
let dots = [],
  throughDotCount = 0,
  dotSize, dotQty, ringQty;

// mouse/geometry tracking
let isMousedown, tempwinMouseX, tempwinMouseY, tempwinMouseX2, tempwinMouseY2,
  verifyX = 0,
  verifyY = 0,
  vMax, circleRad,
  rad = 50.0; // animatedRadius
let brushSelected = 1;

//FIREBASE STUFF
var database;


let drawLayer, dotLayer, lineLayer, uploadLayer;

function start() {

  username = document.getElementById("lname").value;
  if (username.length == 0) {
    username = "anonymous";
  }

  $(".loading").remove();
  $(".username").remove();

  //fullscreen(1);

  sizeWindow();
  writeTextUI();
  selectAbrush(1);
  linearGrid();
  render();
alert("hello");

  appStarted = 1;


}

function setup() {
  // create canvas and all layers
  createCanvas(windowWidth, windowHeight);
  lineLayer = createGraphics(width, height);
  lineLayer.id("lineLayer");
  drawLayer = createGraphics(width, height);
  drawLayer.id("drawLayer");
  dotLayer = createGraphics(width, height);
  dotLayer.id("dotLayer");
  uploadLayer = createGraphics(500, 500);
  uploadLayer.id("uploadLayer");

  dotLayer.fill(10);
  dotLayer.noStroke();


  // initialise all colour informaiton
  pixelDensity(1); // Ignores retina displays
  colorMode(RGB, 255, 255, 255, 255);
  appCol = color(205, 12, 64, 0.1);
  drawLayer.colorMode(RGB, 255, 255, 255, 255);


  //basicLayer info
  drawLayer.stroke(10);
  drawLayer.strokeWeight(20);

  // vector array used to store points, this will max out at 100
  resetVectorStore();

}



// calcuate Dimensions for use in this sketch, done during initialise and resize.
function dimensionCalc() {
  if (width > height) {
    vMax = width / 100;
    vMin = height / 100;
    circleRad = height * 0.45;
  } else {
    vMax = height / 100;
    vMin = width / 100;
    circleRad = width * 0.45;
  }
}


function windowResized() {
  if (appStarted) {
    sizeWindow();
  }
}

function sizeWindow() {
  resizeCanvas(windowWidth, windowHeight);
  lineLayer.resizeCanvas(windowWidth, windowHeight);
  let aa = createGraphics(windowWidth, windowHeight);
  aa.image(drawLayer, 0, 0, windowWidth, windowHeight)
  drawLayer.resizeCanvas(windowWidth, windowHeight);
  drawLayer = aa;
  aa.remove();

  let bb = createGraphics(windowWidth, windowHeight);
  bb.image(dotLayer, 0, 0, windowWidth, windowHeight);
  dotLayer.resizeCanvas(windowWidth, windowHeight);
  dotLayer = bb;
  bb.remove();

  dimensionCalc();
  writeTextUI();

 if (drawingPaused){
   renderSmall();
 } else {
   render();
 }

}

function mousePressed() {
  fadeIn = 0;
}

function mouseDragged() {

  if (drawingPaused == 0) {
    //stop fadein
    fadeIn = 0;

    //  fade the UI out
    if (buttonOpacity > 0) {
      buttonOpacity = buttonOpacity - 0.01;
      let buttons = document.getElementsByClassName("box");
      for (var i = 0; i < buttons.length; i++) {
        buttons[i].style.opacity = buttonOpacity;
      }
    }

    calcDynamics();

    brushIt(mouseX, mouseY, pmouseX, pmouseY);
    tracker++;
    //  drawLayer.line(mouseX, mouseY, pmouseX, pmouseY);
    render();
  }
  return false;
}


function touchEnded() {
  resetVectorStore();
  fadeIn = 1;
  drawLayer.image(lineLayer, 0, 0, width, height);
  lineLayer.clear();
  lineArray = [];
}



function draw() {
  // fade the UI in
  if (fadeIn) {
    if (buttonOpacity < 1.1) {
      buttonOpacity = buttonOpacity + 0.01;
      let buttons = document.getElementsByClassName("box");
      for (var i = 0; i < buttons.length; i++) {
        buttons[i].style.opacity = buttonOpacity;
      }
    } else {
      fadeIn = 0;
    }
  }
}



function render() {
  background(65);
  noTint();
  blendMode(BLEND);
  image(dotLayer, 0, 0, width, height);
  image(drawLayer, 0, 0, width, height);
  image(lineLayer, 0, 0, width, height);


}







// Dot class, not used in intro
class Dot {
  constructor(x, y, r) {
    this.x = x;
    this.y = y;
    this.r = r;
  }
  show() {
    noStroke();
    fill(255, 100);
    ellipse(this.x, this.y, this.r * 2);
  }
}

function upload() {
  // //renderWithout the dots or the background;
  clear();
  uploadLayer.background(127)
  uploadLayer.image(drawLayer, 0, 0, 500, 500);
  background(127);
  image(drawLayer,0,0,width,height);
  if (tracker > 200){
  saveToFirebase();
  console.log("Threshold reached - image saved")
} else {
  console.log("Threshold not reached - image ignored")
}
}

function renderSmall() {
  blendMode(BLEND);
  background(65);
  tint(255, 200)
  image(drawLayer, width / 4, height / 4, width / 2, height / 2);
  blendMode(OVERLAY);
  setTimeout(getFirebaseImgList, 1000);

}

function nextDrawing() {
  blendMode(BLEND);

  // render without the dots
  if (drawingPaused == 0) {
    upload();
    clearUI();
    renderSmall();
    setTimeout(writeNextButton, 1200);

  } else if (drawingPaused == 1) {

    throughDotCount = 0;
    dotsCount = 0;
    drawLayer.clear();
    lineLayer.clear();
    typeBool = !typeBool;
    if (typeBool) {
      linearGrid();
    } else {
      polarGrid();
    }
    clearUI();
    writeTextUI();
    render();
  }

  drawingPaused++;
  drawingPaused = drawingPaused % 2;

}

function linearGrid() {
  dotLayer.clear();
  dotLayer.fill(20);
  dotLayer.noStroke();
  type = "linear";
  dots = [];
  // calculate amount of x's and y's to include
  let r = vMax / 3.2;
  let qtyX = 12; // quantiy along X
  let qtyY = 8;
  let spaceX = width / qtyX;
  let spaceY = height / qtyY;
  for (let i = 1; i < qtyX; i++) {
    for (let j = 0; j < qtyY; j++) {
      dotLayer.ellipse((spaceX * i), (spaceY * (j + 0.5)), r * 2, r * 2);
    }
  }
}

function polarGrid() {
  dotLayer.clear();
  dotLayer.fill(20);
  dotLayer.noStroke();
  type = "polar";
  let r;
  let gap;
  let remainder;
  if (drawingPaused === 1) {
    dotQty = 240;
    r = 5;
    gap = circleRad * 0.95;
    remainder = circleRad - gap;
  }

  for (let i = 0; i < dotQty; i++) {
    let rotateVal = i * 137.5;
    let tran = (((gap) / dotQty) * (i + 1)) + remainder;
    tran *= 3; // extend past the frame
    let tempX = (tran * cos(radians(rotateVal))) + width / 2;
    let tempY = (tran * sin(radians(rotateVal))) + height / 2;
    r = r + ((i / 100000) * vMax);
    dotLayer.ellipse(tempX, tempY, r * 2, r * 2);
  }
}
