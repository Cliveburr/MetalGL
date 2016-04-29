
class Engine implements MetalEngine.IEngine {
    private _inputs: MetalEngine.IInput[];
    private _renderer: MetalEngine.IRenderer;

    constructor() {
        this._inputs = [];
    }

    public addInput(input: MetalEngine.IInputType): void {
        this._inputs.push(new input());
    }

    public setRenderer(renderer: MetalEngine.IRenderer): void {
        this._renderer = renderer;
    }

    public start(): void {
    }
}

export = Engine;