//draw shape function, s - shape, l- layer
function drawShape(s, l) {
  //loop through lines in shape object
  for (let i = 0; i < s.lines.length; i++) {
    //draw line
    line(
      camToScreen(s.lines[i][0]).x,
      camToScreen(s.lines[i][0]).y,
      camToScreen(s.lines[i][1]).x,
      camToScreen(s.lines[i][1]).y
    );
  }

  fill(averageColor(l.color, colour_background))
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
  if (count == count2 && count > 0) return true;
  return false;
}

//function  to check if point inside of triangle defined by 3 points
function isPointInsideTriangle(p, p0, p1, p2) {
  var dX = p.x - p2.x;
  var dY = p.y - p2.y;
  var dX21 = p2.x - p1.x;
  var dY12 = p1.y - p2.y;
  var D = dY12 * (p0.x - p2.x) + dX21 * (p0.y - p2.y);
  var s = dY12 * dX + dX21 * dY;
  var t = (p2.y - p0.y) * dX + (p0.x - p2.x) * dY;
  if (D < 0) return s <= 0 && t <= 0 && s + t >= D;
  return (
    s - ERROR_DELTA >= 0 && t - ERROR_DELTA >= 0 && s + t + ERROR_DELTA <= D
  );
}

function updateLinesOfAllShapesOnLayer(selectedLayer) {
  //loop through all shapes on selected layer
  for (let i = 0; i < app.layers[selectedLayer].shapes.length; i++) {
    updateLinesOfShape(selectedLayer,  app.layers[selectedLayer].shapes[i]);
  }
}

function updateLinesOfShape(selectedLayer, s) {
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

/*
//loop throughg all points in shape by index
  
*/
