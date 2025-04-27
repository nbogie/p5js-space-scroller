function mouseMoved() {}
function mousePressed() {
    if (config.shouldPlaySound && soundNotYetEnabledByGesture) {
        soundNotYetEnabledByGesture = false;
        setupSound();
    }

    addAsteroid({ pos: mouseWorldPos() });
}

function mouseWorldPos(): p5.Vector {
    return world.cameraPos.copy().add(mousePos());
}

function mousePos(): p5.Vector {
    return createVector(mouseX, mouseY);
}
