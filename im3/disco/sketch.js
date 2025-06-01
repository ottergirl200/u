// courtesy of Patt Vira from https://youtu.be/uctX1P3H3xM?si=7wVuzcgAS9bobG1S, then tweaked

let mic, amplitude;
let sizes = [];
let cols, rows, size = 10;
let xoff = 0, yoff = 0, inc = 0.1;
let zoff = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  rectMode(CENTER);

  // mic setup
  mic = new p5.AudioIn();
  mic.start();

  amplitude = new p5.Amplitude();
  amplitude.setInput(mic);

  cols = width / size;
  rows = height / size;
}

function draw() {
  background(255);

  // get mic volume (typically 0.0 to ~0.3+)
  let level = amplitude.getLevel();
  let scale = map(level, 0, 0.1, 0.5, 3); // control how reactive the grid is

  xoff = 0;
  for (let i = 0; i < cols; i++) {
    sizes[i] = [];
    yoff = 0;
    for (let j = 0; j < rows; j++) {
      let n = noise(xoff, yoff, zoff);
      sizes[i][j] = map(n, 0, 1, 0, size * 1.7 * scale);

      let r = noise(xoff, yoff, zoff) * 10;
      let g = noise(xoff + 15, yoff + 15, zoff) * 255;
      let b = noise(xoff + 30, yoff + 30, zoff) * 10;

      fill(r, g, b);
      noStroke();
      rect(size / 2 + i * size, size / 2 + j * size, sizes[i][j], sizes[i][j]);

      yoff += inc;
    }
    xoff += inc;
  }

  zoff += 0.01;
}

// ensure mic works after user interaction
function mousePressed() {
  userStartAudio();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  cols = width / size;
  rows = height / size;
}

