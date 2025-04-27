"use strict";

// This property only exists in non-minified p5
// @ts-expect-error
p5.disableFriendlyErrors = true;

const shouldDrawTrails = true;
const shouldDrawStars = true;
let shouldPlaySound = false;
let soundNotYetEnabledByGesture = true;

let trackedVehicle: Vehicle;

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

function setup() {
    createCanvas(windowWidth, windowHeight);

    cameraPos = createVector(0, 0);
    frameRate(60);
    angleMode(RADIANS);

    setupStandardColours();

    randomizeBigPalette();

    setPaletteForResources();
    //vehicles.push(createVehicle());
    createVehicles(gNumVehicles);
    createAsteroids(10 * numberOfWorldPages());
    createStarfield();
    ellipseMode(CENTER);
    rectMode(CENTER);
}

function draw() {
    background(15);
    drawAll();
    updateAll();
}

function drawAll() {
    push();
    if (shouldDrawStars) {
        drawStarfield();
    }

    drawGridLines();
    orbs.forEach((o) => drawOrb(o));

    const shotsToDraw = gShots.filter(
        (s) => s.live && distFromCamera(s.pos) < width,
    );

    shotsToDraw.forEach(drawShot);
    asteroids.forEach(drawAsteroid);
    vehicles.forEach(drawVehicle);

    //Draw targets of vehicles
    vehicles
        .filter((v) => v.target && v.target.live)
        .forEach((v) => drawTarget(v.target));

    pop();

    drawHUD();
}
function updateAll() {
    gShots.forEach(updateShot);
    vehicles.forEach(updateVehicle);
    asteroids.forEach(updateAsteroid);
    orbs.forEach(updateOrb);
    updateCamera(cameraPos, trackedVehicle);

    trackedVehicle = vehicles.find((v: Vehicle) => v.hp > 0);
    updateEngineWhistleSound();
}

function keyPressed() {
    switch (key) {
        case "m":
            toggleMute();
            break;
        case "r":
            randomizePalette();
            break;
        case "o":
            if (trackedVehicle) {
                addOrb(trackedVehicle);
            }
            break;
        case "b":
            randomizeMonoPalette();
            redraw();
            break;
        case "p":
            togglePause();
            break;
    }
}

function mouseMoved() {}
function mousePressed() {
    if (shouldPlaySound && soundNotYetEnabledByGesture) {
        soundNotYetEnabledByGesture = false;
        setupSound();
    }

    addAsteroid({ pos: mouseWorldPos() });
}

const resTypes: ResourceType[] = [
    { label: "fuel", hue: 55, color: null },
    { label: "laser", hue: 30, color: null },
    { label: "explosive", hue: 0, color: null },
    { label: "magic", hue: 80, color: null },
];
function togglePause() {
    //function to toggle the running of this p5 sketch
    if (isLooping()) {
        noLoop();
    } else {
        loop();
    }
}
