import { IConnection } from "./BarnesHutTree";

export default class GraphEdge implements IConnection {

    public get id() {
        if (this.isBidirectional)
            return this.from < this.to ? 
                `${this.from}-${this.to}` : 
                `${this.to}-${this.from}`;
        return `${this.from}-${this.to}`;
    }

    private _from: number;
    public get from() { return this._from; }
    public set from(value) { this._from = value; }

    private _to: number;
    public get to() { return this._to; }
    public set to(value) { this._to = value; }

    private _value: number;
    public get value() { return this._value; }
    public set value(value) { this._value = value; }

    private _isBidirectional: boolean;
    public get isBidirectional() { return this._isBidirectional; }
    public set isBidirectional(value) { this._isBidirectional = value; }

    constructor(init: Partial<GraphEdge>) {
        if (!init.from || !init.to)
            throw new Error('[from] and [to] are mandatory while creating a GraphEdge');
        Object.assign(this, init);        
    }

}