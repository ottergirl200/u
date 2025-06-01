// courtesy of Patt Vira from https://youtu.be/4IyeLc6J1Uo, then tweaked

let asciiChar = "$@%&#*dDoOyYuUlLiIkKeEtTaArRsSeElLfF/\\|(){}[]?-_+~<>i!lI;:,^`'. ";

let video;
let vidw = 64;
let vidh = 48;
let scl = 10;
let w, h;

// store current text color base
let baseColor;

let diffusions = []; // stores multiple diffusion events

function setup() {
  createCanvas(windowWidth, windowHeight);
  video = createCapture(VIDEO);
  video.size(vidw, vidh);
  video.hide();

  w = width / video.width;
  h = height / video.height;

  baseColor = color(0); // start with black
}

function draw() {
  background(255);
  video.loadPixels();

  textSize(w);
  textAlign(CENTER, CENTER);

  let maxRadius = dist(0, 0, width, height);
  let speed = 10;

  // Remove finished diffusions
  diffusions = diffusions.filter(d => (frameCount - d.frame) * speed < maxRadius);

  for (let i = 0; i < video.width; i++) {
    for (let j = 0; j < video.height; j++) {
      let pixelIndex = (i + j * video.width) * 4;
      let r = video.pixels[pixelIndex + 0];
      let g = video.pixels[pixelIndex + 1];
      let b = video.pixels[pixelIndex + 2];

      let bright = (r + g + b) / 3;
      let tIndex = floor(map(bright, 0, 255, 0, asciiChar.length));
      let t = asciiChar.charAt(tIndex);

      let x = i * w + w / 2;
      let y = j * h + h / 2;

      let c = baseColor;

      // Check all diffusions
      for (let d of diffusions) {
        let elapsed = frameCount - d.frame;
        let radius = elapsed * speed;
        if (dist(x, y, d.x, d.y) < radius) {
          c = d.color;
        }
      }

      fill(c);
      noStroke();
      text(t, x, y);
    }
  }
}

function mousePressed() {
  diffusions.push({
    x: mouseX,
    y: mouseY,
    frame: frameCount,
    color: random() < 0.5 ? color(0) : color(228, 34, 23)
  });
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  w = width / video.width;
  h = height / video.height;
}

