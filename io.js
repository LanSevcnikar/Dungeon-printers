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

	//console.log(division)
	cam.subtract(division);

  screenSizeOfGrid *= 1 -  event.delta / 1000; 
  //console.log(screenSizeOfGrid);
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
  if(isSamePoint(temp, mousePrevious)) {
    mousePrevious.x = NaN;
    mousePrevious.y = NaN;
    return;
  }
  if(isSameDouble(mousePrevious.x, temp.x) || isSameDouble(mousePrevious.y, temp.y)) {
    mousePrevious.x = NaN;
    mousePrevious.y = NaN;
    return;
  }

  let shape;
  shape = new Shape([
      new Point(mousePrevious.x, mousePrevious.y),
      new Point(temp.x, mousePrevious.y),
      temp,
      new Point(mousePrevious.x, temp.y),
    ]);

  mainLayer.addShape(shape);
  mousePrevious.x = NaN;
  mousePrevious.y = NaN;
}