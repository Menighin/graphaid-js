import IPoint from "@models/interfaces/IPoint";
import Shape from "./Shape";

export default class Circle extends Shape {

    private _position: IPoint;
    public get position() { return this._position; }
    public set position(value) { this._position = value; }

    private _radius: number;
    public get radius() { return this._radius; }
    public set radius(value) { this._radius = value; }


}