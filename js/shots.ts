interface Shot extends Entity<Shot> {
    //pos and vel from Entity
    rotation: number;
    damage: number;
    color: p5.Color;
    life: number;
}
interface ShotOptions {
    facing: number;
    vel: p5.Vector;
    pos: p5.Vector;
    hue: number;
    drawFn?: (shot: Shot) => void;
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
    const drawFn = opts.drawFn ?? drawDefaultShot;
    pop();
    const shot = {
        live: true,
        tag: "shot",
        zIndex: 0,
        updatePriority: 0,
        drawFn,
        updateFn: updateShot,
        takeDamageFn: () => "no-collision", //shots don't get shot,
        pos: opts.pos.copy().add(vel),
        rotation, //NOT inferred from the velocity
        vel: vel,
        collisionRadius: Math.pow(sz, 2),
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
function drawDefaultShot(s: Shot) {
    if (s.live) {
        push();
        translateForScreenCoords(s.pos);
        fill(s.color);
        noStroke();
        rotate(s.rotation);
        rect(0, 0, s.collisionRadius, s.collisionRadius / 2);
        pop();
    }
}

function updateShot(shot: Shot) {
    if (shot.life <= 0) {
        destroy(shot);
        return;
    }

    if (!shot.live) {
        return;
    }

    if (shot.live) {
        shot.pos.x += shot.vel.x * world.timeSpeed;
        shot.pos.y += shot.vel.y * world.timeSpeed;
        doAnyShotAsteroidCollisions(shot);
        doAnyShotEntityCollisionsExceptAsteroids(shot);
        shot.life -= random(0.03, 0.04) * world.timeSpeed;
    }
}

function doAnyShotAsteroidCollisions(shot: Shot) {
    const asteroids = getLiveAsteroids();

    asteroids
        .filter((ast) => ast.live)
        .forEach((ast) => {
            if (isColliding(ast, shot)) {
                //TODO: move to asteroid's takeDamageFn
                ast.hp -= shot.damage;
                ast.tookDamage = true;
                destroy(shot);
                if (ast.hp <= 0) {
                    destroy(ast);
                    shatterAsteroid(ast);
                }
            }
        });
}

function doAnyShotEntityCollisionsExceptAsteroids(shot: Shot) {
    debugger;
    const allExceptAsteroidsAndShots = world.entities.filter(
        (e: Entity<any>) => e.tag !== "asteroid" && e.tag !== "shot" && e.live,
    );
    entityLoop: for (let ent of allExceptAsteroidsAndShots) {
        if (isColliding(ent, shot)) {
            const collisionResult = ent.takeDamageFn(ent);
            switch (collisionResult) {
                case "no-collision":
                    break;
                case "damaged":
                case "destroyed":
                    destroy(shot);
                    break entityLoop;
                case "reflected":
                    reflectShot(shot, ent);
                    break;
                default:
                    break;
            }
        }
    }
}

function reflectShot(shot: Shot, ent: Entity<any>) {
    shot.vel.mult(-1);
    shot.rotation += PI;
}
