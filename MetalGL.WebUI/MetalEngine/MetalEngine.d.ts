
declare module MetalEngine {
    export interface IEngine {
        addInput(input: IInputType): void;
        setRenderer(renderer: IRenderer): void;
        start(): void;
    }

    export interface IInput {
        onHit: System.IEvent<(source: string, ev: any, event: string) => void>;
    }

    export interface IInputType {
        new (): IInput;
    }

    export interface IRenderer {
        attach(el: HTMLElement): void;
    }

    export interface IRendererType {
        new (): IRenderer;
    }
}