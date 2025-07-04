interface Vehicle extends Entity<Vehicle> {
    // from Entity
    //   pos: p5.Vector;
    //   vel: p5.Vector;
    //   live: boolean;

    accel: p5.Vector;
    life: number;
    hp: number;
    fuel: number;
    maxSteeringForce: number;
    facing: number;
    maxSpeed: number;
    maxThrust: number;
    hue: number;
    color: p5.Color;
    traction: 0.3;
    weaponSystem: WeaponSystem;
    steer: p5.Vector;
    isLinedUpToShoot: boolean;
    rammingDamage: number;
    trail: Trail;
    target?: Target;
    desiredVector: p5.Vector;
    tookDamage: boolean;
    isUnderPlayerControl: boolean;
}

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
            : p.isLinedUpToShoot
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
    vertex(sz * 2, 0);
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

    //an issue here is that the target will be drawn with the same zindex as all vehicles, like it or not.
    //We could add the targets to the world entity list, but are they really entities?
    if (p.target && p.target.live) {
        drawTarget(p.target);
    }
}
function steerVehicleAutonomously(v: Vehicle) {
    const currPos = createVector(v.pos.x, v.pos.y);
    if (!v.live) {
        return;
    }
    if (v.target && v.target.live) {
        const targetPos = createVector(v.target.pos.x, v.target.pos.y);
        const desired = p5.Vector.sub(targetPos, currPos);
        desired.setMag(v.maxSpeed);
        v.desiredVector = desired.copy().normalize();
        v.facing = v.desiredVector.copy().normalize().heading();

        //steering = desired minus velocity
        const steer = p5.Vector.sub(desired, v.vel);
        steer.limit(v.maxSteeringForce);
        v.steer = steer.copy().mult(world.timeSpeed);
        v.accel.add(steer);
        v.fuel -= v.accel.mag();
    } else {
        v.target = acquireTarget(v);
    }

    updateAutomatedShooting(v);
}
function updateVehicleWeaponsWithUserInput(v: Vehicle) {
    if (keyIsDown(32)) {
        shootIfTime(v);
    }
}

function updateVehicle(v: Vehicle) {
    v.pos.add(v.vel.copy().mult(world.timeSpeed));
    if (v.isUnderPlayerControl) {
        steerVehicleWithUserInput(v);
        updateVehicleWeaponsWithUserInput(v);
    } else {
        steerVehicleAutonomously(v);
    }
    v.vel.add(v.accel);

    v.trail.particles.forEach(updateParticle);

    //reset accel for next time
    v.life -= random(0.001, 0.01) * world.timeSpeed;

    v.accel.mult(0);
    v.tookDamage = false;
}

function setupVehicles(n: number) {
    world.entities.push(...collect(n, createVehicle));
}

function createVehicle(): Vehicle {
    return {
        tag: "vehicle",
        updateFn: updateVehicle,
        drawFn: drawVehicle,
        takeDamageFn: () => "no-collision", //TODO: no collision for shot owner, but yes for other vehicles...
        zIndex: 0,
        updatePriority: 0,
        live: true,
        pos: randomWorldPos(),
        vel: createVector(0, 0),
        accel: createVector(0, 0),
        collisionRadius: 10,
        hp: 100,
        target: undefined,
        fuel: 100,
        desiredVector: createVector(0, 0),
        maxSteeringForce: 0.2,
        maxThrust: 0.1,
        maxSpeed: random(2, 10),
        facing: random(TWO_PI),
        hue: random(0, 100),
        color: randomColor(),
        traction: 0.3,
        steer: createVector(0, 0),
        rammingDamage: 3,
        isLinedUpToShoot: false,

        trail: createTrail(),
        tookDamage: false,
        life: 1,
        isUnderPlayerControl: false,
        weaponSystem: random([
            createDefaultWeaponSystem,
            createSpreadWeaponSystem,
            createSurroundWeaponSystem,
        ])(),
    } satisfies Vehicle;
}
function steerVehicleWithUserInput(v: Vehicle) {
    if (keyIsDown(UP_ARROW)) {
        const thrust = p5.Vector.fromAngle(v.facing).mult(
            v.maxThrust * world.timeSpeed,
        );
        v.accel.add(thrust);
        addTrailParticle(v); //TODO: consider world.timeSpeed for emission rate
    }
    if (keyIsDown(LEFT_ARROW)) {
        v.facing -= config.steerSpeed * world.timeSpeed;
    }
    if (keyIsDown(RIGHT_ARROW)) {
        v.facing += config.steerSpeed * world.timeSpeed;
    }
}
function changeWeaponSystemForTrackedVehicle(systemNumber: number) {
    if (!world.trackedVehicle) {
        return;
    }
    const name = changeWeaponSystemForVehicle(
        systemNumber,
        world.trackedVehicle,
    );
    name && flashMessage("Picked weapon: " + name, 2000);
}

