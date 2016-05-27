
module internal {
    export class MetalGL {
        private _element: HTMLCanvasElement;
        private _parentElement: HTMLElement;
        private _programs: ElementCollection<Program>;
        private _buffers: ElementCollection<Buffer>;

        public gl: WebGLRenderingContext;

        constructor() {
            this.createElement();
            this._programs = new ElementCollection<Program>();
            this._buffers = new ElementCollection<Buffer>();
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

        public attachProgram(program: Program): void {
            this._programs.add(program);
        }

        public attachBuffer(buffer: Buffer): void {
            this._buffers.add(buffer);
        }

        public createMesh(geometry: IGeometry, material: IMaterial): void {
            var program = this._programs.read(material.program);
            if (!program)
                throw 'Program not found! ' + material.program;

            //for (var i = 0, b: string; b = material.program.requireBuffers[i]; i++) {
            //    if (!this._buffers.read(b))
            //        throw 'Buffer not found! ' + b;
            //}

            //for (var i = 0, b: string; b = geometry.requireBuffers[i]; i++) {
            //    if (!this._buffers.read(b))
            //        throw 'Buffer not found! ' + b;
            //}

            //for (var i = 0, b: string; b = geometry.requireBuffers[i]; i++) {
            //    if (!this._buffers.read(b))
            //        throw 'Buffer not found! ' + b;
            //}
        }
    }

    export interface IElement {
        id: string;
    }

    export class ElementCollection<T extends IElement> {
        private _items: T[] = [];

        public add(item: T): void {
            this._items.push(item);
        }

        public remove(item: T): boolean {
            var i = this._items.indexOf(item);
            if (i > -1) {
                this._items.splice(i, 1);
                return true;
            }
            else {
                return false;
            }
        }

        public read(id: string): T {
            var f = this._items.filter((i) => i.id == id);
            if (f.length > 0) {
                return f[0];
            }
            else {
                return null;
            }
        }
    }

    export abstract class Program {
        protected _render: MetalGL;
        protected _program: WebGLProgram;
        protected _shaderFragment: WebGLShader;
        protected _shaderVertex: WebGLShader;
        protected abstract _sh_fragment(): string;
        protected abstract _sh_vertex(): string;

        public abstract useProgram(): void;

        constructor(render: MetalGL,
            public id: string) {
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

    export enum BufferType {
        Array = 0,
        Element = 1
    }

    export enum BufferVarType {
        Float32Array = 0
    }

    export interface IBufferItem {
        index: number;
        toMount: () => number[];
    }

    export abstract class Buffer {
        private _buffer: WebGLBuffer;
        private _gl: WebGLRenderingContext;

        public items: IBufferItem[];
        public size: number;

        constructor(render: MetalGL,
            public id: string,
            public type: BufferType,
            public varType: BufferVarType,
            public dimension: number) {

            this._buffer = render.gl.createBuffer();

            this.items = [];
            this.size = 0;
            this._gl = render.gl;

            render.attachBuffer(this);
        }

        public request(toMount: () => number[]): IBufferItem {
            var i: IBufferItem = {
                index: this.items.length,
                toMount: toMount
            };
            this.items.push(i);
            return i;
        }

        public updateAll(): void {
            var b = [];
            for (var i = 0, t: IBufferItem; t = this.items[i]; i++) {
                b.push(t.toMount());
            }

            var array = null;
            switch (this.varType) {
                case BufferVarType.Float32Array: array = new Float32Array(b); break;
            }

            var btype = this.type == BufferType.Array ? this._gl.ARRAY_BUFFER : this._gl.ELEMENT_ARRAY_BUFFER;
            this._gl.bindBuffer(btype, this._buffer);
            this._gl.bufferData(btype, array, this._gl.DYNAMIC_DRAW);
        }

        public update(): void {
        }

        public release(): void {
            //TODO
        }
    }

    export interface IGeometry {
        requireBuffers: string[];
    }

    export interface IMaterial {
        requireBuffers: string[];
        program: string;
    }

    export interface IMesh {
    }

    export interface IObject {
    }
}

export = internal;