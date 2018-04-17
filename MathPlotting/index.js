import SVG from "svg.js"
import Plot from "./plot.js"

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
    graphHover(P.pathGroup, mouse);
})

function graphHover(container, mousePos) {
    //delete paths drawn in last frame
    let p = document.getElementsByClassName('tempPath');
    if (p.length > 0) {Array.from(p).forEach(e=> e.remove())};
    const y = P.xPosToyPos(mousePos.x);

    container.path()
        .attr('d', `M 0 ${y} L ${mousePos.x} ${y}`)
        .attr('stroke-width', 1)
        .attr('stroke-opacity', 0.8)
        .attr('stroke', `blue` )
        .attr('class', 'tempPath')

    container.path()
        .attr('d', `M ${mousePos.x} ${y} L ${mousePos.x} ${P.size - 0}`)
        .attr('stroke-width', 1)
        .attr('stroke-opacity', 0.8)
        .attr('stroke', `green` )
        .attr('class', 'tempPath')
}



