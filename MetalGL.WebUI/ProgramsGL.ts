import mgl = require('./MetalGL');

module programs {
    export function setProgramsFor(render: mgl.MetalGL): void {
        new ColorProgram(render);
    }

    export class Float32Buffer {
        public buffer: WebGLBuffer
        public size: number;
    }

    export class TriangleColorBuff {

    }

    export class ColorVertexBuffer extends Float32Buffer {
    }

    export class ColorProgram extends mgl.IProgram {
        public id(): string { return 'colorprogram' };

        constructor(render: mgl.MetalGL) {
            super(render);
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
precision mediump float;

void main(void) {
    gl_FragColor = vec4(0.1, 0.1, 0.1, 1.0);
}`;
        }

        public useProgram(): void {
        }
    }
}

export = programs;