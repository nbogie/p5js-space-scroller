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
    color: p5.Color | null;
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
