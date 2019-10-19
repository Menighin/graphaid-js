export default class GraphEdge {

    private _origin: number;
    public get origin() { return this._origin; }
    public set origin(value) { this._origin = value; }

    private _destination: number;
    public get destination() { return this._destination; }
    public set destination(value) { this._destination = value; }

    private _isBidirectional: boolean;
    public get isBidirectional() { return this._isBidirectional; }
    public set isBidirectional(value) { this._isBidirectional = value; }

    constructor(origin: number, destination: number, isBidirectional: boolean = false) {
        this.origin = origin;
        this.destination = destination;
        this.isBidirectional = isBidirectional;
    }

}