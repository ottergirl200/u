//  courtesy of Patt Vira from https://youtu.be/fN0Wa9mvT60?si=idUHwsOwH2XVs2gq, then tweaked

let mic, amplitude;
let sizes = [];
let cols = 20, rows = 20, size = 30;
let xoff = 0, yoff = 0, inc = 0.1;
let zoff = 0;
let h = baseHeight * scaleFactor * 2; // twice as tall and modulated by mic

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  rectMode(CENTER);
  angleMode(DEGREES);

  mic = new p5.AudioIn();
  mic.start();
  amplitude = new p5.Amplitude();
  amplitude.setInput(mic);
}

function draw() {
  background(255);

  let level = amplitude.getLevel(); // volume (0.0 to ~1.0)
  let scaleFactor = map(level, 0, 0.3, 0.5, 2); // sensitivity

  rotateX(135);
  rotateY(-45);

  noStroke();

  xoff = 0;
  for (let i = 0; i < cols; i++) {
    sizes[i] = [];
    yoff = 0;
    for (let j = 0; j < rows; j++) {
      let baseHeight = map(noise(xoff, yoff, zoff), 0, 1, 10, 100);
      let h = baseHeight * scaleFactor; // modulate by mic input
      sizes[i][j] = h;

      push();
      translate(
        i * size - (cols * size) / 2,
        h, // center on Y
        j * size - (rows * size) / 2
      );
      drawCustomBox(size, h*2, size);
      pop();

      yoff += inc;
    }
    xoff += inc;
  }

  zoff += 0.01;
}

function drawCustomBox(w, h, d) {
  let hw = w / 2;
  let hh = h / 2;
  let hd = d / 2;

  let vertices = [
    createVector(-hw, -hh, -hd),
    createVector(hw, -hh, -hd),
    createVector(hw, -hh, hd),
    createVector(-hw, -hh, hd),
    createVector(-hw, hh, -hd),
    createVector(hw, hh, -hd),
    createVector(hw, hh, hd),
    createVector(-hw, hh, hd),
  ];

  let faces = [
    [0, 1, 2, 3], // top
    [4, 5, 6, 7], // bottom
    [0, 1, 5, 4], // front
    [1, 2, 6, 5], // right
    [2, 3, 7, 6], // back
    [3, 0, 4, 7]  // left
  ];

  let faceColors = [
    color(0, 128, 0),   // top
    color(0, 128, 0),         // bottom
    color(0, 100, 0),         // front
    color(0, 100, 0),         // right
    color(0, 100, 0),         // back
    color(0, 100, 0)          // left
  ];

  for (let i = 0; i < faces.length; i++) {
    fill(faceColors[i]);
    beginShape();
    for (let j = 0; j < 4; j++) {
      let v = vertices[faces[i][j]];
      vertex(v.x, v.y, v.z);
    }
    endShape(CLOSE);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function mousePressed() {
  userStartAudio(); 
}
