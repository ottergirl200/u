let binaryText = "01110011\n01110100\n01100001\n01111001";
let decodedText = "won't you stay?\nwon't you stay?\nwon't you stay?\nwon't you stay?\nwon't you stay?\nwon't you stay?\nwon't you stay?\nwon't you stay?\nwon't you stay?\nwon't you stay?";
let currentText = "";
let index = 0;
let mode = "binary";
let timer = 0;
let typeSpeed = 75;

let decodedStartTime = 0;
let fadeOpacity = 0;
let fading = false;

function setup() {
  createCanvas(windowWidth, windowHeight);
  textFont("Helvetica");
  textSize(24);
  fill(0);
  frameRate(60);
}

function draw() {
  background(255);
  textAlign(CENTER, CENTER);
  text(currentText, width / 2, height / 3);

  if (mode === "binary") {
    if (frameCount % int(typeSpeed / (1000 / 60)) === 0) {
      if (index < binaryText.length) {
        currentText += binaryText.charAt(index);
        index++;
      } else {
        mode = "pause";
        timer = millis();
      }
    }
  }

  else if (mode === "pause") {
    if (millis() - timer > 1000) {
      currentText = "";
      index = 0;
      mode = "decoded";
      decodedStartTime = millis(); 
    }
  }

  else if (mode === "decoded") {
    if (frameCount % int(typeSpeed / (1000 / 60)) === 0) {
      if (index < decodedText.length) {
        currentText += decodedText.charAt(index);
        index++;
      }
    }

    if (millis() - decodedStartTime > 5000) {
      fading = true;
    }
  }

  if (fading) {
    fadeOpacity += 1;
    fadeOpacity = constrain(fadeOpacity, 0, 255);
    fill(0, fadeOpacity);
    rect(0, 0, width, height);
  }
}
