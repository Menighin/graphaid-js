import Shape from "./Shape";
import IPoint from "@models/interfaces/IPoint";

export default class Line extends Shape {

    private _points: Array<IPoint>;
    public get points() { return this._points; }
    public set points(value) { this._points = value; }

    constructor(init?: Partial<Line>) {
        super(init);
        Object.assign(this, init);
    }

}