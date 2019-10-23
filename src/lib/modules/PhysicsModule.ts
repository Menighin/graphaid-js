import BarnesHutTree, { IBody } from "../models/BarnesHutTree";
import Point from "../models/Point";

export default class PhysicsModule {

    private _bodies: IBody[];

    constructor() {
        this._bodies = [];
    }

    public insert(body: IBody): void {
        this._bodies.push(body);
    }

    public simulateStep(): void {
        const tree = this.generateTree();

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