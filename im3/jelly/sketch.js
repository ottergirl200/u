// courtesy of Patt Vira from https://youtu.be/te5_28lG3r4?si=4TZNevG6jH3zQkaO, then tweaked

let mic, amplitude;
let r = 15; let angles = []; let cSize = 10; let num = 15; let t = 10;
let cols = 10; let rows = 10; let size = 25;
let xoff = 0; let yoff = 0; let inc = 0.7;

function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);

   // mic setup
   mic = new p5.AudioIn();
   mic.start();
 
   amplitude = new p5.Amplitude();
   amplitude.setInput(mic);

  xoff = 0;
  for (let i=0; i<cols; i++) {
    angles[i] = [];
    yoff = 0;
    for (let j=0; j<rows; j++) {
      angles[i][j] = 360*noise(xoff, yoff);
      yoff += inc;
    }
    xoff += inc;
  }
}
function draw() {
  background(255);
  translate(width / 2, height / 2);

  let level = amplitude.getLevel();
  let dynamicR = r + level * 2000; // mic controls spiral radius

  let tentacleParts = [];

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      for (let k = 0; k < num; k++) {
        let xmargin = i * size - size * cols / 2 + size / 2;
        let ymargin = j * size - size * rows / 2 + size / 2;
        let x = dynamicR * (k / (num - 1)) * cos(angles[i][j] + t * k);
        let y = dynamicR * (k / (num - 1)) * sin(angles[i][j] + t * k);

        let finalX = xmargin + x + (i - cols / 2) * k * 0.7;
        let finalY = ymargin + y + (j - rows / 2) * k * 0.7;

        let depth = (num - k) + i * 0.01 - j * 0.01;

        tentacleParts.push({
          x: finalX,
          y: finalY,
          size: cSize + k,
          color: color(0, 255 * k / (num - 1), 0),
          depth: -depth
        });
      }

      angles[i][j] += 4;
    }
  }

  tentacleParts.sort((a, b) => a.depth - b.depth);

  noStroke();
  for (let p of tentacleParts) {
    fill(p.color);
    ellipse(p.x, p.y, p.size, p.size);
  }
}

function mousePressed() {
  userStartAudio();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}



