// brushDynamics
let smoothDist = [0, 0, 0, 0, 0];
const reducer = (accumulator, currentValue) => accumulator + currentValue;
let velocity = 0;
let x = 100,
  y = 100,
  dragLength = 3,
  angle1 = 0;
let vec = [];

let fadeIn = 0;
let buttonOpacity = 1;
let inverter = 0;

let lineArray = [];



// stages are used to track each set of dots
let stage = 1;

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

// colour tracking
let hueDrift, brightDrift, satDrift,
  primaryArray = [360, 60, 240], // RGB in HSB terms
  colHue = 360,
  colSat = 100,
  colBri = 100,
  appCol;

// intro tracking
let xintro = [],
  yintro = [],
  direction = 0,
  introHue = 0,
  demoStage = 0,
  finger_x = 0,
  finger_xEased = 0,
  expansion = 0.1,
  hitRad = 40,
  tempOpacity = 20,
  intro_X = 0, // used for colour dots
  cycle_count = 0;

// intro and UI tracking
let introText = ["Touch and Listen", "Look", "Draw"],
  slide = 4,
  delayTime = 15000,
  introComplete = 0;

//DATA
let lineStore;
let pointStore;

let brushSelected = 1;

function preload() {
  //
  // audio = loadSound('assets/audio.mp3');
  // click = loadSound('assets/click.mp3');
}

function start() {
  $(".startBtn").remove();
  fullscreen(1);
  // note currently everything resets on windowResized. Unsure if this is logical yet

  // if (audio.isPlaying()) {} else {
  //   audio.loop(1);
  // }
  sizeWindow();
  writeTextUI();
  selectAbrush(0);

  reset();
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

  drawLayer.stroke(10);
  drawLayer.strokeWeight(20);

  // vector array used to store points, this will max out at 100
  resetVectorStore();

}

function reset() {


  // initialised dimensions and start intro
  dimensionCalc();
  intro_X = (width * 0.30) - 100;

  //DATA
  lineStore = [];
  pointStore = [];

  render();

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
  stage--;
  nextDrawing();
}

function mousePressed() {
  fadeIn = 0;
}

