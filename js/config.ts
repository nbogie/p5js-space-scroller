function createConfig() {
    const newConfig: Config = {
        shouldDrawTrails: true,
        shouldDrawStars: true,
        shouldPlaySound: false,
        steerSpeed: 0.1,
    };
    return newConfig;
}
//from our Config type, make a type representing a union of the keys of the properties which are boolean
type BooleanKeysOfConfig = {
    [K in keyof Config]: Config[K] extends boolean ? K : never;
}[keyof Config];

function toggleConfigBooleanProperty<K extends BooleanKeysOfConfig>(
    key: K,
): boolean {
    return (config[key] = !config[key]);
}
