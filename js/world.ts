interface World {
    entities: Entity[];
    stars: Star[];
    vehicles: Vehicle[];
    MAX_NUM_VEHICLES: number;
    trackedVehicle?: Vehicle;
    targets: Target[];
    MAX_NUM_TARGETS: number;
    orbs: Orb[];
    shots: Shot[];
    mobs: Mob[];
    worldWidth: number;
    worldHeight: number;
    camera: GameCamera;
}

function createWorld(): World {
    const entities: Entity[] = [];
    const stars: Star[] = [];
    const vehicles: Vehicle[] = [];
    const targets: Target[] = [];
    const orbs: Orb[] = [];
    const MAX_NUM_TARGETS: number = 6;
    const MAX_NUM_VEHICLES: number = 6;
    const shots: Shot[] = [];
    const worldWidth: number = 6000;
    const worldHeight: number = 5000;
    const trackedVehicle: Vehicle = undefined;
    const mobs: Mob[] = [];

    const camera: GameCamera = {
        pos: createVector(0, 0),
        moveSpeed: 5,
        maxScreenShakeAmount: 10,
        screenShakeAmount: 0,
    };

    const newWorld = {
        entities,
        stars,
        vehicles,
        trackedVehicle,
        targets,
        orbs,
        MAX_NUM_TARGETS,
        MAX_NUM_VEHICLES,
        shots,
        worldWidth,
        worldHeight,
        camera,
        mobs,
    } satisfies World;
    return newWorld;
}
