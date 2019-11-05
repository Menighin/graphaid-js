import BarnesHutTree, { IBody, BarnesHutNode } from "../models/BarnesHutTree";
import Point from "../models/Point";
import IPoint from "../models/interfaces/IPoint";
import IDrawable from "./interfaces/IDrawable";
import DrawerModule from "./drawerModule/DrawerModule";
import Line from "./drawerModule/models/Line";
import Text from "./drawerModule/models/Text";

export default class PhysicsModule implements IDrawable{

    private _bodies: IBody[];
    private _speedByBodyId: Record<number, {vx: number, vy: number}>;
    private _tree: BarnesHutTree;
    private _step = 0;

    private _isStabilized: boolean;
    public get isStabilized() { return this._isStabilized; }
    public set isStabilized(value) { this._isStabilized = value; }

    constructor() {
        this._bodies = [];
        this._speedByBodyId = {};
        this.isStabilized = false;
    }

    public insert(body: IBody): void {
        if (this._bodies.any())
            this.calculateInitialPosition(body);

        this._bodies.push(body);
        if (!this._speedByBodyId[body.id])
            this._speedByBodyId[body.id] = { vx: 0, vy: 0};
        
        // Re-stabilize
        this._isStabilized = false;
    }

    public simulateStep(): void {

        if (this._bodies.length === 0) return;

        this._tree = this.generateTree();
        this._step++;

        const timeFrame = 0.4;

        let averageSpeed = 0;
        this._bodies.forEach(b => {
            const forces = this._tree.calculateForces(b);
            const bodySpeed = this._speedByBodyId[b.id];

            // Calculate the acelerations
            const ax = forces.fx / b.mass;
            const ay = forces.fy / b.mass;

            // Calculate the speeds
            bodySpeed.vx += ax * timeFrame;
            bodySpeed.vy += ay * timeFrame;

            // Cap the speed
            bodySpeed.vx = Math.min(bodySpeed.vx, 5);
            bodySpeed.vy = Math.min(bodySpeed.vy, 5);

            // Calculate the new position
            b.position.x += bodySpeed.vx * timeFrame;
            b.position.y += bodySpeed.vy * timeFrame;

            // Update max speed
            averageSpeed += Math.sqrt(Math.pow(this._speedByBodyId[b.id].vx, 2) + Math.pow(this._speedByBodyId[b.id].vy, 2));
        });

        averageSpeed /= this._bodies.length;
        if (averageSpeed < 2 && this._step > 100) {
            this._step = 0;
            this.isStabilized = true;
        }

    }

    public generateTree(): BarnesHutTree {

        // Finding the points to create the root region
        const topLeftMost = new Point(this._bodies.first().position.x, this._bodies.first().position.y);
        const bottomRightMost = new Point(topLeftMost.x, topLeftMost.y);

        for (let i = 1; i < this._bodies.length; i++) {
            const nPos = this._bodies[i].position;
            if (nPos.x < topLeftMost.x) topLeftMost.x = nPos.x;
            if (nPos.y < topLeftMost.y) topLeftMost.y = nPos.y;
            if (nPos.x > bottomRightMost.x) bottomRightMost.x = nPos.x;
            if (nPos.y > bottomRightMost.y) bottomRightMost.y = nPos.y;
        }

        const dx = Math.abs(topLeftMost.x - bottomRightMost.x);
        const dy = Math.abs(topLeftMost.y - bottomRightMost.y);
        const diff = Math.abs(dx - dy);

        if (dx > dy) {
            topLeftMost.y -= diff / 2;
            bottomRightMost.y += diff / 2;
        } else if (dx < dy) {
            topLeftMost.x -= diff / 2;
            bottomRightMost.x += diff / 2;
        }

        // Creating the tree
        const tree = new BarnesHutTree(topLeftMost, bottomRightMost);

        this._bodies.forEach(n => tree.insert(n));

        return tree;
    }

    public draw(drawerModule: DrawerModule): void {

        if (this._bodies.length === 0) return;

        this._tree.debug = true;
        this._tree.draw(drawerModule);

        for (const body of this._bodies) {
            const forces = this._tree.calculateForces(body);

            drawerModule.bufferShape(new Line({
                layer: 10,
                strokeStyle: 'red',
                points: [
                    body.position,
                    { x: body.position.x + forces.fx, y: body.position.y + forces.fy }
                ]
            }));

            const speed = Math.sqrt(Math.pow(this._speedByBodyId[body.id].vx, 2) + Math.pow(this._speedByBodyId[body.id].vy, 2));
            drawerModule.bufferText(new Text({
                text: `speed: ${speed.toFixed(2)}`,
                position: { x: body.position.x + 10, y: body.position.y },
                font: '5px Arial',
                isFilled: true,
                isStroke: false,
                textAlign: 'left',
                textBaseline: 'middle',
                fillStyle: 'black'
            }))

        }
    }

    private calculateInitialPosition(body: IBody): void {
        this._tree = this.generateTree();
        
        // Find empty node to add the new body
        const queue = [ this._tree.root ];
        let nodeToPut = this._tree.root;
        while (queue.any()) {
            const node = queue.shift()!;

            if (node.body !== null)
                nodeToPut = node;
            
            if (node.body === null && !node.children.any()) {
                nodeToPut = node;
                break;
            }
            queue.push(...node.children);
        }

        body.position.x = (nodeToPut.region.p1.x + nodeToPut.region.p2.x) / 2;
        body.position.y = (nodeToPut.region.p1.y + nodeToPut.region.p2.y) / 2;

        // Safe check to not put node in the same position as another
        while (nodeToPut.body !== null && nodeToPut.body.position.distanceTo(body.position) < 5) 
        {
            body.position.x += Math.floor(Math.random() * 20) + 100;
            body.position.y += Math.floor(Math.random() * 20) + 100;
        }
    }
}