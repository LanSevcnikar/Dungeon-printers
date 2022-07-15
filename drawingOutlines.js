//function to draw shape between current mouse position and previous mouse position
function drawingOutlineNewShape() {
  if (app.selectedTool == "rec") {
    drawOutlineNewShapeRectangle();
  }
  if (app.selectedTool == "oct") {
    drawOutlineNewShapeOcto();
  }
  if (app.selectedTool == "sel") {
    drawOutlineSelect();
  }
}

function drawOutlineSelect() {
  let temp = new Point(mouseX, mouseY);
  temp = screenToCam(temp);
  let shape = new Shape([
    new Point(mousePrevious.x, mousePrevious.y),
    new Point(temp.x, mousePrevious.y),
    temp,
    new Point(mousePrevious.x, temp.y),
  ]);
  drawShape(shape, new Layer("Select", color_select));
}

function drawOutlineNewShapeRectangle() {
  let temp = new Point(mouseX, mouseY);
  temp = screenToCam(temp);
  if (!app.freeDraw) {
    temp = snapToInt(temp);
  }
  let shape = new Shape([
    new Point(mousePrevious.x, mousePrevious.y),
    new Point(temp.x, mousePrevious.y),
    temp,
    new Point(mousePrevious.x, temp.y),
  ]);
  drawShape(shape, new Layer(colour_lines, 2));
}

function drawOutlineNewShapeOcto() {
  let temp = new Point(mouseX, mouseY);
  temp = screenToCam(temp);
  temp.subtract(mousePrevious);
  let r = temp.magnitude();
  if (!app.freeDraw) {
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
  drawShape(shape, new Layer(colour_lines, 2));
}

//function to draw grid on screen
function drawGrid() {
  strokeWeight(0.5);
  stroke(140);
  fill(140);
  // LOOP BETWEEN -10 AND 10
  let minX = Math.floor(cam.x) - 4;
  let maxX = Math.floor(cam.x + screenWidth / screenSizeOfGrid) + 4;
  for (let i = minX; i < maxX; i++) {
    let point1 = new Point(i, 0);
    let point2 = new Point(i, 0);
    line(camToScreen(point1).x, 0, camToScreen(point2).x, screenHeight);
  }
  //copy above code but for y
  let minY = Math.floor(cam.y) - 4;
  let maxY = Math.floor(cam.y + screenHeight / screenSizeOfGrid) + 4;
  for (let i = minY; i < maxY; i++) {
    let point1 = new Point(0, i);
    let point2 = new Point(screenWidth, i);
    line(0, camToScreen(point1).y, screenWidth, camToScreen(point2).y);
  }

  //at coordinated divisible by 10 note their number
  for (let i = minX; i < maxX; i++) {
    for (let j = minY; j < maxY; j++) {
      if (i % 10 == 0 && j % 10 == 0) {
        let point = new Point(i, j);
        point = camToScreen(point);
        text(i + "," + j, point.x - 15, point.y + 10);
      }
    }
  }
}
