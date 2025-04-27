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
        case "s":
            toggleShouldDrawStars();
            break;
        case "p":
            togglePause();
            break;
    }
}