function toggleAutopilot() {
    if (world.trackedVehicle) {
        console.log(
            "tracked vehicle status: ",
            world.trackedVehicle.isUnderPlayerControl,
            millis(),
        );
        debugger;

        if (world.trackedVehicle.isUnderPlayerControl) {
            world.trackedVehicle.isUnderPlayerControl = false;
        } else {
            world.trackedVehicle.isUnderPlayerControl = true;
        }
    }
}
function addTrailParticle(v: Vehicle) {
    const trailParticle = createParticleAt(v.pos);
    trailParticle.vel = v.accel
        .copy()
        .mult(20)
        .rotate(180 + random(-1, 1));
    addParticle(trailParticle, v.trail.particles);
}

function getVehicles() {
    return world.entities.filter((e) => e.tag === "vehicle") as Vehicle[];
}

function getLiveVehicles() {
    return getVehicles().filter((a) => a.live);
}

//todo: needs to consider world.timeSpeed or you'll be able to spawn much faster during pause/unpause, for example.
//todo: consider vehicle's weapon system
function shootIfTime(srcVehicle: Vehicle) {
    tryToShootUsingWeaponSystem(srcVehicle);
}

function tryToShootUsingWeaponSystem(srcVehicle: Vehicle) {
    const ms = millis();
    if (
        ms - srcVehicle.weaponSystem.lastShot >
        srcVehicle.weaponSystem.shotDelay
    ) {
        shootUsingWeaponSystem(srcVehicle);
        srcVehicle.weaponSystem.lastShot = ms;
    }
}

function shootUsingWeaponSystem(srcVehicle: Vehicle) {
    srcVehicle.weaponSystem.shootFn(srcVehicle);
}

function updateAutomatedShooting(p: Vehicle) {
    const angleOff = p.desiredVector.angleBetween(p.vel);
    // TODO: consider if distance to target
    // (though this would mean they might fly into a non-target rock without shooting it.)
    p.isLinedUpToShoot = angleOff < TWO_PI / 36;
    if (p.isLinedUpToShoot) {
        shootIfTime(p);
    }
}

/** returns name of weapon system after change, or null if not applicable*/
function changeWeaponSystemForVehicle(
    systemNumber: number,
    vehicle: Vehicle,
): string | null {
    const system = createWeaponSystemOfNumberOrNull(systemNumber);
    if (!system) {
        return null;
    }
    vehicle.weaponSystem = system;
    return vehicle.weaponSystem.name;
    //TODO: any clean-up needed?
}

function createWeaponSystemOfNumberOrNull(systemNumber: number) {
    const systemCreators = [
        createDefaultWeaponSystem,
        createSpreadWeaponSystem,
        createSurroundWeaponSystem,
    ];
    const creatorFn = systemCreators[systemNumber - 1];
    if (!creatorFn) {
        return null;
    }

    return creatorFn();
}
