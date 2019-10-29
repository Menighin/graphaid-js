import BarnesHutTree, { IBody } from "../models/BarnesHutTree";
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

    constructor() {
        this._bodies = [];
        this._speedByBodyId = {};
    }

    public insert(body: IBody): void {
        this._bodies.push(body);
        if (!this._speedByBodyId[body.id])
            this._speedByBodyId[body.id] = { vx: 0, vy: 0};
    }

    public simulateStep(): void {
        this._tree = this.generateTree();

        const timeFrame = 0.2;

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

        });
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

    draw(drawerModule: DrawerModule): void {
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
}