function shatterAsteroid(a: Asteroid) {

    playSoundAsteroidDestroyed(a.sizeCategory);
    if (a.sizeCategory >= 2) {
        addAsteroid({ pos: a.pos.copy(), sizeCategory: a.sizeCategory - 1 });
        addAsteroid({ pos: a.pos.copy(), sizeCategory: a.sizeCategory - 1 });
        if (nearCamera(a.pos)) {
            screenShake(a.sizeCategory);
        }
    }
}

function drawAsteroid(a: Asteroid) {

    if (a.live) {
        push();
        translateForScreenCoords(a.pos);
        colorMode(HSB, 100);

        push();
        rotate(a.rotation);
        fill(a.tookDamage ? stdColours.white : a.resType.color);
        noStroke();
        square(0, 0, a.radius * 2.7, 6, 6);
        pop();
        fill('white')
        textSize(14);
        textAlign(CENTER, CENTER);
        stroke("black");
        strokeWeight(2);
        text(a.hp, 0, 0);

        pop();
    }
}

function addAsteroid(opts: AsteroidOpts) {
    asteroids.push(createAsteroidAt(opts));
}
function createAsteroid() {
    return createAsteroidAt({ pos: randomWorldPos() });
}

function createAsteroidAt(opts: AsteroidOpts) {
    const sz = opts.sizeCategory || random([1, 2, 3, 4]);
    return {
        live: true,
        pos: opts.pos.copy(),
        vel: p5.Vector.random2D().mult(random(1, 5)),
        resType: random(resTypes),
        sizeCategory: sz,
        radius: sz * 7,
        damage: sz,
        hp: sz * 20,
        rotation: random(TWO_PI),
        rotationSpeed: random(-0.1, 0.1),
        tookDamage: false
    };
}

function createAsteroids(n: number) {
    repeat(n, (ix: number) => asteroids.push(createAsteroid()));
}



function updateAsteroid(p: Asteroid) {
    if (p.live) {
        p.pos.x += p.vel.x;
        p.pos.y += p.vel.y;
        if (p.pos.x < -worldWidth / 2) {
            p.pos.x += worldWidth / 2;
        }
        if (p.pos.x > worldWidth / 2) {
            p.pos.x -= worldWidth / 2;
        }

        if (p.pos.y < -worldHeight / 2) {
            p.pos.y += worldHeight / 2;
        }
        if (p.pos.y > worldHeight / 2) {
            p.pos.y -= worldHeight / 2;
        }
        p.rotation += p.rotationSpeed;

        vehicles
            .filter(v => true || v.live)
            .forEach(v => {
                if (isColliding(p, v)) {
                    p.hp -= v.rammingDamage;
                    p.tookDamage = true;
                    v.hp -= p.damage;
                    if (v.hp <= 0) {
                        v.live = false;
                    }
                    v.tookDamage = true;
                    if (p.hp <= 0) {
                        p.live = false;
                        shatterAsteroid(p);
                    }
                }
            });
    }
    p.tookDamage = false;
}