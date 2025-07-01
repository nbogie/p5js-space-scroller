type DrawFunction = (self: Entity) => void;
type UpdateFunction = (self: Entity) => void;

type EntityTag =
    | "asteroid"
    | "vehicle"
    | "orb"
    | "shot"
    | "mob-teleporter"
    | "mob-exploder"
    | "mob-chaser";

interface Entity {
    tag: EntityTag;
    pos: p5.Vector;
    vel: p5.Vector;
    zIndex: number;
    updatePriority: number;
    live: boolean;
    drawFn: DrawFunction;
    updateFn: UpdateFunction;
}

//Note: some uses of destroy will expect to be able to further manipulate the entity
// after destroying it but before the end of the current frame.
function destroy(entity: Entity) {
    entity.live = false;
}
