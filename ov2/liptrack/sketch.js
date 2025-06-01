// let video;
// let faceMesh;
// let faces = [];

// function preload() {
//   faceMesh = ml5.faceMesh({ maxFaces: 1, flipped: true });
// }

// function gotFaces(results) {
//   // console.log(results);
//   faces = results;
// }

// function setup() {
//   createCanvas(windowWidth, windowHeight);
//   video = createCapture(VIDEO, { flipped: true });
//   video.size(width, height);
//   video.hide();

//   faceMesh.detectStart(video, gotFaces);

//   console.log(ml5.version);
// }

// function mousePressed() {
//   console.log(faces);
// }

// function draw() {
//   background(220);
//   image(video, 0, 0);

//   if (faces.length > 0) {
//     let lips = faces[0].lips;
//     strokeWeight(4);
//     noFill();
//     stroke(255, 100, 255);
//     rect(lips.x, lips.y, lips.width, lips.height);
    
//     for (let lipPoint of lips.keypoints) {
//       strokeWeight(2);
//       stroke(0, 255, 0);
//       point(lipPoint.x, lipPoint.y);
//     }
    
    
//   }
// }

// function windowResized() {
//   resizeCanvas(windowWidth, windowHeight);
//   video.size(windowWidth, windowHeight);
// }

// courtesy of Patt Vira from , then tweaked https://editor.p5js.org/codingtrain/sketches/LdEmvXdGI

let video;
let faceMesh;
let faces = [];

function preload() {
  faceMesh = ml5.faceMesh({ maxFaces: 1, flipped: true });
}

function gotFaces(results) {
  faces = results;
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  video = createCapture(VIDEO, { flipped: true }); // mirror the video feed
  video.size(width, height); // match canvas size
  video.hide();

  faceMesh.detectStart(video, gotFaces);

  console.log('ml5 version:', ml5.version);
}

function draw() {
  background(255);

  // Mirror the video to match mirrored tracking
  push();
  translate(width, 0);
  scale(-1, 1);
  image(video, 0, 0, width, height);
  pop();

  if (faces.length > 0) {
    let lips = faces[0].lips;

    // Mirror the bounding box
    let mirroredX = width - (lips.x + lips.width);
    strokeWeight(1);
    noFill();
    stroke(228, 34, 23);
    rect(mirroredX, lips.y, lips.width, lips.height);

    // Draw text in the bounding box
    fill(228, 34, 23);
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(20);
    text("do you like\n to look at\n yourself?", mirroredX + lips.width / 2, lips.y + lips.height / 2);

    // Draw mirrored lip keypoints
    for (let lipPoint of lips.keypoints) {
      let mirroredPointX = width - lipPoint.x;
      strokeWeight(2);
      stroke(255, 24, 24);
      point(mirroredPointX, lipPoint.y);
    }
  }
}

function mousePressed() {
  console.log(faces);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  video.size(windowWidth, windowHeight);
}
