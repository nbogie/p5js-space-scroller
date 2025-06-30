type Mob = ExploderMob | TeleporterMob;

interface BaseMob extends Entity {
    colour: p5.Color;
    minimapColour: p5.Color;
}

interface DrawableMob {
    drawFn: (mob: Mob) => void;
}

interface UpdatableMob {
    updateFn: (mob: Mob) => void;
}

interface ExploderMob extends BaseMob {
    state: "dormant" | "exploding";
    type: "exploder";
}

interface TeleporterMob extends BaseMob {
    type: "teleporter";
    timeOfLastTeleport: number | null;
}

function setupMobs(n: number): void {
    world.entities.push(...collect(n, (ix: number) => createRandomMob()));
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
    rectMode(CENTER);
    square(0, 0, 20 + sin(frameCount / 20) * 10);
    text("Exploder", 20, 20);
    pop();
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
        tag: "mob-exploder",
        live: true,
        zIndex: 0,
        updatePriority: 0,

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
        tag: "mob-teleporter",
        live: true,
        zIndex: 0,
        updatePriority: 0,

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

function getTeleporterMobs(): TeleporterMob[] {
    return world.entities.filter(
        (e) => e.tag === "mob-teleporter",
    ) as TeleporterMob[];
}

function getExploderMobs(): ExploderMob[] {
    return world.entities.filter(
        (e) => e.tag === "mob-exploder",
    ) as ExploderMob[];
}
