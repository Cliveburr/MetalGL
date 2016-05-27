import Engine = require('./MetalGL/Engine');
import Keyboard = require('./MetalGL/Inputs/Keyboard');
import Mouse = require('./MetalGL/Inputs/Mouse');
import Program = require('./MetalGL/Program');
import Prototype = require('./MetalGL/Prototype');

var engine = new Engine();
engine.attach(document.body);
engine.addInput(Keyboard);
engine.addInput(Mouse);


class ColorProgram extends Program {
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

var colorProgram = new ColorProgram();
engine.addProgram(colorProgram);


class Triangle extends Prototype {
    public static program: MetalEngine.IProgram;

    constructor(ps: number[]) {
        super();
        Triangle.program
    }
}

colorProgram.addPrototype(Triangle);

var t1 = new Triangle([-1, -1, 1, -1, 1, 1]);
engine.addObject(t1);

engine.start();

//var render = new mgl.MetalGL();
//render.bindElement(document.body);
//els.useElements(render);

//var ge = new els.TriangleGeometry([-1, -1, 1, -1, 1, 1]);
//var blank = new els.ColorMaterial([0, 0, 0, 0]);
//var triangleMesh = render.createMesh(ge, blank);

//var t1 = triangleMesh.new();

//var GL = render.gl;

function teste1() {
    // criar o elemento e bindar na pagina
    var nel = document.createElement('canvas');
    nel.style.zIndex = '0';
    nel.width = window.innerWidth;
    nel.height = window.innerHeight;
    document.body.appendChild(nel);

    var GL = <WebGLRenderingContext>nel.getContext('experimental-webgl', { antialias: true });

    var shader_vertex_source = `
attribute vec2 position;

void main(void) {
    gl_Position = vec4(position, 0.0, 1.0);
}`;


    var shader_fragment_source = `
precision mediump float;

void main(void) {
    gl_FragColor = vec4(0.1, 0.1, 0.1, 1.0);
}`;


    var get_shader = function (source, type, typeString) {
        var shader = GL.createShader(type);
        GL.shaderSource(shader, source);
        GL.compileShader(shader);
        if (!GL.getShaderParameter(shader, GL.COMPILE_STATUS)) {
            alert("ERROR IN " + typeString + " SHADER : " + GL.getShaderInfoLog(shader));
            return false;
        }
        return shader;
    };

    var shader_vertex = get_shader(shader_vertex_source, GL.VERTEX_SHADER, "VERTEX");

    var shader_fragment = get_shader(shader_fragment_source, GL.FRAGMENT_SHADER, "FRAGMENT");

    var SHADER_PROGRAM = GL.createProgram();
    GL.attachShader(SHADER_PROGRAM, shader_vertex);
    GL.attachShader(SHADER_PROGRAM, shader_fragment);

    GL.linkProgram(SHADER_PROGRAM);

    var _position = GL.getAttribLocation(SHADER_PROGRAM, "position");

    GL.enableVertexAttribArray(_position);

    GL.useProgram(SHADER_PROGRAM);


    /*========================= THE TRIANGLE ========================= */
    //POINTS :
    var triangle_vertex = [
        -1, -1, //first summit -> bottom left of the viewport
        1, -1, //bottom right of the viewport
        1, 1,  //top right of the viewport
        0, 1,
        0, 0,
        -1, 0

    ];

    var TRIANGLE_VERTEX = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, TRIANGLE_VERTEX);
    GL.bufferData(GL.ARRAY_BUFFER,
        new Float32Array(triangle_vertex),
        GL.STATIC_DRAW);

    //FACES :
    var triangle_faces = [0, 1, 2, -1, -1, -1];
    var TRIANGLE_FACES = GL.createBuffer();
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, TRIANGLE_FACES);
    GL.bufferData(GL.ELEMENT_ARRAY_BUFFER,
        new Uint16Array(triangle_faces),
        GL.STATIC_DRAW);


    /*========================= DRAWING ========================= */
    GL.clearColor(0.0, 0.0, 0.0, 0.0);

    var animate = function () {

        GL.viewport(0.0, 0.0, nel.width, nel.height);
        GL.clear(GL.COLOR_BUFFER_BIT);

        GL.bindBuffer(GL.ARRAY_BUFFER, TRIANGLE_VERTEX);

        GL.vertexAttribPointer(_position, 2, GL.FLOAT, false, 4 * 2, 0) ;

        GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, TRIANGLE_FACES);
        GL.drawElements(GL.TRIANGLES, 6, GL.UNSIGNED_SHORT, 0);
        GL.flush();

        window.requestAnimationFrame(animate);
    };

    animate();
}

//teste1();