interface World {
    stars: Star[];
    asteroids: Asteroid[];
    vehicles: Vehicle[];
    trackedVehicle?: Vehicle;
    targets: Target[];
    orbs: Orb[];
    gNumTargets: number;
    gNumVehicles: number;

    gAsteroids: Asteroid[];
    gShots: Shot[];
    worldWidth: number;
    worldHeight: number;

    //camera stuff
    cameraPos: p5.Vector;
    cameraMoveSpeed: number;
    maxScreenShakeAmount: number;
    screenShakeAmount: number;
}

interface Config {
    shouldDrawTrails: boolean;
    shouldDrawStars: boolean;
    shouldPlaySound: boolean;
}

type AsteroidSize = 4 | 3 | 2 | 1;
interface Asteroid {
    live: boolean;
    pos: p5.Vector;
    vel: p5.Vector;
    resType: ResourceType;
    sizeCategory: AsteroidSize;
    radius: number;
    damage: number;
    hp: number;
    tookDamage: boolean;
    rotation: number;
    rotationSpeed: number;
}
interface AsteroidOpts {
    sizeCategory?: number;
    pos: p5.Vector;
}
interface Collidable {
    pos: p5.Vector;
    radius: number;
}

interface Orb {
    pos: p5.Vector;
    vel: p5.Vector;
    live: boolean;
    life: number;
    radius: number;
    exploding: boolean;
}

interface OrbOptions {
    pos: p5.Vector;
    vel: p5.Vector;
}
interface Palette {
    colors: p5.Color[];
    name: string;
    url: string;
}
interface Particle {
    pos: p5.Vector;
    vel: p5.Vector;
    radius: number;
    color: p5.Color;
    life: number;
    hue: number;
}
interface ResourceType {
    label: string;
    hue: number;
    color: p5.Color;
}
interface Shot {
    live: boolean;
    pos: p5.Vector;
    rotation: number;
    vel: p5.Vector;
    radius: number;
    damage: number;
    color: p5.Color;
    life: number;
}
interface ShotOptions {
    vel: p5.Vector;
    pos: p5.Vector;
}
interface Star {
    pos: p5.Vector;
    radius: number;
    strength: number;
}
interface Target {
    pos: p5.Vector;
    live: boolean;
}
interface Trail {
    particles: Particle[];
}
interface Vehicle {
    pos: p5.Vector;
    vel: p5.Vector;
    accel: p5.Vector;
    live: boolean;
    life: number;
    radius: number;
    hp: number;
    fuel: number;
    maxSteeringForce: number;
    facing: number;
    maxSpeed: number;
    hue: number;
    color: p5.Color;
    traction: 0.3;
    steer: p5.Vector;
    canShoot: boolean;
    rammingDamage: number;
    lastShot: number;
    shotDelay: number;
    trail: Trail;
    target: Target;
    desiredVector: p5.Vector;
    tookDamage: boolean;
}

type BoomEventSize = "small" | "med" | "big";
