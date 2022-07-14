const { createApp } = Vue;

let app = createApp({
  data() {
    return {
      selectedTool: 4,
      offsetForDrawing: 0,
      freeDraw: false,
      layers: [new Layer("Layer 1"), new Layer("Base")],
      selectedLayer: 0,
      selectedPlayer: null,
      players: [
        new Player("Quinn", [90, 10, 180], 6, 6),
        new Player("Erin", [90, 10, 180], 12, 8),
        new Player("Lunk", [90, 10, 180]),
      ],
    };
  },
}).mount("#app");

const ERROR_DELTA = 0.0001;

const colour_background = (51, 50, 50);
const colour_lines = (232, 233, 235);
const colour_background_lines = (132, 133, 135);

screenWidth = window.innerWidth;
screenHeight = window.innerHeight;

let mousePrevious = new Point(NaN, NaN);
let cam = new Point(0, 0);
let screenSizeOfGrid = 40;

//function to return middlepoint of two points
function middlePoint(p1, p2) {
  return new Point((p1.x + p2.x) / 2, (p1.y + p2.y) / 2);
}

// p5js main function
function setup() {
  createCanvas(screenWidth, screenHeight);
  background(colour_background);
  stroke(colour_lines);
  strokeWeight(1);
  fill(255);
}

// p5js main function
function draw() {
  //set fill colour to whitr
  background(colour_background);

  app.layers.forEach((layer) => {
    layer.drawAllShapes();
  });
  drawGrid();
  //if mouse pressed not NaN draw circle with radious 3 at that location
  strokeWeight(2);
  if (!isNaN(mousePrevious.x)) {
    drawingOutlineNewShape();
  }
  if (app.selectedPlayer != null) {
    updateSelectedPlayerLocation(app.selectedPlayer);
  }

  //show all players
  app.players.forEach((player) => {
    player.draw();
  });

  //text in top corner to show cam location and scale  and grid size big font white font
  //set font to white
  textSize(20);
  text("cam Location: (" + cam.x + "," + cam.y + ")", 10, 20);
  text("Grid Size: " + screenSizeOfGrid, 10, 60);
  text("Framerate: " + frameRate().toFixed(2), 10, 80);
  text("Mouse Prs: (" + mousePrevious.x + "," + mousePrevious.y + ")", 10, 100);
  text("Mouse Location: (" + mouseX + "," + mouseY + ")", 10, 120);
}

function updateSelectedPlayerLocation(player) {
  let temp = new Point(
    mouseX - screenSizeOfGrid / 2,
    mouseY - screenSizeOfGrid / 2
  );
  temp = screenToCam(temp);
  temp = snapToInt(temp);
  player.location = temp;
}
