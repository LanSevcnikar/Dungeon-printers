//class Player
class Player {
  //constructor, giving a name and a color

  constructor(name, color, x, y) {
    this.name = name;
    this.color = [color[0], color[1], color[2]];
    //if x and y are not null then set location to that

    if (x != null && y != null) {
      this.location = new Point(x, y);
    } else {
      this.location = new Point(0, 0);
    }
  }

  //show function to show the player
  draw() {
    fill(this.color);
    //text(this.name, 10, 10);
    //make ellipse at location using camToScreen function
    ellipse(
      camToScreen(this.location).x + screenSizeOfGrid / 2,
      camToScreen(this.location).y + screenSizeOfGrid / 2,
      screenSizeOfGrid / 1.5,
      screenSizeOfGrid / 1.5
    );
    //display first letter of name inside of ellipse
    fill(255);
    text(
      this.name[0],
      camToScreen(this.location).x + screenSizeOfGrid / 2 - 9,
      camToScreen(this.location).y + screenSizeOfGrid / 2 + 7
    );
  }

  findSightOfPlayer() {
    //loop through all shapes in layer 0
    let playerPosition = new Point(
      this.location.x + 0.5,
      this.location.y + 0.5
    );
    let allPoints = [];
    for (let l1 = 0; l1 < app.layers.length; l1++) {
      for (let s1 = 0; s1 < app.layers[l1].shapes.length; s1++) {
        //loop through all points in shape
        for (let ll = 0; ll < app.layers[l1].shapes[s1].lines.length; ll++) {
          for (let i = 0; i < 2; i++) {
            let p = app.layers[l1].shapes[s1].lines[ll][i];
            if (p.x == null || p.y == null) continue;
            // line(
            //   camToScreen(playerPosition).x,
            //   camToScreen(playerPosition).y,
            //   camToScreen(p).x,
            //   camToScreen(p).y
            // );
            //loop through all shapes
            let points = [p];
            for (let l2 = 0; l2 < app.layers.length; l2++) {
              for (let s2 = 0; s2 < app.layers[l2].shapes.length; s2++) {
                //loop through all lines
                let shape = app.layers[l2].shapes[s2];
                for (let m = 0; m < shape.lines.length; m++) {
                  if (
                    shape.lines[m][0].x == null ||
                    shape.lines[m][0].y == null || 
                    shape.lines[m][1].x == null ||
                    shape.lines[m][1].y == null
                  ){ 
                    continue;
                  }

                  let temp = findPointOfCollision(
                    playerPosition,
                    p,
                    shape.lines[m][0],
                    shape.lines[m][1]
                  );
                  points.push(temp);
                }
              }
            }
            //filter out null points
            points = points.filter(function (n) {
              return n != null;
            });
            //sort points by clossness to player
            points.sort(function (a, b) {
              return playerPosition.distance(a) - playerPosition.distance(b);
            });
            //loop through all points
            //create two more points that have the same coordinates as point
            let p1 = new Point(points[0].x, points[0].y);
            let p2 = new Point(points[0].x, points[0].y);
            //rotate p1 by 90 degrees
            p1.subtract(playerPosition);
            p1.rotate(90);
            p1.setmag(0.1);
            p1.add(points[0]);
            p1.subtract(playerPosition);
            p1.setmag(100);
            p1.add(playerPosition);

            p2.subtract(playerPosition);
            p2.rotate(270);
            p2.setmag(0.1);
            p2.add(points[0]);
            p2.subtract(playerPosition);
            p2.setmag(100);
            p2.add(playerPosition);

            // line(
            //   camToScreen(playerPosition).x,
            //   camToScreen(playerPosition).y,
            //   camToScreen(p1).x,
            //   camToScreen(p1).y
            // );
            // //draw line connecting player and p2
            // line(
            //   camToScreen(playerPosition).x,
            //   camToScreen(playerPosition).y,
            //   camToScreen(p2).x,
            //   camToScreen(p2).y
            // );

            let points1 = [p1];
            for (let l2 = 0; l2 < app.layers.length; l2++) {
              for (let s2 = 0; s2 < app.layers[l2].shapes.length; s2++) {
                //loop through all lines
                let shape = app.layers[l2].shapes[s2];
                for (let m = 0; m < shape.lines.length; m++) {
                  let temp = findPointOfCollision(
                    playerPosition,
                    p1,
                    shape.lines[m][0],
                    shape.lines[m][1]
                  );
                  points1.push(temp);
                }
              }
            }

            let points2 = [p2];
            for (let l2 = 0; l2 < app.layers.length; l2++) {
              for (let s2 = 0; s2 < app.layers[l2].shapes.length; s2++) {
                //loop through all lines
                let shape = app.layers[l2].shapes[s2];
                for (let m = 0; m < shape.lines.length; m++) {
                  let temp = findPointOfCollision(
                    playerPosition,
                    p2,
                    shape.lines[m][0],
                    shape.lines[m][1]
                  );
                  points2.push(temp);
                }
              }
            }

            points1 = points1.filter(function (n) {
              return n != null;
            });

            points2 = points2.filter(function (n) {
              return n != null;
            });

            points1.sort(function (a, b) {
              return playerPosition.distance(a) - playerPosition.distance(b);
            });

            points2.sort(function (a, b) {
              return playerPosition.distance(a) - playerPosition.distance(b);
            });

            // draw each point
            // points[0].draw();
            // points1[0].draw();
            // points2[0].draw();

            allPoints.push(points[0]);
            allPoints.push(points1[0]);
            allPoints.push(points2[0]);
          }
        }
      }
    }
    //sort all points based on the angle they make with playerlocatioin
    allPoints.sort(function (a, b) {
      return playerPosition.angleBetween(a) - playerPosition.angleBetween(b);
    });

    //draw shape defined by all the points
    fill(255,255,255,100);
    beginShape();
    for (let i = 0; i < allPoints.length; i++) {
      vertex(
        camToScreen(allPoints[i]).x,
        camToScreen(allPoints[i]).y
      );
    }
    endShape(CLOSE);

    //console.log(allPoints);
  }
}
