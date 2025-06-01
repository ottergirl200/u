// courtesy from justin_here from https://editor.p5js.org/justin_here/sketches/LWxoqu5_z, then tweaked

let capture;
function setup() {
  createCanvas(windowWidth, windowHeight);
  capture = createCapture(VIDEO); 
  capture.hide();                 
}

const resolution = 0.15; 
function draw() {
  if(capture.loadedmetadata) {
    const img = capture.get(0, 0, capture.width, capture.height);

    img.resize(width * resolution, height * resolution);
    img.filter(GRAY);   
    const g = halftone(img, width, height, 1 / resolution);  
    image(g, 0, 0);
  }
}

function halftone(img, w, h, maxD = 1) {
  const sx = w / img.width;     
  const sy = h / img.height;    
  
  let g = createGraphics(w, h); 
  g.background(255);           
  g.fill(228, 34, 23); 
  g.noStroke();                 
  for(let y = 0; y < img.height; y++) {
    for(let x = 0; x < img.width; x++) {
      const level = img.get(x, y)[0];       
      const d = (255 - level) / 255 * maxD; 
      g.circle(x * sx, y * sy, d);         
    }
  }
  return g; 
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  video.size(windowWidth, windowHeight);
}

