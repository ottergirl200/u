let arrow;
let video;

let imgs = [];
let totalImgs = 16;
let scrollY = 0;

let leftImgs = [], rightImgs = [], topImgs = [], bottomImgs = [];

let leftScales = [], rightScales = [], topScales = [], bottomScales = [];

let links = [
  "https://au.indeed.com/",
  "https://onlyfans.com/onlyfans",
  "https://en.wikipedia.org/wiki/Black_Mirror",
  "https://www.imdb.com/title/tt0500092/",
  "https://www.youtube.com/watch?v=oxZxe092eqo",
  "https://www.youtube.com/watch?v=2bUwDL2VHKE",
  "https://wwwwwwwww.jodi.org/",
  "https://www.jimpunk.com/",
  "https://au.shein.com/",
  "https://www.goodreads.com/book/show/415459.I_Have_No_Mouth_I_Must_Scream",
  "https://www.bram.org/",
  "https://chatgpt.com/?model=auto",
  "https://en.akinator.com/",
  "https://no-content.org/#",
  "https://www.addictinggames.com/",
  "https://potatoland.org/riot/",
  "https://web.archive.org/web/20150327125414/http://www.windows93.net/",
  "https://drandrewhuang.wordpress.com/2020/09/07/technology-is-neither-good-nor-bad-nor-is-it-neutral-notes-on-technology-and-history-kranzbergs-laws/",
  "https://h5.g123.jp/game/highschool?lang=en",
  "https://www.youtube.com/watch?v=KFI_Fl1sRWg",
];

function preload() {
  for (let i = 1; i <= totalImgs; i++) {
    imgs.push(loadImage(`data/img${i}.gif`));
  }
  
  arrow = loadImage('data/redarrow.png');
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  textureMode(NORMAL);
  noStroke();
  
  video = createVideo(['data/int-media_1.mp4']);
  video.loop(); 
  video.hide(); 
  video.volume(0);
  video.play();

  leftImgs = imgs.slice(0, 4);
  rightImgs = imgs.slice(4, 8);
  topImgs = imgs.slice(8, 12);
  bottomImgs = imgs.slice(12, 16);

  leftScales = new Array(leftImgs.length).fill(1);
  rightScales = new Array(rightImgs.length).fill(1);
  topScales = new Array(topImgs.length).fill(1);
  bottomScales = new Array(bottomImgs.length).fill(1);

}

function draw() {
  let camZ = (height / 2.0) / tan(PI * 30.0 / 180.0);
  camera(0, 0, camZ, 0, 0, 0, 0, 1, 0);
  
  background(255);
  
  push();
  translate(0, 0, -camZ + 1);
  texture(video);
  plane(width * 2, height * 2); 
  pop();
  
  drawScrollingColumn(leftImgs, -200, 1, scrollY, leftScales);     // scroll up
  drawScrollingColumn(rightImgs, 200, -1, scrollY, rightScales);   // scroll down, invert scale

  drawScrollingRow(topImgs, -200, 1, scrollY, topScales);          // scroll right
  drawScrollingRow(bottomImgs, 200, -1, scrollY, bottomScales);    // scroll left, invert scale

  push();
  let arrowPos = createVector(mouseX - width / 2, mouseY - height / 2); 
  translate(arrowPos.x, arrowPos.y, 1); 
  noStroke();
  texture(arrow);
  plane(1000, 1000); 
  pop();

}

function drawScrollingColumn(imgArray, x, dir, scroll, scaleArray) {
  let spacing = 160;
  let totalHeight = imgArray.length * spacing;

  for (let i = 0; i < imgArray.length; i++) {
    let rawY = ((dir * i * spacing - scroll) % totalHeight + totalHeight) % totalHeight;
    let y = rawY - height / 2;

    let scaleFactor = dir === -1
      ? map(y, -height / 2, height / 2, 1.5, 0.5)
      : map(y, -height / 2, height / 2, 0.5, 1.5);

    let baseW = 120 * scaleFactor;
    let baseH = 120 * scaleFactor;

    let hovered = isMouseOverImage(x, y, baseW, baseH);
    let targetScale = hovered ? 1.2 : 1.0;
    scaleArray[i] = lerp(scaleArray[i], targetScale, 0.1);

    push();
    translate(x, y, 0);
    drawWarpedImage(imgArray[i], baseW * scaleArray[i], baseH * scaleArray[i]);
    pop();
  }
}

