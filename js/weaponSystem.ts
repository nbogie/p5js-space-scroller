interface WeaponSystem {
    shootFn: (srcVehicle: Vehicle) => void;
}

function createDefaultWeaponSystem() {
    return {
        shootFn: (srcVehicle: Vehicle) => {
            addShot({
                pos: srcVehicle.pos,
                vel: p5.Vector.fromAngle(srcVehicle.facing)
                    .mult(40)
                    .add(srcVehicle.vel),
                hue: BLUE_HUE,
            });
        },
    } satisfies WeaponSystem;
}

function createSpreadWeaponSystem() {
    return {
        shootFn: (srcVehicle: Vehicle) => {
            const angles = [0, -1, 1].map((sgn) => sgn * random(0.1, 0.3));
            for (const angle of angles) {
                addShot({
                    pos: srcVehicle.pos,
                    vel: p5.Vector.fromAngle(srcVehicle.facing + angle)
                        .mult(40)
                        .add(srcVehicle.vel),
                    hue: MAGENTA_HUE,
                });
            }
        },
    } satisfies WeaponSystem;
}
function createSurroundWeaponSystem() {
    return {
        shootFn: (srcVehicle: Vehicle) => {
            const numShots = 16;
            const angles = collect(numShots, (ix) => (ix * TWO_PI) / numShots);
            for (const angle of angles) {
                addShot({
                    pos: srcVehicle.pos,
                    vel: p5.Vector.fromAngle(srcVehicle.facing + angle)
                        .mult(40)
                        .add(srcVehicle.vel),
                    hue: LIME_HUE,
                });
            }
        },
    } satisfies WeaponSystem;
}
const BLUE_HUE = 200;
const MAGENTA_HUE = 300;
const LIME_HUE = 100;
