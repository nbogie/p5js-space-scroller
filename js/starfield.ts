function createStarfield() {
    repeat(1000 * numberOfWorldPages(), (ix: number) =>
        stars.push({
            pos: randomWorldPos(),
            radius: random(0.5, random(0.5, 3)),
            strength: random(100),
        }),
    );
}

function drawStarfield() {
    stars
        .filter((s) => isOnScreen(s.pos, 5))
        .forEach((s) => {
            const r = Math.random() > 0.9 ? s.radius * 2 : 0;
            push();
            colorMode(HSB, 100);
            const colr = color(0, 0, 100, s.strength);
            translateForScreenCoords(s.pos);
            fill(colr);
            noStroke();
            circle(0, 0, s.radius);
            stroke(colr);
            line(-r, 0, r, 0);
            line(0, -r, 0, r);
            pop();
        });
}