function drawScrollingRow(imgArray, y, dir, scroll, scaleArray) {
  let spacing = 160;
  let totalWidth = imgArray.length * spacing;
  let scrollX = scroll * 0.8 * dir;  

  for (let i = 0; i < imgArray.length; i++) {
    let rawX = ((i * spacing + scrollX) % totalWidth + totalWidth) % totalWidth;
    let x = rawX - width / 2;

    let scaleFactor = dir === -1
      ? map(x, -width / 2, width / 2, 1.5, 0.5)
      : map(x, -width / 2, width / 2, 0.5, 1.5);

    let baseW = 120 * scaleFactor;
    let baseH = 120 * scaleFactor;

    let hovered = isMouseOverImage(x, y, baseW, baseH);
    let targetScale = hovered ? 1.2 : 1.0;
    scaleArray[i] = lerp(scaleArray[i], targetScale, 0.1);

    push();
    translate(x, y, 0);
    drawWarpedImage(imgArray[i], baseW * scaleArray[i], baseH * scaleArray[i]);
    pop();
  }
}

function drawWarpedImage(img, w, h) {
  texture(img);
  beginShape();
  vertex(-w / 2, -h / 2, 0, 0, 0);
  vertex(w / 2, -h / 2, 0, 1, 0);
  vertex(w / 2, h / 2, 0, 1, 1);
  vertex(-w / 2, h / 2, 0, 0, 1);
  endShape(CLOSE);
}

function isMouseOverImage(x, y, w, h) {
  let mx = mouseX - width / 2;
  let my = mouseY - height / 2;
  return mx > x - w / 2 && mx < x + w / 2 && my > y - h / 2 && my < y + h / 2;
}

function mousePressed() {
  let mx = mouseX - width / 2;
  let my = mouseY - height / 2;

  let candidates = [];

  function checkHover(imgArray, posFunc, scaleArray, dir = 1, isRow = false) {
    let spacing = 160;
    let totalLength = imgArray.length * spacing;
    for (let i = 0; i < imgArray.length; i++) {
      let pos = ((dir * i * spacing - scrollY * (isRow ? 0.8 : 1)) % totalLength + totalLength) % totalLength;
      pos -= isRow ? width / 2 : height / 2;

      let scaleFactor = dir === -1
        ? map(pos, isRow ? -width / 2 : -height / 2, isRow ? width / 2 : height / 2, 1.5, 0.5)
        : map(pos, isRow ? -width / 2 : -height / 2, isRow ? width / 2 : height / 2, 0.5, 1.5);

      let baseW = 120 * scaleFactor * scaleArray[i];
      let baseH = 120 * scaleFactor * scaleArray[i];

      let x = isRow ? pos : (isRow ? 0 : dir === 1 ? -200 : 200);
      let y = isRow ? (dir === 1 ? -200 : 200) : pos;

      if (isMouseOverImage(x, y, baseW, baseH)) {
        candidates.push(true);
      }
    }
  }

  checkHover(leftImgs, null, leftScales, 1, false);
  checkHover(rightImgs, null, rightScales, -1, false);
  checkHover(topImgs, null, topScales, 1, true);
  checkHover(bottomImgs, null, bottomScales, -1, true);

  if (candidates.length > 0) {
    let randLink = random(links);
    window.open(randLink, "_blank");
  }
}

function mouseWheel(event) {
  scrollY += event.delta;
  return false;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
