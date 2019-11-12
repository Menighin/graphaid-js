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
import GraphEdge from '@models/GraphEdge';
import Line from './modules/drawerModule/models/Line';

export default class Graphaid implements IDrawable {

    private _canvasModule: CanvasModule;
    private _physicsModule: PhysicsModule;
    private _nodes: GraphNode[] = [];
    private _nodesById: Record<number, GraphNode> = {};
    private _edges: GraphEdge[] = [];
    private _edgesById: Record<string, GraphEdge> = {};

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

    public addNode(node: GraphNode): void {
        if (this._nodesById[node.id] !== undefined)
            throw `A node with ID ${node.id} already exists!`;

        this._nodes.push(node);
        this._nodesById[node.id] = node;
        this._physicsModule.insertBody(node);
        this._canvasModule.requestRedraw();
    }

    public addEdge(edge: GraphEdge): void {
        if (this._edgesById[edge.id] !== undefined)
            throw `An edge with ID ${edge.id} already exists!`;

        this._edges.push(edge);
        this._edgesById[edge.id] = edge;
        this._physicsModule.insertConnection(edge);
        this._canvasModule.requestRedraw();
    }

    draw(drawerModule: DrawerModule): void {
        if (!this._physicsModule.isStabilized)
            this._physicsModule.simulateStep();

        // Draw the middle point of gravity
        drawerModule.bufferShape(new Circle({
            layer: 100,
            radius: 3,
            strokeStyle: 'green',
            position: {x: 0, y: 0},
            isFilled: true
        }));

        // Draw nodes and edges
        this.drawNodes(drawerModule);
        this.drawEdges(drawerModule);
        
        // If not stabilized, keep redrawing
        if (!this._physicsModule.isStabilized)
            this._canvasModule.requestRedraw();
    }

    private drawNodes(drawerModule: DrawerModule) : void {
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
    }

    private drawEdges(drawerModule: DrawerModule) : void {
        for (const edge of this._edges) {
            const n1 = this._nodesById[edge.from];
            const n2 = this._nodesById[edge.to];
            drawerModule.bufferShape(new Line({
                points: [
                    n1.position,
                    n2.position
                ]
            }));
        }
    }
}