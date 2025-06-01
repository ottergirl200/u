// courtesy of justin_here from https://editor.p5js.org/justin_here/sketches/85IMO3j9G, then tweaked

const resolution = 0.1;

let palette;
let cells;
let pts;
let capture;

function setup() {
  createCanvas(windowWidth, windowHeight);

  palette = [
    color(100, 0, 0),      // dark red
    color(200, 0, 0),      // red
    color(255, 85, 0),     // orange
    color(255, 200, 0),    // yellow
    color(255, 255, 255)   // white 
  ];

  const gridVoronoi = new GridVoronoi(1 / resolution);
  cells = gridVoronoi.cells();
  pts = gridVoronoi.points.flat();

  capture = createCapture(VIDEO);
  capture.size(width, height);
  capture.hide();
}

function draw() {
  if (capture.loadedmetadata) {
    const img = capture.get(0, 0, capture.width, capture.height);

    for (let i = 0; i < cells.length; i++) {
      const p = pts[i];
      const px = floor(p.x * capture.width / width);
      const py = floor(p.y * capture.height / height);

      let c = img.get(px, py);
      let bright = (c[0] + c[1] + c[2]) / 3;

      let paletteIndex = floor(map(bright, 0, 255, 0, palette.length));
      paletteIndex = constrain(paletteIndex, 0, palette.length - 1);
      fill(palette[paletteIndex]);
      noStroke();

      beginShape();
      for (let v of cells[i]) {
        vertex(v.x, v.y);
      }
      endShape(CLOSE);
    }
  }
}

function points(size) {
  const rows = floor(height / size);
  const columns = floor(width / size);

  const points = [];
  for (let r = 0; r < rows; r++) {
    points.push([]);
    for (let c = 0; c < columns; c++) {
      points[r][c] = createVector(
        random(size * 0.15, size * 0.85) + c * size,
        random(size * 0.15, size * 0.85) + r * size
      );
    }
  }
  return points;
}

class GridVoronoi {
  constructor(size) {
    this.size = size;
    this.points = points(size);
  }

  cell(point) {
    const xi = floor(point.x / this.size);
    const yi = floor(point.y / this.size);

    const nbrIndices = [
      [-1, -1], [0, -1], [1, -1],
      [-1,  0],          [1,  0],
      [-1,  1], [0,  1], [1,  1]
    ];

    const neighbors = [];
    for (let nbrIdx of nbrIndices) {
      const row = this.points[nbrIdx[1] + yi];
      if (row !== undefined) {
        const p = row[nbrIdx[0] + xi];
        if (p !== undefined) {
          neighbors.push(p);
        }
      }
    }

    const w = max(width * 2, height * 2);
    const domains = neighbors.map(p => domain(point, p, w));
    return cell(domains);
  }

  cells() {
    return this.points.flat().map(p => this.cell(p));
  }
}

function squareVertices(w) {
  const halfW = w / 2;
  return [
    createVector(halfW, -halfW),
    createVector(halfW, halfW),
    createVector(-halfW, halfW),
    createVector(-halfW, -halfW),
  ];
}

function inConvex(convexVertices, p) {
  const firstZ = p5.Vector.cross(
    p5.Vector.sub(convexVertices[convexVertices.length - 1], p),
    p5.Vector.sub(convexVertices[0], p)
  ).z;

  for (let i = 0; i < convexVertices.length - 1; i++) {
    const z = p5.Vector.cross(
      p5.Vector.sub(convexVertices[i], p),
      p5.Vector.sub(convexVertices[i + 1], p)
    ).z;

    if (firstZ * z <= 0) {
      return false;
    }
  }
  return true;
}

function intersectionOf(line1, line2) {
  const v1 = p5.Vector.sub(line1.p2, line1.p1);
  const v2 = p5.Vector.sub(line2.p2, line2.p1);
  const v = p5.Vector.cross(v1, v2);

  if (v.mag() > 0) {
    const t = p5.Vector.cross(p5.Vector.sub(line2.p1, line1.p1), v2).z / v.z;
    const u = p5.Vector.cross(p5.Vector.sub(line1.p1, line2.p1), v1).z / -v.z;
    if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
      return p5.Vector.add(line1.p1, p5.Vector.mult(v1, t));
    }
  }
  return null;
}

function convexCenterPoint(convexVertices) {
  let x = 0;
  let y = 0;
  for (let i = 0; i < convexVertices.length; i++) {
    x += convexVertices[i].x;
    y += convexVertices[i].y;
  }
  return createVector(x / convexVertices.length, y / convexVertices.length);
}

function convexCtClk(convexVertices) {
  const p = convexCenterPoint(convexVertices);
  return convexVertices.sort((p1, p2) =>
    p5.Vector.sub(p1, p).heading() - p5.Vector.sub(p2, p).heading()
  );
}

function intersectionConvexLine(convexVertices, line) {
  const pts = [];
  for (
    let i = convexVertices.length - 1, j = 0;
    j < convexVertices.length;
    i = j++
  ) {
    const p = intersectionOf(
      line, { p1: convexVertices[i], p2: convexVertices[j] }
    );
    if (p !== null) {
      pts.push(p);
    }
  }
  return pts;
}

function convexIntersection(convexVertices1, convexVertices2) {
  let points = [];
  for (
    let i = convexVertices1.length - 1, j = 0;
    j < convexVertices1.length;
    i = j++
  ) {
    const pts = intersectionConvexLine(
      convexVertices2,
      { p1: convexVertices1[i], p2: convexVertices1[j] }
    );
    points = points.concat(pts);
  }

  points = points
    .concat(convexVertices1.filter(p => inConvex(convexVertices2, p)))
    .concat(convexVertices2.filter(p => inConvex(convexVertices1, p)));

  return convexCtClk(points);
}

function polygonRotate(vertices, angle) {
  return vertices.map(p => p5.Vector.rotate(p, angle));
}

function polygonTranslate(vertices, x, y) {
  return vertices.map(p => createVector(p.x + x, p.y + y));
}

function domain(me, p, w) {
  const sq = squareVertices(w);
  const halfW = w / 2;
  const v = p5.Vector.sub(p, me);
  const a = v.heading();
  const middlePt = p5.Vector.lerp(p, me, 0.5);
  const offset = p5.Vector.sub(middlePt, v.normalize().mult(halfW));

  return polygonTranslate(polygonRotate(sq, a), offset.x, offset.y);
}

function cell(domains) {
  let c = domains[0];
  for (let i = 1; i < domains.length; i++) {
    c = convexIntersection(c, domains[i]);
  }
  return c;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  capture.size(windowWidth, windowHeight);
}
