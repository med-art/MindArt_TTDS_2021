// brushDynamics
let smoothDist = [0, 0, 0, 0, 0];
const reducer = (accumulator, currentValue) => accumulator + currentValue;
let velocity = 0;
let x = 100,
  y = 100,
  dragLength = 3,
  angle1 = 0;
let vec = [];

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
    circleRad = height * 0.45;
  } else {
    vMax = height / 100;
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



function mouseDragged() {
    calcDynamics();

  brushIt(mouseX, mouseY, pmouseX, pmouseY);
//  drawLayer.line(mouseX, mouseY, pmouseX, pmouseY);
  console.log("tst");
  render();
  return false;
}


function touchEnded() {
  resetVectorStore();
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
  background(200);
  image(drawLayer, 0, 0);
  for (let i = 0; i < dotsCount; i++) {
    dots[i].show();
  }
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
  if (stage < 3) {
    stage0grid();
  } else if (stage >= 3 && stage < 6) {
    stage1grid();
  } else if (stage >= 6 && stage < 8) {
    stage2grid();
  } else if (stage >= 8 && stage < 9) {
    stage3grid();
  } else if (stage >= 9 && stage < 11) {
    stage4grid();
  } else if (stage >= 11 && stage < 13) {
    stage5grid();
  }


  stage++;
  render();
}

function stage0grid() {
  let manualArray = [
    [1, 1, 4, 1, 1, 3, 4, 3, 1, 5, 4, 5, 1, 7, 4, 7],
    [1, 1, 2, 1, 3, 1, 4, 1, 1, 3, 4, 3, 1, 5, 4, 5, 1, 7, 2, 7, 3, 7, 4, 7],
    [1, 1, 3, 1, 2, 2, 4, 2, 1, 3, 3, 3, 2, 4, 4, 4, 1, 5, 3, 5, 2, 6, 4, 6, 1, 7, 3, 7, 2, 8, 4, 8]
  ];
  dots = [];
  let w = width / 5;
  let h = height / 9;
  let r = vMax * 2;
  dotQtyY = manualArray[stage].length / 2;
  for (let i = 0; i < manualArray[stage].length; i += 2) {
    dots[dotsCount++] = new Dot(manualArray[stage][i] * w, manualArray[stage][i + 1] * h, r);
  }
}

function stage1grid() {
  dots = [];
  if (stage === 3) {
    dotQtyX = 7;
    dotQtyY = 9;
    r = vMax * 1.2;
    let spaceX = width / dotQtyX + 4;
    let spaceY = height / dotQtyY + 4;
    for (let i = 0; i < dotQtyX; i++) {
      for (let j = 0; j < dotQtyY; j++) {
        dots[dotsCount++] = new Dot((i + 1) * spaceX, (j + 1) * spaceY, r);
      }
    }
  } else if (stage === 4) {
    dotQtyX = 2;
    dotQtyY = 5 * 4;
    r = vMax * 1;
    let spaceX = width / dotQtyX + 2;
    let spaceY = height / dotQtyY + 2;
    for (let i = 0; i < dotQtyX; i++) {
      for (let j = 0; j < dotQtyY; j += 4) {
        dots[dotsCount++] = new Dot(((i + 0.5) * spaceX) - (spaceX / 6), (j + 0.5) * spaceY, r);
        dots[dotsCount++] = new Dot(((i + 0.5) * spaceX) + (spaceX / 6), (j + 0.5) * spaceY, r);
        dots[dotsCount++] = new Dot(((i + 0.5) * spaceX) - (spaceX / 3), (j + 0.5) * spaceY + (spaceY * 2), r);
        dots[dotsCount++] = new Dot(((i + 0.5) * spaceX) + ((spaceX / 6) * 2), (j + 0.5) * spaceY + (spaceY * 2), r);
      }
    }

  } else if (stage === 5) {
    dotQtyX = 4;
    dotQtyY = 13 * 4;
    r = vMax * 0.5;
    let spaceX = width / dotQtyX + 2;
    let spaceY = height / dotQtyY + 2;
    for (let i = 0; i < dotQtyX; i++) {
      for (let j = 0; j < dotQtyY; j += 4) {
        dots[dotsCount++] = new Dot(((i + 0.5) * spaceX) - (spaceX / 6), (j + 0.5) * spaceY, r);
        dots[dotsCount++] = new Dot(((i + 0.5) * spaceX) + (spaceX / 6), (j + 0.5) * spaceY, r);
        dots[dotsCount++] = new Dot(((i + 0.5) * spaceX) - (spaceX / 3), (j + 0.5) * spaceY + (spaceY * 2), r);
        dots[dotsCount++] = new Dot(((i + 0.5) * spaceX) + ((spaceX / 6) * 2), (j + 0.5) * spaceY + (spaceY * 2), r);
      }
    }
  }
}

function stage2grid() {
  let r = vMax;
  ringQty = 1;
  if (stage === 6) {
    dotQty = 7;
  }
  if (stage === 7) {
    dotQty = 10;
  }
  for (let i = 0; i < ringQty; i++) {
    for (let j = 0; j < dotQty; j++) {
      let rotateVal = j * (360 / dotQty);
      let tran = (circleRad / ringQty) * (i + 1);
      let tempX = (tran * cos(radians(rotateVal))) + width / 2;
      let tempY = (tran * sin(radians(rotateVal))) + height / 2;
      dots[dotsCount++] = new Dot(tempX, tempY, r);
    }
  }
}

function stage3grid() {
  let r = vMax;
  if (stage === 8) {
    dotQty = 7;
    ringQty = 3;
    r = vMax * 0.75;
  }
  for (let i = 0; i < ringQty; i++) {
    for (let j = 0; j < dotQty + (i * 3); j++) {
      let rotateVal = j * (360 / (dotQty + (i * 3)));
      let tran = (circleRad / ringQty) * (i + 1);
      let tempX = (tran * cos(radians(rotateVal))) + width / 2;
      let tempY = (tran * sin(radians(rotateVal))) + height / 2;
      r = r - (r / 100);
      dots[dotsCount++] = new Dot(tempX, tempY, r);
    }
  }
}

function stage4grid() {
  let r = vMax;
  let gap;
  let remainder;
  if (stage === 9) {
    dotQty = 50;
    r = vMax * 0.6;
    gap = circleRad * 0.9;
    remainder = circleRad - gap;
  }
  if (stage === 10) {
    dotQty = 100;
    r = vMax * 0.5;
    gap = circleRad * 0.7;
    remainder = circleRad - gap;
  }
  for (let i = 0; i < dotQty; i++) {
    let rotateVal = i * 137.5;
    let tran = (((gap) / dotQty) * (i + 1)) + remainder;
    let tempX = (tran * cos(radians(rotateVal))) + width / 2;
    let tempY = (tran * sin(radians(rotateVal))) + height / 2;
    r = r + ((i / 40000) * vMax);
    dots[dotsCount++] = new Dot(tempX, tempY, r);
  }
}

function stage5grid() {
  if (stage === 11) {
    x = 7;
    y = 7;
    noiseAmp = 8;
    dotSize = 5;

  } else if (stage === 12) {
    writeRestartUI();
  }
  dotQtyX = x;
  dotQtyY = y;
  spaceX = width / (dotQtyX + 2);
  spaceY = height / (dotQtyY + 2);
  for (let i = 0; i < dotQtyX; i++) {
    for (let j = 0; j < dotQtyY; j++) {
      let noiseX = int((random(-width, width) * noiseAmp) / 150);
      let noiseY = int((random(-height, height) * noiseAmp) / 150);
      let r = random((vMax * (dotSize / 10)), (vMax * (dotSize / 10)) * 2);
      dots[dotsCount++] = new Dot(noiseX + (spaceX * 1.5) + (spaceX * i), noiseY + (spaceY * 1.5) + (spaceY * j), r);
    }
  }
  noiseAmp += 10;
  x += 5;
  y += 5;
  dotSize--;
}

function brushIt(_x, _y, pX, pY) {
  if (brushSelected === 0) {
    brush_pencil(_x, _y, pX, pY, 50, velocity, 0);
  } else if (brushSelected === 1) {
        brush_pencil2(_x, _y, pX, pY, 50, velocity, 0);
  } else if (brushSelected === 2) {
    brush_scatter1(_x, _y, 10, 10, 10, 10) //_x, _y, qty, spread, pSize, colRand
  } else if (brushSelected === 3) {
    brush_lineScatter(_x, _y, pX, pY, 10, 4, 1, 255); // _x, _y, pX, pY, qty, spread, pSize, col
  } else if (brushSelected === 4) {
    brush_lineScatter(_x, _y, pX, pY, 30, 5, 10, 10); // _x, _y, pX, pY, qty, spread, pSize, col
  } else if (brushSelected === 5) {
    brush_rake(x, y, x2, y2, angle1, 50, 10, 101, 5) // x, y, x2, y2, angle, qtyOfLines, brushWidth, opacity, noise
  }
}
function brush_pencil(_x, _y, pX, pY, t, v, c) {
   v = constrain(v, 3, 10);
  let v0 = createVector(_x, _y);
  let v1 = createVector(pX, pY);
  drawLayer.stroke(c,105);
  drawLayer.strokeWeight(1);
  for (let i = 0; i < 200; i++) {
     let v3 = p5.Vector.lerp(v0, v1, random(0, 1));
    drawLayer.point(v3.x + ((noise(_x+i)-0.5)*v), v3.y + ((noise(_y+i)-0.5)*v));
  }
  drawLayer.stroke(c, 30);
  drawLayer.strokeWeight(3);
  for (let i = 0; i < 2; i++) {
   let v3 = p5.Vector.lerp(v0, v1, random(0, 1));
    drawLayer.point(v3.x + random(-v, v), v3.y + random(-v, v));
  }
}

function brush_pencil2(_x, _y, pX, pY, t, v) {
  v = constrain(v, 0, 50);
  let v0 = createVector(_x, _y);
  let v1 = createVector(pX, pY);
  drawLayer.stroke(0, 10);
  drawLayer.strokeWeight(1);
  for (let i = 0; i < 100; i++) {
    drawLayer.line(v0.x + ((noise(_x+i)-0.5)*v), v0.y + ((noise(_y+i)-0.5)*v), v1.x + ((noise(_x+i)-0.5)*v), v1.y + ((noise(_y+i)-0.5)*v));
  }
  drawLayer.stroke(100);
  drawLayer.strokeWeight(random(1, 3));
  for (let i = 0; i < 20; i++) {
   let v3 = p5.Vector.lerp(v0, v1, random(0, 1));
    drawLayer.point(v3.x + ((noise(pX-i)-0.5)*v*2), v3.y + ((noise(pY-i)-0.5)*v*2));
  }
}


function brush_scatter1(_x, _y, qty, spread, pSize, colRand) {
  spread = spread * random(0.5, 1);
  drawLayer.fill(0, 200);
  drawLayer.noStroke();
  qty = qty * random(0, 1);
  pSize = pSize * random(0.2, 1);
  for (let i = 0; i < qty; i++) {
    let rX = randomGaussian(spread, spread/2);
    let rY = randomGaussian(spread, spread/2);
    drawLayer.ellipse(_x + (rX), _y + (rY), pSize, pSize);
  }
}

function brush_lineScatter(_x, _y, pX, pY, qty, spread, pSize, colRand) {
  drawLayer.strokeWeight(pSize); // for line work
  drawLayer.stroke(0, colRand);
  for (i = 0; i < qty; i++) {
    let rX = randomGaussian(-spread, spread);
    let rY = randomGaussian(-spread, spread);
    drawLayer.line(_x + rX, _y + rY, pX + rX, pY + rY);
  }
}

function brush_rake(x, y, x2, y2, angle, qtyOfLines, brushWidth, opacity, noise) {

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
      drawLayer.stroke(40, opacity);
    } else if (i % 3 === 1) {
      drawLayer.stroke(200, opacity);
    } else if (i % 3 === 2) {
      drawLayer.stroke(40, opacity);
    }

    drawLayer.line(vec[i].x, vec[i].y, d.x, d.y);
    vec[i] = d;
  }

}
