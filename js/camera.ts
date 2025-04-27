function updateCamera(camPosToChange: p5.Vector, trackedVehicle: Vehicle) {
    if (keyIsDown(LEFT_ARROW)) {
        camPosToChange.x += world.camera.moveSpeed;
    }
    if (keyIsDown(RIGHT_ARROW)) {
        camPosToChange.x -= world.camera.moveSpeed;
    }
    if (keyIsDown(UP_ARROW)) {
        camPosToChange.y += world.camera.moveSpeed;
    }
    if (keyIsDown(DOWN_ARROW)) {
        camPosToChange.y -= world.camera.moveSpeed;
    }

    if (trackedVehicle) {
        trackVehicleWithCamera(trackedVehicle);
        if (world.camera.screenShakeAmount > 0) {
            shakeCamera(world.camera.screenShakeAmount);
            world.camera.screenShakeAmount -= 0.4;
        }
    }
}

function shakeCamera(amt: number) {
    world.camera.pos.add(p5.Vector.random2D().mult(amt));
}

function trackVehicleWithCamera(v: Vehicle) {
    const velExtra = v.vel.copy().mult(20);
    world.camera.pos.x = v.pos.x - width / 2 + velExtra.x;
    world.camera.pos.y = v.pos.y - height / 2 + velExtra.y;
}

function distFromCamera(p: p5.Vector) {
    return p5.Vector.dist(
        world.camera.pos.copy().add(createVector(width / 2, height / 2)),
        p,
    );
}
function nearCamera(pos: p5.Vector) {
    return distFromCamera(pos) < height;
}

function screenShake(amt: number) {
    world.camera.screenShakeAmount += amt;
    if (world.camera.screenShakeAmount > world.camera.maxScreenShakeAmount) {
        world.camera.screenShakeAmount = world.camera.maxScreenShakeAmount;
    }
}

function translateForScreenCoords(pos: p5.Vector, labelled = false) {
    const screenCoords = pos.copy().sub(world.camera.pos);
    const translation = getTranslationForScreenCoords(pos);
    translate(translation.x, translation.y);
    if (labelled) {
        fill("white");
        textSize(10);
        text(
            `${Math.round(screenCoords.x)},${Math.round(screenCoords.y)}`,
            20,
            0,
        );
    }
}

function getTranslationForScreenCoords(pos: p5.Vector): p5.Vector {
    return createVector(
        round(pos.x - world.camera.pos.x),
        round(pos.y - world.camera.pos.y),
    );
}

function isOnScreen(pos: p5.Vector, radius: number) {
    return (
        pos.x + radius >= world.camera.pos.x &&
        pos.x - radius <= world.camera.pos.x + width &&
        pos.y + radius >= world.camera.pos.y &&
        pos.y - radius <= world.camera.pos.y + height
    );
}

function drawGridLines() {
    push();
    const numCols = floor((8 * world.worldWidth) / width);
    const numRows = floor((8 * world.worldHeight) / width);

    //TODO: work out which row and col we're in and only draw the neighbourhood
    for (let col = 0; col < numCols; col++) {
        for (let row = 0; row < numRows; row++) {
            const pos = createVector(
                (col * width) / 2 - world.worldWidth / 2,
                (row * width) / 2 - world.worldHeight / 2,
            );
            push();
            const translation = getTranslationForScreenCoords(pos);
            if (translation.mag() < width) {
                translateForScreenCoords(pos);
                strokeWeight(0.1);
                colorMode(RGB, 255);
                stroke(color(255, 255, 255, 120));
                line(0, -width / 2, 0, width / 2);
                line(-width / 2, 0, width / 2, 0);
            }
            pop();
        }
    }
    pop();
}

function numberOfWorldPages() {
    return Math.pow(world.worldWidth / width, 2);
}
