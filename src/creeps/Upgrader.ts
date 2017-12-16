import { Base } from "creeps/Base";
import { Util } from "utils/Util";

export class Upgrader extends Base {
    constructor(creep: Creep) {
        super(creep);
    }

    private enterMoveContainer() {
        this.setState('move_container');
        var target = this.creep.room.find(FIND_STRUCTURES, { filter: (s) => s.structureType == STRUCTURE_CONTAINER && !Util.isEmpty(s) })[0];
        if (target == undefined) {
            this.enterMoveHarvest();
        }
        this.mem.target = target.id;
        this.moveTo(target);
    }

    private runMoveContainer() {
        let target: StructureContainer = Game.getObjectById(this.mem.target);
        let res = this.creep.withdraw(target, RESOURCE_ENERGY);
        if (res == 0) {
            this.enterMoveDrop();
            return;
        } else if (res == ERR_NOT_IN_RANGE) {
            this.moveTo(target);
        } else {
            // console.log(`unhandled harvest error: ${res}`);
            this.setState('initState');
        }
    }

    private enterMoveHarvest() {
        this.setState('move_harvest');
        var target: Source = this.creep.room.find(FIND_SOURCES)[0];
        // console.log(`setting target: source${target.id}`);
        this.mem.target = target.id;
        this.moveTo(target);
    }

    private runMoveHarvest() {
        var target: Source = Game.getObjectById(this.mem.target);
        var res = this.creep.harvest(target);
        if (res == 0) {
            this.enterHarvest();
        } else if (res == ERR_NOT_IN_RANGE) {
            this.moveTo(target);
        } else {
            // console.log(`unhandled harvest error: ${res}`);
            // this.creep.suicide();
            this.setState('initState');
        }
    }

    private enterHarvest() {
        this.setState("harvest");
    }

    private runHarvest() {
        if (this.creep.carry.energy == this.creep.carryCapacity) {
            this.enterMoveDrop();
            return;
        }

        var target: Source = Game.getObjectById(this.mem.target);
        this.creep.harvest(target);
    }

    private enterMoveDrop() {
        this.setState('move_drop');
        var controller = this.creep.room.controller;
        this.mem.target = controller.id;
        this.moveTo(controller);
    }

    private runMoveDrop() {
        let target: StructureController = Game.getObjectById(this.mem.target);
        let res = this.creep.upgradeController(target);
        if (res == 0) {
            this.enterUpgrade();
        } else if (res == ERR_NOT_IN_RANGE) {
            this.moveTo(target);
        } else {
            // console.log(`unhandled transfer error: ${res}`);
            // this.creep.suicide();
            this.setState('initState');
        }
    }

    private enterUpgrade() {
        this.setState("transfer");
        if (this.creep.carry.energy == 0) {
            this.enterMoveContainer();
        } else {
            let target: StructureController = Game.getObjectById(this.mem.target);
            this.creep.upgradeController(target);
        }
    }

    private runTransfer() {
        if (this.creep.carry.energy == 0) {
            this.enterMoveContainer();
            return;
        }

        let target: Spawn = Game.getObjectById(this.mem.target);
        this.creep.transfer(target, RESOURCE_ENERGY);
    }

    public run() {
        switch (this.getState()) {
            case 'initState': {
                this.enterMoveContainer();
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
