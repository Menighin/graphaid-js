export default interface IPoint {
    x: number,
    y: number,
    diffWith?(p: IPoint): IPoint,
    distanceTo?(p: IPoint): number
}