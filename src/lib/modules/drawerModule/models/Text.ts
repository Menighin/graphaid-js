import Shape from "./Shape";
import IPoint from "@models/interfaces/IPoint";

export default class Text extends Shape {
    
    private _position: IPoint;
    public get position() { return this._position; }
    public set position(value) { this._position = value; }

    private _text: string;
    public get text() { return this._text; }
    public set text(value) { this._text = value; }

    private _font: string;
    public get font() { return this._font; }
    public set font(value) { this._font = value; }

    private _textAlign: CanvasTextAlign;
    public get textAlign() { return this._textAlign; }
    public set textAlign(value) { this._textAlign = value; }

    private _textBaseline: CanvasTextBaseline;
    public get textBaseline() { return this._textBaseline; }
    public set textBaseline(value) { this._textBaseline = value; }

    constructor(init?: Partial<Text>) {
        super(init);
        Object.assign(this, init);
    }

    public toString(): string {
        return [super.toString(), this.font, this.textAlign, this.textBaseline].join('-');
    }

}