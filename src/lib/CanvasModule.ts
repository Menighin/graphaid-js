export default class CanvasModule {

    container: HTMLDivElement | null;
    canvas: HTMLCanvasElement | null;
    canvasContext: CanvasRenderingContext2D | null;

    constructor(div: string) {
        this.container = document.getElementById(div) as HTMLDivElement;
        this.canvas = document.createElement('canvas');
        this.container.appendChild(this.canvas);
        this.canvasContext = this.canvas.getContext('2d');
        
    }
}