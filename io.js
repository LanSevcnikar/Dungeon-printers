// on mouse press and drag make cam move
function mouseDragged() {
  //make debug call to console
  //condition if space bar is being pressed
  if (keyIsDown(32)) {
    cam.x -= (mouseX - pmouseX) / screenSizeOfGrid;
    cam.y -= (mouseY - pmouseY) / screenSizeOfGrid;
  }
}

//on scroll change grid size
function mouseWheel(event) {
  //if scroll into positive multiply grid size by scalar otherwise divide it by it
  //ratio of mouse to screen
  let ratio = new Point(mouseX / screenWidth, mouseY / screenHeight);
  let division = new Point(
    screenWidth / screenSizeOfGrid,
    screenHeight / screenSizeOfGrid
  );

  division.x *= ratio.x;
  division.x *= event.delta / 1000;
  division.y *= ratio.y;
  division.y *= event.delta / 1000;

  //console.log(division)
  cam.subtract(division);

  screenSizeOfGrid *= 1 - event.delta / 1000;
  //console.log(screenSizeOfGrid);
}

//on mouse pressed save current mouse position
function mousePressed() {
  if (mouseX > screenWidth - 450) return;
  updateHistory();
  // if spacebar is not being pressed
  if (!keyIsDown(32)) {
    if (
      app.selections.selectedTool == "rec" ||
      app.selections.selectedTool == "oct"
    ) {
      mousePrevious.x = mouseX;
      mousePrevious.y = mouseY;
      mousePrevious = screenToCam(mousePrevious);
      if (!app.selections.freeDraw) {
        mousePrevious = snapToInt(mousePrevious);
      }
      //draw circle at mouse pressed with radious 10
    }

    if (app.selections.selectedTool == "sel") {
      mousePrevious.x = mouseX;
      mousePrevious.y = mouseY;
      mousePrevious = screenToCam(mousePrevious);
    }

    if (app.selections.selectedTool == "mov") {
      mousePrevious.x = mouseX;
      mousePrevious.y = mouseY;
      mousePrevious = screenToCam(mousePrevious);
    }

    if (app.selections.selectedTool == "chm") {
      let temp = new Point(mouseX, mouseY);
      temp = screenToCam(temp);
      let closestPlayer = app.entities[0];
      //loop through players anmd if closer, change closest player
      for (let i = 1; i < app.entities.length; i++) {
        if (
          temp.distance(app.entities[i].location) <
          temp.distance(closestPlayer.location)
        ) {
          closestPlayer = app.entities[i];
        }
      }
      if (temp.distance(closestPlayer.location) > 1.5) {
        closestPlayer = null;
      }
      //console.log(closestPlayer);
      app.selectedPlayer = closestPlayer;
    }

    if(app.selections.selectedTool == "fre"){
      let temp = new Point(mouseX, mouseY);
      temp = screenToCam(temp);
      if(freeLine.length == 0){
        freeLine.push(temp);
      }
      else{
        temp.subtract(freeLine[0]);
        if(temp.magnitude() < 0.3){
          app.layers[app.selections.selectedLayer].addShape(new Shape(freeLine));
          freeLine = [];
        }else{
          temp.add(freeLine[0]);
          freeLine.push(temp);
        }
      }
    }

    if (app.selections.selectedTool == "drw") {
      app.brushStrokes;
      app.brushStrokes.push({
        color: [
          app.selections.brushColor[0],
          app.selections.brushColor[1],
          app.selections.brushColor[2],
          app.selections.brushColor[3],
        ],
        points: [new Point(mouseX, mouseY)],
      });
    }
  }
}

//on mouse released set mouse previous values to NaN
function mouseReleased() {
  if (mouseX > screenWidth - 450) return;
  if (app.selections.selectedTool == "rec") {
    mouseRealeasedRectangle();
  }
  if (app.selections.selectedTool == "oct") {
    mouseRealeasedOcto();
  }
  if (app.selections.selectedTool == "sel") {
    mouseReleasedSelect();
  }
  if (app.selections.selectedTool == "drw") {
    app.selections.strokeCount += 1;
  }
  //check if spaceBar is being pressed
  if (!keyIsDown(32)) {
    updateAllThings();
  }

  app.selectedPlayer = null;
  mousePrevious.x = NaN;
  mousePrevious.y = NaN;
}

