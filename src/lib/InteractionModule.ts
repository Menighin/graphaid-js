import CanvasModule from './CanvasModule';
import { Point, Pointer } from './CommonsModule';
import Hammer from 'hammerjs';

export class InteractionModule {

    private _canvasModule: CanvasModule;
    private _hammer: HammerManager;
    private _touch: Point;
    private _interactionHandler: IInteractionHandler;

    constructor(canvasModule: CanvasModule, eventsHandler: IInteractionHandler) {
        this._canvasModule = canvasModule;
        this._hammer = new Hammer(canvasModule.canvas);
        this._interactionHandler = eventsHandler;

        this.bindEvents();
    }

    private bindEvents(): void {
        this._canvasModule.canvas.addEventListener('mousewheel', e => this.onMouseWheel(e as WheelEvent));
        this._canvasModule.canvas.addEventListener('mousemove', this.onMouseMove);

        this._hammer.on('hammer.input', this.onTouch);
        this._hammer.on('tap', this.onMouseClick);
        this._hammer.on('panmove', this.onDrag);
        this._hammer.on('panend', this.onDragEnd);
    }

    private onTouch(event: HammerInput): void {
        if (event.isFirst)
            this._touch = { x: event.center.x, y: event.center.y };
    }

    private onMouseMove(event: MouseEvent): void {
        this._interactionHandler.onMouseMove(this.getPointer({ x: event.x, y: event.y }));
    }

    private onMouseClick(event: HammerInput): void {
        this._interactionHandler.onMouseClick(this.getPointer(event.center))
    }

    private onMouseWheel(event: WheelEvent): void {
        let delta = 0;
        if (event.deltaY) { /* IE/Opera. */
            delta = event.deltaY / 120;
        }
        else if (event.detail) { /* Mozilla case. */
            // In Mozilla, sign of delta is different than in IE.
            // Also, delta is multiple of 3.
            delta = -event.detail / 3;
        }

        // If delta is nonzero, handle it.
        // Basically, delta is now positive if wheel was scrolled up,
        // and negative, if wheel was scrolled down.
        if (delta !== 0) {
            // Calculate the pointer location
            let pointer = this.getPointer({ x: event.clientX, y: event.clientY });
            this._interactionHandler.onMouseWheel(pointer, delta);
        }
        // Prevent default actions caused by mouse wheel.
        event.preventDefault();
    }

    private onDrag(event: HammerInput) {
        this._interactionHandler.onDrag(this.getPointer(event.center));
    }

    private onDragEnd(event: HammerInput) {
        let pointer = this.getPointer(event.center);
        this._interactionHandler.onDragEnd(pointer);
    }

    private getPointer(point: Point): Pointer {
        const clientPoint = {
            x: point.x - this._canvasModule.canvas.getBoundingClientRect().left,
            y: point.y - this._canvasModule.canvas.getBoundingClientRect().top
        };

        const canvasPoint = this._canvasModule.toCanvasPoint(clientPoint);
        return {
            clientPosition: clientPoint,
            canvasPosition: canvasPoint
        };
    }
}

export interface IInteractionHandler {
    onMouseMove(pointer: Pointer): void;
    onMouseClick(pointer: Pointer): void;
    onMouseWheel(pointer: Pointer, value: number): void;
    onDrag(pointer: Pointer): void;
    onDragEnd(pointer: Pointer): void;
}