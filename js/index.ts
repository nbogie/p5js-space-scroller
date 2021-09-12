"use strict";


// This property only exists in non-minified p5
// @ts-expect-error
p5.disableFriendlyErrors = true;


const shouldDrawTrails = true;
const shouldDrawStars = false;
const shouldPlaySound = false;

let trackedVehicle: Vehicle;

let shootOsc: p5.Oscillator;
let shootEnv: p5.Envelope;

const stars: Star[] = [];
const vehicles: Vehicle[] = [];
const asteroids: Asteroid[] = [];
const gTargets: Target[] = [];
const orbs: Orb[] = [];
const gNumTargets: number = 6;
const gNumVehicles: number = 6;
const gAsteroids = [];
const gShots: Shot[] = [];
const worldWidth: number = 6000;
const worldHeight: number = 5000;

let cameraPos: p5.Vector;
let cameraMoveSpeed: number = 5;
const maxScreenShakeAmount: number = 10;

let screenShakeAmount = 0;

let gPalette: Palette;

function setup() {
  createCanvas(windowWidth, windowHeight);
  setupSound();
  cameraPos = createVector(0, 0);
  frameRate(60);
  angleMode(RADIANS);
  randomizeBigPalette();
  setPaletteForResources();
  //vehicles.push(createVehicle());
  createVehicles(gNumVehicles);
  createAsteroids(10 * numberOfWorldPages());
  createStarfield();

  background("black");
  ellipseMode(CENTER);
  rectMode(CENTER);
}

function draw() {
  background(0);
  push();
  if (shouldDrawStars) {
    drawStarfield();
  }

  drawGridLines();
  orbs.forEach(o => drawOrb(o));
  const filteredShots = gShots.filter(
    s => s.live && distFromCamera(s.pos) < width
  );

  filteredShots.forEach(drawShot);
  asteroids.forEach(drawAsteroid);
  vehicles.forEach(drawVehicle);

  trackedVehicle = vehicles.find((v: Vehicle) => v.hp > 0);

  vehicles
    .filter(v => v.target && v.target.live)
    .forEach(v => drawTarget(v.target));
  pop();

  fill("white");
  textSize(12);

  if (trackedVehicle) {
    text("Health: " + trackedVehicle.hp, width - 100, 50);
  }
  text(Math.round(frameRate()) + " fps", 50, 575);

  text(
    "Camera: " +
    JSON.stringify({
      x: Math.round(cameraPos.x),
      y: Math.round(cameraPos.y)
    }),
    50,
    600
  );

  gShots.forEach(updateShot);
  vehicles.forEach(updateVehicle);
  asteroids.forEach(updateAsteroid);
  orbs.forEach(updateOrb);
  updateCamera(cameraPos, trackedVehicle);
}

function keyPressed() {
  switch (key) {
    case "r":
      randomizePalette();
      redraw();
    case "o":
      if (trackedVehicle) {
        addOrb(trackedVehicle);
      }
      break;
    case "m":
      randomizeMonoPalette();
      redraw();
      break;
  }
}


const resTypes: ResourceType[] = [
  { label: "fuel", hue: 55, color: null },
  { label: "laser", hue: 30, color: null },
  { label: "explosive", hue: 0, color: null },
  { label: "magic", hue: 80, color: null }
];


function numberOfWorldPages() {
  return Math.pow(worldWidth / width, 2);
}


function randomPos(): p5.Vector {
  return createVector(random(width), random(height));
}
function randomWorldPos(): p5.Vector {
  return createVector(
    random(-worldWidth / 2, worldWidth / 2),
    random(-worldHeight / 2, worldHeight / 2)
  );
}




function getColorForShipHP(hp: number) {
  return lerpColor(color("red"), color("green"), (max(hp, 20) - 20) / 100);
}

function drawVec(
  vec: p5.Vector,
  len: number,
  minMag: number,
  maxMag: number,
  c: p5.Color,
  lineWidth: number = 1
) {
  push();
  rotate(vec.heading());
  stroke(c);
  strokeWeight(lineWidth);
  line(0, 0, map(vec.mag(), 0, maxMag, 0, len), 0);
  pop();
}
function addTarget(pos: Target) {
  gTargets.unshift(pos);
  gTargets.splice(gNumTargets);
  vehicles.forEach((v, ix) => {
    v.target = gTargets[ix % gTargets.length];
  });
}
function mouseWorldPos(): p5.Vector {
  return cameraPos.copy().add(mousePos());
}

function mousePos(): p5.Vector {
  return createVector(mouseX, mouseY);
}

function mouseMoved() { }
function mousePressed() {
  addAsteroid({ pos: mouseWorldPos() });
}
function isColliding(a: Collidable, s: Collidable) {
  return dist(a.pos.x, a.pos.y, s.pos.x, s.pos.y) < a.radius + s.radius;
}


function acquireTarget(vehicle: Vehicle) {
  const closeAsteroids = asteroids.filter(
    a => a.pos.dist(vehicle.pos) < height
  );
  return random(closeAsteroids.length > 0 ? closeAsteroids : asteroids);
}



function drawGridLines() {
  const numCols = (8 * worldWidth) / width;
  const numRows = (8 * worldHeight) / width;
  for (let col = 0; col < numCols; col++) {
    for (let row = 0; row < numRows; row++) {
      const pos = createVector(
        (col * width) / 2 - worldWidth / 2,
        (row * width) / 2 - worldHeight / 2
      );
      push();
      translateForScreenCoords(pos);
      strokeWeight(0.1);
      colorMode(RGB, 255);
      stroke(color(255, 255, 255, 120));
      line(0, -width / 2, 0, width / 2);
      line(-width / 2, 0, width / 2, 0);
      pop();
    }
  }
}

function drawTarget(t: Target) {
  push();

  translateForScreenCoords(t.pos);
  noFill();
  colorMode(HSB, 100);

  stroke(0, 100, 100);
  circle(0, 0, 25);
  drawTargetPetals(4, (ix: number) => {
    repeat(3, (jx: number) => {
      push();
      translate(jx * 4 + 8, 0);
      line(0, -2 * jx, 0, 2 * jx);
      pop();
    });
  });

  pop();
}
function drawTargetPetals(numPetals: number, fn: (ix: number) => void) {
  const angle = TWO_PI / numPetals;
  push();
  repeat(numPetals, (ix: number) => {
    fn(ix);
    rotate(angle);
  });
  pop();
}