function mouseReleasedSelect() {
  app.selectedShapes = [];
  let temp = new Point(mouseX, mouseY);
  temp = screenToCam(temp);
  //loop through all shapes in selected layer
  for (
    let i = 0;
    i < app.layers[app.selections.selectedLayer].shapes.length;
    i++
  ) {
    //set new variable to shape and loop through all points of current shape
    let shape = app.layers[app.selections.selectedLayer].shapes[i];

    let topLeft = new Point(
      min(mousePrevious.x, temp.x),
      min(mousePrevious.y, temp.y)
    );
    let bottomRight = new Point(
      max(mousePrevious.x, temp.x),
      max(mousePrevious.y, temp.y)
    );
    let topRight = new Point(
      max(mousePrevious.x, temp.x),
      min(mousePrevious.y, temp.y)
    );
    let bottomLeft = new Point(
      min(mousePrevious.x, temp.x),
      max(mousePrevious.y, temp.y)
    );

    let square = new Shape([topLeft, topRight, bottomRight, bottomLeft]);
    let contains = false;

    for (let j = 0; j < shape.points.length; j++) {
      if (isPointInShape(shape.points[j], square)) {
        contains = true;
      }
    }
    //loop through points of square
    for (let j = 0; j < square.points.length; j++) {
      if (isPointInShape(square.points[j], shape)) {
        contains = true;
      }
    }

    if (contains) {
      app.selectedShapes.push(shape);
    }
  }

  //console.log(app.selectedShapes);
}

function mouseRealeasedRectangle() {
  let temp = new Point(mouseX, mouseY);
  temp = screenToCam(temp);
  if (!app.selections.freeDraw) {
    temp = snapToInt(temp);
  }
  if (isSamePoint(temp, mousePrevious)) {
    mousePrevious.x = NaN;
    mousePrevious.y = NaN;
    return;
  }
  if (
    isSameDouble(mousePrevious.x, temp.x) ||
    isSameDouble(mousePrevious.y, temp.y)
  ) {
    mousePrevious.x = NaN;
    mousePrevious.y = NaN;
    return;
  }

  let topLeft = new Point(
    min(mousePrevious.x, temp.x) + app.selections.offsetForDrawing,
    min(mousePrevious.y, temp.y) + app.selections.offsetForDrawing
  );
  let bottomRight = new Point(
    max(mousePrevious.x, temp.x) - app.selections.offsetForDrawing,
    max(mousePrevious.y, temp.y) - app.selections.offsetForDrawing
  );
  let topRight = new Point(
    max(mousePrevious.x, temp.x) - app.selections.offsetForDrawing,
    min(mousePrevious.y, temp.y) + app.selections.offsetForDrawing
  );
  let bottomLeft = new Point(
    min(mousePrevious.x, temp.x) + app.selections.offsetForDrawing,
    max(mousePrevious.y, temp.y) - app.selections.offsetForDrawing
  );

  let shape;
  shape = new Shape([topLeft, topRight, bottomRight, bottomLeft]);

  //loop through all the points in shape

  app.layers[app.selections.selectedLayer].addShape(shape);
  mousePrevious.x = NaN;
  mousePrevious.y = NaN;
}

function mouseRealeasedOcto() {
  let temp = new Point(mouseX, mouseY);
  temp = screenToCam(temp);
  temp.subtract(mousePrevious);
  let r = temp.magnitude();
  if (!app.selections.freeDraw) {
    r = Math.round(r);
  }
  let a = PI / 8;
  let points = [];
  for (let i = 0; i < 8; i++) {
    let x = r * cos(a);
    let y = r * sin(a);
    let something = new Point(x, y);
    something.add(mousePrevious);
    points.push(something);
    a += PI / 4;
  }

  let shape = new Shape(points);
  app.layers[app.selections.selectedLayer].addShape(shape);
  mousePrevious.x = NaN;
  mousePrevious.y = NaN;
}

//when window size changes, adjust p5 canvas accordingly
function windowResized() {
  //console.log("Window was resized");
  screenHeight = window.innerHeight;
  screenWidth = window.innerWidth - 450;
  //console.log(screenHeight, screenWidth);
  resizeCanvas(screenWidth, screenHeight);
}

function keyPressed() {
  //check if key is delete
  if (keyCode === DELETE) {
    deleteSelected();
  }

  if (keyCode == 90) {
    if (keyIsDown(17)) {
      undoHistory();
    }
  }

  if (keyCode == 17) {
    if (keyIsDown(90)) {
      undoHistory();
    }
  }
}

//when delete is clicked call function
function deleteSelected() {
  if (app.selectedShapes.length > 0) {
    //console.log(app.selectedShapes, "deleting them")
    for (let i = 0; i < app.selectedShapes.length; i++) {
      app.layers[app.selections.selectedLayer].deleteShape(
        app.selectedShapes[i]
      );
    }
    app.selectedShapes = [];
  }
}
