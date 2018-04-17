import SVG from "svg.js"


let Plot = class{
    constructor(parameters = {
            containerID: 'plot',
            size: 400,
            granularity: 400, //steps -- paths drawn total
            interval: [0, 20],
            yRange: 2,
            axis: [1,1,0,0] //right upper, right lower
        }) {
        Object.assign(this, parameters);
        this.xRange = this.interval[1] - this.interval[0];
        this.unitSizeX = this.size / this.xRange;
        this.unitSizeY = this.size / this.yRange;
        // this.incrementX = this.unitSizeX / this.gra;

        this.container = new SVG(this.containerID).size(this.size * 2, this.size * 2); //random *2
        this.pathGroup = this.container.group();

        this.drawAxis()
    }
    drawAxis(){
        this.pathGroup.path()
            .attr('d', `M 0 ${this.size} L 0 0`)
            .attr('stroke-width', 2)
            .attr('stroke-opacity', 0.8)
            .attr('stroke', `black` );

        this.pathGroup.path()
            .attr('d', `M 0 ${this.size} L ${this.size} ${this.size}`)
            .attr('stroke-width', 2)
            .attr('stroke-opacity', 0.8)
            .attr('stroke', `black`)
    }
    init(func) {
        this.f = func;
        this.computeValues();
        this.computePositions();
        this.makePaths();
    }
    getPos() {
        return this.pos.slice();
    }
    xPosToyPos(xPos) {
        const y = this.size - this.f(xPos/this.unitSizeX) * this.unitSizeY;
        return y;
    }
    computeValues(){
        const t = this;
        if (!t.f) {Console.log('PLOT CLASS has not FUNCTION')};

        t.Xs = new Array(t.granularity).fill(1).map((x, i) => (i-t.interval[0])  / t.unitSizeX);
        //this.Ys = Xs.map(x => this.f(x));
        t.values = t.Xs.map(function(e) {
            return {x: e, y: t.f(e)}
        });
    }
    computePositions() {
        const t = this;
        t.pos = t.values.map(function(v) {
            return {x: v.x * t.unitSizeX, y: t.size - v.y * t.unitSizeY}
        });
    }
    makePaths(pos = this.pos){
        const t = this;
        for (let i= 0; i < pos.length-1; i++) {
            const v = pos[i];
            const v2 = pos[i+1];
            t.pathGroup.path().attr('d', `M ${v.x} ${v.y} L ${v2.x} ${v2.y}`)
                .attr('stroke-width', 0.3)
                .attr('stroke-opacity', 0.8)
                .attr('stroke', `black` )
        }
    }
}

export default Plot;




