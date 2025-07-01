interface WeaponSystem {
    shootFn: (srcVehicle: Vehicle) => void;
    lastShot: number;
    shotDelay: number;
    shotSpeed: number;
}

function createDefaultWeaponSystem() {
    return {
        shootFn: (srcVehicle: Vehicle) => {
            const speed = srcVehicle.weaponSystem.shotSpeed;

            const shotSpread = PI / 32;
            const randomAngleOffset = random(-shotSpread, shotSpread);

            addShot({
                pos: srcVehicle.pos,
                vel: p5.Vector.fromAngle(srcVehicle.facing + randomAngleOffset)
                    .mult(speed)
                    .add(srcVehicle.vel),
                hue: BLUE_HUE,
            });
        },
        lastShot: -99999,
        shotDelay: 200,
        shotSpeed: 10,
    } satisfies WeaponSystem;
}

function createSpreadWeaponSystem() {
    return {
        shootFn: (srcVehicle: Vehicle) => {
            const speed = srcVehicle.weaponSystem.shotSpeed;

            const angles = [0, -1, 1].map((sgn) => sgn * random(0.1, 0.3));
            for (const angle of angles) {
                addShot({
                    pos: srcVehicle.pos,
                    vel: p5.Vector.fromAngle(srcVehicle.facing + angle)
                        .mult(speed)
                        .add(srcVehicle.vel),
                    hue: MAGENTA_HUE,
                });
            }
        },
        shotSpeed: 4,
        lastShot: -99999,
        shotDelay: 400,
    } satisfies WeaponSystem;
}
function createSurroundWeaponSystem() {
    return {
        shootFn: (srcVehicle: Vehicle) => {
            const speed = srcVehicle.weaponSystem.shotSpeed;
            const numShots = 16;
            const angles = collect(numShots, (ix) => (ix * TWO_PI) / numShots);
            for (const angle of angles) {
                addShot({
                    pos: srcVehicle.pos,
                    vel: p5.Vector.fromAngle(srcVehicle.facing + angle)
                        .mult(speed)
                        .add(srcVehicle.vel),
                    hue: LIME_HUE,
                });
            }
        },
        lastShot: -99999,
        shotDelay: 800,
        shotSpeed: 10,
    } satisfies WeaponSystem;
}

const BLUE_HUE = 200;
const MAGENTA_HUE = 300;
const LIME_HUE = 100;
