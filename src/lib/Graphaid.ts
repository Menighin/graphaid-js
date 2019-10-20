import CanvasModule from './modules/CanvasModule';
import './Prototypes';

export default class Graphaid {

    private _canvasModule: CanvasModule;

    constructor(div: string) {
        this._canvasModule = new CanvasModule(div);
        this._canvasModule.initDraw();
    }

}