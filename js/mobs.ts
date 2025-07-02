type Mob = ExploderMob | TeleporterMob | ChaserMob;

interface BaseMob<T extends Entity<T>> extends Entity<T> {
    colour: p5.Color;
    minimapColour: p5.Color;
}
function setupMobs(n: number): void {
    world.entities.push(...collect(n, (ix: number) => createRandomMob()));
}

function createRandomMob() {
    const fn = random([
        createExploderMob,
        createTeleporterMob,
        createChaserMob,
    ]);
    const mob = fn();
    return mob;
}
