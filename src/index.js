import Graphaid from './lib/Graphaid';
import Hammer from 'hammerjs';
import GraphNode from './lib/models/GraphNode';
import GraphEdge from './lib/models/GraphEdge';

window.onload = function() {
    const gaid = new Graphaid('placeholder');
    let id = 0;

    // this.setInterval(() => {
    //     gaid.addNode(new GraphNode({
    //         id: id++,
    //         value: 10
    //     }));
    // }, 200);

    for (let i = 0; i < 10; i++) {
        gaid.addNode(new GraphNode({
            id: id++,
            value: 10
        }));
    }

    for (let i = 0; i < 10; i++) {
        gaid.addEdge(new GraphEdge({
            from: i,
            to: ++i,
            value: i * 2
        }));
    }
}
