// let capture;

// function setup() {
//   createCanvas(windowWidth, windowHeight);
//   capture = createCapture(VIDEO);
//   capture.hide();
// }

// function draw() {
//   image(capture, 0, 0, windowWidth, windowHeight);
//   filter(INVERT);
// }

// function windowResized() {
//   resizeCanvas(windowWidth, windowHeight);
// }

let capture;

function setup() {
  createCanvas(windowWidth, windowHeight);
  capture = createCapture(VIDEO);
  capture.size(windowWidth, windowHeight);
  capture.hide();
  pixelDensity(1);
}

function draw() {
  capture.loadPixels();
  loadPixels();

  for (let y = 0; y < capture.height; y++) {
    for (let x = 0; x < capture.width; x++) {
      let index = (x + y * capture.width) * 4;
      let r = capture.pixels[index + 0];
      let g = capture.pixels[index + 1];
      let b = capture.pixels[index + 2];

      // Get grayscale brightness
      let brightness = (r + g + b) / 3;

      // Map to thermal color
      let heatColor = thermalColorMap(brightness);

      // Set pixel
      pixels[index + 0] = red(heatColor);
      pixels[index + 1] = green(heatColor);
      pixels[index + 2] = blue(heatColor);
      pixels[index + 3] = 255;
    }
  }

  updatePixels();
}

// Smooth thermal gradient mapping
function thermalColorMap(val) {
  val = 255 - constrain(val, 0, 255);
  let t = val / 255;

  // Define color stops (simulate thermal camera palette)
  const stops = [
    color(100, 0, 0),      // dark red
    color(200, 0, 0),      // red
    color(255, 85, 0),     // orange
    color(255, 200, 0),    // yellow
    color(255, 255, 255)   // white hot
  ];

  let i = floor(t * (stops.length - 1));
  let lerpAmt = (t * (stops.length - 1)) - i;
  return lerpColor(stops[i], stops[min(i + 1, stops.length - 1)], lerpAmt);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  capture.size(windowWidth, windowHeight);
}
