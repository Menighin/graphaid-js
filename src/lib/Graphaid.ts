import CanvasModule from './CanvasModule';

export default class Graphaid {

    canvasModule: CanvasModule;

    constructor(div: string) {
        this.canvasModule = new CanvasModule(div);
    }

}