import Point from "./Point";
import IPoint from "./interfaces/IPoint";

export default class BarnesHutTree {

    private _root: BarnesHutNode;
    public get root() { return this._root; }
    public set root(value) { this._root = value; }

    constructor(topLeft: Point, bottomRight: Point) {
        this.root = new BarnesHutNode(new BarnersHutRegion(topLeft, bottomRight));
    }

    public insert(body: IBody): void {
        let nodeToPlace = this.root;

        // Search for a place to hide the body 🤫
        let foundThePlace = false;
        while (!foundThePlace) {
            if (nodeToPlace.children.any()) {
                nodeToPlace = nodeToPlace.children.first(o => o.region.isInRegion(body.position));
                if (nodeToPlace === null)
                    throw new Error(`No region was found to hide body with mass ${body.mass} and position ${body.position}. 
                                    Did you pass the correct coordinates while creating the BarnersHutTree?`)
            } else if (nodeToPlace.body !== null) {
                this.splitNewRegions(nodeToPlace);
                nodeToPlace = nodeToPlace.children.first(o => o.region.isInRegion(body.position));
            } else {
                nodeToPlace.body = body;
                foundThePlace = true;
            }
        }
    }

    private splitNewRegions(parent: BarnesHutNode): void {
        const pr = parent.region;
        const middleX = (pr.p1.x + pr.p2.x) / 2;
        const middleY = (pr.p1.y + pr.p2.y) / 2;

        // Create regions
        for (let i = 0; i < 4; i++) {
            let topLeft: Point = new Point(0, 0);
            let bottomRight: Point = new Point(0, 0);
            switch(i) {
                case 0:
                    topLeft = new Point(pr.p1.x, pr.p1.y);
                    bottomRight = new Point(middleX, middleY);
                    break;
                case 1:
                    topLeft = new Point(middleX, pr.p1.y);
                    bottomRight = new Point(pr.p2.x, middleY);
                    break;
                case 2:
                    topLeft = new Point(pr.p1.x, middleY);
                    bottomRight = new Point(middleX, pr.p2.y);
                    break;
                case 3:
                    topLeft = new Point(middleX, middleY);
                    bottomRight = new Point(pr.p2.x, pr.p2.y);
                    break;
            }

            parent.children.push(new BarnesHutNode(new BarnersHutRegion(topLeft, bottomRight), parent));
        }

        // Move the body from the parent node to one of the children
        if (parent.body !== null) {
            const newGrave = parent.children.first(c => c.region.isInRegion(parent.body!.position));
            newGrave.body = parent.body;
            parent.body = null;
        }
    }

}

export class BarnesHutNode {
    
    private _mass: number;
    public get mass() { return this._mass; }
    public set mass(value) { this._mass = value; }

    private _position: Point | null;
    public get position() { return this._position; }
    public set position(value) { this._position = value; }

    private _region: BarnersHutRegion;
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

    constructor(region: BarnersHutRegion, parent: BarnesHutNode | null = null) {
        this.region = region;
        this.mass = 0;
        this.parent = parent;
        this.children = [];
        this.body = null;
        this.position = null;
    }
    
}

class BarnersHutRegion {
    
    private _p1: Point;
    public get p1() { return this._p1; }
    public set p1(value) { this._p1 = value; }

    private _p2: Point;
    public get p2() { return this._p2; }
    public set p2(value) { this._p2 = value; }

    constructor(p1: Point, p2: Point) {
        this.p1 = p1;
        this.p2 = p2;
    }

    public isInRegion(p: IPoint) {
        return p.x >= this.p1.x && p.x <= this.p2.x &&
               p.y >= this.p1.y && p.y <= this.p2.y;
    }
}

export interface IBody {
    readonly position: Point,
    readonly mass: number
}