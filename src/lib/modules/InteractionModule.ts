import Hammer from 'hammerjs';
import CanvasModule from './CanvasModule';
import IPointer from '@models/interfaces/IPointer';
import IPoint from '@models/interfaces/IPoint';
import Point from '../models/Point';

export class InteractionModule {

    private _canvasModule: CanvasModule;
    private _hammer: HammerManager;
    private _touch: IPointer;
    private _interactionHandler: IInteractionHandler;
    private _isDragging: boolean = false;

    constructor(canvasModule: CanvasModule, interactionHandler: IInteractionHandler) {
        this._canvasModule = canvasModule;
        this._hammer = new Hammer(canvasModule.canvas);
        this._interactionHandler = interactionHandler;

        this.bindEvents();
    }

    private bindEvents(): void {
        this._canvasModule.canvas.addEventListener('mousewheel', e => this.onMouseWheel(e as WheelEvent));
        this._canvasModule.canvas.addEventListener('mousemove', this.onMouseMove.bind(this));

        this._hammer.on('hammer.input', this.onTouch.bind(this));
        this._hammer.on('tap', this.onMouseClick.bind(this));
        this._hammer.on('panstart', this.onDragStart.bind(this));
        this._hammer.on('panmove', this.onDrag.bind(this));
        this._hammer.on('panend', this.onDragEnd.bind(this));

        this._hammer.get('pan').set({ direction: Hammer.DIRECTION_ALL });
    }

    private onTouch(event: HammerInput): void {
        if (event.isFirst)
            this._touch = this.getPointer(event.center);
    }

    private onMouseMove(event: MouseEvent): void {
        if (!this._isDragging)
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

    private onDragStart(event: HammerInput) {
        this._isDragging = true;
        this._interactionHandler.onDragStart(this.getPointer(event.center));
    }

    private onDrag(event: HammerInput) {
        this._interactionHandler.onDrag(this.getPointer(event.center), this._touch);
    }

    private onDragEnd(event: HammerInput) {
        this._interactionHandler.onDragEnd(this.getPointer(event.center), this._touch);
        this._isDragging = false;
    }

    private getPointer(point: IPoint): IPointer {
        const clientPoint = new Point(
            point.x - this._canvasModule.canvas.getBoundingClientRect().left,
            point.y - this._canvasModule.canvas.getBoundingClientRect().top
        );

        const canvasPoint = this._canvasModule.toCanvasPoint(clientPoint);
        return {
            clientPosition: clientPoint,
            canvasPosition: canvasPoint
        };
    }
}

export interface IInteractionHandler {
    onMouseMove(pointer: IPointer): void;
    onMouseClick(pointer: IPointer): void;
    onMouseWheel(pointer: IPointer, value: number): void;
    onDragStart(pointer: IPointer): void,
    onDrag(pointerCurrent: IPointer, pointerStart: IPointer): void;
    onDragEnd(pointerEnd: IPointer, pointerStart: IPointer): void;
}