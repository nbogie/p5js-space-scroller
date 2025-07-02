function randInt(min: number, max: number): number {
    return Math.floor(random(min, max + 1));
}

function atLeastTwoOf(fns: (() => () => any)[]) {
    const pickedFns = _.sampleSize(fns, randInt(2, fns.length));
    pickedFns.forEach((f: () => any) => f());
}

function repeat(n: number, fn: (i: number, n: number) => any) {
    for (let i = 0; i < n; i++) {
        fn(i, n);
    }
}

function collect<T>(n: number, creatorFn: (ix: number) => T): T[] {
    const arr: T[] = [];
    repeat(n, (ix) => arr.push(creatorFn(ix)));
    return arr;
}

function posToString(p: p5.Vector) {
    return `${Math.round(p.x)}, ${Math.round(p.y)}`;
}

function randomPos(): p5.Vector {
    return createVector(random(width), random(height));
}
function randomWorldPos(): p5.Vector {
    return createVector(
        random(-world.worldWidth / 2, world.worldWidth / 2),
        random(-world.worldHeight / 2, world.worldHeight / 2),
    );
}

function drawVec(
    vec: p5.Vector,
    len: number,
    minMag: number,
    maxMag: number,
    c: p5.Color,
    lineWidth: number = 1,
) {
    push();
    rotate(vec.heading());
    stroke(c);
    strokeWeight(lineWidth);
    line(0, 0, map(vec.mag(), 0, maxMag, 0, len), 0);
    pop();
}

function isColliding(a: Collidable, s: Collidable) {
    return (
        dist(a.pos.x, a.pos.y, s.pos.x, s.pos.y) <
        a.collisionRadius + s.collisionRadius
    );
}

function calcNearestEntity<
    A extends { pos: p5.Vector },
    B extends { pos: p5.Vector },
>(ship: A, entities: B[]): B | null {
    //TODO: just use minBy from lodash or something
    let recordDist = Number.MAX_SAFE_INTEGER;
    let recordEnt = null;

    entities.forEach((ent) => {
        const dst = ent.pos.dist(ship.pos);
        if (dst < recordDist) {
            recordDist = dst;
            recordEnt = ent;
        }
    });
    return recordEnt;
}
