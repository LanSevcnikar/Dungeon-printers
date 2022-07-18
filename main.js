const { createApp } = Vue;

let allDataTypes = [
  "selectedTool",
  "offsetForDrawing",
  "freeDraw",
  "layers",
  "selectedLayer",
  "selectedPlayer",
  "previouslySelectedPlayer",
  "entities",
  "selectedShapes",
];

let app = createApp({
  data() {
    return {
      //Data to be saved in the file
      selections: {
        showGrid: true,
        showDevTools: true,
        selectedTool: "rec", //
        offsetForDrawing: 0.2, //
        freeDraw: false, //
        brushColor: [120, 0, 0, 4],
        strokeCount: 0,
        selectedLayer: 0, //
        showFieldOfView: false, //
        showOutsideView: true, //
        snapEntities: true,
        smoothUpdate: false,
      },

      brushStrokes: [],

      //Really importaint things
      layers: [new Layer("Layer 1")],
      entities: [],
      selectedShapes: [],

      //Not needed to be saved and backed up
      selectedPlayer: null,
      previouslySelectedPlayer: null,
      addedEntity: {
        name: "",
        color: [0, 0, 0],
        isNPC: false,
      },
      addedLayer: "",
    };
  },
  methods: {
    deleteEntity(entity) {
      this.entities.splice(this.entities.indexOf(entity), 1);
    },
    addEntity() {
      this.entities.push(
        new Player(
          this.addedEntity.name,
          this.addedEntity.color,
          this.addedEntity.isNPC,
          5,
          5
        )
      );
      //console.log(this.entities);
      this.addEntity.name = "";
      this.addEntity.color = [];
    },
    addLayer() {
      this.layers.push(new Layer(this.addedLayer));
      this.addedLayer = "";
    },
    bumpToTop(index) {
      //reorder layers so that the one with the index is first
      let temp = this.layers[index];
      this.layers.splice(index, 1);
      this.layers.push(temp);
    },
    deleteLayer(index) {
      //if there is more than one layer
      if (this.layers.length > 1) {
        this.layers.splice(index, 1);
      }
    },
    clearBrush(){
      this.brushStrokes = [];
      this.selections.strokeCount = 0;
    },
    resetAllData() {
      this.selections = {
        showGrid: true,
        showDevTools: true,
        selectedTool: "rec", //
        offsetForDrawing: 0.2, //
        freeDraw: false, //
        brushColor: [120, 0, 0, 4],
        strokeCount: 0,
        selectedLayer: 0, //
        showFieldOfView: false, //
        showOutsideView: true, //
        snapEntities: true,
        smoothUpdate: false,
      };

      this.brushStrokes = [];

      this.layers = [new Layer("Layer 1")];
      this.entities = [];
      this.selectedShapes = [];

      this.selectedPlayer = null;
      this.previouslySelectedPlayer = null;
      this.addedEntity = {
        name: "",
        color: [0, 0, 0],
        isNPC: false,
      };
      this.addedLayer = "";

      updateAllThings();
    },
  },
}).mount("#app");

const ERROR_DELTA = 0.00001;

const colour_background = [51, 50, 50];
const color_select = [60, 60, 230, 180];
const colour_lines = (232, 233, 235);
const colour_background_lines = (132, 133, 135);

screenWidth = window.innerWidth;
screenHeight = window.innerHeight;

let mousePrevious = new Point(NaN, NaN);
let cam = new Point(0, 0);
let screenSizeOfGrid = 40;

let history = [];

function updateHistory() {
  let temp = JSON.stringify(app);

  history.push(temp);
  //delete first element if longer than 12
  if (history.length > 12) {
    history.shift();
  }
}

function undoHistory() {
  if (history.length > 0) {
    let temp = history.pop();
    temp = JSON.parse(temp);
    loadFromJson(temp);
  }
}

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
  //loop through all players
}

