import { Base } from "creeps/Base";
import { Util } from "utils/Util";

export class Builder extends Base {
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
            this.enterMoveBuild();
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
            this.setState('initState');
            // this.creep.suicide();
        }
    }

    private enterHarvest() {
        this.setState("harvest");
    }

    private runHarvest() {
        if (this.creep.carry.energy == this.creep.carryCapacity) {
            this.enterMoveBuild();
            return;
        }

        var target: Source = Game.getObjectById(this.mem.target);
        this.creep.harvest(target);
    }

    private enterMoveBuild() {
        this.mem.state = 'move_build';
        var site = this.creep.room.find(FIND_CONSTRUCTION_SITES).sort((a, b) => { if (a.progress <= b.progress) { return 1; } else { return -1; } })[0];
        this.mem.target = site.id;
        this.moveTo(site);
    }

    private runMoveBuild() {
        let target: ConstructionSite = Game.getObjectById(this.mem.target);
        let res = this.creep.build(target);
        if (res == 0) {
            this.enterBuild();
        } else if (res == ERR_NOT_IN_RANGE) {
            this.moveTo(target);
        } else {
            // console.log(`unhandled build error: ${res}`);
            this.setState('initState');
            // this.creep.suicide();
        }
    }

    private enterBuild() {
        this.setState("build");
        if (this.creep.carry.energy == 0) {
            this.enterMoveContainer();
        } else {
            let target: ConstructionSite = Game.getObjectById(this.mem.target);
            this.creep.build(target);
        }
    }

    private runBuild() {
        if (this.creep.carry.energy == 0) {
            this.enterMoveContainer();
            return;
        }

        let target: ConstructionSite = Game.getObjectById(this.mem.target);
        if (this.creep.build(target) != 0) {
            this.setState('initState');
        }
    }

    public run() {
        switch (this.getState()) {
            case 'initState': {
                this.enterMoveContainer();
                break;
            }
            case 'move_container': {
                this.runMoveContainer();
                break;
            }
            case 'move_harvest': {
                this.runMoveHarvest();
                break;
            }
            case 'move_build': {
                this.runMoveBuild();
                break;
            }
            case 'harvest': {
                this.runHarvest();
                break;
            }
            case 'build': {
                this.runBuild();
                break;
            }
        }
    }
}
