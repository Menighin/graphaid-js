export default class Shape {

    private _layer: number = 100;
    public get layer() { return this._layer; }
    public set layer(value) { this._layer = value; }

    private _strokeStyle: string;
    public get strokeStyle() { return this._strokeStyle; }
    public set strokeStyle(value) { this._strokeStyle = value; }

    private _fillStyle: string;
    public get fillStyle() { return this._fillStyle; }
    public set fillStyle(value) { this._fillStyle = value; }

    private _isStroke: boolean = true;
    public get isStroke() { return this._isStroke; }
    public set isStroke(value) { this._isStroke = value; }

    private _isFilled: boolean = false;
    public get isFilled() { return this._isFilled; }
    public set isFilled(value) { this._isFilled = value; }

    private _lineWidth: number = 1;
    public get lineWidth() { return this._lineWidth; }
    public set lineWidth(value) { this._lineWidth = value; }

    public toString(): string {
        return [this.layer, this.strokeStyle, this.fillStyle, this.isStroke, this.isFilled, this.lineWidth].join('-');
    }

    constructor(init?: Partial<Shape>) {
        Object.assign(this, init);
    }
}