function mouseDragged() {
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

function resetVectorStore() {
  for (let i = 0; i < 1000; i++) {
    vec[i] = 0;
  }
}

function calcDynamics() {

  // calculate the distance between mouse position, and previous position. Average the previous
  let d = dist(mouseX, mouseY, pmouseX, pmouseY);
  smoothDist.shift();
  smoothDist.push(d);
  velocity = smoothDist.reduce(reducer) / smoothDist.length;


  // calculate mouseDirection
  let dx = mouseX - x;
  let dy = mouseY - y;

  angle1 = atan2(dy, dx);
  x = (mouseX) - cos(angle1) * dragLength;
  x2 = (100) - cos(PI / 2) * 1;
  y = (mouseY) - sin(angle1) * dragLength;
  y2 = (100) - sin(PI / 2) * 1;

}

function render() {
  background(80);
  for (let i = 0; i < dotsCount; i++) {
    dots[i].show();
  }
  image(drawLayer, 0, 0);
  image(lineLayer, 0, 0);

}



//startSimulation and pauseSimulation defined elsewhere
function handleVisibilityChange() {
  // if (document.hidden) {
  //   audio.stop();
  // } else {
  //   audio.loop(1);
  // }
}

document.addEventListener("visibilitychange", handleVisibilityChange, false);



// Dot class, not used in intro
class Dot {
  constructor(x, y, r) {
    this.x = x;
    this.y = y;
    this.r = r;
  }
  show() {
    noStroke();
    fill(0, 100);
    ellipse(this.x, this.y, this.r * 2);
  }
}

function nextDrawing() {
  throughDotCount = 0;
  dotsCount = 0;
  // click.play();
  drawLayer.clear();
  lineLayer.clear();



  if (stage === 0) {
    stage1grid();
  }

  if (stage === 1) {
    stage2grid();
  }

  stage++;
  stage = stage % 2;
  render();
}

function stage1grid() {
  dots = [];

  // calculate amount of x's and y's to include
  let r = vMax / 3.2;
  let qtyX = vMax*1.3; // quantiy along X
  let qtyY = vMin*1.3;
  let spaceX = width / qtyX;
  let spaceY = height / qtyY;
  console.log(spaceX, spaceY);




  for (let i = 1; i < qtyX; i++) {
    for (let j = 0; j < qtyY; j++) {
          dots[dotsCount++] = new Dot((spaceX * i), (spaceY * (j + 0.5)), r);
    }
  }


}


function stage2grid() {
  let r = vMax;
  let gap;
  let remainder;
  if (stage === 1) {
    dotQty = 300;
    r = vMax * 0.25;
    gap = circleRad * 0.95;
    remainder = circleRad - gap;
  }
  // if (stage === 10) {
  //   dotQty = 100;
  //   r = vMax * 0.5;
  //   gap = circleRad * 0.7;
  //   remainder = circleRad - gap;
  // }
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

function brushIt(_x, _y, pX, pY) {
  if (brushSelected === 0) {
    brush_pencil(_x, _y, pX, pY, 70, velocity, 0);
  }
  if (brushSelected === 1) {
    brush_dottedLine(_x, _y, pX, pY, 35, 1);
  } else if (brushSelected === 2) {
    brush_lineScatter(_x, _y, pX, pY, 40, 6.5, 2, 100); // _x, _y, pX, pY, qty, spread, pSize, col
  } else if (brushSelected === 3) {
    brush_pencil(_x, _y, pX, pY, 80, velocity, 255);
  } else if (brushSelected === 6) {
    brush_dottedLine(_x, _y, pX, pY, 170, 0);
  } else if (brushSelected === 5) {
    brush_rake(x, y, x2, y2, angle1, 50, 11, 200, 3, velocity) // x, y, x2, y2, angle, qtyOfLines, brushWidth, opacity, noise
  } else if (brushSelected === 4) {
    brush_erase(_x, _y, pX, pY);
  }
}

function brush_pencil(_x, _y, pX, pY, t, v, c) {
  v = constrain(v, 2, 40);
  let v0 = createVector(_x, _y);
  let v1 = createVector(pX, pY);
  drawLayer.stroke(c, 145);
  drawLayer.strokeWeight(1);
  for (let i = 0; i < int(velocity*10); i++) {
    let v3 = p5.Vector.lerp(v0, v1, random(0, 1));
    drawLayer.point(v3.x + ((noise(_x + i) - 0.5) * v), v3.y + ((noise(_y + i) - 0.5) * v));
  }
  drawLayer.stroke(c, 30);
  drawLayer.strokeWeight(3);
  for (let i = 0; i < 2; i++) {
    let v3 = p5.Vector.lerp(v0, v1, random(0, 1));
    drawLayer.point(v3.x + random(-v, v), v3.y + random(-v, v));
  }
}

function brush_dottedLine(_x, _y, pX, pY, c, version) {
  let v1 = createVector(_x, _y);
  lineArray.push(v1)
  lineRender(c, version);
}

function lineRender(c, version) {
  if (version) {
    lineLayer.drawingContext.setLineDash([7, 18]);
    lineLayer.strokeWeight(4);
  } else {
    lineLayer.drawingContext.setLineDash([1, 20]);
    lineLayer.strokeWeight(7);
  }
  lineLayer.stroke(c, 255);
  lineLayer.noFill();

  lineLayer.beginShape();
  for (let i = 0; i < lineArray.length; i++) {
    curveVertex(lineArray[i].x, lineArray[i].y)
  }
  lineLayer.endShape();

}

// function brush_pencil2(_x, _y, pX, pY, t, v) {
//   v = constrain(v, 0, 50);
//   let v0 = createVector(_x, _y);
//   let v1 = createVector(pX, pY);
//   drawLayer.stroke(0, 30);
//   drawLayer.strokeWeight(1);
//   for (let i = 0; i < 100; i++) {
//     drawLayer.line(v0.x + ((noise(_x + i) - 0.5) * v), v0.y + ((noise(_y + i) - 0.5) * v), v1.x + ((noise(_x + i) - 0.5) * v), v1.y + ((noise(_y + i) - 0.5) * v));
//   }
//   drawLayer.stroke(70);
//   drawLayer.strokeWeight(random(1, 3));
//   for (let i = 0; i < 20; i++) {
//     let v3 = p5.Vector.lerp(v0, v1, random(0, 1));
//     drawLayer.point(v3.x + ((noise(pX - i) - 0.5) * v), v3.y + ((noise(pY - i) - 0.5) * v));
//   }
// }


function brush_scatter1(_x, _y, qty, spread, pSize, colRand, v, pX, pY) {
  v = constrain(v, 0, 50);
  let v0 = createVector(_x, _y);
  let v1 = createVector(pX, pY);
  for (let i = 0; i < 20; i++) {
    drawLayer.stroke(random(0, 40), 100);
    drawLayer.strokeWeight(random(1, 5));
    let v3 = p5.Vector.lerp(v0, v1, random(0, 1));
    drawLayer.point(v3.x + ((noise(pX - i) - 0.5) * v), v3.y + ((noise(pY - i) - 0.5) * v));
  }
}

function brush_lineScatter(_x, _y, pX, pY, qty, spread, pSize, colRand) {
  drawLayer.strokeWeight(pSize); // for line work
  drawLayer.stroke(colRand, colRand);
  for (i = 0; i < qty; i++) {
    let rX = randomGaussian(-spread, spread);
    let rY = randomGaussian(-spread, spread);
    drawLayer.line(_x + rX, _y + rY, pX + rX, pY + rY);
  }
}

function brush_rake(x, y, x2, y2, angle, qtyOfLines, brushWidth, opacity, noise, v) {

  v = map(constrain(v, 1, 10), 0, 10, 0.5, 1.5);

  brushWidth = brushWidth*v;
  strokeW = ceil(brushWidth / qtyOfLines);
  drawLayer.strokeWeight(strokeW);

  var a = createVector(x, y);
  var b = createVector(0, brushWidth / 2);
  b.rotate(angle);
  var c = p5.Vector.add(a, b);
  a.sub(b);

  for (var i = 0; i < qtyOfLines; i++) {
    // cool
    // d = p5.Vector.lerp(a, c, (i/qtyOfLines)*random(0,1));

    d = p5.Vector.lerp(a, c, (i / (qtyOfLines + 1)) + randomGaussian(0, (1 / qtyOfLines) * noise));


    if (i === 0 || i === vec.length - 1 || (i % 3) === 2) { // if first line, last line or every 3rd line, then thin, else fat
      drawLayer.strokeWeight(strokeW / 2);
    } else {
      drawLayer.strokeWeight(strokeW);
    }

    var n = vec[i];
    if (i % 3 === 0) {
      drawLayer.stroke(100, opacity);
    } else if (i % 3 === 1) {
      drawLayer.stroke(255, opacity);
    } else if (i % 3 === 2) {
      drawLayer.stroke(100, opacity);
    }

    drawLayer.line(vec[i].x, vec[i].y, d.x, d.y);
    vec[i] = d;
  }
}


function brush_erase(_x, _y, pX, pY) {
  drawLayer.erase();
  drawLayer.strokeWeight(20);
  drawLayer.line(_x, _y, pX, pY);
  drawLayer.noErase();
}
