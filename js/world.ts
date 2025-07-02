interface World<AnyEntity extends Entity<any>> {
    entities: AnyEntity[];
    stars: Star[];
    MAX_NUM_VEHICLES: number;
    trackedVehicle?: Vehicle;
    MAX_NUM_TARGETS: number;
    worldWidth: number;
    worldHeight: number;
    camera: GameCamera;
    timeSpeed: number;
}

function createWorld(): World<Entity<any>> {
    const entities: Entity<any>[] = [];
    const stars: Star[] = [];
    const MAX_NUM_TARGETS: number = 6;
    const MAX_NUM_VEHICLES: number = 6;
    const worldWidth: number = 6000;
    const worldHeight: number = 5000;
    const trackedVehicle: Vehicle | undefined = undefined;

    const camera: GameCamera = {
        pos: createVector(0, 0),
        moveSpeed: 5,
        maxScreenShakeAmount: 10,
        screenShakeAmount: 0,
    };

    const newWorld = {
        entities,
        stars,
        trackedVehicle,
        MAX_NUM_TARGETS,
        MAX_NUM_VEHICLES,
        worldWidth,
        worldHeight,
        camera,
        timeSpeed: 1,
    } satisfies World<Entity<any>>;
    return newWorld;
}
