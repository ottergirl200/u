// courtesy of Patt Vira from https://editor.p5js.org/pattvira/sketches/UpBGiYqEa, then tweaked

let center; 
let angle = 0;
let letters = []; 
let cols; let rows; let size = 20; 

let video;
let faceMesh;
let faces = [];
let mouthX, mouthY, mouthW;

function preload() {
  faceMesh = ml5.faceMesh({ maxFaces: 1, flipped: false});
}

function gotFaces(results) {
  // console.log(results);
  faces = results;
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  video = createCapture(VIDEO);
  video.size(width, height);
  video.hide();

  faceMesh.detectStart(video, gotFaces);
  
  center = createVector(width/2, height/2);
  cols = width/size;
  rows = height/size;
  
  for (let i=0; i<cols; i++) {
    letters[i] = [];
    for (let j=0; j<rows; j++) {
      let x = i*size + size/2;
      let y = j*size + size/2;
      letters[i][j] = new Letter(x, y, 0.3);
    }
  }
}

function draw() {
  background(255);
  // image(video, 0, 0);

  if (faces.length > 0) {
    let face = faces[0];
    let keypoints = face.keypoints;
    let mouthTop = keypoints[13];
    let mouthBottom = keypoints[14];
    fill(0);
    mouthX = (mouthTop.x + mouthBottom.x)/2;
    mouthY = (mouthTop.y + mouthBottom.y)/2;
    mouthW = mouthBottom.y - mouthTop.y;
    ellipse(mouthX, mouthY, 10, 10);
    
    for (let i=0; i<keypoints.length; i++) {
      fill(0);
      noStroke();
      ellipse(keypoints[i].x, keypoints[i].y, 2, 2);
    }
    
  }
  
  center.x = mouthX; 
  center.y = mouthY;
  
  fill(228, 34, 23);
  ellipse(center.x, center.y, 10, 10);
  
  for (let i=0; i<cols; i++) {
    for (let j=0; j<rows; j++) {
      
      if (mouthW > 30) {
        letters[i][j].scl = 1;
      } else {
        if (letters[i][j].scl > 0.3) {
          letters[i][j].scl -= 0.01;
        } else {
          letters[i][j].scl = 0.3;
        }
        
      }
      letters[i][j].display();
    }
  }
  
  angle += 0.005;
  
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  video.size(windowWidth, windowHeight);
}







