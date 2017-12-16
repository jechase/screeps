import { Base } from "creeps/Base";
import { Util } from "utils/Util";

export class Harvester extends Base {
    constructor(creep: Creep) {
        super(creep);
    }

    private findSource() {
        if (this.mem.target == undefined) {
            // console.log(`${this.creep.name} finding new source`);
            let sources = this.creep.room.find(FIND_SOURCES_ACTIVE);
            let target: Source = sources[Math.floor(Math.random() * sources.length)];

            // console.log(`setting target: source${target.id}`);
            this.mem.target = target.id;
            return target
        } else {
            return (<Source>Game.getObjectById(this.mem.target));
        }
    }

    private findDest() {
        var target: any;

        if (this.mem.target != undefined) {
            target = (<any>Game.getObjectById(this.mem.target));
        }

        if (target == undefined) {
            let spawn: Spawn = this.creep.room.find(FIND_MY_SPAWNS)[0];
            target = spawn;
        }

        // console.log(`initial target: ${target}, isFull: ${Util.isFull(target)}`);

        if (Util.isFull(target)) {
            // console.log(`initial target full, finding new one`);
            let targets = this.creep.room.find(FIND_STRUCTURES, { filter: (s) => (s.structureType == STRUCTURE_CONTAINER || s.structureType == STRUCTURE_EXTENSION) && !Util.isFull(s) });
            target = targets[Math.floor(Math.random() * targets.length)];
            // console.log(`new target: ${target}`);
        }

        this.mem.target = target.id;

        // console.log(`target: ${target}`);
        return target
    }

    private enterMoveHarvest() {
        this.creep.say("moving to harvest!")
        this.setState('move_harvest');
        this.mem.target = undefined;
        let target: Source = this.findSource();
        this.moveTo(target);
    }

    private runMoveHarvest() {
        var target: Source = this.findSource();
        var res = this.creep.harvest(target);
        if (res == 0) {
            this.enterHarvest();
        } else if (res == ERR_NOT_IN_RANGE) {
            this.moveTo(target);
        } else {
            // console.log(`unhandled harvest error: ${res}`);
            this.setState('initState');
            // this.creep.suicide();
        }
    }

    private enterHarvest() {
        this.creep.say("Harvesting!");
        this.setState('harvest');
    }

    private runHarvest() {
        if (this.creep.carry.energy == this.creep.carryCapacity) {
            this.enterMoveDrop();
            return;
        }

        var target: Source = this.findSource();
        this.creep.harvest(target);
    }

    private enterMoveDrop() {
        this.creep.say("Moving to deposit!");
        this.setState('move_drop');
        this.mem.target = undefined;
        let target = this.findDest();
        this.moveTo(target);
    }

    private runMoveDrop() {
        var target: any = this.findDest();
        let res = this.creep.transfer(target, RESOURCE_ENERGY);
        if (res == 0) {
            this.enterTransfer();
        } else if (res == ERR_NOT_IN_RANGE) {
            this.moveTo(target);
        } else {
        }
    }

    private enterTransfer() {
        this.setState("transfer");
    }

    private runTransfer() {
        if (this.creep.carry.energy == 0) {
            this.enterMoveHarvest();
            return;
        }

        this.enterMoveDrop();
    }

    public run() {
        switch (this.getState()) {
            case 'initState': {
                this.enterMoveHarvest();
                break;
            }
            case 'move_harvest': {
                this.runMoveHarvest();
                break;
            }
            case 'move_drop': {
                this.runMoveDrop();
                break;
            }
            case 'harvest': {
                this.runHarvest();
                break;
            }
            case 'transfer': {
                this.runTransfer();
                break;
            }
        }
    }
}
