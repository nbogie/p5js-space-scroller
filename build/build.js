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
        fill(a.tookDamage ? stdColours.white : a.resType.color);
        noStroke();
        square(0, 0, a.radius * 2.7, 6, 6);
        pop();
        fill("white");
        textSize(14);
        textAlign(CENTER, CENTER);
        stroke("black");
        strokeWeight(2);
        text(a.hp, 0, 0);
        pop();
    }
}
function addAsteroid(opts) {
    world.asteroids.push(createAsteroidAt(opts));
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
        tookDamage: false,
        minimapColour: color(0, 200, 200, 100),
    };
}
function setupAsteroids(n) {
    world.asteroids = collect(n, createAsteroid);
}
function updateAsteroid(p) {
    if (p.live) {
        p.pos.x += p.vel.x;
        p.pos.y += p.vel.y;
        if (p.pos.x < -world.worldWidth / 2) {
            p.pos.x += world.worldWidth / 2;
        }
        if (p.pos.x > world.worldWidth / 2) {
            p.pos.x -= world.worldWidth / 2;
        }
        if (p.pos.y < -world.worldHeight / 2) {
            p.pos.y += world.worldHeight / 2;
        }
        if (p.pos.y > world.worldHeight / 2) {
            p.pos.y -= world.worldHeight / 2;
        }
        p.rotation += p.rotationSpeed;
        world.vehicles
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
function updateCamera(posToChange, trackedVehicle) {
    if (keyIsDown(LEFT_ARROW)) {
        posToChange.x += world.camera.moveSpeed;
    }
    if (keyIsDown(RIGHT_ARROW)) {
        posToChange.x -= world.camera.moveSpeed;
    }
    if (keyIsDown(UP_ARROW)) {
        posToChange.y += world.camera.moveSpeed;
    }
    if (keyIsDown(DOWN_ARROW)) {
        posToChange.y -= world.camera.moveSpeed;
    }
    if (trackedVehicle) {
        trackVehicleWithCamera(trackedVehicle);
        if (world.camera.screenShakeAmount > 0) {
            shakeCamera(world.camera.screenShakeAmount);
            world.camera.screenShakeAmount -= 0.4;
        }
    }
}
function shakeCamera(amt) {
    world.camera.pos.add(p5.Vector.random2D().mult(amt));
}
function trackVehicleWithCamera(v) {
    var velExtra = v.vel.copy().mult(20);
    world.camera.pos.x = v.pos.x - width / 2 + velExtra.x;
    world.camera.pos.y = v.pos.y - height / 2 + velExtra.y;
}
function distFromCamera(p) {
    return p5.Vector.dist(world.camera.pos.copy().add(createVector(width / 2, height / 2)), p);
}
function nearCamera(pos) {
    return distFromCamera(pos) < height;
}
function screenShake(amt) {
    world.camera.screenShakeAmount += amt;
    if (world.camera.screenShakeAmount > world.camera.maxScreenShakeAmount) {
        world.camera.screenShakeAmount = world.camera.maxScreenShakeAmount;
    }
}
function translateForScreenCoords(pos, labelled) {
    if (labelled === void 0) { labelled = false; }
    var screenCoords = pos.copy().sub(world.camera.pos);
    var translation = getTranslationForScreenCoords(pos);
    translate(translation.x, translation.y);
    if (labelled) {
        fill("white");
        textSize(10);
        text("".concat(Math.round(screenCoords.x), ",").concat(Math.round(screenCoords.y)), 20, 0);
    }
}
function getTranslationForScreenCoords(pos) {
    return createVector(round(pos.x - world.camera.pos.x), round(pos.y - world.camera.pos.y));
}
function isOnScreen(pos, radius) {
    return (pos.x + radius >= world.camera.pos.x &&
        pos.x - radius <= world.camera.pos.x + width &&
        pos.y + radius >= world.camera.pos.y &&
        pos.y - radius <= world.camera.pos.y + height);
}
function drawGridLines() {
    push();
    var numCols = floor((8 * world.worldWidth) / width);
    var numRows = floor((8 * world.worldHeight) / width);
    for (var col = 0; col < numCols; col++) {
        for (var row = 0; row < numRows; row++) {
            var pos = createVector((col * width) / 2 - world.worldWidth / 2, (row * width) / 2 - world.worldHeight / 2);
            push();
            var translation = getTranslationForScreenCoords(pos);
            if (translation.mag() < width) {
                translateForScreenCoords(pos);
                strokeWeight(0.1);
                colorMode(RGB, 255);
                stroke(color(255, 255, 255, 120));
                line(0, -width / 2, 0, width / 2);
                line(-width / 2, 0, width / 2, 0);
            }
            pop();
        }
    }
    pop();
}
function numberOfWorldPages() {
    return Math.pow(world.worldWidth / width, 2);
}
function createConfig() {
    var newConfig = {
        shouldDrawTrails: true,
        shouldDrawStars: true,
        shouldPlaySound: false,
    };
    return newConfig;
}
function toggleConfigBooleanProperty(key) {
    return (config[key] = !config[key]);
}
function drawHUD() {
    push();
    fill("white");
    textSize(12);
    text("FPS: " + frameRate().toFixed(0), 100, 100);
    if (world.trackedVehicle) {
        text("Health: " + world.trackedVehicle.hp, width - 100, 50);
    }
    text(Math.round(frameRate()) + " fps", 50, 575);
    text(world.mobs.length + " mob(s)", 50, 475);
    text("Camera: " +
        JSON.stringify({
            x: Math.round(world.camera.pos.x),
            y: Math.round(world.camera.pos.y),
        }), 50, 600);
    push();
    if (world.trackedVehicle !== undefined) {
        var nearestExploderMob = calcNearestEntity(world.trackedVehicle, world.mobs.filter(function (m) { return m.type === "exploder"; }));
        var nearestTeleporterMob = calcNearestEntity(world.trackedVehicle, world.mobs.filter(function (m) { return m.type === "teleporter"; }));
        translateForScreenCoords(world.trackedVehicle.pos);
        noFill();
        stroke(255, 50);
        circle(0, 0, 100);
        pop();
        nearestExploderMob &&
            plotEntityOnRadar(nearestExploderMob, world.trackedVehicle.pos);
        nearestTeleporterMob &&
            plotEntityOnRadar(nearestTeleporterMob, world.trackedVehicle.pos);
        world.asteroids
            .filter(function (a) { return a.live; })
            .forEach(function (ast) { return plotEntityOnRadar(ast, world.trackedVehicle.pos); });
    }
}
function plotEntityOnRadar(entity, referencePos) {
    push();
    translateForScreenCoords(referencePos);
    noFill();
    circle(0, 0, 100);
    var vecToNearest = p5.Vector.sub(entity.pos, referencePos);
    var radarDist = min(vecToNearest.mag() / 20, 50);
    var offset = vecToNearest.copy().setMag(radarDist);
    translate(offset);
    stroke(entity.minimapColour);
    strokeWeight(5);
    point(0, 0);
    pop();
}
p5.disableFriendlyErrors = true;
var world;
var config;
var soundNotYetEnabledByGesture = true;
function setup() {
    createCanvas(windowWidth, windowHeight);
    config = createConfig();
    world = createWorld();
    setupStandardColours();
    randomizeBigPalette();
    setPaletteForResources();
    setupAsteroids(10);
    setupStarfield();
    setupVehicles(world.MAX_NUM_VEHICLES);
    setupMobs(10);
    var firstLiveVehicle = world.vehicles.find(function (v) { return v.hp > 0; });
    switchPlayerControlToVehicle(firstLiveVehicle);
    frameRate(60);
    angleMode(RADIANS);
    ellipseMode(CENTER);
    rectMode(CENTER);
}
function draw() {
    background(15);
    drawAll();
    updateAll();
}
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}
function drawAll() {
    push();
    if (config.shouldDrawStars) {
        drawStarfield();
    }
    drawGridLines();
    world.orbs.forEach(function (o) { return drawOrb(o); });
    world.mobs.forEach(function (ent) { return ent.drawFn(ent); });
    var shotsToDraw = world.shots.filter(function (s) { return s.live && distFromCamera(s.pos) < width; });
    shotsToDraw.forEach(drawShot);
    world.asteroids.forEach(drawAsteroid);
    world.vehicles.forEach(drawVehicle);
    world.vehicles
        .filter(function (v) { return v.target && v.target.live; })
        .forEach(function (v) { return drawTarget(v.target); });
    pop();
    drawHUD();
}
function updateAll() {
    world.shots.forEach(updateShot);
    world.vehicles.forEach(updateVehicle);
    world.asteroids.forEach(updateAsteroid);
    world.orbs.forEach(updateOrb);
    world.mobs.forEach(function (ent) { return ent.updateFn(ent); });
    updateCamera(world.camera.pos, world.trackedVehicle);
    updateEngineWhistleSound();
}
function switchPlayerControlToVehicle(v) {
    if (v) {
        var prevTrackedVehicle = world.trackedVehicle;
        if (prevTrackedVehicle && prevTrackedVehicle.isUnderPlayerControl) {
            prevTrackedVehicle.isUnderPlayerControl = false;
        }
        world.trackedVehicle = v;
        v.isUnderPlayerControl = true;
    }
    else {
        world.trackedVehicle.isUnderPlayerControl = false;
        world.trackedVehicle = undefined;
    }
}
var resTypes = [
    { label: "fuel", hue: 55, color: null },
    { label: "laser", hue: 30, color: null },
    { label: "explosive", hue: 0, color: null },
    { label: "magic", hue: 80, color: null },
];
function togglePause() {
    if (isLooping()) {
        noLoop();
    }
    else {
        loop();
    }
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
            if (world.trackedVehicle) {
                addOrb(world.trackedVehicle);
            }
            break;
        case "a":
            toggleAutopilot();
            break;
        case "b":
            randomizeMonoPalette();
            redraw();
            break;
        case "s":
            toggleShouldDrawStars();
            break;
        case "p":
            togglePause();
            break;
    }
}
function setupMobs(n) {
    world.mobs = collect(n, function (ix) { return createRandomMob(); });
}
function createRandomMob() {
    var fn = random([createExploderMob, createTeleporterMob]);
    var mob = fn();
    return mob;
}
function drawExploderMob(mob) {
    push();
    noStroke();
    fill(mob.colour);
    translateForScreenCoords(mob.pos);
    rectMode(CENTER);
    square(0, 0, 20 + sin(frameCount / 20) * 10);
    text("Exploder", 20, 20);
    pop();
}
function drawTeleporterMob(mob) {
    push();
    noStroke();
    fill(mob.colour);
    translateForScreenCoords(mob.pos);
    rectMode(CENTER);
    circle(0, 0, 20);
    text("Teleporter", 20, 20);
    pop();
}
function updateExploderMob() {
}
function updateTeleporterMob(mob) {
    var shouldTeleport = millis() - mob.timeOfLastTeleport > 3000 && random() < 0.01;
    if (shouldTeleport) {
        var hopDist = random(400, 4000);
        mob.pos.add(p5.Vector.random2D().mult(hopDist));
        mob.timeOfLastTeleport = millis();
    }
}
function createExploderMob() {
    return {
        pos: randomWorldPos(),
        vel: p5.Vector.random2D().mult(0.3),
        state: "dormant",
        type: "exploder",
        colour: color(random(200, 255), random(200, 255), random(0, 50)),
        minimapColour: color("orange"),
        drawFn: drawExploderMob,
        updateFn: updateExploderMob,
    };
}
function createTeleporterMob() {
    return {
        pos: randomWorldPos(),
        vel: p5.Vector.random2D().mult(0.3),
        type: "teleporter",
        colour: color("magenta"),
        drawFn: drawTeleporterMob,
        updateFn: updateTeleporterMob,
        minimapColour: color("magenta"),
        timeOfLastTeleport: 0,
    };
}
function mouseMoved() { }
function mousePressed() {
    if (config.shouldPlaySound && soundNotYetEnabledByGesture) {
        soundNotYetEnabledByGesture = false;
        setupSound();
    }
    addAsteroid({ pos: mouseWorldPos() });
}
function mouseWorldPos() {
    return world.camera.pos.copy().add(mousePos());
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
        exploding: false,
    };
    world.orbs.unshift(orb);
    world.orbs.splice(10);
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
var gPalette;
var stdColours;
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
        "#00A8C6,#40C0CB,#F9F2E7,#AEE239,#8FBE00|fresh cut day by electrikmonk|",
    ],
    createPalettes: function () {
        var makePalette = function (str) {
            var _a = str.split("|"), colorsStr = _a[0], name = _a[1], url = _a[2];
            return {
                colors: colorsStr.split(",").map(function (n) { return color(n); }),
                name: name,
                url: url,
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
    },
};
function setupStandardColours() {
    stdColours = { white: color("white"), black: color("black") };
}
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
        life: 1,
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
    push();
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
        life: 1,
    };
    pop();
    return shot;
}
function addShot(opts) {
    var shot = createShot(opts);
    world.shots.unshift(shot);
    world.shots.splice(100);
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
        world.asteroids
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
function shootIfTime(srcVehicle) {
    var ms = millis();
    if (ms - srcVehicle.lastShot > srcVehicle.shotDelay) {
        addShot({
            pos: srcVehicle.pos,
            vel: p5.Vector.fromAngle(srcVehicle.facing)
                .mult(40)
                .add(srcVehicle.vel),
        });
        srcVehicle.lastShot = ms;
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
    toggleConfigBooleanProperty("shouldPlaySound");
}
function setupAsteroidHitSound() {
    asteroidHitNoise = new p5.Noise("white");
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
    engineWhistleNoise = new p5.Noise("white");
    engineWhistleNoise.disconnect();
    engineWhistleFilter.process(engineWhistleNoise);
    engineWhistleNoise.start();
}
function playSoundAsteroidDestroyed(level) {
    if (!config.shouldPlaySound || soundNotYetEnabledByGesture) {
        return;
    }
    var env = new p5.Envelope();
    var releaseTime = {
        1: 0.05,
        2: 0.05,
        3: 0.1,
        4: 1,
    };
    env.setADSR(random(0.001, 0.002), 0.1, 0.2, releaseTime[level]);
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
    var _a, _b;
    if (!config.shouldPlaySound || soundNotYetEnabledByGesture) {
        return;
    }
    engineWhistleFilterWidth = 50;
    var maxVel = 5;
    var vel = (_b = (_a = world.trackedVehicle) === null || _a === void 0 ? void 0 : _a.vel) === null || _b === void 0 ? void 0 : _b.mag();
    if (vel) {
        engineWhistleFilterFreq = map(vel, 0, maxVel, 10, 8000);
    }
    engineWhistleFilter.set(engineWhistleFilterFreq, engineWhistleFilterWidth);
}
function setupStarfield() {
    world.stars = collect(1000 * numberOfWorldPages(), function (ix) { return ({
        pos: randomWorldPos(),
        radius: random(0.5, random(0.5, 3)),
        strength: random(100),
    }); });
}
function drawStarfield() {
    world.stars
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
function toggleShouldDrawStars() {
    toggleConfigBooleanProperty("shouldDrawStars");
}
function addTarget(pos) {
    world.targets.unshift(pos);
    world.targets.splice(world.MAX_NUM_TARGETS);
    world.vehicles.forEach(function (v, ix) {
        v.target = world.targets[ix % world.targets.length];
    });
}
function acquireTarget(vehicle) {
    var closeAsteroids = world.asteroids.filter(function (a) { return a.pos.dist(vehicle.pos) < height; });
    return random(closeAsteroids.length > 0 ? closeAsteroids : world.asteroids);
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
function collect(n, creatorFn) {
    var arr = [];
    repeat(n, function (ix) { return arr.push(creatorFn(ix)); });
    return arr;
}
function posToString(p) {
    return "".concat(Math.round(p.x), ", ").concat(Math.round(p.y));
}
function randomPos() {
    return createVector(random(width), random(height));
}
function randomWorldPos() {
    return createVector(random(-world.worldWidth / 2, world.worldWidth / 2), random(-world.worldHeight / 2, world.worldHeight / 2));
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
function calcNearestEntity(ship, entities) {
    var recordDist = Number.MAX_SAFE_INTEGER;
    var recordEnt = null;
    entities.forEach(function (ent) {
        var dst = ent.pos.dist(ship.pos);
        if (dst < recordDist) {
            recordDist = dst;
            recordEnt = ent;
        }
    });
    return recordEnt;
}
function drawVehicle(p) {
    if (config.shouldDrawTrails) {
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
function steerVehicleAutonomously(v) {
    var currPos = createVector(v.pos.x, v.pos.y);
    if (!v.live) {
        return;
    }
    if (v.target && v.target.live) {
        var targetPos = createVector(v.target.pos.x, v.target.pos.y);
        var desired = p5.Vector.sub(targetPos, currPos);
        desired.setMag(v.maxSpeed);
        v.desiredVector = desired.copy().normalize();
        v.facing = v.desiredVector.copy().normalize().heading();
        var steer = p5.Vector.sub(desired, v.vel);
        steer.limit(v.maxSteeringForce);
        v.steer = steer.copy();
        v.accel.add(steer);
        v.fuel -= v.accel.mag();
    }
    else {
        v.target = acquireTarget(v);
    }
    updateShooting(v);
}
function updateVehicleWeaponsWithUserInput(v) {
    if (keyIsDown(32)) {
        shootIfTime(v);
    }
}
function updateVehicle(v) {
    v.pos.add(v.vel);
    if (v.isUnderPlayerControl) {
        steerVehicleWithUserInput(v);
        updateVehicleWeaponsWithUserInput(v);
    }
    else {
        steerVehicleAutonomously(v);
    }
    v.vel.add(v.accel);
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
function setupVehicles(n) {
    world.vehicles = collect(n, createVehicle);
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
        maxThrust: 0.1,
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
        life: 1,
        isUnderPlayerControl: false,
    };
}
function steerVehicleWithUserInput(v) {
    if (keyIsDown(UP_ARROW)) {
        var thrust = p5.Vector.fromAngle(v.facing).mult(v.maxThrust);
        v.accel.add(thrust);
    }
    if (keyIsDown(DOWN_ARROW)) {
        v.accel.add(v.desiredVector.copy().mult(-v.traction));
    }
    if (keyIsDown(LEFT_ARROW)) {
        v.facing -= 0.05;
    }
    if (keyIsDown(RIGHT_ARROW)) {
        v.facing += 0.05;
    }
}
function toggleAutopilot() {
    if (world.trackedVehicle) {
        console.log("tracked vehicle status: ", world.trackedVehicle.isUnderPlayerControl, millis());
        debugger;
        if (world.trackedVehicle.isUnderPlayerControl) {
            world.trackedVehicle.isUnderPlayerControl = false;
            console.log("relinquishing control of vehicle: ", world.trackedVehicle.isUnderPlayerControl);
        }
        else {
            console.log("user now has control of vehicle");
            world.trackedVehicle.isUnderPlayerControl = true;
        }
    }
}
function createWorld() {
    var stars = [];
    var vehicles = [];
    var asteroids = [];
    var targets = [];
    var orbs = [];
    var MAX_NUM_TARGETS = 6;
    var MAX_NUM_VEHICLES = 6;
    var shots = [];
    var worldWidth = 6000;
    var worldHeight = 5000;
    var trackedVehicle = undefined;
    var mobs = [];
    var camera = {
        pos: createVector(0, 0),
        moveSpeed: 5,
        maxScreenShakeAmount: 10,
        screenShakeAmount: 0,
    };
    var newWorld = {
        stars: stars,
        vehicles: vehicles,
        asteroids: asteroids,
        trackedVehicle: trackedVehicle,
        targets: targets,
        orbs: orbs,
        MAX_NUM_TARGETS: MAX_NUM_TARGETS,
        MAX_NUM_VEHICLES: MAX_NUM_VEHICLES,
        shots: shots,
        worldWidth: worldWidth,
        worldHeight: worldHeight,
        camera: camera,
        mobs: mobs,
    };
    return newWorld;
}
//# sourceMappingURL=build.js.map