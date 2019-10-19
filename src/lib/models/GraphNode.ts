import { IBody } from "./BarnersHutTree";
import Point from "./Point";

export default class GraphNode implements IBody {

    private _id: number;
    public get id() { return this._id; }
    public set id(value) { this._id = value; }
    
    private _value : number;
    public get value() { return this._value; }
    public get mass() { return this._value; }
    public set value(v) { this._value = v; }

    private _position: Point;
    public get position() { return this._position; }
    public set position(value) { this._position = value; }

    constructor(id: number, value: number = 1, position: Point = new Point(0, 0)) {
        this.id = id;
        this.value = value;
        this.position = position;
    }
}