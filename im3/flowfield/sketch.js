// courtesy of Patt Vira from https://youtu.be/KOgRn2Brcdo?si=76lMA65O4XGbZ9oG, then tweaked

let mic, amplitude;
let cols, rows, size = 50;
let arrows = [], r = size / 2;
let xoff = 0, yoff = 0, zoff = 0, increment = 0.1;

let particles = [];
let num = 100;

function setup() {
  createCanvas(windowWidth, windowHeight);
  cols = floor(width / size);
  rows = floor(height / size);
  angleMode(DEGREES);

  mic = new p5.AudioIn();
  mic.start();
  mic.amp(2.0);

  amplitude = new p5.Amplitude();
  amplitude.setInput(mic);

  for (let i = 0; i < num; i++) {
    particles[i] = new Particle(random(width), random(height));
  }

  background(255, 255, 255, 10);
}

// function draw() {

//   console.log(level);

//   // let level = amplitude.getLevel();
//   // // let levelMapped = map(level, 0, 0.3, 0.0001, 0.01); // sensitivity
//   // let levelMapped = map(level, 0, 0.3, 0.001, 0.03);
//   // zoff += levelMapped;

//   // generateFlowField();
//   let level = amplitude.getLevel();
//   let levelMapped = map(level, 0, 0.3, 0.001, 0.03);
//   let strength = map(level, 0, 0.3, 0.3, 2); // ← NEW
//   zoff += levelMapped;

//   generateFlowField(strength); // ← PASS strength

//   for (let i = 0; i < num; i++) {
//     particles[i].follow(arrows);
//     particles[i].update();
//     particles[i].checkEdges();
//     particles[i].display(level);
//   }
// }

function draw() {
  let level = amplitude.getLevel();
  let levelMapped = map(level, 0, 0.1, 0.001, 0.03);
  let strength = map(level, 0, 0.1, 0.5, 4);
  zoff += levelMapped;

  generateFlowField(strength); // Pass strength into field gen

  for (let i = 0; i < num; i++) {
    particles[i].follow(arrows);
    particles[i].update();
    particles[i].checkEdges();
    particles[i].display(level); // ← level is in scope here
  }
}

// function generateFlowField() {
//   xoff = 0;
//   for (let i = 0; i < cols; i++) {
//     arrows[i] = [];
//     yoff = 0;
//     for (let j = 0; j < rows; j++) {
//       let angle = map(noise(xoff, yoff, zoff), 0, 1, 0, 360);
//       // let v = p5.Vector.fromAngle(radians(angle));
//       let v = p5.Vector.fromAngle(radians(angle));
//       v.setMag(0.5); // ← ADDED: make vector stronger 
//       arrows[i][j] = v;
//       yoff += increment;
//     }
//     xoff += increment;
//   }
// }

function generateFlowField(strength) {
  xoff = 0;
  for (let i = 0; i < cols; i++) {
    arrows[i] = [];
    yoff = 0;
    for (let j = 0; j < rows; j++) {
      let angle = map(noise(xoff, yoff, zoff), 0, 1, 0, 360);
      let v = p5.Vector.fromAngle(radians(angle));
      v.setMag(strength); // ← Use mic-reactive strength
      arrows[i][j] = v;
      yoff += increment;
    }
    xoff += increment;
  }
}

class Particle {
  constructor(x, y) {
    this.pos = createVector(x, y);
    // this.vel = createVector(0, 0);
    this.vel = p5.Vector.random2D().mult(0.5); // ← ADDED randomness
    this.acc = createVector(0, 0);
    this.maxSpeed = 2;
  }

  follow(vectors) {
    let x = floor(this.pos.x / size);
    let y = floor(this.pos.y / size);
    if (x >= 0 && x < cols && y >= 0 && y < rows) {
      let force = vectors[x][y];
      this.applyForce(force);
    }
  }

  applyForce(force) {
    this.acc.add(force);
  }

  update() {
    this.vel.add(this.acc);
    this.vel.limit(this.maxSpeed);
    this.pos.add(this.vel);
    this.acc.mult(0);
  }

  // display() {
  //   // stroke(0, 128, 0, 50);
  //   stroke(0, 128, 0, map(level, 0, 0.3, 10, 255)); 
  //   strokeWeight(2);
  //   point(this.pos.x, this.pos.y);
  // }

  display(level) {
    let alpha = map(level, 0, 0.3, 10, 255);
    stroke(0, 128, 0, alpha);
    strokeWeight(2);
    point(this.pos.x, this.pos.y);
  }  

  // display(level) {
  //   let alpha = map(level, 0, 0.3, 30, 200);
  //   stroke(0, 128, 0, alpha);
  //   strokeWeight(2);
  //   point(this.pos.x, this.pos.y);
  // }

  checkEdges() {
    if (this.pos.x > width) this.pos.x = 0;
    if (this.pos.x < 0) this.pos.x = width;
    if (this.pos.y > height) this.pos.y = 0;
    if (this.pos.y < 0) this.pos.y = height;
  }
}

function mousePressed() {
  userStartAudio();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

