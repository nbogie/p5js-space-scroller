"use strict";
// This property only exists in non-minified p5
// @ts-expect-error
p5.disableFriendlyErrors = true;

/** almost all game state (asteroids, ship, bullets, etc) */
let world: World;

let pauseState: PauseState = { type: "unpaused", simplified: "unpaused" };

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

    setupAsteroids(10);
    setupStarfield();
    setupVehicles(world.MAX_NUM_VEHICLES);
    setupMobs(10);

    const firstLiveVehicle = getLiveVehicles().find((v: Vehicle) => v.hp > 0);
    switchPlayerControlToVehicle(firstLiveVehicle);

    frameRate(60);
    angleMode(RADIANS);
    ellipseMode(CENTER);
    rectMode(CENTER);
}

function draw() {
    // if (frameCount % 200 === 0) {
    //     debugger;
    //     const x = world.trackedVehicle;
    //     const y = world.trackedVehicle?.isUnderPlayerControl;
    // }

    background(15);
    world.timeSpeed = processAnyTimeDistortion();
    text("timeSpeed: " + world.timeSpeed, 10, 10);
    text("state: " + pauseState.type, 10, 40);
    drawAll();
    drawPauseDialogIfNeeded();
    if (pauseState.type !== "paused") {
        updateAll();
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function prepareEntitiesForDrawing() {
    //TODO: remove anything not near the screen

    //sort by zIndex
    return [...world.entities].sort((a, b) => {
        return a.zIndex - b.zIndex;
    });
}
function prepareEntitiesForUpdate() {
    //sort by update priority
    return [...world.entities].sort((a, b) => {
        return a.updatePriority - b.updatePriority;
    });
}

function drawAll() {
    const preparedEntities = prepareEntitiesForDrawing();

    push();
    if (config.shouldDrawStars) {
        drawStarfield();
    }

    drawGridLines();

    preparedEntities.forEach((ent) => {
        if (ent.live) {
            ent.drawFn(ent);
        }
    });

    pop();

    drawHUD();
}

function updateAll() {
    const preparedEntities = prepareEntitiesForUpdate();
    preparedEntities.forEach((ent) => {
        if (ent.live) {
            ent.updateFn(ent);
        }
    });

    updateCamera(world.camera.pos, world.trackedVehicle);

    updateEngineWhistleSound();

    //cull entities marked for deletion
    world.entities = world.entities.filter((e) => e.live);
}

function switchPlayerControlToVehicle(v?: Vehicle) {
    if (v) {
        const prevTrackedVehicle = world.trackedVehicle;

        if (prevTrackedVehicle && prevTrackedVehicle.isUnderPlayerControl) {
            prevTrackedVehicle.isUnderPlayerControl = false;
        }
        world.trackedVehicle = v;
        v.isUnderPlayerControl = true;
    } else {
        if (world.trackedVehicle) {
            world.trackedVehicle.isUnderPlayerControl = false;
            world.trackedVehicle = undefined;
        }
    }
}

const resTypes: ResourceType[] = [
    { label: "fuel", hue: 55, color: null },
    { label: "laser", hue: 30, color: null },
    { label: "explosive", hue: 0, color: null },
    { label: "magic", hue: 80, color: null },
];
