import CanvasModule from './modules/CanvasModule';
import './Prototypes';
import './DebugVariables';
import IDrawable from '@modules/interfaces/IDrawable';
import DrawerModule from '@modules/drawerModule/DrawerModule';
import Circle from './modules/drawerModule/models/Circle';
import GraphNode from './models/GraphNode';
import Point from './models/Point';
import PhysicsModule from './modules/PhysicsModule';
import Text from './modules/drawerModule/models/Text';

export default class Graphaid implements IDrawable {

    private _canvasModule: CanvasModule;
    private _physicsModule: PhysicsModule;
    private _nodes: GraphNode[] = [];

    constructor(div: string) {
        this._canvasModule = new CanvasModule(div);
        this._physicsModule = new PhysicsModule();
        this._canvasModule.addBeforeDrawCallback(this);
        this._canvasModule.addBeforeDrawCallback(this._physicsModule);

        // this._nodes.push(new GraphNode({id: 0, value: 10, position: new Point(0, 0)}));
        this._nodes.push(new GraphNode({id: 1, value: 10, position: new Point(100, 100)}));
        this._nodes.push(new GraphNode({id: 2, value: 10, position: new Point(200, 100)}));
        this._nodes.push(new GraphNode({id: 3, value: 10, position: new Point(300, 200)}));
        this._nodes.push(new GraphNode({id: 4, value: 10, position: new Point(320, 200)}));
        this._nodes.push(new GraphNode({id: 5, value: 10 , position: new Point(340, 200)}));
        this._nodes.push(new GraphNode({id: 6, value: 10, position: new Point(400, 200)}));


        this._nodes.forEach(n => this._physicsModule.insert(n));

        // Setting debug variables so they will appear on chrome console
        window.graphaidDebug = {
            nodeLabels: true
        };

        this._canvasModule.initDraw();
    }

    public addNode(node: GraphNode) {
        this._nodes.push(node);
    }

    draw(drawerModule: DrawerModule): void {

        if (!this._physicsModule.isStabilized)
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
                fillStyle: 'blue',
                isFilled: true
            });

            drawerModule.bufferShape(circle);


            if (window.graphaidDebug.nodeLabels) {
                drawerModule.bufferText(new Text({
                    text: node.id.toString(),
                    position: node.position,
                    font: '5px Arial',
                    isFilled: true,
                    isStroke: false,
                    textAlign: 'center',
                    textBaseline: 'middle',
                    fillStyle: 'white'
                }))
            }
        }
        
        if (!this._physicsModule.isStabilized)
            this._canvasModule.requestRedraw();
    }
}