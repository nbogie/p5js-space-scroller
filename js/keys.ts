function keyPressed() {
    //if key is string version of any single integer 0 through 9, call foo() and pass the parsed integer.
    if (key.length === 1 && key >= "1" && key <= "9") {
        const num = parseInt(key, 10);
        changeWeaponSystemForTrackedVehicle(num);
        return;
    }
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
        case "a":
            toggleAutopilot();
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
