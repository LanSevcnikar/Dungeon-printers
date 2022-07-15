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
}
