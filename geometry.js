//class Point
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
    this.x = this.x / mag;
    this.y = this.y / mag;
  }
  //function to return the magnitudr of the point
  magnitude() {
    return sqrt(this.x * this.x + this.y * this.y);
  }
  //multiply x and y by scalar
  multiply(scalar) {
    this.x *= scalar;
    this.y *= scalar;
  }
  //draw function to draw the point
  draw(i) {
    fill(255);
    if (i == null) i = 5;
    //draw eclipse at coordinates
    //console.log(this)
    ellipse(camToScreen(this).x, camToScreen(this).y, i, i);
  }
  //distance function between this and another point
  distance(p) {
    return sqrt(
      (this.x - p.x) * (this.x - p.x) + (this.y - p.y) * (this.y - p.y)
    );
  }
  //function to rotate point by x degrees around 0,0
  rotate(x) {
    let a = (x * PI) / 180;
    let newX = this.x * cos(a) - this.y * sin(a);
    let newY = this.x * sin(a) + this.y * cos(a);
    this.x = newX;
    this.y = newY;
  }
  angleBetween(p) {
    return atan2(this.y - p.y, this.x - p.x);
  }
}

//class Shape
class Shape {
  constructor(a) {
    this.points = [];
    this.lines = [];
    this.sublines = [];
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
  constructor(local_name, local_color) {
    if (local_color == null) this.color = [240, 240, 240];
    else this.color = local_color;
    this.name = local_name;
    this.shapes = [];
  }

  //add shape
  addShape(shape) {
    this.shapes.push(shape);
  }

  //draweAllShapes function
  drawAllShapesBase() {
    //set fill and stroke according to internal data
    if (app.selections.showOutsideView) {
      this.shapes.forEach((shape) => {
        drawShapeBase(shape, this);
      });
    } else {
      //loop through all players that are not NPCs
      for (let i = 0; i < app.entities.length; i++) {
        if (!app.entities[i].isNPC) {
          //create new shape for player sight
          let playerSight = new Shape(app.entities [i].shapeOfSight);
          drawShapeBase(playerSight, app.layers[0]);
        }
      }
    }
  }

  drawAllShapesOutline() {
    this.shapes.forEach((shape) => {
      fill((this.color + 130) / 4);
      stroke(this.color);
      strokeWeight(2);
      drawShapeOutline(shape, this);
    });
  }

  deleteShape(shape) {
    this.shapes.splice(this.shapes.indexOf(shape), 1);
  }
}

//function taht calculates the avergae of two colors
function averageColor(color1, color2) {
  //console.log(color1, color2);
  let average = [0, 0, 0, color1[3]];
  for (let i = 0; i < 3; i++) {
    average[i] = (color1[i] + color2[i] * 3) / 4;
  }
  return average;
}

//function to check if two points are the same called isSamePoint but for doublkes
function isSamePoint(p1, p2) {
  return isSameDouble(p1.x, p2.x) && isSameDouble(p1.y, p2.y);
}

//function to check if two doubles are inside of error_delta
function isSameDouble(a, b) {
  return abs(a - b) < ERROR_DELTA;
}

//function that will find the collision point of two lines defined by points, returning NULL if there is no collision
function findPointOfCollision(_p1, _p2, _p3, _p4) {
  let p1 = new Point(_p1.x, _p1.y);
  let p2 = new Point(_p2.x, _p2.y);
  let p3 = new Point(_p3.x, _p3.y);
  let p4 = new Point(_p4.x, _p4.y);
  //check if first or second line is vertical
  if (isSameDouble(p1.x, p2.x) || isSameDouble(p3.x, p4.x)) {
    if (isSameDouble(p1.x, p2.x) && isSameDouble(p3.x, p4.x)) {
      return null;
    }
    if (isSameDouble(p1.x, p2.x)) {
      // calculate the linear function defined by p3 and p4
      let m = (p4.y - p3.y) / (p4.x - p3.x);
      let b = p3.y - m * p3.x;
      // calculate the y coordinate of the point of collision
      let y = m * p1.x + b;
      // calculate the x coordinate of the point of collision
      let x = p1.x;
      //check if new point is between p1 and p2
      if (y < max(p1.y, p2.y) && y > min(p1.y, p2.y)) {
        let mx = min(p3.x, p4.x);
        let Mx = max(p3.x, p4.x);
        let my = min(p3.y, p4.y);
        let My = max(p3.y, p4.y);
        //check if new point is between p3 and p4
        if (x >= mx && x <= Mx && y >= my && y <= My) {
          return new Point(x, y);
        }
      }
      // return the point of collision
      return null;
    }
    //repeat above code, switiching p1 with p3 and p2 with p4
    if (isSameDouble(p3.x, p4.x)) {
      // calculate the linear function defined by p1 and p2
      let m = (p2.y - p1.y) / (p2.x - p1.x);
      let b = p1.y - m * p1.x;
      // calculate the y coordinate of the point of collision
      let y = m * p3.x + b;
      // calculate the x coordinate of the point of collision
      let x = p3.x;
      //check if new point is between p3 and p4
      if (y < max(p3.y, p4.y) && y > min(p3.y, p4.y)) {
        let mx = min(p1.x, p2.x);
        let Mx = max(p1.x, p2.x);
        let my = min(p1.y, p2.y);
        let My = max(p1.y, p2.y);
        //check if new point is between p1 and p2
        if (x >= mx && x <= Mx && y >= my && y <= My) {
          return new Point(x, y);
        }
      }
      // return the point of collision
      return null;
    }
    return null;
  }
  // calculate the linear function defined by p1 and p2
  let m1 = (p2.y - p1.y) / (p2.x - p1.x);
  let b1 = p1.y - m1 * p1.x;
  // calculate the linear function defined by p3 and p4
  let m2 = (p4.y - p3.y) / (p4.x - p3.x);
  let b2 = p3.y - m2 * p3.x;

  // calculate the x coordinate of the point of collision
  let x = (b2 - b1) / (m1 - m2);
  // calculate the y coordinate of the point of collision
  let y = m1 * x + b1;
  if (isSameDouble(m1, m2)) {
    return null;
  }
  //debug to console p1, p2, p3, p4, x, y
  //console.log(p1, p2, p3, p4, x, y);

  //check if new point is between p1 and p2 and p3 and p4
  if (
    y <= max(p1.y, p2.y) + ERROR_DELTA &&
    y >= min(p1.y, p2.y) - ERROR_DELTA &&
    x <= max(p1.x, p2.x) + ERROR_DELTA &&
    x >= min(p1.x, p2.x) - ERROR_DELTA &&
    y <= max(p3.y, p4.y) + ERROR_DELTA &&
    y >= min(p3.y, p4.y) - ERROR_DELTA &&
    x <= max(p3.x, p4.x) + ERROR_DELTA &&
    x >= min(p3.x, p4.x) - ERROR_DELTA
  ) {
    return new Point(x, y);
  }

  return null;
}

//draws all points of collision between two shapes, not really ever used in code but meant for debugging
function drawAllPointsOfCollision(shape1, shape2) {
  //loop through all points in shape by index
  for (let i = 1; i < shape1.points.length; i++) {
    //loop through all points in shape by index
    for (let j = 1; j < shape2.points.length; j++) {
      //find the point of collision
      let point = findPointOfCollision(
        shape1.points[i - 1],
        shape1.points[i],
        shape2.points[j - 1],
        shape2.points[j]
      );
      //if the point of collision is not null
      if (point != null) {
        //draw the point of collision
        point.draw();
      }
    }
  }
}
