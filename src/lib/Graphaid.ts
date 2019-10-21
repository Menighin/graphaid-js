import CanvasModule from './modules/CanvasModule';
import './Prototypes';
import IDrawable from '@modules/interfaces/IDrawable';
import DrawerModule from '@modules/drawerModule/DrawerModule';
import Circle from './modules/drawerModule/models/Circle';
import GraphNode from './models/GraphNode';
import Point from './models/Point';
import BarnesHutTree from './models/BarnersHutTree';

export default class Graphaid implements IDrawable {

    private _canvasModule: CanvasModule;
    private _nodes: Array<GraphNode> = [];

    constructor(div: string) {
        this._canvasModule = new CanvasModule(div);
        this._canvasModule.addBeforeDrawCallback(this);

        this._nodes.push(new GraphNode({id: 1, value: 10, position: new Point(100, 100)}));
        this._nodes.push(new GraphNode({id: 2, value: 10, position: new Point(200, 100)}));

        this._canvasModule.initDraw();


        const bht = new BarnesHutTree(new Point(0, 0), new Point(500, 300));
        for (const n of this._nodes)
            bht.insert(n);
    }

    public addNode(node: GraphNode) {
        this._nodes.push(node);
    }

    draw(drawerModule: DrawerModule): void {

        for (const node of this._nodes) {
            const circle = new Circle({
                radius: 20,
                position: node.position
            });

            drawerModule.bufferShape(circle);
        }

    }
}