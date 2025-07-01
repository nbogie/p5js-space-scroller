function drawHUD() {
    push();
    fill("white");
    textSize(12);

    text("FPS: " + frameRate().toFixed(0), 100, 100);

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

    drawMessages();
    if (world.trackedVehicle !== undefined) {
        push();
        //plot nearby mobs on radar
        const nearestExploderMob = calcNearestEntity(
            world.trackedVehicle,
            getExploderMobs(),
        );

        const nearestTeleporterMob = calcNearestEntity(
            world.trackedVehicle,
            getTeleporterMobs(),
        );

        translateForScreenCoords(world.trackedVehicle.pos);

        //radar outline
        noFill();
        stroke(255, 50);
        circle(0, 0, 100);
        pop();

        nearestExploderMob &&
            plotEntityOnRadar(nearestExploderMob, world.trackedVehicle.pos);
        nearestTeleporterMob &&
            plotEntityOnRadar(nearestTeleporterMob, world.trackedVehicle.pos);

        getLiveAsteroids().forEach((ast) =>
            plotEntityOnRadar(ast, world.trackedVehicle.pos),
        );
    }
}

function plotEntityOnRadar(
    entity: {
        pos: p5.Vector;
        minimapColour: p5.Color;
    },
    referencePos: p5.Vector,
) {
    push();
    translateForScreenCoords(referencePos);
    noFill();
    circle(0, 0, 100);
    const vecToNearest = p5.Vector.sub(entity.pos, referencePos);
    const radarDist = min(vecToNearest.mag() / 20, 50);
    const offset = vecToNearest.copy().setMag(radarDist);
    translate(offset);
    stroke(entity.minimapColour);
    strokeWeight(5);
    point(0, 0);
    pop();
}
