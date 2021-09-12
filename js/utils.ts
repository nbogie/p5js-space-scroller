
function randInt(min: number, max: number): number {
    return Math.floor(random(min, max + 1));
}

function atLeastTwoOf(fns: (() => () => any)[]) {
    const pickedFns = _.sampleSize(fns, randInt(2, fns.length));
    pickedFns.forEach((f: () => any) => f());
}

function repeat(n: number, fn: (i: number, n: number) => any) {
    for (let i = 0; i < n; i++) {
        fn(i, n);
    }
}

function posToString(p: p5.Vector) {
    return `${Math.round(p.x)}, ${Math.round(p.y)}`;
}