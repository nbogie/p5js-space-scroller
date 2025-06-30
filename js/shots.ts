function createShot(opts: ShotOptions): Shot {
    push();
    colorMode(HSB, 100);
    const shotSpread = PI / 32;
    const sz = random([4, 5, 6, 7]);
    const vel = opts.vel
        .copy()
        .normalize()
        .mult(25)
        .rotate(random(-shotSpread, shotSpread));

    const shot = {
        live: true,
        tag: "shot",
        zIndex: 0,
        updatePriority: 0,
        drawFn: drawShot,
        updateFn: updateShot,
        pos: opts.pos.copy().add(vel),
        rotation: vel.heading(),
        vel: vel,
        radius: Math.pow(sz, 2),
        damage: sz,
        color: color(random(50, 70), 100, 100, 100),
        life: 1,
    } satisfies Shot;
    pop();
    return shot;
}

function addShot(opts: ShotOptions) {
    const shot = createShot(opts);
    world.entities.push(shot);
    if (nearCamera(shot.pos)) {
        playSoundShot();
    }
}
function drawShot(s: Shot) {
    if (s.live) {
        push();
        translateForScreenCoords(s.pos);
        fill(s.color);
        noStroke();
        rotate(s.rotation);
        rect(0, 0, s.radius, s.radius / 2);
        pop();
    }
}

function updateShot(p: Shot) {
    if (p.life <= 0) {
        destroy(p);
        return;
    }

    if (!p.live) {
        return;
    }

    const asteroids = getLiveAsteroids();
    if (p.live) {
        p.pos.x += p.vel.x;
        p.pos.y += p.vel.y;
        asteroids
            .filter((a) => a.live)
            .forEach((a) => {
                if (isColliding(a, p)) {
                    a.hp -= p.damage;
                    a.tookDamage = true;
                    destroy(p);
                    if (a.hp <= 0) {
                        destroy(a);
                        shatterAsteroid(a);
                    }
                }
            });
        p.life -= random(0.001, 0.01);
    }
}

function shootIfTime(srcVehicle: Vehicle) {
    const ms = millis();
    if (ms - srcVehicle.lastShot > srcVehicle.shotDelay) {
        addShot({
            pos: srcVehicle.pos,
            vel: p5.Vector.fromAngle(srcVehicle.facing)
                .mult(40)
                .add(srcVehicle.vel),
        });
        srcVehicle.lastShot = ms;
    }
}

function updateShooting(p: Vehicle) {
    const angleOff = p.desiredVector.angleBetween(p.vel);

    p.canShoot = angleOff < TWO_PI / 36;
    if (p.canShoot) {
        shootIfTime(p);
    }
}
