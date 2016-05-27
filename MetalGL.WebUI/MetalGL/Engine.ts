
class Engine implements MetalEngine.IEngine {
    private _inputs: MetalEngine.IInput[];
    private _el: HTMLElement;
    private _programs: MetalEngine.WebGL.IProgram[];

    constructor() {
        this._inputs = [];
    }

    public addInput(input: MetalEngine.IInputType): void {
        this._inputs.push(new input());
    }

    public attach(el: HTMLElement): void {
        this._el = el;
    }

    public addProgram(program: MetalEngine.WebGL.IProgram): void {
        program.setRenderer(this);
        this._programs.push(program);
    }

    public addObject(proto: MetalEngine.IPrototype): void {
    }

    public start(): void {
    }
}

export = Engine;