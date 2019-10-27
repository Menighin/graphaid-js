import CanvasModule from './modules/CanvasModule';
import './Prototypes';
import IDrawable from '@modules/interfaces/IDrawable';
import DrawerModule from '@modules/drawerModule/DrawerModule';
import Circle from './modules/drawerModule/models/Circle';
import GraphNode from './models/GraphNode';
import Point from './models/Point';
import BarnesHutTree from './models/BarnesHutTree';
import Line from './modules/drawerModule/models/Line';
import PhysicsModule from './modules/PhysicsModule';

export default class Graphaid implements IDrawable {

    private _canvasModule: CanvasModule;
    private _physicsModule: PhysicsModule;
    private _nodes: GraphNode[] = [];

    constructor(div: string) {
        this._canvasModule = new CanvasModule(div);
        this._physicsModule = new PhysicsModule();
        this._canvasModule.addBeforeDrawCallback(this);

        // this._nodes.push(new GraphNode({id: 0, value: 10, position: new Point(0, 0)}));
        this._nodes.push(new GraphNode({id: 1, value: 10, position: new Point(100, 100)}));
        this._nodes.push(new GraphNode({id: 2, value: 10, position: new Point(200, 100)}));
        this._nodes.push(new GraphNode({id: 3, value: 10, position: new Point(300, 200)}));
        this._nodes.push(new GraphNode({id: 4, value: 10, position: new Point(320, 200)}));
        this._nodes.push(new GraphNode({id: 5, value: 10 , position: new Point(340, 200)}));
        this._nodes.push(new GraphNode({id: 6, value: 10, position: new Point(400, 200)}));


        this._nodes.forEach(n => this._physicsModule.insert(n));

        this._canvasModule.initDraw();
    }

    public addNode(node: GraphNode) {
        this._nodes.push(node);
    }

    draw(drawerModule: DrawerModule): void {

        this._physicsModule.simulateStep();

        drawerModule.bufferShape(new Circle({
            layer: 100,
            radius: 3,
            strokeStyle: 'green',
            position: {x: 0, y: 0},
            isFilled: true
        }));

        for (const node of this._nodes) {
            const circle = new Circle({
                layer: 10,
                radius: 5,
                position: node.position,
                isFilled: true
            });

            drawerModule.bufferShape(circle);
            
            const bht = this._physicsModule.generateTree();
            bht.debug = true;
            bht.draw(drawerModule);

            const forces = bht.calculateForces(node);

            drawerModule.bufferShape(new Line({
                layer: 10,
                strokeStyle: 'red',
                points: [
                    node.position,
                    { x: node.position.x + forces.fx, y: node.position.y + forces.fy }
                ]
            }));

        }
        this._canvasModule.requestRedraw();
    }
}