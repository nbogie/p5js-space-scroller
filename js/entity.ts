type DrawFunction<T> = (selfEntity: T) => void;
type UpdateFunction<T> = (selfEntity: T) => void;
type TakeDamageFunction<T> = (selfEntity: T) => void;

type EntityTag =
    | "asteroid"
    | "vehicle"
    | "orb"
    | "shot"
    | "mob-teleporter"
    | "mob-exploder"
    | "mob-chaser";

//todo: simplify by putting these properties in Entity, and auto-gen this type from Entity.
interface Collidable {
    pos: p5.Vector;
    collisionRadius: number;
}

interface Entity<T extends Entity<T>> extends Collidable {
    tag: EntityTag;
    vel: p5.Vector;
    zIndex: number;
    updatePriority: number;
    live: boolean;
    drawFn: DrawFunction<T>;
    updateFn: UpdateFunction<T>;
    takeDamageFn: TakeDamageFunction<T>;
}

//Note: some uses of destroy will expect to be able to further manipulate the entity
// after destroying it but before the end of the current frame.
function destroy<T extends Entity<T>>(entity: Entity<T>) {
    entity.live = false;
}
