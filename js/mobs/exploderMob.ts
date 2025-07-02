interface ExploderMob extends BaseMob<ExploderMob> {
    state: "dormant" | "exploding";
    type: "exploder";
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

function updateExploderMob() {
    //no-op for now...
}

function takeDamageExploderMob(): CollisionResult {
    return "reflected";
}
function getExploderMobs(): ExploderMob[] {
    return world.entities.filter(
        (e) => e.tag === "mob-exploder",
    ) as ExploderMob[];
}
