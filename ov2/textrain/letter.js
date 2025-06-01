class Letter {
  constructor(x, y) {
    this.t = random(alphabets);
    this.x = x;
    this.y = y;
    this.dy = 1;
  }
  
  update() {
    let color = video.get(this.x, this.y);
    let b = brightness(color);

    if (b > thresholdVal * 100) {
      this.y += this.dy;
    } else {
      if (this.y > 0 && b < thresholdVal * 100) {
        this.y -= this.dy;
        color = video.get(this.x, this.y);
        b = brightness(color);
      }

    }
    
    if (this.y >= height) {
      this.y = 1;
    }
  }
  
  display() {
    fill(228, 34, 23);
    text(this.t, this.x, this.y);
  }
}