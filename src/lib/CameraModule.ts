import { Point } from './CommonsModule';
import { IViewport } from './DrawerModule';

export default class CameraModule implements IViewport {

    private _scale: number;
    get scale() { return this._scale; }
    set scale(value) { this._scale = value; }

    private _translation: Point;
    get translation() { return this._translation; }
    set translation(value) { this._translation = value; }

    private _initialTranslation: Point | null = null;

    constructor() {
        this.scale = 1;
        this.translation = new Point(0, 0);
    }

    public translateCameraStart(point: Point): void {
        this._initialTranslation = new Point(this.translation.x, this.translation.y);
    }

    public translateCamera(currentPoint: Point, startPoint: Point): void {
        if (this._initialTranslation == null)
            throw new Error('translateCamera called without calling translateCameraStart');
        
        const diff = currentPoint.diffWith(startPoint);
        this.translation = new Point(this._initialTranslation.x + diff.x, this._initialTranslation.y + diff.y);
    }

    public translateCameraEnd(point: Point): void {
        this._initialTranslation = null;
        console.log(`Translation: [${this.translation.x}, ${this.translation.y}]`)
    }
}