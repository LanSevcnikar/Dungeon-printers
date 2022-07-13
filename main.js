const ERROR_DELTA = 0.0001;

const colour_background = (51, 50, 50);
const colour_lines = (232, 233, 235);
const colour_background_lines = (132, 133, 135);

const screenWidth = window.innerWidth;
const screenHeight = window.innerHeight - 50;




let mousePrevious = new Point(NaN, NaN);
let cam = new Point(0, 0);
let screenSizeOfGrid = 40;
let mainLayer = new Layer((75,74,74), colour_lines, 2);






//draw shape function
function drawShape(s) {
  //loop through points in shape
	
	beginShape();
  for (let i = 0; i < s.points.length; i++) {
		vertex(camToScreen(s.points[i]).x, camToScreen(s.points[i]).y);
  }
	endShape(CLOSE);
}

//function to draw shape between current mouse position and previous mouse position
function drawingOutlineNewShape() {
  let temp = new Point(mouseX, mouseY);
  temp = screenToCam(temp);
  temp = snapToInt(temp);
  let shape = new Shape([
    new Point(mousePrevious.x, mousePrevious.y),
    temp,
  ]);
  drawShape(shape);
}

//function to draw grid on screen
function drawGrid() {
  strokeWeight(0.5);
  stroke(colour_background_lines);
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
}

// p5js main function
function setup() {
  createCanvas(screenWidth, screenHeight);
  background(colour_background);
  stroke(colour_lines);
  strokeWeight(1);
	fill(255)
  let shape = new Shape([
    new Point(2, 2),
    new Point(2, 6),
    new Point(4, 6),
    new Point(4, 2),
  ]);
  //mainLayer.addShape(shape);
}

// p5js main function
function draw() {
	//set fill colour to whitr
    background(colour_background);
	
	mainLayer.drawAllShapes();
  drawGrid();
  //if mouse pressed not NaN draw circle with radious 3 at that location
	strokeWeight(2);
  if (!isNaN(mousePrevious.x)) {
    drawingOutlineNewShape();
  }

  //text in top corner to show cam location and scale  and grid size big font white font
  //set font to white
  textSize(20);
  text("cam Location: (" + cam.x + "," + cam.y + ")", 10, 20);
  text("Grid Size: " + screenSizeOfGrid, 10, 60);
  //show framrate
  text("Framerate: " + frameRate().toFixed(2), 10, 80);
  //show values of mouse pressed and mouse location
  text(
    "Mouse Pressed: (" + mousePrevious.x + "," + mousePrevious.y + ")",
    10,
    100
  );
  text("Mouse Location: (" + mouseX + "," + mouseY + ")", 10, 120);
}
