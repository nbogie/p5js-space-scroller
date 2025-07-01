type WeaponUpgrade = RateUpgrade | SpeedUpgrade | DamageUpgrade;
type RateUpgrade = {
    type: "rate";
    apply: (system: WeaponSystem) => void;
};
type SpeedUpgrade = {
    type: "speed";
    apply: (system: WeaponSystem) => void;
};
type DamageUpgrade = {
    type: "damage";
    apply: (system: WeaponSystem) => void;
};

function addRandomUpgradeForTesting(vehicle: Vehicle) {
    const upgrades = [
        {
            type: "rate",
            apply: (system: WeaponSystem) =>
                (system.shotDelay = Math.max(10, system.shotDelay - 70)),
        },
        {
            type: "speed",
            apply: (system: WeaponSystem) => (system.shotSpeed += 10),
        },
        {
            type: "damage",
            apply: (system: WeaponSystem) => {
                system.shotDamage += 1;
            },
        },
    ] satisfies WeaponUpgrade[];
    const randomUpgrade = random(upgrades);
    vehicle.weaponSystem.processUpgrade(randomUpgrade, vehicle.weaponSystem);
    flashMessage("Got upgrade: " + randomUpgrade.type, 2000);
}
