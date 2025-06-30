function createParticle() {
    return createParticleAt(createVector(random(width), random(height)));
}

function createParticleAt(pos: p5.Vector) {
    return {
        pos: pos.copy(),
        vel: p5.Vector.random2D(),
        hue: random(10),
        radius: random(0.5, 3),
        color: randomColor(),
        life: 1,
    };
}
function drawParticle(p: Particle) {
    if (p.life <= 0) {
        return;
    }
    push();
    translateForScreenCoords(p.pos);
    colorMode(HSB, 100);
    fill(color(p.hue, 100, 100, map(p.life, 0.8, 1, 0, 100)));
    noStroke();
    const sz = map(p.life, 0, 1, 0, 2);
    circle(0, 0, sz);
    pop();
}

function updateParticle(p: Particle) {
    p.pos.x += p.vel.x * world.timeSpeed;
    p.pos.y += p.vel.y * world.timeSpeed;
    p.life -= random(0.001, 0.01) * world.timeSpeed;
}

function addParticle(p: Particle, ps: Particle[]) {
    ps.unshift(p);
    ps.splice(100);
}

function createTrail() {
    const ps: Particle[] = [];
    return { particles: ps };
}
function drawTrail(trail: Trail) {
    trail.particles.forEach((p: Particle) => {
        push();
        translateForScreenCoords(p.pos);

        noStroke();
        fill(p.color);

        square(0, 0, p.radius * 2);
        pop();
    });
}
