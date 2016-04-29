import Event = require('../../System/Event');

class Mouse implements MetalEngine.IInput {
    public onHit: System.IEvent<(source: string, ev: any, event: string) => void>;

    constructor() {
        this.onHit = new Event<(source: string, ev: any, event: string) => void>();
        window.addEventListener('mousedown', (ev) => this.sendInput(ev, 'mousedown'), false);
        window.addEventListener('mouseup', (ev) => this.sendInput(ev, 'mouseup'), false);
        window.addEventListener('click', (ev) => this.sendInput(ev, 'click'), false);
        window.addEventListener('mousemove', (ev) => this.sendInput(ev, 'mousemove'), false);
    }

    private sendInput(ev: MouseEvent, event: string): void {
        this.onHit.raise('keyboard', ev, event);
    }
}

export = Mouse;