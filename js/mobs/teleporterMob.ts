interface TeleporterMob extends BaseMob<TeleporterMob> {
    type: "teleporter";
    timeOfLastTeleport: number | null;
}

function createTeleporterMob() {
    return {
        tag: "mob-teleporter",
        live: true,
        zIndex: 0,
        updatePriority: 0,
        pos: randomWorldPos(),
        vel: p5.Vector.random2D().mult(0.3),
        collisionRadius: 10,
        type: "teleporter",
        colour: color("magenta"),
        drawFn: drawTeleporterMob,
        updateFn: updateTeleporterMob,
        takeDamageFn: () => "no-collision",
        minimapColour: color("magenta"),
        timeOfLastTeleport: 0,
    } satisfies TeleporterMob;
}

function drawTeleporterMob(mob: Mob) {
    push();
    noStroke();
    fill(mob.colour);
    translateForScreenCoords(mob.pos);
    rectMode(CENTER);
    circle(0, 0, 20);
    text("Teleporter", 20, 20);
    pop();
}

function updateTeleporterMob(mob: TeleporterMob): void {
    const shouldTeleport =
        millis() - (mob.timeOfLastTeleport ?? 0) > 3000 && random() < 0.01; //mob.pos.dist(world.trackedVehicle.pos) < 200;
    if (shouldTeleport) {
        const hopDist = random(400, 4000);
        mob.pos.add(p5.Vector.random2D().mult(hopDist));
        mob.timeOfLastTeleport = millis();
    }
}

function getTeleporterMobs(): TeleporterMob[] {
    return world.entities.filter(
        (e) => e.tag === "mob-teleporter",
    ) as TeleporterMob[];
}
