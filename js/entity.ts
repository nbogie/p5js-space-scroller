type DrawFunction = (self: Entity) => void;
type UpdateFunction = (self: Entity) => void;

type EntityTag =
    | "asteroid"
    | "vehicle"
    | "orb"
    | "shot"
    | "mob-teleporter"
    | "mob-exploder"
    | "target";
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
