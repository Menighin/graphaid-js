import Point from "@models/Point";

export default interface IViewport {
    readonly scale: number,
    readonly translation: Point
}