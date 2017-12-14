import { Base } from "creeps/Base";

export class Upgrader extends Base {
    constructor(creep: Creep) {
        super(creep);
    }

    private enterMoveHarvest() {
        this.mem.state = 'move_harvest';
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
        }
    }

    private enterHarvest() {
        this.mem.state = "harvest";
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
        this.mem.state = 'move_drop';
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
        }
    }

    private enterUpgrade() {
        this.mem.state = "transfer";
        if (this.creep.carry.energy == 0) {
            this.enterMoveHarvest();
        } else {
            let target: StructureController = Game.getObjectById(this.mem.target);
            this.creep.upgradeController(target);
        }
    }

    private runTransfer() {
        if (this.creep.carry.energy == 0) {
            this.enterMoveHarvest();
            return;
        }

        let target: Spawn = Game.getObjectById(this.mem.target);
        this.creep.transfer(target, RESOURCE_ENERGY);
    }

    public run() {
        switch (this.mem.state) {
            case 'none': {
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
