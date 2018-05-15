import SVG from "svg.js"
import Plot from "./plot.js"
import katex from "katex"
import {symbolizer, latexFromString} from "./symbolizer.js"
import {Graph, Node, drawGraph} from "./TreeVis.js"
import './style/katex.css'
import './style/monokai-sublime.min.css'
import './style/quill.snow.css'
import './style/style.css'
import {initQuill} from './editor.js'



// const fx = new SVG("fx").size(1000, 1000);
// const fxG = fx.group();


// document.getElementById('evaluate-button').addEventListener('click', function(e) {
//     const equation = document.getElementById('input-textfield').value;
//     const latex = latexFromString(equation);

//     const element = document.getElementById('latex');
//     katex.render(latex, element, {
//         //displayMode: true,
//     });

//     window.symbolicRepresentation = symbolizer(equation);
//     P.init(window.symbolicRepresentation)
//     console.log("symRep", symbolicRepresentation);
//     // refresh the graph here with the new formula

// });


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

initQuill();


// const dataNodes = data.map(d => new Node({name: d.name, children: d.children}))
//
//
// const treeDiv = new SVG("treeView").size(1200, 1200);
// const graph = new Graph(dataNodes, treeDiv);
//
// drawGraph(graph, treeDiv, 500);



