let colArray = ["#000000", "#333333", "#666666", "#999999", "#cccccc", "#ffffff", "#ffffff"];
let button, selColour;
let numSwatch = 6;
let swatch = [];

function writeTextUI() {

  $(".interface").remove();
  $(".select").remove();
  $(".box").remove();

  textSize(vMax * 2);
  fill(0);
  noStroke
  colH1 = color(355, 0, 20);
  nextButton = createButton("New")
  nextButton.id("select");
  nextButton.class("box");
  nextButton.position(width - (16 * vMax), height - (7 * vMax));
  nextButton.mousePressed(nextDrawing);

  // TODO - fading buttons
  for (let i = 0; i < numSwatch + 1; i++) {
    tint(40*i);
    swatch[i] = createImg('assets/Brush '+(i+1)+'.svg');
    noTint();
    swatch[i].position((i * 6) * vMax, height - (8 * vMax));
    swatch[i].size(6 * vMax, 15 * vMax);
    // swatch[i].style("background-color", colArray[i]);
    // swatch[i].style("border", "1px solid black");
    // swatch[i].style("border", "1px solid black");
    swatch[i].class("box");
    swatch[i].mousePressed(function() {
      selectAbrush(i);
    });
  }



  // // write another little box - this could be better
  // swatch[7] = createButton("");
  // swatch[7].position((i * 6) * vMax, height - (4 * vMax));
  // swatch[7].size(9 * vMax, 15 * vMax);
  // swatch[7].style("background-color", colArray[1]);
  // // eraser.style("border", "1px solid black");
  // swatch[7].class("box");
  // swatch[7].style("border-radius", 0);
  // swatch[7].mousePressed(function() {
  //   selectAbrush(6);
  // });
}

function selectAbrush(i) {
  for (let j = 0; j < numSwatch + 1; j++) {
    swatch[j].position((j * 6) * vMax, height - (8 * vMax));
    //swatch[j].style("border", "1px dotted grey");
  }

  swatch[i].position((i * 6) * vMax, height - (13 * vMax));
  //swatch[i].style("border", "5px inset grey");

  //nudge the eraser over
  swatch[6].position(swatch[6].x + (0.5 * vMax), swatch[6].y);
  //swatch[6].style("border", "1px inset grey");

  // change the brush
  changeBrush(i + 1)
}

function restart() {
  stage = 0;
  dimensionCalc();
  nextDrawing();
}

function checkFS() {
  if (!fullscreen()) {
    addFS();
  }
}

function addFS() {
  $('.fsButton').remove();
  fsButton = createImg('assets/enterFS.png', "FULLSCREEN");
  fsButton.style('height', '4.5vMax');
  // fsButton.class("fsButton");
  fsButton.class("box");
  fsButton.position(width - (7.5 * vMax), 1.5 * vMax);
  fsButton.mousePressed(fs);
}

function fs() {
  fullscreen(1);
  $('.fsButton').remove();
}


function changeBrush(brushSel) {



  brushSelected = brushSel - 1;

}
