type AsteroidSize = 4 | 3 | 2 | 1;
interface Asteroid extends Entity<Asteroid> {
    // from Entity
    //   pos: p5.Vector;
    //   vel: p5.Vector;
    //   live: boolean;

    resType: ResourceType;
    sizeCategory: AsteroidSize;
    damage: number;
    mineral: Mineral | null;
    hp: number;
    tookDamage: boolean;
    rotation: number;
    rotationSpeed: number;
    minimapColour: p5.Color;
}
interface AsteroidOpts {
    sizeCategory?: number;
    mineral?: Mineral | null;
    pos: p5.Vector;
}
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
        fill(
            a.tookDamage
                ? stdColours.white
                : (a.resType.color ?? stdColours.gray100),
        );
        if (a.mineral) {
            stroke("lime");
            const t = map(sin(frameCount / 10), -1, 1, 0, 1);
            strokeWeight((t * a.collisionRadius) / 6);
        } else {
            noStroke();
        }
        square(0, 0, a.collisionRadius * 2.7, 6, 6);

        pop();
        fill("white");
        textSize(14);
        textAlign(CENTER, CENTER);
        stroke("black");
        strokeWeight(2);
        text(a.hp, 0, 0);

        pop();
    }
}

function addAsteroid(opts: AsteroidOpts) {
    world.entities.push(createAsteroidAt(opts));
}

function createAsteroid() {
    return createAsteroidAt({ pos: randomWorldPos() });
}

function createAsteroidAt(opts: AsteroidOpts) {
    const sz = opts.sizeCategory || random([1, 2, 3, 4]);
    return {
        tag: "asteroid",
        live: true,
        pos: opts.pos.copy(),
        vel: p5.Vector.random2D().mult(random(1, 5)),
        resType: random(resTypes),
        sizeCategory: sz,
        collisionRadius: sz * 7,
        damage: sz,
        mineral: random() < 0.2 ? randomMineral() : null,
        hp: sz * 20,
        rotation: random(TWO_PI),
        rotationSpeed: random(-0.1, 0.1),
        tookDamage: false,
        minimapColour: color(0, 200, 200, 100),
        updatePriority: 0,
        zIndex: 0,
        drawFn: drawAsteroid,
        updateFn: updateAsteroid,
        takeDamageFn: takeDamageAsteroid,
    } satisfies Asteroid;
}

function setupAsteroids(n: number) {
    world.entities.push(...collect(n, createAsteroid));
}

function updateAsteroid(p: Asteroid) {
    if (p.live) {
        p.pos.x += p.vel.x;
        p.pos.y += p.vel.y;
        if (p.pos.x < -world.worldWidth / 2) {
            p.pos.x += world.worldWidth / 2;
        }
        if (p.pos.x > world.worldWidth / 2) {
            p.pos.x -= world.worldWidth / 2;
        }

        if (p.pos.y < -world.worldHeight / 2) {
            p.pos.y += world.worldHeight / 2;
        }
        if (p.pos.y > world.worldHeight / 2) {
            p.pos.y -= world.worldHeight / 2;
        }
        p.rotation += p.rotationSpeed;

        getLiveVehicles().forEach((v) => {
            if (isColliding(p, v)) {
                p.hp -= v.rammingDamage;
                p.tookDamage = true;
                v.hp -= p.damage;
                if (v.hp <= 0) {
                    destroy(v);
                }
                v.tookDamage = true;
                if (p.hp <= 0) {
                    destroy(p);
                    shatterAsteroid(p);
                }
            }
        });
    }
    p.tookDamage = false;
}

function takeDamageAsteroid(a: Asteroid): CollisionResult {
    return "no-collision"; //TODO: handle shatter and destruction here instead of in shots.ts
}

function randomMineral(): Mineral {
    return random([...allMineralNames]);
}

function getAsteroids() {
    return world.entities.filter(
        (e: Entity<any>) => e.tag === "asteroid",
    ) as Asteroid[];
}

function getLiveAsteroids() {
    return getAsteroids().filter((a) => a.live);
}
