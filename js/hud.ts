function drawHUD() {
    push();
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
                y: Math.round(cameraPos.y),
            }),
        50,
        600,
    );
    pop();
}
