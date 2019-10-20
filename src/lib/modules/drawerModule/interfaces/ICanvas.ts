import IViewport from "./IViewport";

export default interface ICanvas {
    readonly ctx: CanvasRenderingContext2D,
    readonly camera: IViewport
}