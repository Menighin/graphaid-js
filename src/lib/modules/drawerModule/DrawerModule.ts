import ICanvas from "./interfaces/ICanvas";
import Shape from "./models/Shape";
import Circle from "./models/Circle";
import Line from "./models/Line";
import Text from "./models/Text";

export default class DrawerModule {

    private _canvas: ICanvas;
    private _shapesBuffer: Shape[] = [];
    private _textBuffer: Text[] = [];

    constructor(canvas: ICanvas) {
        this._canvas = canvas;
    }

    public bufferShape(shape: Shape): void {
        this._shapesBuffer.push(shape);
    }

    public bufferText(text: Text): void {
        this._textBuffer.push(text);
    }

    public flushDraw() : void {
        const ctx = this._canvas.ctx;
        const canvas = ctx.canvas;
        const camera = this._canvas.camera;
        
        // Clear the canvas
        ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);

        // Setting translation and scale
        ctx.save();
        ctx.translate(camera.translation.x, camera.translation.y);
        ctx.scale(camera.scale, camera.scale);

        // Draw shapes and texts
        this.drawShapes(ctx);
        this.drawTexts(ctx);

        ctx.restore();

        this._shapesBuffer = [];
    }

    private drawShapes(ctx: CanvasRenderingContext2D): void {
        // Grouping shapes for fast drawing
        const shapeGroups: { [shape: string]: Array<Shape>} = {};
        for (const s of this._shapesBuffer.sort((a, b) => a.layer - b.layer)) {
            const key = s.toString();
            if (!shapeGroups[key])
                shapeGroups[key] = [];
            shapeGroups[key].push(s);
        }

        // Drawing shapes by group
        for (const g of Object.keys(shapeGroups)) {
            const shapes = shapeGroups[g];
            const shapeProperties = shapes.first() as Shape;

            ctx.strokeStyle = shapeProperties.strokeStyle;
            ctx.lineWidth = shapeProperties.lineWidth;
            ctx.fillStyle = shapeProperties.fillStyle;
            
            ctx.beginPath();

            for (const shape of shapes) {
                if (shape instanceof Circle)
                    this.drawCircle(shape);
                else if (shape instanceof Line) 
                    this.drawLine(shape);
                else
                    throw new Error(`DrawerModule does not know how to draw a [${shape.constructor.name}]`);
            }

            if (shapeProperties.isStroke)
                ctx.stroke();
            
            if (shapeProperties.isFilled)
                ctx.fill();
        }
    }

    private drawTexts(ctx: CanvasRenderingContext2D) {
        // Grouping texts for fast drawing
        const textGroups: { [shape: string]: Text[]} = {};
        for (const s of this._textBuffer.sort((a, b) => a.layer - b.layer)) {
            const key = s.toString();
            if (!textGroups[key])
                textGroups[key] = [];
            textGroups[key].push(s);
        }

        // Drawing texts by group
        for (const g of Object.keys(textGroups)) {
            const texts = textGroups[g];
            const textProperties = texts.first();

            ctx.strokeStyle = textProperties.strokeStyle;
            ctx.lineWidth = textProperties.lineWidth;
            ctx.fillStyle = textProperties.fillStyle;
            ctx.font = textProperties.font;
            ctx.textAlign = textProperties.textAlign;
            ctx.textBaseline = textProperties.textBaseline;
            
            for (const text of texts) {
                if (textProperties.isStroke)
                    ctx.strokeText(text.text, text.position.x, text.position.y);
                
                if (textProperties.isFilled)
                    ctx.fillText(text.text, text.position.x, text.position.y);
            }
        }
    }

    private drawCircle(circle: Circle): void {
        const ctx = this._canvas.ctx;
        ctx.moveTo(circle.position.x + circle.radius, circle.position.y);
        ctx.arc(circle.position.x, circle.position.y, circle.radius, 0, 2 * Math.PI);
    }

    private drawLine(line: Line): void {
        const ctx = this._canvas.ctx;
        
        for (let i = 0; i < line.points.length; i++) {
            const point = line.points[i];
            if (i == 0)
                ctx.moveTo(point.x, point.y);
            else
                ctx.lineTo(point.x, point.y);
        }
    }
}
