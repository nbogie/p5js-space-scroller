function updateOrb(p: Orb) {
    if (p.live) {
        p.pos.add(p.vel);
        if (Math.random() < 0.01) {
            p.exploding = true;
            screenShake(4);
        }
        if (p.exploding) {
            p.radius *= 2;
            p.life -= 0.03;
            if (p.life <= 0) {
                p.live = false;
            }
        } else {
            p.radius = map(sin(frameCount / 3), -1, 1, 10, 30);
        }
    }
}

function addOrb(opts: OrbOptions) {
    const orb = {
        pos: opts.pos.copy(),
        vel: opts.vel.copy(),
        live: true,
        life: 1,
        radius: 30,
        exploding: false,
    };
    orbs.unshift(orb);
    orbs.splice(10);
}

function drawOrb(o: Orb) {
    if (o.live) {
        push();
        translateForScreenCoords(o.pos);
        noStroke();
        fill("white");
        circle(0, 0, o.radius);
        pop();
    }
}
