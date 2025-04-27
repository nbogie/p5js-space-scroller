function createWorld() {
    const stars: Star[] = [];
    const vehicles: Vehicle[] = [];
    const asteroids: Asteroid[] = [];
    const targets: Target[] = [];
    const orbs: Orb[] = [];
    const MAX_NUM_TARGETS: number = 6;
    const MAX_NUM_VEHICLES: number = 6;
    const shots: Shot[] = [];
    const worldWidth: number = 6000;
    const worldHeight: number = 5000;
    const trackedVehicle: Vehicle = undefined;

    const camera: GameCamera = {
        pos: createVector(0, 0),
        moveSpeed: 5,
        maxScreenShakeAmount: 10,
        screenShakeAmount: 0,
    };

    const newWorld = {
        stars,
        vehicles,
        asteroids,
        trackedVehicle,
        targets,
        orbs,
        MAX_NUM_TARGETS,
        MAX_NUM_VEHICLES,
        shots,
        worldWidth,
        worldHeight,
        camera,
    };
    return newWorld;
}
