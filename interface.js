let button, selColour;
let numSwatch = 6;
let swatch = [];

function clearUI(){

    $(".interface").remove();
    $(".select").remove();
    $(".box").remove();
}

function writeNextButton(){
  nextButton = createButton("New")
  nextButton.id("select");
  nextButton.class("box");
  nextButton.position(width - (16 * vMax), height - (7 * vMax));
  nextButton.mousePressed(nextDrawing);
}

function writeTextUI() {
clearUI();

  textSize(vMax * 2);
  fill(0);
  noStroke
  colH1 = color(355, 0, 20);
  writeNextButton();

  // TODO - fading buttons
  for (let i = 0; i < numSwatch + 1; i++) {
    tint(40*i);
    swatch[i] = createImg('assets/Brush '+(i+1)+'.svg');
    noTint();
    swatch[i].position((i * 6) * vMax, height - (8 * vMax));
    swatch[i].size(6 * vMax, 15 * vMax);
    swatch[i].class("box");
    swatch[i].mousePressed(function() {
      selectAbrush(i);
    });
  }


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

//startSimulation and pauseSimulation defined elsewhere
function handleVisibilityChange() {
  // if (document.hidden) {
  //   audio.stop();
  // } else {
  //   audio.loop(1);
  // }
}

document.addEventListener("visibilitychange", handleVisibilityChange, false);
