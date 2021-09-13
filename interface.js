let colArray = ["#000000", "#444444", "#888888", "#a1a1a1", "#c2c2c2", "#ffffff"];
let button, selColour;

function writeTextUI() {

  $(".interface").remove();
  $(".select").remove();

  textSize(vMax*2);
  fill(0);
  noStroke
  colH1 = color(355, 0, 20);
  nextButton = createButton("New")
  nextButton.class("select");
  nextButton.position(width - (16 * vMax), height - (7 * vMax));
  nextButton.mousePressed(nextDrawing);

  saveButton = createButton("Save")
  saveButton.class("select");
  saveButton.position(width - (16 * vMax), height - (13 * vMax));
  saveButton.mousePressed(saveImg);


      swatch1 = createButton("");
      swatch1.position(0 * vMax, height - (10 * vMax));
      swatch1.size(6 * vMax, 10.5 * vMax);
      swatch1.style("background-color", colArray[0]);
      swatch1.class("box");
      swatch1.mousePressed(function() {
        changeBrush(1)
      });

      swatch2 = createButton("");
      swatch2.position(6 * vMax, height - (10 * vMax));
      swatch2.size(6 * vMax, 10.5 * vMax);
      swatch2.style("background-color", colArray[1]);
      swatch2.class("box");
      swatch2.mousePressed(function() {
        changeBrush(2)
      });

      swatch3 = createButton("");
      swatch3.position(12 * vMax, height - (10 * vMax));
      swatch3.size(6 * vMax, 10.5 * vMax);
      swatch3.style('background-color', colArray[2]);
      swatch3.class("box");
      swatch3.mousePressed(function() {
        changeBrush(3)
      });

      swatch4 = createButton("");
      swatch4.position(18 * vMax, height - (10 * vMax));
      swatch4.size(6 * vMax, 10.5 * vMax);
      swatch4.style("background-color", colArray[3]);
      swatch4.class("box");
      swatch4.mousePressed(function() {
        changeBrush(4)
      });

      swatch5 = createButton("");
      swatch5.position(24 * vMax, height - (10 * vMax));
      swatch5.size(6 * vMax, 10.5 * vMax);
      swatch5.style("background-color", colArray[4]);
      swatch5.class("box");
      swatch5.mousePressed(function() {
        changeBrush(5)
      });

      swatch6 = createButton("");
      swatch6.position(30 * vMax, height - (10 * vMax));
      swatch6.size(6 * vMax, 10.5 * vMax);
      swatch6.style("background-color", colArray[5]);
      swatch6.class("box");
      swatch6.mousePressed(function() {
        changeBrush(6)
      });


}

function writeRestartUI() {
  textSize(vMax*2);
  fill(0);
  noStroke();
  nextButton.remove();
  nextButton = createButton("Restart")
  nextButton.class("select");
  nextButton.position(width - (16 * vMax), height - (7 * vMax));
  nextButton.style('background-color', 'indianred');
  nextButton.mousePressed(restart);
}

function restart() {
  stage = 0;
  dimensionCalc();
  writeTextUI();
  nextDrawing();
}


function saveImg() {
  click.play();
  save('touchscape' + month() + day() + hour() + second() + '.jpg');
}

function checkFS(){
  if (!fullscreen()){
  addFS();
}
}

function addFS(){
  $('.fsButton').remove();
  fsButton = createImg('assets/enterFS.png', "FULLSCREEN");
  fsButton.style('height', '4.5vMax');
  fsButton.class("fsButton");
  fsButton.position(width - (7.5 * vMax), 1.5 * vMax);
  fsButton.mousePressed(fs);
}

function fs(){
  fullscreen(1);
  $('.fsButton').remove();
}


  function changeBrush(brushSel) {



    brushSelected = brushSel-1;

  }
