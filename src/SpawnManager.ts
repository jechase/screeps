export class SpawnManager {
    public static isType(creep: Creep, ty: string) {
        var memory: any = creep.memory;
        if (!memory.hasOwnProperty('role')) {
            return false;
        }
        if (ty.indexOf(memory.role) != -1 || memory.role.indexOf(ty) != -1) {
            return true;
        } else {
            return false;
        }
    }

    private static spawnMissing(spawn: Spawn) {
        var room = spawn.room;
        var creeps = room.find(FIND_MY_CREEPS);

        for (let ty in SpawnManager.SPAWN_COUNTS) {
            var level = room.controller.level;
            let count = creeps.filter((c) => SpawnManager.isType(c, ty)).length;
            if (count < SpawnManager.SPAWN_COUNTS[ty]) {
                var res = 1;
                while (res != 0 && level > 0) {
                    res = spawn.spawnCreep(SpawnManager.BODIES[ty][level - 1], `${ty}${Game.time}`);
                    level--;
                }
            }
        }
    }

    public static run() {
        // console.log("SpawnManager running...");
        for (let name in Game.spawns) {
            let spawn = Game.spawns[name];
            // console.log(`Running ${spawn.name}`);

            SpawnManager.spawnMissing(spawn);
            SpawnManager.cleanup(spawn);
        }
    }

    private static cleanup(spawn: Spawn) {
        var room = spawn.room;
        var creeps = room.find(FIND_MY_CREEPS);

        for (let ty in SpawnManager.SPAWN_COUNTS) {
            let of_ty = creeps.filter((c) => SpawnManager.isType(c, ty));
            let count = creeps.filter((c) => SpawnManager.isType(c, ty)).length;
            // console.log(`${count} ${ty}s`);
            if (count > SpawnManager.SPAWN_COUNTS[ty]) {
                of_ty.slice(0, count - SpawnManager.SPAWN_COUNTS[ty]).map((c) => c.suicide());
            }
        }
    }

    private static SPAWN_COUNTS: any = {
        'harvester': 3,
        'builder': 3,
        'upgrader': 3,
    };

    private static BODY_WORKER = [[WORK, CARRY, MOVE], [WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE]];

    private static BODIES: any = {
        'harvester': SpawnManager.BODY_WORKER,
        'builder': SpawnManager.BODY_WORKER,
        'upgrader': SpawnManager.BODY_WORKER,
    };
}
