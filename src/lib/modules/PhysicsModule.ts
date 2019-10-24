import BarnesHutTree, { IBody } from "../models/BarnesHutTree";
import Point from "../models/Point";
import IPoint from "../models/interfaces/IPoint";

export default class PhysicsModule {

    private _bodies: IBody[];
    private _speedByBodyId: Record<number, {vx: number, vy: number}>;

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
        const tree = this.generateTree();

        this._bodies.forEach(b => {
            const forces = tree.calculateForces(b);
            const bodySpeed = this._speedByBodyId[b.id];

            const ax = forces.fx / b.mass;
            const ay = forces.fy / b.mass;

            bodySpeed.vx += ax * 0.3;
            bodySpeed.vy += ay * 0.3;

            b.position.x += bodySpeed.vx * 0.3;
            b.position.y += bodySpeed.vy * 0.3;

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
}