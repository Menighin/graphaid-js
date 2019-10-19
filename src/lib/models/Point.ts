import IPoint from "./interfaces/IPoint";

export default class Point implements IPoint {
    private _x: number;
    get x() { return this._x; }
    set x(value) { this._x = value; }

    private _y: number;
    get y() { return this._y; }
    set y(value) { this._y = value; }

    constructor(x: number = 0, y:number = 0) {
        this._x = x;
        this._y = y;
    }

    public diffWith(p: IPoint): IPoint {
        return new Point(this.x - p.x, this.y - p.y);
    }

    public distanceTo(p: IPoint): number {
        const a = this.x - p.x;
        const b = this.y - p.y;
        return Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));
    }

    public toString(): string {
        return `[${this.x}, ${this.y}]`;
    }
}