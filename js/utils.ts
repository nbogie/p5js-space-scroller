
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

function posToString(p: p5.Vector) {
    return `${Math.round(p.x)}, ${Math.round(p.y)}`;
}


function randomPos(): p5.Vector {
    return createVector(random(width), random(height));
}
function randomWorldPos(): p5.Vector {
    return createVector(
        random(-worldWidth / 2, worldWidth / 2),
        random(-worldHeight / 2, worldHeight / 2)
    );
}



function drawVec(
    vec: p5.Vector,
    len: number,
    minMag: number,
    maxMag: number,
    c: p5.Color,
    lineWidth: number = 1
) {
    push();
    rotate(vec.heading());
    stroke(c);
    strokeWeight(lineWidth);
    line(0, 0, map(vec.mag(), 0, maxMag, 0, len), 0);
    pop();
}