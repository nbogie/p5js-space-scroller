interface ChaserMob extends BaseMob<ChaserMob> {
    type: "chaser";
    target?: Vehicle;
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
        takeDamageFn: takeDamageChaserMob,
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
function takeDamageChaserMob(mob: ChaserMob): CollisionResult {
    console.log("CHASER TOOK DMG");
    destroy(mob);
    return "destroyed";
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
