//draw shape function, s - shape, l- layer
function drawShapeBase(s, l) {
  //loop through lines in shape object
  //console.log(l)
  fill(averageColor(l.color, colour_background));
  noStroke();
  beginShape();
  //loop through points in shape
  for (let i = 0; i < s.points.length; i++) {
    vertex(camToScreen(s.points[i]).x, camToScreen(s.points[i]).y);
  }
  endShape(CLOSE);
}

function drawShapeOutline(s, l) {
  stroke(l.color);
  if (app.selections.showOutsideView) {
    for (let i = 0; i < s.lines.length; i++) {
      //draw line
      line(
        camToScreen(s.lines[i][0]).x,
        camToScreen(s.lines[i][0]).y,
        camToScreen(s.lines[i][1]).x,
        camToScreen(s.lines[i][1]).y
      );
    }
  } else {
    //console.log(s.sublines);
    for (let i = 0; i < s.sublines.length; i++) {
      //draw line
      line(
        camToScreen(s.sublines[i][0]).x,
        camToScreen(s.sublines[i][0]).y,
        camToScreen(s.sublines[i][1]).x,
        camToScreen(s.sublines[i][1]).y
      );
    }
  }
}

//function to check if a point is in some shape
function isPointInShape(p, s) {
  let points = [];
  //loop through all points in s
  for (let i = 0; i < s.points.length - 1; i++) {
    let p1 = new Point(-1000, p.y);
    let p2 = new Point(1000, p.y);
    let p3 = new Point(s.points[i].x, s.points[i].y);
    let p4 = new Point(s.points[i + 1].x, s.points[i + 1].y);
    points.push(findPointOfCollision(p1, p2, p3, p4));
  }
  //remove null items from points
  points = points.filter(function (n) {
    return n != null;
  });

  //sort by x coordinate
  points.sort(function (a, b) {
    return a.x - b.x;
  });

  //count number of points with x smaller than p
  let count = 0;
  for (let i = 0; i < points.length; i++) {
    if (points[i].x < p.x) {
      count++;
    }
  }

  //count number of points with x bigger than p
  let count2 = 0;
  for (let i = 0; i < points.length; i++) {
    if (points[i].x > p.x) {
      count2++;
    }
  }

  //console.log(p,s,points);
  if (count2 % 2 == 1 && count % 2 == 1) return true;
  return false;
}

function updateLinesOfAllShapesOnLayer(selectedLayer) {
  //loop through all shapes on selected layer
  for (let i = 0; i < app.layers[selectedLayer].shapes.length; i++) {
    updateLinesOfShape(selectedLayer, app.layers[selectedLayer].shapes[i]);
  }
}

function updateSublinesOfAllShapesOnLayer(selectedLayer) {
  //loop through all shapes on selected layer
  if (app.selections.showOutsideView) return;
  for (let i = 0; i < app.layers[selectedLayer].shapes.length; i++) {
    updateSublinesOfShape(selectedLayer, app.layers[selectedLayer].shapes[i]);
  }
}

function updateSublinesOfShape(selectedLayer, s) {
  s.sublines = [];
  //loop through lines in s
  for (let l = 0; l < s.lines.length; l++) {
    let points = [];
    let p1 = new Point(s.lines[l][0].x, s.lines[l][0].y);
    let p2 = new Point(s.lines[l][1].x, s.lines[l][1].y);
    points.push(p1);
    points.push(p2);


    //loop through all non NPC entities
    for (let e = 0; e < app.entities.length; e++) {
      //check if entity is NPC
      if (app.entities[e].isNPC == false) {
        //loop through the shape of sight of entity
        //console.log(app.entities[e])
        for (let i = 0; i < app.entities[e].shapeOfSight.length  - 1; i++) {
          let p3 = new Point(
            app.entities[e].shapeOfSight[i].x,
            app.entities[e].shapeOfSight[i].y
          );
          let p4 = new Point(
            app.entities[e].shapeOfSight[i + 1].x,
            app.entities[e].shapeOfSight[i + 1].y
          );
          //console.log(p3,p4)
          let pointOfCollision = findPointOfCollision(p1, p2, p3, p4);
          if (pointOfCollision != null) {
            points.push(pointOfCollision);
            //console.log("There is at least one more point of collision");
          }
        }
      }
    }
    //sort points first by x and then y coordinate
    points.sort(function (a, b) {
      if (a.x == b.x) {
        return a.y - b.y;
      } else {
        return a.x - b.x;
      }
    });

    //remove duplicates
    // points = points.filter(function (item, pos) {
    //   return points.indexOf(item) == pos;
    // });

    // loop through points
    for (let i = 0; i < points.length - 1; i++) {
      //points[i].draw();
      let insideOfSight = false;
      for (let e = 0; e < app.entities.length; e++) {
        //check if entity is NPC
        if (app.entities[e].isNPC == false) {
          let s = new Shape(app.entities[e].shapeOfSight);
          insideOfSight =
            insideOfSight ||
            isPointInShape(middlePoint(points[i], points[i + 1]), s);
        }
      }
      if (insideOfSight) {
        s.sublines.push([points[i], points[i + 1]]);
      }
    }
  }
  
  //console.log(s.sublines);
}

function updateLinesOfShape(selectedLayer, s) {
  s.lines = [];
  let l = app.layers[selectedLayer];
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
        s.lines.push([points[j], points[j + 1]]);
      }
    }
  }
}
