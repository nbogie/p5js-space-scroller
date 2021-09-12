
function addTarget(pos: Target) {
    gTargets.unshift(pos);
    gTargets.splice(gNumTargets);
    vehicles.forEach((v, ix) => {
        v.target = gTargets[ix % gTargets.length];
    });
}

function acquireTarget(vehicle: Vehicle) {
    const closeAsteroids = asteroids.filter(
        a => a.pos.dist(vehicle.pos) < height
    );
    return random(closeAsteroids.length > 0 ? closeAsteroids : asteroids);
}



function drawTarget(t: Target) {
    push();

    translateForScreenCoords(t.pos);
    noFill();
    colorMode(HSB, 100);

    stroke(0, 100, 100);
    circle(0, 0, 25);
    drawTargetPetals(4, (ix: number) => {
        repeat(3, (jx: number) => {
            push();
            translate(jx * 4 + 8, 0);
            line(0, -2 * jx, 0, 2 * jx);
            pop();
        });
    });

    pop();
}
function drawTargetPetals(numPetals: number, fn: (ix: number) => void) {
    const angle = TWO_PI / numPetals;
    push();
    repeat(numPetals, (ix: number) => {
        fn(ix);
        rotate(angle);
    });
    pop();
}
