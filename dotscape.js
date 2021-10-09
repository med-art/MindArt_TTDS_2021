// drawingPauseds are used to track each set of dots
let drawingPaused = 1;

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

function start() {
  $(".startBtn").remove();
  //fullscreen(1);
  sizeWindow();
  writeTextUI();
  selectAbrush(1);
  render();
}

function setup() {
  // create canvas and all layers
  createCanvas(windowWidth, windowHeight);
  lineLayer = createGraphics(width, height);
  drawLayer = createGraphics(width, height);

  // initialise all colour informaiton
  pixelDensity(1); // Ignores retina displays
  colorMode(RGB, 255, 255, 255, 255);
  appCol = color(205, 12, 64, 0.1);
  drawLayer.colorMode(RGB, 255, 255, 255, 255);

  var stbtn = $("<div />").appendTo("body");
  stbtn.addClass('startBtn');
  $('<p>Touch here to begin</p>').appendTo(stbtn);
  stbtn.mousedown(start);
  stbtn.mousemove(start);

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
  sizeWindow();
}

function sizeWindow() {
  resizeCanvas(windowWidth, windowHeight);
  lineLayer.resizeCanvas(windowWidth, windowHeight);
  drawLayer.resizeCanvas(windowWidth, windowHeight);
  dimensionCalc();
  removeElements();
  writeTextUI();
  checkFS();
  drawingPaused--;
  linearGrid();
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
  background(10);
  for (let i = 0; i < dotsCount; i++) {
    dots[i].show();
  }
  image(drawLayer, 0, 0);
  image(lineLayer, 0, 0);

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
  //renderWithout the dots or the background;
  clear();
  image(drawLayer, 0, 0);
  saveToFirebase();
}

function renderSmall() {
  blendMode(BLEND);
  background(10);
  tint(255, 80)
  image(drawLayer, width / 4, height / 4, width / 2, height / 2);
  blendMode(ADD);

  setTimeout(getFirebaseImgList, 1000);


  //access firebase
  // pull down 5 images
  //layer them one of top of another

}

function nextDrawing() {
  blendMode(BLEND);

  // render without the dots
  if (drawingPaused == 0) {
    upload();
    clearUI();
    writeNextButton();
    renderSmall();
    document.getElementById("select").innerHTML = "New Drawing";
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
      dots[dotsCount++] = new Dot((spaceX * i), (spaceY * (j + 0.5)), r);
    }
  }
}

function polarGrid() {
  type = "polar";
  let r = 20;
  let gap;
  let remainder;
  if (drawingPaused === 1) {
    dotQty = 300;
    r = vMax * 0.25;
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
    dots[dotsCount++] = new Dot(tempX, tempY, r);
  }
}
