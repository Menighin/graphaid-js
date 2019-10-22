import CanvasModule from './modules/CanvasModule';
import './Prototypes';
import IDrawable from '@modules/interfaces/IDrawable';
import DrawerModule from '@modules/drawerModule/DrawerModule';
import Circle from './modules/drawerModule/models/Circle';
import GraphNode from './models/GraphNode';
import Point from './models/Point';
import BarnesHutTree from './models/BarnesHutTree';

export default class Graphaid implements IDrawable {

    private _canvasModule: CanvasModule;
    private _nodes: Array<GraphNode> = [];

    constructor(div: string) {
        this._canvasModule = new CanvasModule(div);
        this._canvasModule.addBeforeDrawCallback(this);

        this._nodes.push(new GraphNode({id: 1, value: 10, position: new Point(100, 100)}));
        this._nodes.push(new GraphNode({id: 2, value: 10, position: new Point(200, 100)}));
        this._nodes.push(new GraphNode({id: 3, value: 10, position: new Point(300, 200)}));
        this._nodes.push(new GraphNode({id: 4, value: 10, position: new Point(400, 200)}));
        this._nodes.push(new GraphNode({id: 5, value: 10, position: new Point(320, 200)}));
        this._nodes.push(new GraphNode({id: 6, value: 10, position: new Point(340, 200)}));

        const bht = new BarnesHutTree(new Point(0, 0), new Point(500, 300));
        bht.debug = true;
        for (const n of this._nodes)
            bht.insert(n);
        
        this._canvasModule.addBeforeDrawCallback(bht);
        this._canvasModule.initDraw();
    }

    public addNode(node: GraphNode) {
        this._nodes.push(node);
    }

    draw(drawerModule: DrawerModule): void {

        for (const node of this._nodes) {
            const circle = new Circle({
                radius: 5,
                position: node.position,
                isFilled: true
            });

            drawerModule.bufferShape(circle);
        }

    }
}