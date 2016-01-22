import mgl = require('./MetalGL');

module internal {
    export function useElements(render: mgl.MetalGL): void {
        new ColorProgram(render);
        new TriangleVertex(render);
    }

    export class ColorProgram extends mgl.Program {
        public requireBuffers: string[] = ['TriangleVertex'];

        constructor(render: mgl.MetalGL) {
            super(render, 'ColorProgram');
        }

        protected _sh_vertex(): string {
            return `
attribute vec2 position;

void main(void) {
    gl_Position = vec4(position, 0.0, 1.0);
}`;
        }

        protected _sh_fragment(): string {
            return `
precision highp float;

void main(void) {
    gl_FragColor = vec4(0.1, 0.1, 0.1, 1.0);
}`;
        }

        public useProgram(): void {
        }
    }

    export class TriangleVertex extends mgl.Buffer {
        constructor(render: mgl.MetalGL) {
            super(render, 'TriangleVertex', mgl.BufferType.Array, mgl.BufferVarType.Float32Array, 2);
        }
    }

    export class TriangleGeometry implements mgl.IGeometry {
        public requireBuffers: string[] = ['TriangleVertex'];
        public vertexs: number[];

        constructor(ps: number[]) {
            this.vertexs = ps;
        }
    }

    export class ColorMaterial implements mgl.IMaterial {
        public program: string = 'ColorProgram';
        public requireBuffers: string[] = [];
        public color: number[];

        constructor(color: number[]) {
            this.color = color;
        }
    }
}

export = internal;