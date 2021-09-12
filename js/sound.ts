
function setupSound() {
    if (!shouldPlaySound) {
        return;
    }
    var attackLevel = 1.0;
    var releaseLevel = 0;

    var attackTime = 0.001;
    var decayTime = 0.01;
    var susPercent = 0.2;
    var releaseTime = 0.05;

    shootEnv = new p5.Envelope();
    shootEnv.setADSR(attackTime, decayTime, susPercent, releaseTime);
    shootEnv.setRange(attackLevel, releaseLevel);

    shootOsc = new p5.Oscillator(440, "triangle");
    shootOsc.amp(shootEnv);
    shootOsc.start();
    shootOsc.freq(880);
}


function playSoundAsteroidDestroyed() {
    if (!shouldPlaySound) {
        return;
    }
    shootOsc.freq(random([1100, 2200, 3300, 2600]));

    shootEnv.play(shootOsc);
}

function playSoundShot() {
    if (!shouldPlaySound) {
        return;
    }
    shootOsc.freq(random([110, 220, 330, 260]));
    shootEnv.play(shootOsc);
}
