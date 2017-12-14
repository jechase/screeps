import { Harvester } from "creeps/Harvester";
import { Upgrader } from "creeps/Upgrader";
import { Builder } from "creeps/Builder";

export class CreepManager {
    private static init(creep: Creep) {
        var mem: any = creep.memory;
        if (mem.hasOwnProperty('init')) {
            return;
        }

        CreepManager.assignRole(creep);
        CreepManager.setState(creep);
    }

    private static assignRole(creep: Creep) {
        var mem: any = creep.memory;

        if (creep.name.indexOf("harvester") != -1) {
            mem.role = "harvester";
        }
        if (creep.name.indexOf("builder") != -1) {
            mem.role = "builder";
        }
        if (creep.name.indexOf("upgrader") != -1) {
            mem.role = "upgrader";
        }
    }

    private static setState(creep: Creep) {
        var mem: any = creep.memory;

        mem.state = 'none';
    }

    public static run() {
        console.log(`Running CreepManager...`);
        for (let name in Game.creeps) {
            var creep = Game.creeps[name];
            console.log(`Running creep ${creep.name}`);
            if (creep.spawning) {
                console.log(`spawning ${creep.name}`);
                CreepManager.init(creep);
                continue;
            }

            var mem: any = creep.memory;

            switch (mem.role) {
                case "harvester": {
                    new Harvester(creep).run();
                    break;
                }
                case "upgrader": {
                    new Upgrader(creep).run();
                    break;
                }
                case "builder": {
                    new Builder(creep).run();
                    break;
                }
            }
        }
    }
}
