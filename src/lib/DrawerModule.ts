import CameraModule from "./CameraModule";
import { Point } from "./CommonsModule";

export class DrawerModule {

    private _drawable: IDrawable;
    private _isDrawing: boolean;

    constructor(drawable: IDrawable) {
        this._drawable = drawable;
    }

    public draw() : void {
        if (!this._isDrawing) {
            this._isDrawing = true;
            const ctx = this._drawable.ctx;
            const canvas = ctx.canvas;
            const camera = this._drawable.camera;
            
            // Clear the canvas
            ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);

            // Setting translation and scale
            ctx.save();
            ctx.translate(camera.translation.x, camera.translation.y);
            ctx.scale(camera.scale, camera.scale);

            ctx.moveTo(0, 0);
            ctx.lineTo(100, 100);
            ctx.stroke();

            ctx.restore();

            this._isDrawing = false;

            requestAnimationFrame(this.draw.bind(this));
        }
    }

}

export interface IDrawable {
    readonly ctx: CanvasRenderingContext2D,
    readonly camera: IViewport
}

export interface IViewport {
    readonly scale: number,
    readonly translation: Point
}