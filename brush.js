function updateBrushStroke() {
  let temp = new Point(mouseX, mouseY);
  temp.subtract(
    app.brushStrokes[app.selections.strokeCount].points[
      app.brushStrokes[app.selections.strokeCount].points.length - 1
    ]
  );
  if (temp.magnitude() > 10) {
    app.brushStrokes[app.selections.strokeCount].points.push(
      new Point(mouseX, mouseY)
    );
  }
}

function drawBrushStrokes() {
  //loop through all brush strokes
  for (let i = 0; i < app.brushStrokes.length; i++) {
    strokeWeight(app.brushStrokes[i].color[3]);
    //set color of stroke and fill to brush color
    stroke([app.brushStrokes[i].color[0],app.brushStrokes[i].color[1],app.brushStrokes[i].color[2],200]);
    fill([app.brushStrokes[i].color[0],app.brushStrokes[i].color[1],app.brushStrokes[i].color[2],200]);
    //loop through all points in stroke
    for (let j = 0; j < app.brushStrokes[i].points.length - 1; j++) {
      //draw line between two points
      line(
        app.brushStrokes[i].points[j].x,
        app.brushStrokes[i].points[j].y,
        app.brushStrokes[i].points[j + 1].x,
        app.brushStrokes[i].points[j + 1].y
      );
    }
  }
}