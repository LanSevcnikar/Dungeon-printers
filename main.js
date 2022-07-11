const ERROR_DELTA = 1;

const colour_background = (51, 50, 50);
const colour_lines = (232, 233, 235);
const colour_background_lines = (132, 133, 135);

const screenWidth = window.innerWidth;
const screenHeight = window.innerHeight - 50;

//class point
class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  //add function to subtract another point
  add(p) {
    this.x += p.x;
    this.y += p.y;
  }
  //subtract function to subtract another point
  subtract(p) {
    this.x -= p.x;
    this.y -= p.y;
  }
  //setmag function to set the magnitude of the point
  setmag(mag) {
    this.normalize();
    this.x *= mag;
    this.y *= mag;
  }
  //normalize function to normalize the point
  normalize() {
    let mag = sqrt(this.x * this.x + this.y * this.y);
    this.x = (100 * this.x) / mag;
    this.y = (100 * this.y) / mag;
  }
  //multiply x and y by scalar
  multiply(scalar) {
    this.x *= scalar;
    this.y *= scalar;
  }
}

//class Shape
class Shape {
  constructor(a) {
    this.points = [];
    a.forEach((element) => {
      if (this.points.length == 0) this.points.push(element);
      else if (!isSamePoint(element, this.points[this.points.length - 1])) {
        this.points.push(element);
      }
    });
    this.points.push(a[0]);
  }
  //clone functyion
  clone() {
    let newPoints = [];
    this.points.forEach((element) => {
      newPoints.push(new Point(element.x, element.y));
    });
    return new Shape(newPoints);
  }
}

class Layer {
	constructor(colour_local_background, colour_local_lines, local_width){
		this.background = colour_local_background;
		this.lines = colour_local_lines;
		this.shapes = [];
		this.line_width = local_width;
	}

	//add shape
	addShape(shape){
		this.shapes.push(shape);
	}

	//draweAllShapes function
	drawAllShapes(){
		//set fill and stroke according to internal data
		fill(this.background);
		stroke(this.lines);
		strokeWeight(this.line_width);
		this.shapes.forEach((shape) => {
			drawShape(shape);
		});
	}

}


let mousePrevious = new Point(NaN, NaN);
let cam = new Point(0, 0);
let screenSizeOfGrid = 40;
let mainLayer = new Layer((75,74,74), colour_lines, 2);

//function to check if two points are the same called isSamePoint but for doublkes
function isSamePoint(p1, p2) {
	return p1.x == p2.x && p1.y == p2.y;
}

//function cmaera cooridnates to screen cooridnates
function camToScreen(p) {
  let temp = new Point(p.x, p.y);
  temp.subtract(cam);
  temp.multiply(screenSizeOfGrid);
  return temp;
}

//function to transform screen cooridnates to camera coordinates
function screenToCam(p) {
  p.x = p.x / screenSizeOfGrid + cam.x;
  p.y = p.y / screenSizeOfGrid + cam.y;
  return p;
}

//function to snap point to int
function snapToInt(p) {
  p.x = Math.round(p.x);
  p.y = Math.round(p.y);
  return p;
}

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
	let division = new Point(screenWidth / screenSizeOfGrid, screenHeight / screenSizeOfGrid);
	
	division.x *= ratio.x;
	division.x *= event.delta / 1000; 
	division.y *= ratio.y;
	division.y *= event.delta / 1000;

	console.log(division)
	cam.subtract(division);

  screenSizeOfGrid *= 1 -  event.delta / 1000; 
  console.log(screenSizeOfGrid);
}


//on mouse pressed save current mouse position
function mousePressed() {
  // if spacebar is not being pressed
  if (!keyIsDown(32)) {
    mousePrevious.x = mouseX;
    mousePrevious.y = mouseY;
    mousePrevious = screenToCam(mousePrevious);
    mousePrevious = snapToInt(mousePrevious);
		//draw circle at mouse pressed with radious 10
	}

} 

//on mouse released set mouse previous values to NaN
function mouseReleased() {
  let temp = new Point(mouseX, mouseY);
  temp = screenToCam(temp);
  temp = snapToInt(temp);

  let shape = new Shape([
    new Point(mousePrevious.x, mousePrevious.y),
    new Point(temp.x, mousePrevious.y),
    temp,
    new Point(mousePrevious.x, temp.y),
  ]);
  mainLayer.addShape(shape);
  mousePrevious.x = NaN;
  mousePrevious.y = NaN;
}

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
    new Point(temp.x, mousePrevious.y),
    temp,
    new Point(mousePrevious.x, temp.y),
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
  mainLayer.addShape(shape);
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
