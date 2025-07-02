type Mob = ExploderMob | TeleporterMob | ChaserMob;

interface BaseMob<T extends Entity<T>> extends Entity<T> {
    colour: p5.Color;
    minimapColour: p5.Color;
}

interface ExploderMob extends BaseMob<ExploderMob> {
    state: "dormant" | "exploding";
    type: "exploder";
}

interface TeleporterMob extends BaseMob<TeleporterMob> {
    type: "teleporter";
    timeOfLastTeleport: number | null;
}

interface ChaserMob extends BaseMob<ChaserMob> {
    type: "chaser";
    target?: Vehicle;
}

function setupMobs(n: number): void {
    world.entities.push(...collect(n, (ix: number) => createRandomMob()));
}

function createRandomMob() {
    const fn = random([
        createExploderMob,
        createTeleporterMob,
        createChaserMob,
    ]);
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

function takeDamageExploderMob() {
    //no-op for now...
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

function createExploderMob() {
    return {
        tag: "mob-exploder",
        live: true,
        zIndex: 0,
        updatePriority: 0,
        collisionRadius: 10,
        pos: randomWorldPos(),
        vel: p5.Vector.random2D().mult(0.3),
        state: "dormant",
        type: "exploder",
        colour: color(random(200, 255), random(200, 255), random(0, 50)),
        minimapColour: color("orange"),
        drawFn: drawExploderMob,
        updateFn: updateExploderMob,
        takeDamageFn: takeDamageExploderMob,
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
        collisionRadius: 10,
        type: "teleporter",
        colour: color("magenta"),
        drawFn: drawTeleporterMob,
        updateFn: updateTeleporterMob,
        takeDamageFn: () => {}, //no op for now
        minimapColour: color("magenta"),
        timeOfLastTeleport: 0,
    } satisfies TeleporterMob;
}

function createChaserMob() {
    return {
        tag: "mob-chaser",
        live: true,
        zIndex: 0,
        updatePriority: 0,

        pos: randomWorldPos(),
        vel: p5.Vector.random2D().mult(0.3),
        collisionRadius: 10,
        type: "chaser",
        colour: color(random(200, 255), random(200, 255), random(0, 50)),
        minimapColour: color("orange"),
        drawFn: drawChaserMob,
        updateFn: updateChaserMob,
        takeDamageFn: () => takeDamageChaserMob,
    } satisfies ChaserMob;
}
function drawChaserMob(mob: Mob) {
    push();
    noStroke();
    fill(mob.colour);
    translateForScreenCoords(mob.pos);
    rotate(mob.vel.heading());
    rectMode(CENTER);
    rect(0, 0, 30, 10);
    text("Chaser", 20, 20);
    pop();
}
function takeDamageChaserMob(mob: ChaserMob): void {
    destroy(mob);
}
function updateChaserMob(mob: ChaserMob): void {
    if (!mob.target) {
        mob.target = world.trackedVehicle;
    }
    if (mob.target) {
        const desired = p5.Vector.sub(mob.target.pos, mob.pos);
        desired.setMag(2); // Set a constant speed
        mob.vel.lerp(desired, 0.1); // Smoothly adjust velocity towards the target
        mob.pos.add(mob.vel);
    }
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
