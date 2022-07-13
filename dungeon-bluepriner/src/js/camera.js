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