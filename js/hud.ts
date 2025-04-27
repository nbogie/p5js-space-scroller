function drawHUD() {
    push();
    fill("white");
    textSize(12);

    if (world.trackedVehicle) {
        text("Health: " + world.trackedVehicle.hp, width - 100, 50);
    }
    text(Math.round(frameRate()) + " fps", 50, 575);

    text(
        "Camera: " +
            JSON.stringify({
                x: Math.round(world.camera.pos.x),
                y: Math.round(world.camera.pos.y),
            }),
        50,
        600,
    );
    pop();
}
