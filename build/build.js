"use strict";
function shatterAsteroid(a) {
    playSoundAsteroidDestroyed(a.sizeCategory);
    if (a.sizeCategory >= 2) {
        addAsteroid({ pos: a.pos.copy(), sizeCategory: a.sizeCategory - 1 });
        addAsteroid({ pos: a.pos.copy(), sizeCategory: a.sizeCategory - 1 });
        if (nearCamera(a.pos)) {
            screenShake(a.sizeCategory);
        }
    }
}
function drawAsteroid(a) {
    if (a.live) {
        push();
        translateForScreenCoords(a.pos);
        colorMode(HSB, 100);
        push();
        rotate(a.rotation);
        fill(a.tookDamage ? color("white") : a.resType.color);
        noStroke();
        square(0, 0, a.radius * 2.7, 6, 6);
        pop();
        fill('white');
        textSize(14);
        textAlign(CENTER, CENTER);
        stroke("black");
        strokeWeight(2);
        text(a.hp, 0, 0);
        pop();
    }
}
function addAsteroid(opts) {
    asteroids.push(createAsteroidAt(opts));
}
function createAsteroid() {
    return createAsteroidAt({ pos: randomWorldPos() });
}
function createAsteroidAt(opts) {
    var sz = opts.sizeCategory || random([1, 2, 3, 4]);
    return {
        live: true,
        pos: opts.pos.copy(),
        vel: p5.Vector.random2D().mult(random(1, 5)),
        resType: random(resTypes),
        sizeCategory: sz,
        radius: sz * 7,
        damage: sz,
        hp: sz * 20,
        rotation: random(TWO_PI),
        rotationSpeed: random(-0.1, 0.1),
        tookDamage: false
    };
}
function createAsteroids(n) {
    repeat(n, function (ix) { return asteroids.push(createAsteroid()); });
}
function updateAsteroid(p) {
    if (p.live) {
        p.pos.x += p.vel.x;
        p.pos.y += p.vel.y;
        if (p.pos.x < -worldWidth / 2) {
            p.pos.x += worldWidth / 2;
        }
        if (p.pos.x > worldWidth / 2) {
            p.pos.x -= worldWidth / 2;
        }
        if (p.pos.y < -worldHeight / 2) {
            p.pos.y += worldHeight / 2;
        }
        if (p.pos.y > worldHeight / 2) {
            p.pos.y -= worldHeight / 2;
        }
        p.rotation += p.rotationSpeed;
        vehicles
            .filter(function (v) { return true || v.live; })
            .forEach(function (v) {
            if (isColliding(p, v)) {
                p.hp -= v.rammingDamage;
                p.tookDamage = true;
                v.hp -= p.damage;
                if (v.hp <= 0) {
                    v.live = false;
                }
                v.tookDamage = true;
                if (p.hp <= 0) {
                    p.live = false;
                    shatterAsteroid(p);
                }
            }
        });
    }
    p.tookDamage = false;
}
function updateCamera(cameraPos, trackedVehicle) {
    if (keyIsDown(LEFT_ARROW)) {
        cameraPos.x += cameraMoveSpeed;
    }
    if (keyIsDown(RIGHT_ARROW)) {
        cameraPos.x -= cameraMoveSpeed;
    }
    if (keyIsDown(UP_ARROW)) {
        cameraPos.y += cameraMoveSpeed;
    }
    if (keyIsDown(DOWN_ARROW)) {
        cameraPos.y -= cameraMoveSpeed;
    }
    if (trackedVehicle) {
        trackVehicleWithCamera(trackedVehicle);
        if (screenShakeAmount > 0) {
            shakeCamera(screenShakeAmount);
            screenShakeAmount -= 0.4;
        }
    }
}
function shakeCamera(amt) {
    cameraPos.add(p5.Vector.random2D().mult(amt));
}
function trackVehicleWithCamera(v) {
    var velExtra = v.vel.copy().mult(20);
    cameraPos.x = v.pos.x - width / 2 + velExtra.x;
    cameraPos.y = v.pos.y - height / 2 + velExtra.y;
}
function distFromCamera(p) {
    return p5.Vector.dist(cameraPos.copy().add(createVector(width / 2, height / 2)), p);
}
function nearCamera(pos) {
    return distFromCamera(pos) < height;
}
function screenShake(amt) {
    screenShakeAmount += amt;
    if (screenShakeAmount > maxScreenShakeAmount) {
        screenShakeAmount = maxScreenShakeAmount;
    }
}
function translateForScreenCoords(pos, labelled) {
    if (labelled === void 0) { labelled = false; }
    var screenCoords = pos.copy().sub(cameraPos);
    translate(Math.round(pos.x - cameraPos.x), Math.round(pos.y - cameraPos.y));
    if (labelled) {
        fill("white");
        textSize(10);
        text(Math.round(screenCoords.x) + "," + Math.round(screenCoords.y), 20, 0);
    }
}
function isOnScreen(pos, radius) {
    return (pos.x + radius >= cameraPos.x &&
        pos.x - radius <= cameraPos.x + width &&
        pos.y + radius >= cameraPos.y &&
        pos.y - radius <= cameraPos.y + height);
}
function drawGridLines() {
    var numCols = (8 * worldWidth) / width;
    var numRows = (8 * worldHeight) / width;
    for (var col = 0; col < numCols; col++) {
        for (var row = 0; row < numRows; row++) {
            var pos = createVector((col * width) / 2 - worldWidth / 2, (row * width) / 2 - worldHeight / 2);
            push();
            translateForScreenCoords(pos);
            strokeWeight(0.1);
            colorMode(RGB, 255);
            stroke(color(255, 255, 255, 120));
            line(0, -width / 2, 0, width / 2);
            line(-width / 2, 0, width / 2, 0);
            pop();
        }
    }
}
function numberOfWorldPages() {
    return Math.pow(worldWidth / width, 2);
}
function drawHUD() {
    push();
    fill("white");
    textSize(12);
    if (trackedVehicle) {
        text("Health: " + trackedVehicle.hp, width - 100, 50);
    }
    text(Math.round(frameRate()) + " fps", 50, 575);
    text("Camera: " +
        JSON.stringify({
            x: Math.round(cameraPos.x),
            y: Math.round(cameraPos.y)
        }), 50, 600);
    pop();
}
p5.disableFriendlyErrors = true;
var shouldDrawTrails = true;
var shouldDrawStars = false;
var shouldPlaySound = true;
var soundNotYetEnabledByGesture = true;
var trackedVehicle;
var stars = [];
var vehicles = [];
var asteroids = [];
var gTargets = [];
var orbs = [];
var gNumTargets = 6;
var gNumVehicles = 6;
var gAsteroids = [];
var gShots = [];
var worldWidth = 6000;
var worldHeight = 5000;
var cameraPos;
var cameraMoveSpeed = 5;
var maxScreenShakeAmount = 10;
var screenShakeAmount = 0;
var gPalette;
function setup() {
    createCanvas(windowWidth, windowHeight);
    cameraPos = createVector(0, 0);
    frameRate(60);
    angleMode(RADIANS);
    randomizeBigPalette();
    setPaletteForResources();
    createVehicles(gNumVehicles);
    createAsteroids(10 * numberOfWorldPages());
    createStarfield();
    background("black");
    ellipseMode(CENTER);
    rectMode(CENTER);
}
function draw() {
    background(0);
    drawAll();
    updateAll();
}
function drawAll() {
    push();
    if (shouldDrawStars) {
        drawStarfield();
    }
    drawGridLines();
    orbs.forEach(function (o) { return drawOrb(o); });
    var shotsToDraw = gShots.filter(function (s) { return s.live && distFromCamera(s.pos) < width; });
    shotsToDraw.forEach(drawShot);
    asteroids.forEach(drawAsteroid);
    vehicles.forEach(drawVehicle);
    vehicles
        .filter(function (v) { return v.target && v.target.live; })
        .forEach(function (v) { return drawTarget(v.target); });
    pop();
    drawHUD();
}
function updateAll() {
    gShots.forEach(updateShot);
    vehicles.forEach(updateVehicle);
    asteroids.forEach(updateAsteroid);
    orbs.forEach(updateOrb);
    updateCamera(cameraPos, trackedVehicle);
    trackedVehicle = vehicles.find(function (v) { return v.hp > 0; });
    updateEngineWhistleSound();
}
function keyPressed() {
    switch (key) {
        case "m":
            toggleMute();
            break;
        case "r":
            randomizePalette();
            break;
        case "o":
            if (trackedVehicle) {
                addOrb(trackedVehicle);
            }
            break;
        case "b":
            randomizeMonoPalette();
            redraw();
            break;
    }
}
function mouseMoved() { }
function mousePressed() {
    if (shouldPlaySound && soundNotYetEnabledByGesture) {
        soundNotYetEnabledByGesture = false;
        setupSound();
    }
    addAsteroid({ pos: mouseWorldPos() });
}
var resTypes = [
    { label: "fuel", hue: 55, color: null },
    { label: "laser", hue: 30, color: null },
    { label: "explosive", hue: 0, color: null },
    { label: "magic", hue: 80, color: null }
];
function mouseWorldPos() {
    return cameraPos.copy().add(mousePos());
}
function mousePos() {
    return createVector(mouseX, mouseY);
}
function updateOrb(p) {
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
        }
        else {
            p.radius = map(sin(frameCount / 3), -1, 1, 10, 30);
        }
    }
}
function addOrb(opts) {
    var orb = {
        pos: opts.pos.copy(),
        vel: opts.vel.copy(),
        live: true,
        life: 1,
        radius: 30,
        exploding: false
    };
    orbs.unshift(orb);
    orbs.splice(10);
}
function drawOrb(o) {
    if (o.live) {
        push();
        translateForScreenCoords(o.pos);
        noStroke();
        fill("white");
        circle(0, 0, o.radius);
        pop();
    }
}
var FaveColors = {
    paletteStrs: [
        "#F8B195,#F67280,#C06C84,#6C5B7B,#355C7D,#F8B195,#F67280,#C06C84|1001 stories|http://www.colourlovers.com/palette/1811244/1001_Stories",
        "#5E412F,#FCEBB6,#78C0A8,#F07818,#F0A830,#5E412F,#FCEBB6,#78C0A8|papua new guinea|http://www.colourlovers.com/palette/919313/Papua_New_Guinea",
        "#452632,#91204D,#E4844A,#E8BF56,#E2F7CE,#452632,#91204D,#E4844A|trance|http://www.colourlovers.com/palette/594151/t_r_a_n_c_e",
        "#F0D8A8,#3D1C00,#86B8B1,#F2D694,#FA2A00,#F0D8A8,#3D1C00,#86B8B1|koi carp|http://www.colourlovers.com/palette/656966/Koi_Carp",
        "#FF4E50,#FC913A,#F9D423,#EDE574,#E1F5C4,#FF4E50,#FC913A,#F9D423|dance to forget|http://www.colourlovers.com/palette/937624/Dance_To_Forget",
        "#99B898,#FECEA8,#FF847C,#E84A5F,#2A363B,#99B898,#FECEA8,#FF847C|coup de grace|http://www.colourlovers.com/palette/1098589/coup_de_gr%C3%A2ce",
        "#FF4242,#F4FAD2,#D4EE5E,#E1EDB9,#F0F2EB,#FF4242,#F4FAD2,#D4EE5E|wasabi suicide|http://www.colourlovers.com/palette/482416/Wasabi_Suicide",
        "yellow,yellow,gray||",
        "#c70000,#f4b600,#2d2bb4,black||",
        "black,gray,white||",
        "white||",
        "#FE4365,#FC9D9A,#F9CDAD,#C8C8A9,#83AF9B,#FE4365,#FC9D9A,#F9CDAD||",
        "#69D2E7,#A7DBD8,#E0E4CC,#F38630,#FA6900,#69D2E7,#A7DBD8,#E0E4CC||",
        "#556270,#4ECDC4,#C7F464,#FF6B6B,#C44D58,#556270,#4ECDC4,#C7F464||",
        "#E94E77,#D68189,#C6A49A,#C6E5D9,#F4EAD5|LoversInJapan by lovelyrita|http://www.colourlovers.com/palette/867235/LoversInJapan",
        "#00A0B0,#6A4A3C,#CC333F,#EB6841,#EDC951|Ocean Five by DESIGNJUNKEE|http://www.colourlovers.com/palette/1473/Ocean_Five",
        "#B9D7D9,#668284,#2A2829,#493736,#7B3B3B|Entrapped InAPalette by annajak|",
        "#D1F2A5,#EFFAB4,#FFC48C,#FF9F80,#F56991|mellon ball surprise by Skyblue2u|",
        "#00A8C6,#40C0CB,#F9F2E7,#AEE239,#8FBE00|fresh cut day by electrikmonk|"
    ],
    createPalettes: function () {
        var makePalette = function (str) {
            var _a = str.split("|"), colorsStr = _a[0], name = _a[1], url = _a[2];
            return {
                colors: colorsStr.split(",").map(function (n) { return color(n); }),
                name: name,
                url: url
            };
        };
        var palettes = FaveColors.paletteStrs.map(makePalette);
        return palettes;
    },
    randomPalette: function () {
        return random(FaveColors.createPalettes());
    },
    randomBigPalette: function (minSize) {
        return random(FaveColors.createPalettes().filter(function (p) { return p.colors.length >= minSize; }));
    },
    randomMonoPalette: function () {
        var pal = Object.assign({}, FaveColors.randomPalette());
        pal.colors = _.sampleSize(pal.colors, 2);
        return pal;
    }
};
function randomizePalette() {
    gPalette = FaveColors.randomPalette();
}
function randomizeBigPalette() {
    gPalette = FaveColors.randomBigPalette(5);
}
function randomizeMonoPalette() {
    gPalette = FaveColors.randomMonoPalette();
}
function randomColor() {
    return random(gPalette.colors);
}
function createEmptyColor() {
    return color(255, 0);
}
function randomColorOrTransparent() {
    return random([randomColor(), createEmptyColor()]);
}
function setPaletteForResources() {
    randomizeBigPalette();
    resTypes.forEach(function (rt, ix) {
        rt.color = gPalette.colors[ix];
    });
}
function getColorForShipHP(hp) {
    return lerpColor(color("red"), color("green"), (max(hp, 20) - 20) / 100);
}
function createParticle() {
    return createParticleAt(createVector(random(width), random(height)));
}
function createParticleAt(pos) {
    return {
        pos: pos.copy(),
        vel: p5.Vector.random2D(),
        hue: random(10),
        radius: random(0.5, 3),
        color: randomColor(),
        life: 1
    };
}
function drawParticle(p) {
    if (p.life <= 0) {
        return;
    }
    push();
    translateForScreenCoords(p.pos);
    colorMode(HSB, 100);
    fill(color(p.hue, 100, 100, map(p.life, 0.8, 1, 0, 100)));
    noStroke();
    var sz = map(p.life, 0, 1, 0, 2);
    circle(0, 0, sz);
    pop();
}
function updateParticle(p) {
    p.pos.x += p.vel.x;
    p.pos.y += p.vel.y;
    p.life -= random(0.001, 0.01);
}
function addParticle(p, ps) {
    ps.unshift(p);
    ps.splice(100);
}
function createTrail() {
    var ps = [];
    return { particles: ps };
}
function drawTrail(trail) {
    trail.particles.forEach(function (p) {
        push();
        translateForScreenCoords(p.pos);
        noStroke();
        fill(p.color);
        square(0, 0, p.radius * 2);
        pop();
    });
}
function createShot(opts) {
    colorMode(HSB, 100);
    var shotSpread = PI / 32;
    var sz = random([4, 5, 6, 7]);
    var vel = opts.vel
        .copy()
        .normalize()
        .mult(25)
        .rotate(random(-shotSpread, shotSpread));
    var shot = {
        live: true,
        pos: opts.pos.copy().add(vel),
        rotation: vel.heading(),
        vel: vel,
        radius: Math.pow(sz, 2),
        damage: sz,
        color: color(random(50, 70), 100, 100, 100),
        life: 1
    };
    return shot;
}
function addShot(opts) {
    var shot = createShot(opts);
    gShots.unshift(shot);
    gShots.splice(100);
    if (nearCamera(shot.pos)) {
        playSoundShot();
    }
}
function drawShot(s) {
    if (s.live) {
        push();
        translateForScreenCoords(s.pos);
        fill(s.color);
        noStroke();
        rotate(s.rotation);
        rect(0, 0, s.radius, s.radius / 2);
        pop();
    }
}
function updateShot(p) {
    if (p.live) {
        p.pos.x += p.vel.x;
        p.pos.y += p.vel.y;
        asteroids
            .filter(function (a) { return a.live; })
            .forEach(function (a) {
            if (isColliding(a, p)) {
                a.hp -= p.damage;
                a.tookDamage = true;
                p.live = false;
                if (a.hp <= 0) {
                    a.live = false;
                    shatterAsteroid(a);
                }
            }
        });
        p.life -= random(0.001, 0.01);
    }
}
function shootIfTime(p) {
    var ms = millis();
    if (ms - p.lastShot > p.shotDelay) {
        addShot({
            pos: p.pos,
            vel: p.vel
                .copy()
                .normalize()
                .mult(40)
                .add(p.vel)
        });
        p.lastShot = ms;
    }
}
function updateShooting(p) {
    var angleOff = p.desiredVector.angleBetween(p.vel);
    p.canShoot = angleOff < TWO_PI / 36;
    if (p.canShoot) {
        shootIfTime(p);
    }
}
var shootOsc;
var shootEnv;
var asteroidHitNoise;
var engineWhistleNoise;
var engineWhistleFilter;
var engineWhistleFilterFreq;
var engineWhistleFilterWidth;
function setupSound() {
    setupEngineWhistleSound();
    setupShootSound();
    setupAsteroidHitSound();
}
function toggleMute() {
    shouldPlaySound = !shouldPlaySound;
}
function setupAsteroidHitSound() {
    asteroidHitNoise = new p5.Noise('white');
    asteroidHitNoise.start();
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
    engineWhistleNoise = new p5.Noise('white');
    engineWhistleNoise.disconnect();
    engineWhistleFilter.process(engineWhistleNoise);
    engineWhistleNoise.start();
}
function playSoundAsteroidDestroyed(level) {
    if (!shouldPlaySound || soundNotYetEnabledByGesture) {
        return;
    }
    var env = new p5.Envelope();
    var releaseTime = { 1: 0.05, 2: 0.05, 3: 0.1, 4: 1 };
    env.setADSR(random(0.001, 0.002), 0.1, 0.2, releaseTime[level]);
    env.setRange(1, 0);
    env.play(asteroidHitNoise);
}
function playSoundShot() {
    if (!shouldPlaySound || soundNotYetEnabledByGesture) {
        return;
    }
    shootOsc.freq(random([110, 220, 330, 260]));
    shootEnv.play(shootOsc);
}
function updateEngineWhistleSound() {
    var _a;
    if (!shouldPlaySound || soundNotYetEnabledByGesture) {
        return;
    }
    engineWhistleFilterWidth = 50;
    var maxVel = 5;
    var vel = (_a = trackedVehicle === null || trackedVehicle === void 0 ? void 0 : trackedVehicle.vel) === null || _a === void 0 ? void 0 : _a.mag();
    if (vel) {
        engineWhistleFilterFreq = map(vel, 0, maxVel, 10, 8000);
    }
    engineWhistleFilter.set(engineWhistleFilterFreq, engineWhistleFilterWidth);
}
function createStarfield() {
    repeat(1000 * numberOfWorldPages(), function (ix) {
        return stars.push({
            pos: randomWorldPos(),
            radius: random(0.5, random(0.5, 3)),
            strength: random(100)
        });
    });
}
function drawStarfield() {
    stars
        .filter(function (s) { return isOnScreen(s.pos, 5); })
        .forEach(function (s) {
        var r = Math.random() > 0.9 ? s.radius * 2 : 0;
        push();
        colorMode(HSB, 100);
        var colr = color(0, 0, 100, s.strength);
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
function addTarget(pos) {
    gTargets.unshift(pos);
    gTargets.splice(gNumTargets);
    vehicles.forEach(function (v, ix) {
        v.target = gTargets[ix % gTargets.length];
    });
}
function acquireTarget(vehicle) {
    var closeAsteroids = asteroids.filter(function (a) { return a.pos.dist(vehicle.pos) < height; });
    return random(closeAsteroids.length > 0 ? closeAsteroids : asteroids);
}
function drawTarget(t) {
    push();
    translateForScreenCoords(t.pos);
    noFill();
    colorMode(HSB, 100);
    stroke(0, 100, 100);
    circle(0, 0, 25);
    drawTargetPetals(4, function (ix) {
        repeat(3, function (jx) {
            push();
            translate(jx * 4 + 8, 0);
            line(0, -2 * jx, 0, 2 * jx);
            pop();
        });
    });
    pop();
}
function drawTargetPetals(numPetals, fn) {
    var angle = TWO_PI / numPetals;
    push();
    repeat(numPetals, function (ix) {
        fn(ix);
        rotate(angle);
    });
    pop();
}
function randInt(min, max) {
    return Math.floor(random(min, max + 1));
}
function atLeastTwoOf(fns) {
    var pickedFns = _.sampleSize(fns, randInt(2, fns.length));
    pickedFns.forEach(function (f) { return f(); });
}
function repeat(n, fn) {
    for (var i = 0; i < n; i++) {
        fn(i, n);
    }
}
function posToString(p) {
    return Math.round(p.x) + ", " + Math.round(p.y);
}
function randomPos() {
    return createVector(random(width), random(height));
}
function randomWorldPos() {
    return createVector(random(-worldWidth / 2, worldWidth / 2), random(-worldHeight / 2, worldHeight / 2));
}
function drawVec(vec, len, minMag, maxMag, c, lineWidth) {
    if (lineWidth === void 0) { lineWidth = 1; }
    push();
    rotate(vec.heading());
    stroke(c);
    strokeWeight(lineWidth);
    line(0, 0, map(vec.mag(), 0, maxMag, 0, len), 0);
    pop();
}
function isColliding(a, s) {
    return dist(a.pos.x, a.pos.y, s.pos.x, s.pos.y) < a.radius + s.radius;
}
function drawVehicle(p) {
    if (shouldDrawTrails) {
        drawTrail(p.trail);
    }
    push();
    translateForScreenCoords(p.pos);
    colorMode(HSB, 100);
    fill(p.tookDamage
        ? color("white")
        : p.canShoot
            ? color(p.hue, 40, 100)
            : color("gray"));
    noStroke();
    var sz = 10;
    push();
    rotate(p.facing);
    beginShape();
    vertex(-sz, -sz);
    vertex(-sz, sz);
    vertex(sz, 0);
    endShape();
    pop();
    drawVec(p.desiredVector, 100, 0, 1, color(0, 0, 100, 20), 1);
    drawVec(p.vel, 50, 0, p.maxSpeed, color(30, 0, 100, 30), 4);
    drawVec(p.steer, 30, 0, p.maxSteeringForce, color(0, 100, 100, 25), 1);
    push();
    if (p.live) {
        translate(0, -30);
        fill("#101010");
        rectMode(CENTER);
        rect(0, 0, 30, 6);
        fill(getColorForShipHP(p.hp));
        rectMode(CORNER);
        rect(-15, -3, map(p.hp, 0, 100, 0, 30), 6);
        rectMode(CENTER);
    }
    else {
        translate(-15, -30);
        text("DEAD", 0, 0);
    }
    pop();
    pop();
}
function updateVehicle(v) {
    v.pos.add(v.vel);
    var vel = createVector(v.vel.x, v.vel.y);
    var currPos = createVector(v.pos.x, v.pos.y);
    if (!v.live) {
        return;
    }
    if (v.target && v.target.live) {
        var targetPos = createVector(v.target.pos.x, v.target.pos.y);
        var desired = p5.Vector.sub(targetPos, currPos);
        desired.normalize();
        desired.mult(v.maxSpeed);
        v.desiredVector = desired.copy().normalize();
        v.facing = v.desiredVector
            .copy()
            .normalize()
            .heading();
        var steer = p5.Vector.sub(desired, vel);
        steer.limit(v.maxSteeringForce);
        v.steer = steer.copy();
        v.accel.add(steer);
        v.fuel -= v.accel.mag();
    }
    else {
        v.target = acquireTarget(v);
    }
    v.vel.add(v.accel);
    updateShooting(v);
    v.trail.particles.forEach(updateParticle);
    v.life -= random(0.001, 0.01);
    var trailParticle = createParticleAt(v.pos);
    trailParticle.vel = v.accel
        .copy()
        .mult(20)
        .rotate(180 + random(-1, 1));
    addParticle(trailParticle, v.trail.particles);
    v.accel.mult(0);
    v.tookDamage = false;
}
function createVehicles(n) {
    repeat(n, function (ix) { return vehicles.push(createVehicle()); });
}
function createVehicle() {
    return {
        live: true,
        pos: randomWorldPos(),
        vel: createVector(0, 0),
        accel: createVector(0, 0),
        radius: 10,
        hp: 100,
        target: undefined,
        fuel: 100,
        desiredVector: createVector(0, 0),
        maxSteeringForce: 0.2,
        maxSpeed: random(2, 10),
        facing: random(TWO_PI),
        hue: random(0, 100),
        color: randomColor(),
        traction: 0.3,
        steer: createVector(0, 0),
        rammingDamage: 3,
        canShoot: false,
        lastShot: -99999,
        shotDelay: 100,
        trail: createTrail(),
        tookDamage: false,
        life: 1
    };
}
//# sourceMappingURL=build.js.map