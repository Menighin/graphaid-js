import CanvasModule from './CanvasModule';
import Hammer from 'hammerjs';

export default class InteractionModule {

    canvasModule: CanvasModule;

    constructor(canvasModule: CanvasModule) {
        this.canvasModule = canvasModule;
    }
}