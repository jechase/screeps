export class Base {
    protected creep: Creep;
    protected mem: any;

    protected pushState(name: string) {
        if (this.mem.state == undefined) {
            this.mem.state = [name];
            return 1;
        } else {
            return (<[string]>this.mem.state).push(name);
        }
    }

    protected getState() {
        if (this.mem.state == undefined || (<[string]>this.mem.state).length == 0) {
            return undefined;
        }

        let stack = (<[string]>this.mem.state);

        return stack[stack.length - 1];
    }

    protected popState() {
        if (this.mem.state == undefined || (<[string]>this.mem.state).length == 0) {
            return undefined;
        }

        let stack = (<[string]>this.mem.state);

        return stack.pop();
    }

    protected runState() {
        var state: string = this.getState();

        var stateFunc: any = this[state];
        while (!(stateFunc && stateFunc instanceof Function)) {
            console.log(`${this.creep.name}: attempt to run invalid state: ${state}`);
            this.popState();
            stateFunc = this.getState();
        }

        this[state]();
    }

    protected initState() {
    }

    constructor(creep: Creep) {
        this.creep = creep;
        this.mem = creep.memory;
    }

    protected moveTo(target: any) {
        this.creep.moveTo(target, { visualizePathStyle: { stroke: '#ffaa00' } });
    }
}
