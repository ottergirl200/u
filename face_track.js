//courtesy of Karen Anne then tweaked

let faceapi;
let detections = [];

let video;
let canvas;

let redirectTimerStarted = false;
let redirectStartTime = 0;
let redirectDelay = 3000; // 3 seconds

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  background(255);
  canvas.id("canvas");
  video = createCapture(VIDEO);
  video.id("video");
  video.size(width, height);

  const faceOptions = {
    withLandmarks: true,
    withExpressions: true,
    withDescriptors: true,
    minConfidence: 0.5
  };
  faceapi = ml5.faceApi(video, faceOptions, faceReady);
}

function faceReady() {
  faceapi.detect(gotFaces);
}

function gotFaces(error, result) {
  if (error) {
    console.log(error);
    return;
  }

  detections = result;
  clear();
  drawBoxs(detections);
  drawLandmarks(detections);
  drawExpressions(detections, width / 10, height / 2, 20);

  faceapi.detect(gotFaces); 
}

function drawBoxs(detections) {
  if (detections.length > 0) {
    for (let f = 0; f < detections.length; f++) {
      let { _x, _y, _width, _height } = detections[f].alignedRect._box;
      stroke(228, 34, 23);
      strokeWeight(1);
      noFill();
      rect(_x, _y, _width, _height);
    }
  }
}

function drawLandmarks(detections) {
  if (detections.length > 0) {
    for (let f = 0; f < detections.length; f++) {
      let points = detections[f].landmarks.positions;
      for (let i = 0; i < points.length; i++) {
        stroke(228, 34, 23);
        strokeWeight(3);
        square(points[i]._x, points[i]._y, 2);
      }
    }
  }
}

function drawExpressions(detections, x, y, textYSpace){
  if(detections.length > 0){
    let expressions = detections[0].expressions;

    let expressionArray = Object.entries(expressions);
    expressionArray.sort((a, b) => b[1] - a[1]);
    let dominantExpression = expressionArray[0][0];
    let dominantConfidence = expressionArray[0][1];

    textFont('Helvetica Neue');
    textSize(14);
    noStroke();
    fill(228, 34, 23);

    for (let i = 0; i < expressionArray.length; i++) {
      let [expr, confidence] = expressionArray[i];
    
      if (expr === "sad") {
        fill(0); 
      } else {
        fill(228, 34, 23); 
      }
    
      text(`${expr}: ${nf(confidence * 100, 2, 2)}%`, x, y + textYSpace * i);
    }

    textSize(100);
    // fill(228, 34, 23);
    textAlign(CENTER);

    let message = "";
    switch (dominantExpression) {
      case "happy":
        message = "beautiful!";
        break;
      case "angry":
        message = "why so?";
        break;
      case "sad":
        message = "want to move on?";
        if (!redirectTimerStarted) {
          redirectTimerStarted = true;
          redirectStartTime = millis();
        }
        break;
      case "neutral":
        message = "i feel the same.";
        break;
      case "surprised":
        message = "boo!";
        break;
      case "fearful":
      case "disgusted":
        message = "of me? or of yourself?";
        break;
      default:
        message = "Feeling something?";
    }

    text(message, width/2, height - 60);

    // Handle redirect after 3 seconds if sadness detected
    if (redirectTimerStarted && millis() - redirectStartTime > redirectDelay) {
      window.location.href = "implantation3.html";
    }

  } else {
    // No face detected
    textFont('Helvetica Neue');
    textSize(20);
    fill(255, 0, 0);
    textAlign(CENTER);
    text("No face detected", width/2, height-60);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  video.size(windowWidth, windowHeight);
}
