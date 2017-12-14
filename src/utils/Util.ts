export class Util {
    public static isFull(s: any) {
        if (s instanceof Spawn) {
            let spawn: Spawn = <Spawn>s;
            let ret = spawn.energy == spawn.energyCapacity;
            return ret;
        }

        if (s instanceof StructureContainer) {
            let container: StructureContainer = <StructureContainer>s;
            let ret = container.storeCapacity == container.store.energy;
            return ret;
        }

        return true;
    }

    public static isEmpty(s: any) {
        if (s instanceof Spawn) {
            let spawn: Spawn = <Spawn>s;
            let ret = spawn.energy == 0;
            return ret;
        }

        if (s instanceof StructureContainer) {
            let container: StructureContainer = <StructureContainer>s;
            let ret = container.store.energy == 0;
            return ret;
        }

        return false;
    }
}
