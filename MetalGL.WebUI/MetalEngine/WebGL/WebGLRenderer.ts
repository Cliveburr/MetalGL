
class WebGLRenderer implements MetalEngine.IRenderer {
    private _el: HTMLElement;

    constructor() {
    }

    public attach(el: HTMLElement): void {
        this._el = el;
    }
}

export = WebGLRenderer;