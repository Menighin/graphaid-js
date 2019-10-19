import Point from "../models/Point";

export class DrawerModule {

    private _drawable: IDrawable;

    constructor(drawable: IDrawable) {
        this._drawable = drawable;
    }

    public draw() : void {
        const ctx = this._drawable.ctx;
        const canvas = ctx.canvas;
        const camera = this._drawable.camera;
        
        // Clear the canvas
        ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);

        // Setting translation and scale
        ctx.save();
        ctx.translate(camera.translation.x, camera.translation.y);
        ctx.scale(camera.scale, camera.scale);

        ctx.beginPath();
        ctx.moveTo(100, 100);
        ctx.lineTo(150, 150);
        ctx.stroke();

        ctx.restore();
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