export class GC {
    public static run() {
        // Automatically delete memory of missing creeps
        for (let name in Memory.creeps) {
            if (!(name in Game.creeps)) {
                delete Memory.creeps[name];
            }
        }
    }
}
