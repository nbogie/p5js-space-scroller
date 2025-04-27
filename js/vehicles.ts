function drawVehicle(p: Vehicle) {
    if (config.shouldDrawTrails) {
        drawTrail(p.trail);
    }
    push();
    translateForScreenCoords(p.pos);
    colorMode(HSB, 100);

    fill(
        p.tookDamage
            ? color("white")
            : p.canShoot
              ? color(p.hue, 40, 100)
              : color("gray"),
    );
    noStroke();
    const sz = 10;

    push();
    rotate(p.facing);
    beginShape();
    vertex(-sz, -sz);
    vertex(-sz, sz);
    vertex(sz, 0);
    endShape();

    pop();

    drawVec(p.desiredVector, 100, 0, 1, color(0, 0, 100, 20), 1);
    drawVec(p.vel, 50, 0, p.maxSpeed, color(30, 0, 100, 30), 4);
    drawVec(p.steer, 30, 0, p.maxSteeringForce, color(0, 100, 100, 25), 1);

    push();
    if (p.live) {
        translate(0, -30);
        fill("#101010");
        rectMode(CENTER);
        rect(0, 0, 30, 6);

        fill(getColorForShipHP(p.hp));
        rectMode(CORNER);
        rect(-15, -3, map(p.hp, 0, 100, 0, 30), 6);
        rectMode(CENTER);
    } else {
        translate(-15, -30);
        text("DEAD", 0, 0);
    }
    pop();

    pop();
}

function updateVehicle(v: Vehicle) {
    v.pos.add(v.vel);

    const vel = createVector(v.vel.x, v.vel.y);

    const currPos = createVector(v.pos.x, v.pos.y);
    if (!v.live) {
        return;
    }
    if (v.target && v.target.live) {
        const targetPos = createVector(v.target.pos.x, v.target.pos.y);
        const desired = p5.Vector.sub(targetPos, currPos);
        desired.normalize();
        desired.mult(v.maxSpeed);
        v.desiredVector = desired.copy().normalize();
        v.facing = v.desiredVector.copy().normalize().heading();

        //steering = desired minus velocity
        const steer = p5.Vector.sub(desired, vel);
        steer.limit(v.maxSteeringForce);
        v.steer = steer.copy();
        v.accel.add(steer);
        v.fuel -= v.accel.mag();
    } else {
        v.target = acquireTarget(v);
    }
    v.vel.add(v.accel);

    updateShooting(v);

    v.trail.particles.forEach(updateParticle);

    //reset accel for next time

    v.life -= random(0.001, 0.01);
    const trailParticle = createParticleAt(v.pos);
    trailParticle.vel = v.accel
        .copy()
        .mult(20)
        .rotate(180 + random(-1, 1));
    addParticle(trailParticle, v.trail.particles);
    v.accel.mult(0);
    v.tookDamage = false;
}

function setupVehicles(n: number) {
    world.vehicles = collect(n, createVehicle);
}

function createVehicle(): Vehicle {
    return {
        live: true,
        pos: randomWorldPos(),
        vel: createVector(0, 0),
        accel: createVector(0, 0),
        radius: 10,
        hp: 100,
        target: undefined,
        fuel: 100,
        desiredVector: createVector(0, 0),
        maxSteeringForce: 0.2,
        maxSpeed: random(2, 10),
        facing: random(TWO_PI),
        hue: random(0, 100),
        color: randomColor(),
        traction: 0.3,
        steer: createVector(0, 0),
        rammingDamage: 3,
        canShoot: false,
        lastShot: -99999,
        shotDelay: 100,
        trail: createTrail(),
        tookDamage: false,
        life: 1,
    };
}
