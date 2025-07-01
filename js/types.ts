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
    steerSpeed: number;
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
interface Star {
    pos: p5.Vector;
    radius: number;
    strength: number;
}
interface Trail {
    particles: Particle[];
}
type BoomEventSize = "small" | "med" | "big";
