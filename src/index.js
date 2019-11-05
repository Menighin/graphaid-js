import Graphaid from './lib/Graphaid';
import Hammer from 'hammerjs';
import GraphNode from './lib/models/GraphNode';

window.onload = function() {
    const gaid = new Graphaid('placeholder');
    let id = 0;
    this.setInterval(() => {
        gaid.addNode(new GraphNode({
            id: id++,
            value: 10
        }));
    }, 10);
    // debugger;
    // for (let i = 0; i < 10; i++) {
    //     gaid.addNode(new GraphNode({
    //         id: id++,
    //         value: 10
    //     }));
    // }
    // console.log('wat');
}
