// courtesy of enickles from source: https://js6450.github.io/audio-viz/index.html, then tweaked

let mic;
let amp;

let x = 0;
let y = 50;

function setup() {
  createCanvas(windowWidth, windowHeight);

  //create & start an audio input
  mic = new p5.AudioIn();
  mic.start();

  //create an amplitude object that will use mic as input
  amp = new p5.Amplitude();
  amp.setInput(mic);

  background(255);
}

function draw() {
  //get the level of amplitude of the mic
  let level = amp.getLevel();

  stroke(0, 128, 0, 50);
  fill(0, 128, 0, 10);
  //draw ellipse in the middle of canvas
  //use value of level for the width and height of ellipse
  ellipse(x, y, level * width / 2, level * width / 2);

  x += 2;

  if(x > width){
    x = 0;
    y += 50;
  }

  if(y > height){
    y = 0;
  }
}

function mousePressed() {
    userStartAudio();
  }
  
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
  }
  