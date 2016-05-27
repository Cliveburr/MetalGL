import Event = require('../../System/Event');

class Keyboard implements MetalEngine.IInput {
    public onHit: System.IEvent<(source: string, ev: any, event: string) => void>;

    constructor() {
        this.onHit = new Event<(source: string, ev: any, event: string) => void>();
        window.addEventListener('keydown', (ev) => this.sendInput(ev, 'keydown'), false);
        window.addEventListener('keyup', (ev) => this.sendInput(ev, 'keyup'), false);
        window.addEventListener('keypress', (ev) => this.sendInput(ev, 'keypress'), false);
    }

    private sendInput(ev: KeyboardEvent, event: string): void {
        this.onHit.raise('keyboard', ev, event);
    }
}

export = Keyboard;