"use strict";

// This property only exists in non-minified p5
// @ts-expect-error
p5.disableFriendlyErrors = true;

/** almost all game state (asteroids, ship, bullets, etc) */
let world: World;

/** contains user config like stars, trails, sound on/off */
let config: Config;

let soundNotYetEnabledByGesture = true;

function setup() {
    createCanvas(windowWidth, windowHeight);
    config = createConfig();

    world = createWorld();

    frameRate(60);
    angleMode(RADIANS);

    setupStandardColours();
    randomizeBigPalette();
    setPaletteForResources();

    createVehicles(world.MAX_NUM_VEHICLES);
    createAsteroids(30);
    createStarfield();
    ellipseMode(CENTER);
    rectMode(CENTER);
}

function draw() {
    background(15);
    drawAll();
    updateAll();
}
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function createConfig() {
    const newConfig = {
        shouldDrawTrails: true,
        shouldDrawStars: true,
        shouldPlaySound: false,
    };
    return newConfig;
}

function createWorld() {
    const stars: Star[] = [];
    const vehicles: Vehicle[] = [];
    const asteroids: Asteroid[] = [];
    const targets: Target[] = [];
    const orbs: Orb[] = [];
    const MAX_NUM_TARGETS: number = 6;
    const MAX_NUM_VEHICLES: number = 6;
    const shots: Shot[] = [];
    const worldWidth: number = 6000;
    const worldHeight: number = 5000;

    //camera stuff
    let cameraPos: p5.Vector = createVector(0, 0);
    let cameraMoveSpeed: number = 5;
    const maxScreenShakeAmount: number = 10;
    let screenShakeAmount = 0;
    const trackedVehicle: Vehicle = undefined;
    const newWorld = {
        stars,
        vehicles,
        asteroids,
        trackedVehicle,
        targets,
        orbs,
        MAX_NUM_TARGETS,
        MAX_NUM_VEHICLES,
        shots,
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
    if (config.shouldDrawStars) {
        drawStarfield();
    }

    drawGridLines();
    world.orbs.forEach((o) => drawOrb(o));

    const shotsToDraw = world.shots.filter(
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
    world.shots.forEach(updateShot);
    world.vehicles.forEach(updateVehicle);
    world.asteroids.forEach(updateAsteroid);
    world.orbs.forEach(updateOrb);
    updateCamera(world.cameraPos, world.trackedVehicle);

    world.trackedVehicle = world.vehicles.find((v: Vehicle) => v.hp > 0);
    updateEngineWhistleSound();
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
