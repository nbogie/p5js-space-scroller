function updateCamera(cameraPos: p5.Vector, trackedVehicle: Vehicle) {
    if (keyIsDown(LEFT_ARROW)) {
        cameraPos.x += cameraMoveSpeed;
    }
    if (keyIsDown(RIGHT_ARROW)) {
        cameraPos.x -= cameraMoveSpeed;
    }
    if (keyIsDown(UP_ARROW)) {
        cameraPos.y += cameraMoveSpeed;
    }
    if (keyIsDown(DOWN_ARROW)) {
        cameraPos.y -= cameraMoveSpeed;
    }

    if (trackedVehicle) {
        trackVehicleWithCamera(trackedVehicle);
        if (screenShakeAmount > 0) {
            shakeCamera(screenShakeAmount);
            screenShakeAmount -= 0.4;
        }
    }
}

function shakeCamera(amt: number) {
    cameraPos.add(p5.Vector.random2D().mult(amt));
}

function trackVehicleWithCamera(v: Vehicle) {
    const velExtra = v.vel.copy().mult(20);
    cameraPos.x = v.pos.x - width / 2 + velExtra.x;
    cameraPos.y = v.pos.y - height / 2 + velExtra.y;
}


function distFromCamera(p: p5.Vector) {
    return p5.Vector.dist(
        cameraPos.copy().add(createVector(width / 2, height / 2)),
        p
    );
}
function nearCamera(pos: p5.Vector) {
    return distFromCamera(pos) < height;
}

function screenShake(amt: number) {
    screenShakeAmount += amt;
    if (screenShakeAmount > maxScreenShakeAmount) {
        screenShakeAmount = maxScreenShakeAmount;
    }
}


function translateForScreenCoords(pos: p5.Vector, labelled = false) {
    const screenCoords = pos.copy().sub(cameraPos);
    translate(Math.round(pos.x - cameraPos.x), Math.round(pos.y - cameraPos.y));
    if (labelled) {
        fill("white");
        textSize(10);
        text(`${Math.round(screenCoords.x)},${Math.round(screenCoords.y)}`, 20, 0);
    }
}



function isOnScreen(pos: p5.Vector, radius: number) {
    return (
        pos.x + radius >= cameraPos.x &&
        pos.x - radius <= cameraPos.x + width &&
        pos.y + radius >= cameraPos.y &&
        pos.y - radius <= cameraPos.y + height
    );
}