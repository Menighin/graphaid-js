import { InteractionModule, IInteractionHandler } from './InteractionModule';
import CameraModule from './CameraModule';
import { Point, IPointer, IPoint } from './CommonsModule';
import { IDrawable, IViewport, DrawerModule } from './DrawerModule';

export default class CanvasModule implements IInteractionHandler, IDrawable {

    private _container: HTMLDivElement;
    private _interactionModule: InteractionModule;
    private _drawerModule: DrawerModule;

    private _ctx: CanvasRenderingContext2D;
    get ctx(): CanvasRenderingContext2D { return this._ctx; }

    private _camera: CameraModule;
    get camera(): CameraModule { return this._camera; }

    private _canvas: HTMLCanvasElement;
    get canvas(): HTMLCanvasElement { return this._canvas; }
    set canvas(value: HTMLCanvasElement) { this._canvas = value; }

    constructor(div: string) {
        this._container = document.getElementById(div) as HTMLDivElement;
        this.canvas = document.createElement('canvas');
        this.canvas.width = this._container.clientWidth;
        this.canvas.height = this._container.clientHeight;

        this._container.innerHTML = '';
        this._container.appendChild(this.canvas);
        this._ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;

        this._interactionModule = new InteractionModule(this, this);

        this._camera = new CameraModule();
        this._drawerModule = new DrawerModule(this);
    }

    private xConvertDomToCanvas(x: number): number {
        return (x - this._camera.translation.x) / this._camera.scale;
    }

    private yConvertDomToCanvas(y: number): number {
        return (y - this._camera.translation.y) / this._camera.scale;
    }

    private xConvertCanvasToDom(x: number): number {
        return x * this._camera.scale + this._camera.translation.x;
    }

    private yConvertCanvasToDom(y: number): number {
        return y * this._camera.scale + this._camera.translation.y;
    }

    public initDraw(): void {
        this._drawerModule.draw();
    }

    public onMouseClick(pointer: IPointer): void {

    }

    public onMouseMove(pointer: IPointer): void {
        console.log('mouse move');
    }

    public onMouseWheel(pointer: IPointer, value: number): void {

    }

    public onDragStart(pointer: IPointer): void {
        this.camera.translateCameraStart(pointer.clientPosition);
    }

    public onDrag(pointerCurrent: IPointer, pointerStart: IPointer): void {
        this.camera.translateCamera(pointerCurrent.clientPosition, pointerStart.clientPosition);
    }

    public onDragEnd(pointerEnd: IPointer, pointerStart: IPointer): void {
        this.camera.translateCameraEnd(pointerEnd.clientPosition);
    }

    /**
     * Converts a client point (DOM) to a point in the canvas
     * @param clientPoint The point in client coordinates
     */
    public toCanvasPoint(clientPoint: IPoint): Point {
        return new Point(this.xConvertDomToCanvas(clientPoint.x), this.yConvertDomToCanvas(clientPoint.y));
    }

    /**
     * Converts a point in the canvas to a point in the client (DOM)
     * @param canvasPoint The point in canvas coordinates
     */
    public toClientPoint(canvasPoint: IPoint): Point {
        return new Point(this.xConvertCanvasToDom(canvasPoint.x), this.yConvertCanvasToDom(canvasPoint.y));
    }

}