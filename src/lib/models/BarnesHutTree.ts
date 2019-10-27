import Point from "./Point";
import IPoint from "./interfaces/IPoint";
import IDrawable from "@modules/interfaces/IDrawable";
import DrawerModule from "@modules/drawerModule/DrawerModule";
import Line from "../modules/drawerModule/models/Line";

export default class BarnesHutTree implements IDrawable {
    
    private _root: BarnesHutNode;
    public get root() { return this._root; }
    public set root(value) { this._root = value; }

    private _debug: boolean = false;
    public get debug() { return this._debug; }
    public set debug(value) { this._debug = value; }

    constructor(topLeft: Point, bottomRight: Point) {
        this.root = new BarnesHutNode(new BarnesHutRegion(topLeft, bottomRight, 'root'));
    }

    public insert(body: IBody): void {
        let nodeToPlace = this.root;

        // Search for a place to hide the body 🤫
        let foundThePlace = false;
        while (!foundThePlace) {
            if (nodeToPlace.children.any()) {
                nodeToPlace.mass += body.mass;
                nodeToPlace = nodeToPlace.children.first(o => o.region.isInRegion(body.position));
                if (nodeToPlace === null)
                    throw new Error(`No region was found to hide body with mass ${body.mass} and position ${body.position}. 
                                    Did you pass the correct coordinates while creating the BarnersHutTree?`)
            } else if (nodeToPlace.body !== null) {
                this.splitNewRegions(nodeToPlace);
                nodeToPlace.mass += body.mass;
                nodeToPlace = nodeToPlace.children.first(o => o.region.isInRegion(body.position));
            } else {
                nodeToPlace.body = body;
                nodeToPlace.mass = body.mass;
                foundThePlace = true;
            }
        }

        this.calculateMassCenter(this._root);
    }

    private splitNewRegions(parent: BarnesHutNode): void {
        const pr = parent.region;
        const middleX = (pr.p1.x + pr.p2.x) / 2;
        const middleY = (pr.p1.y + pr.p2.y) / 2;

        // Create regions
        for (let i = 0; i < 4; i++) {
            let topLeft: Point = new Point(0, 0);
            let bottomRight: Point = new Point(0, 0);
            let label = '';
            switch(i) {
                case 0:
                    topLeft = new Point(pr.p1.x, pr.p1.y);
                    bottomRight = new Point(middleX, middleY);
                    label = 'TL';
                    break;
                case 1:
                    topLeft = new Point(middleX, pr.p1.y);
                    bottomRight = new Point(pr.p2.x, middleY);
                    label = 'TR';
                    break;
                case 2:
                    topLeft = new Point(pr.p1.x, middleY);
                    bottomRight = new Point(middleX, pr.p2.y);
                    label = 'BL';
                    break;
                case 3:
                    topLeft = new Point(middleX, middleY);
                    bottomRight = new Point(pr.p2.x, pr.p2.y);
                    label = 'BR';
                    break;
            }

            parent.children.push(new BarnesHutNode(new BarnesHutRegion(topLeft, bottomRight, label), parent));
        }

        // Move the body from the parent node to one of the children
        if (parent.body !== null) {
            const newGrave = parent.children.first(c => c.region.isInRegion(parent.body!.position));
            newGrave.body = parent.body;
            parent.body = null;
        }
    }

    /**
     * Recursively calculates the center of mass for the node
     * @param node The node to calculate the center of mass
     */
    private calculateMassCenter(node: BarnesHutNode): void {
        if (!node.children.any()) {
            if (node.body !== null) {
                node.mass = node.body.mass;
                node.position = node.body.position;
            }
            return;
        }

        let totalWeight = 0;
        let weightedX = 0;
        let weightedY = 0;
        node.children.forEach(n => {
            this.calculateMassCenter(n);
            if (n.mass > 0) {
                totalWeight += n.mass;
                weightedX += n.mass * n.position.x;
                weightedY += n.mass * n.position.y;
            }
        });

        node.position = new Point(weightedX / totalWeight, weightedY / totalWeight);
    }

