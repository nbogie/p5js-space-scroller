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

    setupStandardColours();
    randomizeBigPalette();
    setPaletteForResources();

    setupVehicles(world.MAX_NUM_VEHICLES);
    setupAsteroids(10);
    setupStarfield();
    setupMobs(10);

    frameRate(60);
    angleMode(RADIANS);
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

function drawAll() {
    push();
    if (config.shouldDrawStars) {
        drawStarfield();
    }

    drawGridLines();
    world.orbs.forEach((o) => drawOrb(o));
    world.mobs.forEach((ent) => ent.drawFn(ent));

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
    world.mobs.forEach((ent) => ent.updateFn(ent));

    updateCamera(world.camera.pos, world.trackedVehicle);

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
