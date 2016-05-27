
declare module MetalEngine {
    export interface IEngine {
        addInput(input: IInputType): void;
        attach(el: HTMLElement): void;
        addProgram(program: MetalEngine.IProgram): void;
        addObject(obj: IPrototype): void;
        start(): void;
    }

    export interface IInput {
        onHit: System.IEvent<(source: string, ev: any, event: string) => void>;
    }

    export interface IInputType {
        new (): IInput;
    }

    export interface IPrototype {
    }

    export interface IPrototypeType {
        new (...params: any[]): IPrototype;
        program: IProgram;
    }

    export interface IProgram {
        setRenderer(renderer: MetalEngine.IRenderer): void;
    }

    export interface IProgramType {
        new (): IProgram;
    }
}