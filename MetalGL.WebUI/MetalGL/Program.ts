
abstract class Program implements MetalEngine.WebGL.IProgram {
    protected _renderer: MetalEngine.WebGL.IRenderer;
    protected _program: WebGLProgram;
    protected _shaderFragment: WebGLShader;
    protected _shaderVertex: WebGLShader;
    protected abstract _sh_fragment(): string;
    protected abstract _sh_vertex(): string;

    public abstract useProgram(): void;

    public setRenderer(renderer: MetalEngine.WebGL.IRenderer): void {
        var gl = this._renderer.gl;

        var fragmentShader = this.createShader(this._sh_fragment(), gl.FRAGMENT_SHADER);
        var vertexShader = this.createShader(this._sh_vertex(), gl.VERTEX_SHADER);

        var program = gl.createProgram();
        gl.attachShader(program, fragmentShader);
        gl.attachShader(program, vertexShader);
        gl.linkProgram(program);

        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            throw 'Could not initialise shaders';
        }

        this._renderer = renderer;
        this._program = program;
        this._shaderFragment = fragmentShader;
        this._shaderVertex = vertexShader;
    }

    private createShader(source: string, typeShader: number): WebGLShader {
        var gl = this._renderer.gl;
        var shader = gl.createShader(typeShader);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
            throw 'Error compiling the shader! ' + gl.getShaderInfoLog(shader);
        return shader;
    }

    public addPrototype(proto: MetalEngine.IPrototypeType): void {
        proto.program = this;
    }
}

export = Program;