// p5js main function
function draw() {
  //set fill colour to whitr
  background(colour_background);

  // if (app.selections.selectedTool == "mov" && mousePrevious.x != NaN) {
  //   moveSelectedShapes();
  // }
  app.layers.forEach((layer) => {
    layer.drawAllShapesBase();
  });
  //if mouse pressed not NaN draw circle with radious 3 at that location
  strokeWeight(2);
  if (!isNaN(mousePrevious.x)) {
    drawingOutlineNewShape();
  }
  if (app.selectedPlayer != null) {
    updateSelectedPlayerLocation(app.selectedPlayer);
    //loop throughg all layers
    if (
      app.selections.showOutsideView == false &&
      app.selections.smoothUpdate
    ) {
      app.layers.forEach((layer, index) => {
        updateSublinesOfAllShapesOnLayer(index);
      });
    }
  }
  app.selectedShapes.forEach((shape) => {
    drawShapeBase(shape, new Layer("Select", color_select));
  });

  if (app.selections.showFieldOfView) {
    app.entities.forEach((player) => {
      if (!player.isNPC) {
        player.drawShapeOfSight([150, 150, 150, 255]);
      }
    });
  }
  app.layers.forEach((layer) => {
    layer.drawAllShapesOutline();
  });

  //show all players
  app.entities.forEach((player) => {
    player.draw();
  });
  if (app.selections.selectedTool == "drw") {
    if (app.selections.strokeCount + 1 == app.brushStrokes.length) {
      if (mouseIsPressed) {
        updateBrushStroke();
      }
    }
  }
  drawBrushStrokes();

  if (app.selections.showGrid) {
    drawGrid();
  }
  //text in top corner to show cam location and scale  and grid size big font white font
  //set font to white
  if (app.selections.showDevTools == false) return;
  fill(140);
  stroke(140);
  textSize(20);
  text("cam Location: (" + cam.x + "," + cam.y + ")", 10, 20);
  text("Grid Size: " + screenSizeOfGrid, 10, 60);
  text("Framerate: " + frameRate().toFixed(2), 10, 80);
  text("Mouse Prs: (" + mousePrevious.x + "," + mousePrevious.y + ")", 10, 100);
  text("Mouse Location: (" + mouseX + "," + mouseY + ")", 10, 120);
}

function updateBrushStroke() {
  let temp = new Point(mouseX, mouseY);
  temp.subtract(
    app.brushStrokes[app.selections.strokeCount].points[
      app.brushStrokes[app.selections.strokeCount].points.length - 1
    ]
  );
  if (temp.magnitude() > 10) {
    app.brushStrokes[app.selections.strokeCount].points.push(
      new Point(mouseX, mouseY)
    );
  }
}


function drawBrushStrokes() {
  //loop through all brush strokes
  for (let i = 0; i < app.brushStrokes.length; i++) {
    strokeWeight(app.brushStrokes[i].color[3]);
    //set color of stroke and fill to brush color
    stroke([app.brushStrokes[i].color[0],app.brushStrokes[i].color[1],app.brushStrokes[i].color[2],200]);
    fill([app.brushStrokes[i].color[0],app.brushStrokes[i].color[1],app.brushStrokes[i].color[2],200]);
    //loop through all points in stroke
    for (let j = 0; j < app.brushStrokes[i].points.length - 1; j++) {
      //draw line between two points
      line(
        app.brushStrokes[i].points[j].x,
        app.brushStrokes[i].points[j].y,
        app.brushStrokes[i].points[j + 1].x,
        app.brushStrokes[i].points[j + 1].y
      );
    }
  }
}

function updateSelectedPlayerLocation(player) {
  let temp = new Point(
    mouseX - screenSizeOfGrid / 2,
    mouseY - screenSizeOfGrid / 2
  );
  temp = screenToCam(temp);
  if (app.selections.snapEntities) {
    temp = snapToInt(temp);
  }
  if (temp.x != player.location.x || temp.y != player.location.y) {
    player.location = temp;
    if (
      app.selections.showFieldOfView ||
      app.selections.showOutsideView == false
    ) {
      if (app.selections.smoothUpdate) {
        player.findSightOfPlayer();
      }
    }
  }
  player.location = temp;
}

function moveSelectedShapes() {
  let temp = new Point(mouseX, mouseY);
  temp = screenToCam(temp);
  temp.subtract(mousePrevious);
  temp = snapToInt(temp);
  app.selectedShapes.forEach((shape) => {
    console.log(shape);
  });
}

function updateAllThings() {
  //loop through all layers
  app.layers.forEach((layer, index) => {
    updateLinesOfAllShapesOnLayer(index);
  });

  app.entities.forEach((entity) => {
    if (!entity.isNPC) {
      entity.findSightOfPlayer();
    }
  });
  app.layers.forEach((layer, index) => {
    updateSublinesOfAllShapesOnLayer(index);
  });
  console.log("update all things");
}
