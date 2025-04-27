"use strict";

// This property only exists in non-minified p5
// @ts-expect-error
p5.disableFriendlyErrors = true;

const shouldDrawTrails = true;
const shouldDrawStars = true;
let shouldPlaySound = false;
let soundNotYetEnabledByGesture = true;

let world: World;

function setup() {
    createCanvas(windowWidth, windowHeight);
    world = createWorld();
    world.cameraPos = createVector(0, 0);
    frameRate(60);
    angleMode(RADIANS);

    setupStandardColours();

    randomizeBigPalette();

    setPaletteForResources();
    //vehicles.push(createVehicle());
    createVehicles(world.gNumVehicles);
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

function createWorld() {
    const stars: Star[] = [];
    const vehicles: Vehicle[] = [];
    const asteroids: Asteroid[] = [];
    const gTargets: Target[] = [];
    const orbs: Orb[] = [];
    const gNumTargets: number = 6;
    const gNumVehicles: number = 6;
    const gAsteroids: Asteroid[] = [];
    const gShots: Shot[] = [];
    const worldWidth: number = 6000;
    const worldHeight: number = 5000;

    //camera stuff
    let cameraPos: p5.Vector;
    let cameraMoveSpeed: number = 5;
    const maxScreenShakeAmount: number = 10;
    let screenShakeAmount = 0;
    const trackedVehicle: Vehicle = undefined;
    const newWorld = {
        stars,
        vehicles,
        asteroids,
        trackedVehicle,
        gTargets,
        orbs,
        gNumTargets,
        gNumVehicles,
        gAsteroids,
        gShots,
        worldWidth,
        worldHeight,
        cameraPos,
        cameraMoveSpeed,
        maxScreenShakeAmount,
        screenShakeAmount,
    };
    return newWorld;
}

function drawAll() {
    push();
    if (shouldDrawStars) {
        drawStarfield();
    }

    drawGridLines();
    world.orbs.forEach((o) => drawOrb(o));

    const shotsToDraw = world.gShots.filter(
        (s) => s.live && distFromCamera(s.pos) < width,
    );

    shotsToDraw.forEach(drawShot);
    world.asteroids.forEach(drawAsteroid);
    world.vehicles.forEach(drawVehicle);

    //Draw targets of vehicles
    world.vehicles
        .filter((v) => v.target && v.target.live)
        .forEach((v) => drawTarget(v.target));

    pop();

    drawHUD();
}
function updateAll() {
    world.gShots.forEach(updateShot);
    world.vehicles.forEach(updateVehicle);
    world.asteroids.forEach(updateAsteroid);
    world.orbs.forEach(updateOrb);
    updateCamera(world.cameraPos, world.trackedVehicle);

    world.trackedVehicle = world.vehicles.find((v: Vehicle) => v.hp > 0);
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
            if (world.trackedVehicle) {
                addOrb(world.trackedVehicle);
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
    if (isLooping()) {
        noLoop();
    } else {
        loop();
    }
}
