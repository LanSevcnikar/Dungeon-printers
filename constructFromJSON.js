function loadFromJson(data) {
  console.log("Hello world",data);
  app.selections.selectedTool = data.selectedTool;
  app.selections.offsetForDrawing = data.offsetForDrawing;
  app.selections.freeDraw = data.freeDraw;
  app.selections.showGrid = data.selections.showGrid;
  app.selections.showDevTools = data.selections.showDevTools; 
  app.layers = [];
  for (let i = 0; i < data.layers.length; i++) {
    app.layers.push(new Layer(data.layers[i].name, data.layers[i].color));
    for (let j = 0; j < data.layers[i].shapes.length; j++) {
      app.layers[i].addShape(new Shape(data.layers[i].shapes[j].points));
    }
  }
  app.selections.selectedLayer = data.selectedLayer;
  app.selectedPlayer = data.selectedPlayer;
  app.previouslySelectedPlayer = data.previouslySelectedPlayer;
  app.entities = [];
  for (let i = 0; i < data.entities.length; i++) {
    app.entities.push(
      new Player(
        data.entities[i].name,
        data.entities[i].color,
        data.entities[i].location.x,
        data.entities[i].location.y
      )
    );
  }

  console.log(app);
  //loop through all layers
  for (let i = 0; i < app.layers.length; i++) {
    //call updateLines on each layer
    updateLinesOfAllShapesOnLayer(i);
  }
}
