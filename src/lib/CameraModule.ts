import { Point } from './CommonsModule';
import { IViewport } from './DrawerModule';

export default class CameraModule implements IViewport {

    private _scale: number;
    get scale() { return this._scale; }
    set scale(value) { this._scale = value; }

    private _translation: Point;
    get translation() { return this._translation; }
    set translation(value) { this._translation = value; }

    constructor() {
        this.scale = 1;
        this.translation = {x: 0, y: 0};
    }
}