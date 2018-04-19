import SVG from "svg.js"
import Plot from "./plot.js"
import katex from "katex"
import {symbolizer, latexFromString} from "./symbolizer.js"
import {Graph, Node, drawGraph} from "./TreeVis.js"
import './style/katex.css'

const P = new Plot();
P.init(function(x) {
    return Math.cos(x) //put in any function here
});
console.log(P);

const fx = new SVG("fx").size(1000, 1000);
const fxG = fx.group();


document.getElementById('plot').addEventListener('mousemove', function (e) {
    const x = e.layerX - this.offsetLeft;
    const y = e.layerY - this.offsetTop;
    const mouse = {x:x, y:y}
    plotHover(P.pathGroup, P, mouse);
})

document.getElementById('evaluate-button').addEventListener('click', function(e) {
    const equation = document.getElementById('input-textfield').value;
    const latex = latexFromString(equation);

    const element = document.getElementById('latex');
    katex.render(latex, element, {
        //displayMode: true,
    });

    window.symbolicRepresentation = symbolizer(equation);
    console.log("symRep", symbolicRepresentation);
    // refresh the graph here with the new formula
});

function plotHover(container, plotter, mousePos) {
    //delete paths drawn in last frame

    removeClass('tempPath')
    removeClass('tempText')
    const y = plotter.xPosToyPos(mousePos.x);

    const vals = plotter.posToValue({x: mousePos.x, y:y});

    container.path()
    //xPath - from left
        .attr('d', `M 0 ${y} L ${mousePos.x} ${y}`)
        .attr('stroke-width', 1)
        .attr('stroke-opacity', 0.8)
        .attr('stroke', `blue` )
        .attr('class', 'tempPath')

    putText(container, `x = ${vals.x.toFixed(2)} `, {x:mousePos.x - 30, y: y-20} )
        .attr('fill', 'blue')
        .attr('class', 'tempText')



    container.path()
    //yPath - from bottom
        .attr('d', `M ${mousePos.x} ${y} L ${mousePos.x} ${P.size - 0}`)
        .attr('stroke-width', 1)
        .attr('stroke-opacity', 0.8)
        .attr('stroke', `green` )
        .attr('class', 'tempPath')

    putText(container, `y = ${vals.y.toFixed(2)} `, {x:mousePos.x+2, y: y} )
        .attr('fill', 'green')
        .attr('class', 'tempText')
}
function removeClass(className) {
    let p = document.getElementsByClassName(className);
    if (p.length > 0) {Array.from(p).forEach(e=> e.remove())};
}

function putText(where, text, pos) {
    const txt = where.text(text)
    txt.attr({
        x: pos.x,
        y: pos.y
    });
    txt.font({
        family: 'Helvetica',
        size: 12
    })
    return txt;
}

const data = [
    {
        name: 'Weights + Energy',
        children: [
            'Force + Motion'
        ]
    },
    {
        name: 'Force + Motion',
        children: ['Energy']
    },
    {
        name: 'Heat',
        children: ['Energy', 'Friction']

    },
    {
        name: "Kinetic Energy",
        children: ['Energy']
    },
    {
        name: 'Energy',
        children: ['Entropy']
    },
    {
        name: 'Entropy',
        children: []
    },
    {
        //parent: 'Visualizing Data',
        name: 'Graphing',
        tag: 'toolbox',
        children: [] //'Plotting in 2D'
    },
    {
        name: "Friction",
        children: ["Entropy"]
    }
]

// const dataNodes = data.map(d => new Node({name: d.name, children: d.children}))
//
//
// const treeDiv = new SVG("treeView").size(1200, 1200);
// const graph = new Graph(dataNodes, treeDiv);
//
// drawGraph(graph, treeDiv, 500);



