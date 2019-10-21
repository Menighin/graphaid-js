import { IBody } from "./BarnersHutTree";
import Point from "./Point";

export default class GraphNode implements IBody {

    private _id: number;
    public get id() { return this._id; }
    public set id(value) { this._id = value; }
    
    private _value : number = 1;
    public get value() { return this._value; }
    public get mass() { return this._value; }
    public set value(v) { this._value = v; }

    private _position: Point = new Point(0, 0);
    public get position() { return this._position; }
    public set position(value) { this._position = value; }

    constructor(init: Partial<GraphNode>) {
        if (!init.id)
            throw new Error('The property [id] is mandatory while creating a GraphNode');
        Object.assign(this, init);
    }
}