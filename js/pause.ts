type Pausing = { type: "pausing"; framesLeft: number; simplified: "paused" };
type UnPausing = {
    type: "unpausing";
    framesLeft: number;
    simplified: "unpaused";
};
type Unpaused = { type: "unpaused"; simplified: "unpaused" };
type Paused = { type: "paused"; simplified: "paused" };
type PauseState = Unpaused | Paused | Pausing | UnPausing;

function togglePause() {
    if (pauseState.simplified === "unpaused") {
        pauseState = { type: "pausing", framesLeft: 10, simplified: "paused" };
    } else {
        pauseState = {
            type: "unpausing",
            simplified: "unpaused",
            framesLeft: 10,
        };
    }
}

function processAnyTimeDistortion() {
    switch (pauseState.type) {
        case "unpaused":
            return 1;
        case "paused":
            return 0;
        case "pausing": {
            pauseState.framesLeft = max(0, pauseState.framesLeft - 1);
            const t = pauseState.framesLeft / 10;
            if (pauseState.framesLeft <= 0) {
                pauseState = { type: "paused", simplified: "paused" };
            }
            return t;
        }
        case "unpausing": {
            pauseState.framesLeft = max(0, pauseState.framesLeft - 1);
            const t = 1 - pauseState.framesLeft / 10;
            if (pauseState.framesLeft <= 0) {
                pauseState = { type: "unpaused", simplified: "unpaused" };
            }
            return t;
        }
        default:
            throw new Error(
                "unknown pause state: " + JSON.stringify(pauseState),
            );
    }
}

function drawPauseDialogIfNeeded() {
    if (pauseState.simplified === "paused" || pauseState.type === "unpausing") {
        push();
        const overlayOpacityFraction = 1 - constrain(world.timeSpeed, 0, 1);

        fill(0, 150 * overlayOpacityFraction);
        rect(width / 2, height / 2, width, height);
        fill(255);
        textAlign(CENTER, CENTER);
        const sz = 36 * overlayOpacityFraction;
        textSize(sz);
        text("Paused", width / 2, height / 2 - 20);
        textSize(sz * 0.5);
        text("Press P to unpause", width / 2, height / 2 + 20);
        pop();
    }
}
