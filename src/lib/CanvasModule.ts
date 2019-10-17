export default class CanvasModule {

    container: HTMLDivElement;
    private _canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;

    get canvas(): HTMLCanvasElement { return this._canvas; }
    set canvas(value: HTMLCanvasElement) { this._canvas = value; }

    constructor(div: string) {
        this.container = document.getElementById(div) as HTMLDivElement;
        this.canvas = document.createElement('canvas');
        this.canvas.width = this.container.clientWidth;
        this.canvas.height = this.container.clientHeight;

        this.container.innerHTML = '';
        this.container.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;

        this.ctx.moveTo(0, 0);
        this.ctx.lineTo(this.canvas.width, this.canvas.height);
        this.ctx.stroke();
    }
}