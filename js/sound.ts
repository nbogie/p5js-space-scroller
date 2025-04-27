//consider adding some sounds from:
// https://www.kabisa.nl/tech/browser-beats-i-synthesizing-a-kick-drum/
// https://dev.opera.com/articles/drum-sounds-webaudio/
// https://sonoport.github.io/synthesising-sounds-webaudio.html
let shootOsc: p5.Oscillator;
let shootEnv: p5.Envelope;
let asteroidHitNoise: p5.Noise;
let engineWhistleNoise: p5.Noise;
let engineWhistleFilter: p5.BandPass;
let engineWhistleFilterFreq: number;
let engineWhistleFilterWidth: number;

function setupSound() {
    setupEngineWhistleSound();
    setupShootSound();
    setupAsteroidHitSound();
}

function toggleMute() {
    config.shouldPlaySound = !config.shouldPlaySound;
}
function setupAsteroidHitSound() {
    asteroidHitNoise = new p5.Noise("white"); // other types include 'brown' and 'pink'
    asteroidHitNoise.start();

    // multiply asteroidHitNoise volume by 0
    // (keep it quiet until we're ready to make asteroidHitNoise!)
    asteroidHitNoise.amp(0);
}

function setupShootSound() {
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

function setupEngineWhistleSound() {
    engineWhistleFilter = new p5.BandPass();

    engineWhistleNoise = new p5.Noise("white");

    engineWhistleNoise.disconnect(); // Disconnect soundfile from master output...
    engineWhistleFilter.process(engineWhistleNoise); // ...and connect to whistleFilter so we'll only hear BandPass.
    engineWhistleNoise.start();
}
function playSoundAsteroidDestroyed(level: AsteroidSize) {
    if (!config.shouldPlaySound || soundNotYetEnabledByGesture) {
        return;
    }

    // shootOsc.freq(random([1100, 2200, 3300, 2600]));

    const env = new p5.Envelope();
    // set attackTime, decayTime, sustainRatio, releaseTime
    const releaseTime: Record<AsteroidSize, number> = {
        1: 0.05,
        2: 0.05,
        3: 0.1,
        4: 1,
    };
    env.setADSR(random(0.001, 0.002), 0.1, 0.2, releaseTime[level]);
    // set attackLevel, releaseLevel
    env.setRange(1, 0);
    env.play(asteroidHitNoise);
}

function playSoundShot() {
    if (!config.shouldPlaySound || soundNotYetEnabledByGesture) {
        return;
    }
    shootOsc.freq(random([110, 220, 330, 260]));
    shootEnv.play(shootOsc);
}

function updateEngineWhistleSound() {
    if (!config.shouldPlaySound || soundNotYetEnabledByGesture) {
        return;
    }

    // Map mouseX to a bandpass freq from the FFT spectrum range: 10Hz - 22050Hz
    // engineWhistleFilterFreq = map(mouseX, 0, width, 10, 22050);
    // Map mouseY to resonance/width
    // engineWhistleFilterWidth = map(mouseY, 0, height, 0, 90);
    engineWhistleFilterWidth = 50;
    const maxVel = 5;
    const vel = world.trackedVehicle?.vel?.mag();
    if (vel) {
        engineWhistleFilterFreq = map(vel, 0, maxVel, 10, 8000);
    }

    // set whistleFilter parameters
    engineWhistleFilter.set(engineWhistleFilterFreq, engineWhistleFilterWidth);
}
