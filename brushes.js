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
let dotsCount = 0;


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

// used for Rakes
function resetVectorStore() {
  for (let i = 0; i < 1000; i++) {
    vec[i] = 0;
  }
}


function brushIt(_x, _y, pX, pY) {
  if (brushSelected === 1) {
    brush_pencil(_x, _y, pX, pY, 70, velocity, 60);
  }
  if (brushSelected === 2) {
    brush_dottedLine(_x, _y, pX, pY, 80, 1);
  } else if (brushSelected === 3) {
    brush_lineScatter(_x, _y, pX, pY, 40, 6.5, 1, 90, velocity); // _x, _y, pX, pY, qty, spread, pSize, col
  } else if (brushSelected === 4) {
    brush_pencil(_x, _y, pX, pY, 80, velocity, 255);
  } else if (brushSelected === 5) {
    brush_dottedLine(_x, _y, pX, pY, 200, 0);
  } else if (brushSelected === 6) {
    brush_rake(x, y, x2, y2, angle1, 50, 11, 140, 3, velocity) // x, y, x2, y2, angle, qtyOfLines, brushWidth, opacity, noise
  } else if (brushSelected === 0) {
    brush_erase(_x, _y, pX, pY);
  }
}

function brush_pencil(_x, _y, pX, pY, t, v, c) {
  v = constrain(v, 6, 40);
  let v0 = createVector(_x, _y);
  let v1 = createVector(pX, pY);
  drawLayer.stroke(c, 200);
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

// todo - can I delete the line stuff

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

function brush_lineScatter(_x, _y, pX, pY, qty, spread, pSize, colRand, velocity) {
  spread = constrain(spread*(velocity/20), spread*0.8, spread*1.2);
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
      drawLayer.stroke(215, opacity);
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
