export class Foo {
    constructor(private name: string) { }

    public somefunc() {
        console.log("someFunc called on", this.name);
    }
    public anyfunc() {
        console.log("anyFunc called on", this.name);
    }
}

export function bar(obj: Foo, func: string) {
    if (obj[func] && obj[func] instanceof Function) {
        obj[func]();
    } else {
        throw new Error("Function '" + func + "' is not a valid function");
    }
}

bar(new Foo("foo1"), "somefunc");  // output: 'somefunc called on foo1'
bar(new Foo("foo2"), "anyfunc");  // output: 'anyfunc called on foo1'
bar(new Foo("foo3"), "badFunction");  // throws: Error: Function 'b
