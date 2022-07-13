const ERROR_DELTA = 0.0001;

const colour_background = (51, 50, 50);
const colour_lines = (232, 233, 235);
const colour_background_lines = (132, 133, 135);

screenWidth = window.innerWidth;
screenHeight = window.innerHeight ;

let mousePrevious = new Point(NaN, NaN);
let cam = new Point(0, 0);
let screenSizeOfGrid = 40;
let mainLayer = new Layer((75, 74, 74), colour_lines, 2);

//draw shape function, s - shape, l- layer
function drawShape(s, l) {
  //loop throughg all points in shape by index
  for (let i = 0; i < s.points.length - 1; i++) {
    //if point is not the last point
    let points = [];
    let p1, p2;

    p1 = new Point(s.points[i].x, s.points[i].y);
    p2 = new Point(s.points[i + 1].x, s.points[i + 1].y);
    points.push(p1);
    points.push(p2);

    //loop through all shapes in layer
    for (let j = 0; j < l.shapes.length; j++) {
      //loop through all points in shape
      if (s == l.shapes[j]) {
        continue;
      }
      for (let k = 0; k < l.shapes[j].points.length - 1; k++) {
        let p3, p4;

        p3 = new Point(l.shapes[j].points[k].x, l.shapes[j].points[k].y);
        p4 = new Point(
          l.shapes[j].points[k + 1].x,
          l.shapes[j].points[k + 1].y
        );

        points.push(findPointOfCollision(p1, p2, p3, p4));
      }
    }

    //filter out all null points from array
    points = points.filter(function (n) {
      return n != null;
    });

    //sort array of points first by x coordinate, then by y coordinate
    points.sort(function (a, b) {
      if (isSameDouble(a.x, b.x)) {
        return a.y - b.y;
      } else {
        return a.x - b.x;
      }
    });

    

    //draw line between all points using camToScreen
    for (let j = 0; j < points.length - 1; j++) {
      let insideOfSomeShape = false;
      //loop through all shapes in layer and check if point is inside of some shape
      for (let k = 0; k < l.shapes.length; k++) {
       // console.log(points, s, l.shapes[k]);
        if (s == l.shapes[k]) {
          continue;
        }
        if (
          isPointInShape(middlePoint(points[j], points[j + 1]), l.shapes[k])
        ) {
         
          insideOfSomeShape = true;
          break;
        }
      }

      if (!insideOfSomeShape) {
        line(
          camToScreen(points[j]).x,
          camToScreen(points[j]).y,
          camToScreen(points[j + 1]).x,
          camToScreen(points[j + 1]).y
        );
      }
    }
  }

  noStroke();
  beginShape();
  //loop through points in shape
  for (let i = 0; i < s.points.length; i++) {
    vertex(camToScreen(s.points[i]).x, camToScreen(s.points[i]).y);
  }
  endShape(CLOSE);
}

//function to check if a point is in some shape
function isPointInShape(p, s) {
  if (s.points.length - 1 == 4) {
    let mx = min(s.points[0].x, s.points[2].x);
    let my = min(s.points[0].y, s.points[2].y);
    let Mx = max(s.points[0].x, s.points[2].x);
    let My = max(s.points[0].y, s.points[2].y);
    if (p.x > mx + 0 && p.x < Mx - 0 && p.y > my + 0 && p.y < My - 0) {
      return true;
    }
  }
  return false;
}

//function to return middlepoint of two points
function middlePoint(p1, p2) {
  return new Point((p1.x + p2.x) / 2, (p1.y + p2.y) / 2);
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
  drawShape(shape, new Layer(colour_lines, 2));
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

// p5js main function
function setup() {
  createCanvas(screenWidth, screenHeight);
  background(colour_background);
  stroke(colour_lines);
  strokeWeight(1);
  fill(255);
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

//when window size changes, adjust p5 canvas accordingly
function windowResized() {
  console.log("Window was resized");
  screenHeight = window.innerHeight;
  screenWidth = window.innerWidth;
  console.log(screenHeight, screenWidth);
  resizeCanvas(screenWidth, screenHeight);
}