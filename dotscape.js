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

  brushIt(mouseX, mouseY, pmouseX, pmouseY);
//  drawLayer.line(mouseX, mouseY, pmouseX, pmouseY);
  console.log("tst");
  render();
  return false;
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



getPressure = function(ev) {
  return ((ev.touches && ev.touches[0] && typeof ev.touches[0]["force"] !== "undefined") ? ev.touches[0]["force"] : 1.0);
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
  if (brushSelected === 3) {
    drawLayer.strokeWeight(constrain(abs((_y + _x) - (pX + pY)), 2, 3)); // for line work
    drawLayer.stroke(60, 60, 60, 50);
    for (i = 0; i < 10; i++) {
      let randX = randomGaussian(-6, 6);
      let randY = randomGaussian(-6, 6);
      drawLayer.line(_x + randX, _y + randY, pX + randX, pY + randY);
    }
  }
  if (brushSelected === 0) {
    drawLayer.strokeWeight(constrain(abs((_y + _x) - (pX + pY)), 3, 5)); // for line work
    drawLayer.stroke(10, 10, 10, 120);
    drawLayer.line(_x, _y, pX, pY);
  }
  if (brushSelected === 1) {
    drawLayer.strokeWeight(constrain(abs((_y + _x) - (pX + pY)), 14, 15)); // for line work
    drawLayer.stroke(20, 20, 20, 80);
    drawLayer.line(_x, _y, pX, pY);
  } else if (brushSelected === 4) {
    drawLayer.strokeWeight(abs(random(0, 4)));
    for (i = 0; i < 60; i++) {
      let tempCol = abs(random(200, 255));
      drawLayer.stroke(tempCol, tempCol, tempCol, 100);
      drawLayer.point(_x + randomGaussian(-10, 10), _y + randomGaussian(-10, 10));
    }
  } else if (brushSelected === 5) {
    drawLayer.strokeWeight(constrain(abs((_y + _x) - (pX + pY)), 30, 40)); // for line work
    drawLayer.stroke(255, 255, 255, 35);
    drawLayer.line(_x, _y, pX, pY);
  } else if (brushSelected === 2) {
    drawLayer.strokeWeight(constrain(abs((_y + _x) - (pX + pY)), 50, 60)); // for line work
    drawLayer.stroke(100, 100, 100, 50);
    drawLayer.line(_x, _y, pX, pY);
  } else if (brushSelected === 6) {
    drawLayer.blendMode(REMOVE);

    drawLayer.image(eraseAlpha, _x - 50, _y - 50, 100, 100);
    drawLayer.blendMode(BLEND);

  }
}
