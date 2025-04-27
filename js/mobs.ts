type Mob = ExploderMob | TeleporterMob;

interface BaseMob {
    colour: p5.Color;
    minimapColour: p5.Color;
    pos: p5.Vector;
    vel: p5.Vector;
}

interface DrawableMob {
    drawFn: (mob: Mob) => void;
}

interface UpdatableMob {
    updateFn: (mob: Mob) => void;
}

interface ExploderMob extends BaseMob, DrawableMob, UpdatableMob {
    state: "dormant" | "exploding";
    type: "exploder";
}

interface TeleporterMob extends BaseMob, DrawableMob, UpdatableMob {
    type: "teleporter";
    timeOfLastTeleport: number | null;
}

function createInitialMobs(n: number): Mob[] {
    world.mobs = collect(n, (ix: number) => createRandomMob());
}

function createRandomMob() {
    const fn = random([createExploderMob, createTeleporterMob]);
    const mob = fn();
    return mob;
}

function drawExploderMob(mob: Mob) {
    push();
    noStroke();
    fill(mob.colour);
    translateForScreenCoords(mob.pos);
    // rotate(mob.rotation)
    rectMode(CENTER);
    square(0, 0, 20 + sin(frameCount / 20) * 10);
    text("Exploder", 20, 20);
    pop();
    console.log("drawing exp");
    push();
    stroke("magenta");
    text("exploder", 100, 100);
    pop();
}

function drawTeleporterMob(mob: Mob) {
    push();
    noStroke();
    fill(mob.colour);
    translateForScreenCoords(mob.pos);
    // rotate(mob.rotation)
    rectMode(CENTER);
    circle(0, 0, 20);
    text("Tele", 20, 20);
    pop();
}

function updateExploderMob() {
    //no-op for now...
}

function updateTeleporterMob(mob: TeleporterMob): void {
    const shouldTeleport =
        millis() - mob.timeOfLastTeleport > 3000 && random() < 0.01; //mob.pos.dist(world.trackedVehicle.pos) < 200;
    if (shouldTeleport) {
        const hopDist = random(400, 4000);
        mob.pos.add(p5.Vector.random2D().mult(hopDist));
        mob.timeOfLastTeleport = millis();
    }
}

function createExploderMob() {
    return {
        pos: randomWorldPos(),
        vel: p5.Vector.random2D().mult(0.3),
        state: "dormant",
        type: "exploder",
        colour: color(random(200, 255), random(200, 255), random(0, 50)),
        minimapColour: color("orange"),
        drawFn: drawExploderMob,
        updateFn: updateExploderMob,
    } satisfies ExploderMob;
}

function createTeleporterMob() {
    return {
        pos: randomWorldPos(),
        vel: p5.Vector.random2D().mult(0.3),
        type: "teleporter",
        colour: color("magenta"),
        drawFn: drawTeleporterMob,
        updateFn: updateTeleporterMob,
        minimapColour: color("magenta"),
        timeOfLastTeleport: 0,
    } satisfies TeleporterMob;
}
