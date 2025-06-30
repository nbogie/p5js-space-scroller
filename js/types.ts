interface GameCamera {
    pos: p5.Vector;
    moveSpeed: number;
    maxScreenShakeAmount: number;
    screenShakeAmount: number;
}

interface Config {
    shouldDrawTrails: boolean;
    shouldDrawStars: boolean;
    shouldPlaySound: boolean;
}

type AsteroidSize = 4 | 3 | 2 | 1;
interface Asteroid extends Entity {
    // from Entity
    //   pos: p5.Vector;
    //   vel: p5.Vector;
    //   live: boolean;

    resType: ResourceType;
    sizeCategory: AsteroidSize;
    radius: number;
    damage: number;
    mineral: Mineral | null;
    hp: number;
    tookDamage: boolean;
    rotation: number;
    rotationSpeed: number;
    minimapColour: p5.Color;
}
interface AsteroidOpts {
    sizeCategory?: number;
    mineral?: Mineral | null;
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
interface Shot extends Entity {
    //pos and vel from Entity
    rotation: number;
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
type BoomEventSize = "small" | "med" | "big";
