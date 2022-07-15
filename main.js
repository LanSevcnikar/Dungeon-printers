const { createApp } = Vue;

let app = createApp({
  data() {
    return {
      selectedTool: "rec",
      offsetForDrawing: 0.2,
      freeDraw: false,
      layers: [new Layer("Layer 1")],
      selectedLayer: 0,
      selectedPlayer: null,
      previouslySelectedPlayer: null,
      entities: [],
      addedEntity: {
        name: "",
        color: [],
      },
      addedLayer: "",
      selectedShapes: [],
    };
  },
  methods: {
    deleteEntity(entity) {
      this.entities.splice(this.entities.indexOf(entity), 1);
    },
    addEntity() {
      this.entities.push(
        new Player(this.addedEntity.name, this.addedEntity.color)
      );
      console.log(this.entities);
      this.addEntity.name = "";
      this.addEntity.color = [];
    },
    addLayer() {
      this.layers.push(new Layer(this.addedLayer));
      this.addedLayer = "";
    },
    bumpToTop(index){
      //reorder layers so that the one with the index is first
      let temp = this.layers[index];
      this.layers.splice(index, 1);
      this.layers.push(temp)
    },
    deleteLayer(index){
      //if there is more than one layer
      if(this.layers.length > 1){
        this.layers.splice(index,1);
      }
    }
  },
}).mount("#app");

const ERROR_DELTA = 0.0001;

const colour_background = [51, 50, 50];
const color_select = [60, 60, 230, 180];
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

  if (app.selectedTool == "mov" && mousePrevious.x != NaN) {
    moveSelectedShapes();
  }
  app.layers.forEach((layer) => {
    layer.drawAllShapes();
  });
  //if mouse pressed not NaN draw circle with radious 3 at that location
  strokeWeight(2);
  if (!isNaN(mousePrevious.x)) {
    drawingOutlineNewShape();
  }
  drawGrid();
  if (app.selectedPlayer != null) {
    updateSelectedPlayerLocation(app.selectedPlayer);
  }
  app.selectedShapes.forEach((shape) => {
    drawShape(shape, new Layer("Select", color_select));
  });

  //show all players
  app.entities.forEach((player) => {
    player.draw();
  });

  //text in top corner to show cam location and scale  and grid size big font white font
  //set font to white
  fill(140);
  stroke(140);
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

function moveSelectedShapes() {
  let temp = new Point(mouseX, mouseY);
  temp = screenToCam(temp);
  temp.subtract(mousePrevious);
  temp = snapToInt(temp);
  app.selectedShapes.forEach((shape) => {
    console.log(shape)
  });
}