    public calculateForces(body: IBody): {fx: number, fy: number} {
        const queue: BarnesHutNode[] = [this._root];
        const res = {fx: 0, fy: 0};

        // Calculate forces
        const getForces = (body: IBody, node: IBody, distance: number): {fx: number, fy: number} => {
            const dx = node.position.x - body.position.x;
            const dy = node.position.y - body.position.y;
            const forceAttraction = (9.8 * body.mass * node.mass) / Math.pow(distance, 3);
            const forceRepulsion = (9.8 * body.mass * node.mass) / Math.pow(distance, 2);

            return {
                fx: dx * (forceAttraction - forceRepulsion),
                fy: dy * (forceAttraction - forceRepulsion)
            }
        };

        while (queue.any()) {
            const node = queue.shift()!;

            // If this is not a node with a body, it means it is an internal node, check theta to know
            // Wheter it should keep searching or use a barnes hut node as approximation
            if (!node.body) {

                if (!node.children.any()) continue; // This is an empty node, just skip it

                const s = Math.abs(node.region.p1.x - node.region.p2.x);
                const d = body.position.distanceTo(node.position);
                const theta = s / d;
                
                // Consider the barnes hut node as a body and calculate the force with it
                if (theta < 0.5) {
                    const forces = getForces(body, node, d);

                    res.fx += forces.fx;
                    res.fy += forces.fy;
                } 
                // Go deeper on the three
                else {
                    queue.push(...node.children);
                }

            }
            // If there is a body, this is a leaf so use the body to calculate the force
            else {
                // Doesn't calculate force on itself
                if (node.body.id === body.id)
                    continue;

                const d  = body.position.distanceTo(node.body.position);
                const forces = getForces(body, node, d);

                res.fx += forces.fx;
                res.fy += forces.fy;
            }
        }

        // Adding the central gravity force
        const dx = -body.position.x;
        const dy = -body.position.y;
        const distanceToCenter = Math.sqrt(dx * dx + dy * dy);
        if (distanceToCenter > 50) {
            const gravity = 2 * 9.8 / distanceToCenter;
            res.fx += dx * gravity;
            res.fy += dy * gravity;
        } else {
            const gravity = 9.8 / distanceToCenter;
            res.fx += -dx * gravity;
            res.fy += -dy * gravity;
        }

        return res;
    }

    public draw(drawerModule: DrawerModule): void {

        if (!this.debug) return;

        const queue: BarnesHutNode[] = [this._root];

        while (queue.any()) {
            const node = queue.shift()!;

            drawerModule.bufferShape(new Line({
                layer: 0,
                strokeStyle: '#ccc',
                points: [
                    node.region.p1,
                    {x: node.region.p2.x, y: node.region.p1.y},
                    node.region.p2,
                    {x: node.region.p1.x, y: node.region.p2.y},
                    node.region.p1
                ]
            }));
            
            queue.push(...node.children);
        }

        this.print();
    }

    public print(): void {
        const stack: [number, BarnesHutNode][] = [[0, this.root]];
        while (stack.any()) {
            const item = stack.pop()!;
            const lvl = item[0];
            const node = item[1];

            console.log(`%c${'\t'.repeat(lvl)} R | ${node.mass} | ${node.position} | ${node.region}`, 'color: yellow');

            if (node.body)
                console.log(`%c${'\t'.repeat(lvl + 1)} B | ${node.body.mass} | ${node.body.position}`, 'color: red');

            for (const n of node.children)
                stack.push([lvl + 1, n]);
        }
    }

}

export class BarnesHutNode implements IBody {
    
    private _id: number;
    public get id() { return this._id; }
    public set id(value) { this._id = value; }
    
    private _mass: number;
    public get mass() { return this._mass; }
    public set mass(value) { this._mass = value; }

    private _position: Point;
    public get position() { return this._position; }
    public set position(value) { this._position = value; }

    private _region: BarnesHutRegion;
    public get region() { return this._region; }
    public set region(value) { this._region = value; }

    private _parent: BarnesHutNode | null;
    public get parent() { return this._parent; }
    public set parent(value) { this._parent = value; }

    private _children: BarnesHutNode[];
    public get children() { return this._children; }
    public set children(value) { this._children = value; }

    private _body: IBody | null;
    public get body() { return this._body; }
    public set body(value) { this._body = value; }

    constructor(region: BarnesHutRegion, parent: BarnesHutNode | null = null) {
        this.id = -1; // All barnes hut nodes has the ID set to -1 because they are not real nodes
        this.region = region;
        this.mass = 0;
        this.parent = parent;
        this.children = [];
        this.body = null;
        this.position = new Point(0, 0);
    }
    
}

class BarnesHutRegion {
    
    private _p1: Point;
    public get p1() { return this._p1; }
    public set p1(value) { this._p1 = value; }

    private _p2: Point;
    public get p2() { return this._p2; }
    public set p2(value) { this._p2 = value; }

    private _label: string;
    public get label() { return this._label; }
    public set label(value) { this._label = value; }

    constructor(p1: Point, p2: Point, label: string = '') {
        this.p1 = p1;
        this.p2 = p2;
        this.label = label;
    }

    public isInRegion(p: IPoint) {
        return p.x >= this.p1.x && p.x <= this.p2.x &&
               p.y >= this.p1.y && p.y <= this.p2.y;
    }

    public toString(): string {
        return `[${this.label}] ${this.p1} - ${this.p2}`;
    }
}

export interface IBody {
    readonly id: number,
    readonly position: Point,
    readonly mass: number
}