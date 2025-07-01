interface Shot extends Entity {
    //pos and vel from Entity
    rotation: number;
    radius: number;
    damage: number;
    color: p5.Color;
    life: number;
}
interface ShotOptions {
    facing: number;
    vel: p5.Vector;
    pos: p5.Vector;
    hue: number;
}

function createShot(opts: ShotOptions): Shot {
    push();
    colorMode(HSB, 100);
    const sz = random([4, 5, 6, 7]);
    const vel = opts.vel.copy();
    const rotation = opts.facing;
    push();
    colorMode(HSB, 360, 100, 100);
    const shotColor = color(
        constrain(randomGaussian(opts.hue, 10), 0, 360),
        100,
        100,
        100,
    );
    pop();
    const shot = {
        live: true,
        tag: "shot",
        zIndex: 0,
        updatePriority: 0,
        drawFn: drawShot,
        updateFn: updateShot,
        pos: opts.pos.copy().add(vel),
        rotation, //NOT inferred from the velocity
        vel: vel,
        radius: Math.pow(sz, 2),
        damage: sz,
        color: shotColor,
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
        p.pos.x += p.vel.x * world.timeSpeed;
        p.pos.y += p.vel.y * world.timeSpeed;
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
        p.life -= random(0.03, 0.04) * world.timeSpeed;
    }
}
