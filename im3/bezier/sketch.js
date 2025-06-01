// courtesy of Patt Vira from https://youtu.be/uctX1P3H3xM?si=7wVuzcgAS9bobG1S, then tweaked

let mic;
let amplitude;
let t = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  mic = new p5.AudioIn();
  mic.start();

  amplitude = new p5.Amplitude();
  amplitude.setInput(mic);

  noFill();
  strokeWeight(1);
  // stroke(0, 50);
  stroke(0, 128, 0, 50);
}

function draw() {
  background(255, 1);

  let level = amplitude.getLevel(); // mic level: 0–1
  let ampInfluence = map(level, 0, 0.1, 0, 1); 

  // slowly changing noise offset over time
  let speed = 0.005; 
  let x1 = noise(t + 5) * width;
  let y1 = noise(t + 10 + ampInfluence) * height;
  let x2 = noise(t + 15 + ampInfluence) * width;
  let y2 = noise(t + 20) * height;
  let x3 = noise(t + 25) * width;
  let y3 = noise(t + 30 + ampInfluence) * height;
  let x4 = noise(t + 35) * width;
  let y4 = noise(t + 40 + ampInfluence) * height;

  bezier(x1, y1, x2, y2, x3, y3, x4, y4);

  t += speed;
}

function touchStarted() {
  userStartAudio();
}

function mousePressed() {
  userStartAudio();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
