import { Point, IPointer } from './CommonsModule';
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

    public translateStart(point: Point): void {
        this._initialTranslation = new Point(this.translation.x, this.translation.y);
    }

    public translate(currentPoint: Point, startPoint: Point): void {
        if (this._initialTranslation == null)
            throw new Error('translate called without calling translateStart');
        
        const diff = currentPoint.diffWith(startPoint);
        this.translation = new Point(this._initialTranslation.x + diff.x, this._initialTranslation.y + diff.y);
    }

    public translateEnd(point: Point): void {
        this._initialTranslation = null;
    }

    public zoom(pointer: IPointer, value: number): void {

        const oldScale = this.scale;
        const clientPoint = pointer.clientPosition;
        this.scale += value;
        this.scale = Math.max(0.2, this.scale);
        this.scale = Math.min(15, this.scale);

        const scaleFrac = this.scale / oldScale;
        const tx = (1 - scaleFrac) * clientPoint.x + this.translation.x * scaleFrac;
        const ty = (1 - scaleFrac) * clientPoint.y + this.translation.y * scaleFrac;

        this.translation = new Point(tx, ty);
    }
}