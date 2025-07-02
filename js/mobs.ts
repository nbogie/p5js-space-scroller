const MAX_MOBS_IN_WORLD = 100;

type Mob = ExploderMob | TeleporterMob | ChaserMob;

interface BaseMob<T extends Entity<T>> extends Entity<T> {
    colour: p5.Color;
    minimapColour: p5.Color;
}
function setupMobs(numToAdd: number): void {
    addRandomMobsToWorld(numToAdd);
    setInterval(maybeAddMoreMobs, 3000);
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

function addRandomMobsToWorld(numToAdd: number) {
    world.entities.push(
        ...collect(numToAdd, (ix: number) => createRandomMob()),
    );
}

function getAllLiveMobs() {
    return world.entities.filter(
        (e: Entity<any>) => e.tag.startsWith("mob") && e.live,
    );
}

function maybeAddMoreMobs() {
    const capacityForMore = MAX_MOBS_IN_WORLD - getAllLiveMobs().length;

    if (capacityForMore > 0) {
        addRandomMobsToWorld(min(capacityForMore, 10));
    }
}
