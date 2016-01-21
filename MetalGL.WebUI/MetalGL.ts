
module mgl {
    export class MetalGL {
        private _element: HTMLCanvasElement;
        private _parentElement: HTMLElement;
        private _programs: IProgram[];

        public gl: WebGLRenderingContext;

        constructor() {
            this.createElement();
            this._programs = [];
        }

        private createElement(): void {
            var nel = document.createElement('canvas');
            nel.style.zIndex = '0';
            this._element = nel;

            var gl = this.getWebGLContext(nel);
            if (!gl)
                throw 'WebGL not supported by browser!';
            this.gl = gl;
        }

        private getWebGLContext(canvas: HTMLCanvasElement): WebGLRenderingContext {
            var names = ["webgl", "experimental-webgl", "webkit-3d", "moz-webgl"];
            var context: WebGLRenderingContext = null;
            for (var ii = 0; ii < names.length; ++ii) {
                try {
                    context = <WebGLRenderingContext>canvas.getContext(names[ii]);
                } catch (e) { }
                if (context) {
                    break;
                }
            }
            return context;
        }

        public bindElement(el: HTMLElement): void {
            el.appendChild(this._element);
            this._parentElement = el;
            this.bindEvents();
            this.setTheSize();
        }

        private bindEvents() {
            //this._mgl.addEvent(<any>document, 'onkeydown', this.eventKeydown);
            //this._mgl.addEvent(<any>document, 'onkeyup', this.eventKeydown);

            //this._mgl.addEvent(<any>document, 'onmousemove', this.eventMousemove);
            
            if (this._parentElement === document.body) {
                window.addEventListener('resize', () => this.setTheSize(), false);
            }
        }

        public setTheSize(): void {
            this._element.width = this._parentElement.clientWidth;
            this._element.height = this._parentElement.clientHeight;
            this.gl.viewport(0, 0, this._element.width, this._element.height);
        }

        public attachProgram(program: IProgram): void {
            this._programs.push(program);
        }
    }

    export interface IProgramType {
        (): IProgram;
    }

    export abstract class IProgram {
        protected _render: mgl.MetalGL;
        protected _program: WebGLProgram;
        protected _shaderFragment: WebGLShader;
        protected _shaderVertex: WebGLShader;
        protected abstract _sh_fragment(): string;
        protected abstract _sh_vertex(): string;

        public abstract id(): string;
        public abstract useProgram(): void;

        constructor(render: mgl.MetalGL) {
            var gl = this._render.gl;

            var fragmentShader = this.createShader(this._sh_fragment(), gl.FRAGMENT_SHADER);
            var vertexShader = this.createShader(this._sh_vertex(), gl.VERTEX_SHADER);

            var program = gl.createProgram();
            gl.attachShader(program, fragmentShader);
            gl.attachShader(program, vertexShader);
            gl.linkProgram(program);

            if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
                throw 'Could not initialise shaders';
            }

            render.attachProgram(this);

            this._render = render;
            this._program = program;
            this._shaderFragment = fragmentShader;
            this._shaderVertex = vertexShader;
        }

        private createShader(source: string, typeShader: number): WebGLShader {
            var gl = this._render.gl;
            var shader = gl.createShader(typeShader);
            gl.shaderSource(shader, source);
            gl.compileShader(shader);
            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
                throw 'Error compiling the shader! ' + gl.getShaderInfoLog(shader);
            return shader;
        }
    }

    export interface IObject {
    }
}

export = mgl;