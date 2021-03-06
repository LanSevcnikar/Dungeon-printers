function loadFromJson(data) {
  //console.log("Hello world",data);
  app.selections = {...data.selections};
  app.layers = [];
  for (let i = 0; i < data.layers.length; i++) {
    app.layers.push(new Layer(data.layers[i].name, data.layers[i].color));
    for (let j = 0; j < data.layers[i].shapes.length; j++) {
      app.layers[i].addShape(new Shape(data.layers[i].shapes[j].points));
    }
  }
  app.selections.selectedLayer = data.selections.selectedLayer;
  app.selectedPlayer = data.selectedPlayer;
  app.previouslySelectedPlayer = data.previouslySelectedPlayer;
  app.entities = [];
  for (let i = 0; i < data.entities.length; i++) {
    app.entities.push(
      new Player(
        data.entities[i].name,
        data.entities[i].color,
        data.entities[i].isNPC,
        data.entities[i].location.x,
        data.entities[i].location.y
      )
    );
    app.entities[i].shapeOfSight;; 
  }
  app.brushStrokes = data.brushStrokes;

  //console.log(app);
  //loop through all layers
  updateAllThings();
}

window.onbeforeunload = () => {
  //console.log(JSON.stringify(app));
  let data = JSON.stringify(app);
  window.localStorage.setItem("data", data);
};


window.onload = () => {
  let data = window.localStorage.getItem("data");
  if (data) {
    //console.log(JSON.parse(data));
    loadFromJson(JSON.parse(data));
  }
}

//p5js function to export canvas to jpg
function exportToJPG() {
  let name = app.fileExportName;
  if (name == "") {
    name = "untitled";
  }
  saveCanvas(name + ".jpg");
}


function exportToJson() {
  let name = app.fileExportName;
  if (name == "") {
    name = "untitled";
  }
  saveJSON(app, name + ".json");
}

function importToJson() {
  let file = document.getElementById("inputJSONFile").files[0];
  let reader = new FileReader();

  reader.readAsText(file);

  reader.onload = function () {
    let data = JSON.parse(reader.result);
    //console.log(data);

    loadFromJson(data);
  };
}

