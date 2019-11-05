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
    private _nodesById: Record<number, GraphNode> = {};

    constructor(div: string) {
        this._canvasModule = new CanvasModule(div);
        this._physicsModule = new PhysicsModule();
        this._canvasModule.addBeforeDrawCallback(this);
        this._canvasModule.addBeforeDrawCallback(this._physicsModule);

        // Setting debug variables so they will appear on chrome console
        window.graphaidDebug = {
            nodeLabels: true
        };

        this._canvasModule.initDraw();
    }

    public addNode(node: GraphNode) {
        if (this._nodesById[node.id] !== undefined)
            throw `A node with ID ${node.id} already exists!`;

        this._nodes.push(node);
        this._nodesById[node.id] = node;
        this._physicsModule.insert(node);
        this._canvasModule.requestRedraw();
    }

    draw(drawerModule: DrawerModule): void {
        console.log('oi');
        if (!this._physicsModule.isStabilized)
            this._physicsModule.simulateStep();
        console.log('ei');

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