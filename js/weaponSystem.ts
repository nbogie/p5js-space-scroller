interface WeaponSystem {
    shootFn: (srcVehicle: Vehicle) => void;
    drawShotFn?: (shot: Shot) => void;
    lastShot: number;
    shotDelay: number;
    shotSpeed: number;
    shotDamage: number;
    name: string;
    processUpgrade: (upgrade: WeaponUpgrade, system: WeaponSystem) => void;
}

function createDefaultWeaponSystem() {
    const customShotDrawFn = (shot: Shot) => {
        push();
        noStroke();
        fill(shot.color);
        translateForScreenCoords(shot.pos);
        circle(0, 0, random(20, 40));
        pop();
    };

    return {
        name: "default",
        shootFn: (srcVehicle: Vehicle) => {
            const speed = srcVehicle.weaponSystem.shotSpeed;

            const shotSpread = PI / 32;
            const randomAngleOffset = random(-shotSpread, shotSpread);

            addShot({
                pos: srcVehicle.pos,
                facing: srcVehicle.facing,
                vel: p5.Vector.fromAngle(srcVehicle.facing + randomAngleOffset)
                    .mult(speed)
                    .add(srcVehicle.vel),
                hue: BLUE_HUE,
                drawFn: customShotDrawFn,
            });
        },
        lastShot: -99999,
        shotDelay: 200,
        shotSpeed: 10,
        shotDamage: 1,
        processUpgrade: (upgrade: WeaponUpgrade, system: WeaponSystem) => {
            upgrade.apply(system);
        },
    } satisfies WeaponSystem;
}

function createSpreadWeaponSystem() {
    return {
        name: "spreadshot",
        shootFn: (srcVehicle: Vehicle) => {
            const speed = srcVehicle.weaponSystem.shotSpeed;

            const angles = [0, -1, 1].map((sgn) => sgn * random(0.1, 0.3));
            for (const angle of angles) {
                const heading = srcVehicle.facing + angle;
                addShot({
                    pos: srcVehicle.pos,
                    facing: heading,
                    vel: p5.Vector.fromAngle(heading)
                        .mult(speed)
                        .add(srcVehicle.vel),
                    hue: MAGENTA_HUE,
                });
            }
        },
        shotSpeed: 4,
        lastShot: -99999,
        shotDelay: 400,
        shotDamage: 2,

        processUpgrade: (upgrade: WeaponUpgrade, system: WeaponSystem) => {
            upgrade.apply(system);
        },
    } satisfies WeaponSystem;
}
function createSurroundWeaponSystem() {
    const customShotDrawFn = (shot: Shot) => {
        push();
        noStroke();
        stroke("lime");
        fill(shot.color);
        translateForScreenCoords(shot.pos);
        rotate(shot.rotation);
        const step = 20;
        beginShape();
        vertex(0, 0);
        vertex(step * 1, step * 1);
        vertex(step * 2, 0);
        vertex(step * 3, -step * 1);
        vertex(step * 4, 0);
        noFill();

        endShape();
        pop();
    };

    return {
        name: "360",
        shootFn: (srcVehicle: Vehicle) => {
            const speed = srcVehicle.weaponSystem.shotSpeed;
            const numShots = 16;
            const angles = collect(numShots, (ix) => (ix * TWO_PI) / numShots);
            for (const angle of angles) {
                const facing = srcVehicle.facing + angle;
                addShot({
                    pos: srcVehicle.pos,
                    vel: p5.Vector.fromAngle(facing)
                        .mult(speed)
                        .add(srcVehicle.vel),
                    facing,
                    hue: LIME_HUE,
                    drawFn: customShotDrawFn,
                });
            }
        },
        drawShotFn: (shot: Shot) => {},
        lastShot: -99999,
        shotDelay: 800,
        shotSpeed: 10,
        shotDamage: 3,
        processUpgrade: (upgrade: WeaponUpgrade, system: WeaponSystem) => {
            upgrade.apply(system);
        },
    } satisfies WeaponSystem;
}

const BLUE_HUE = 200;
const MAGENTA_HUE = 300;
const LIME_HUE = 100;
