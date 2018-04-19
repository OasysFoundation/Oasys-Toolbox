import SVG from "svg.js"


let Plot = class{
    constructor(parameters = {
            containerID: 'plot',
            size: 500,
            // granularity: 400, //steps -- paths drawn total
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

        //draw ticks

        const totalTicks = 5;
        const tickStep = this.size / totalTicks;
        const tickSize = 10;

        const ticks = new Array(totalTicks).fill(1).map((e,i) => tickStep * (i + 1) -1);
        ticks.unshift(0);
        console.log(ticks);


        ticks.forEach(e => {
            //x Axis labeling first
            this.pathGroup.path()
                .attr('d', `M ${this.pos[e].x} ${this.size} L ${this.pos[e].x} ${this.size + tickSize}`)
                .attr('stroke-width', 2)
                .attr('stroke-opacity', 0.8)
                .attr('stroke', `black`)

            //text
            const txt = this.container.text(Math.round(this.values[e].x).toString())
            txt.attr({
                x: this.pos[e].x - 4,
                y: this.size + 5
            });

            txt.font({
                family: 'Helvetica',
                size: 8
            })
        })


    }
    init(mathNode) {
        if (mathNode) {
            this.f = function (xVal) {
                return mathNode.eval({x: xVal})
            };
        }
        else {
            this.f = function(x){
                return Math.cos(x);
            }
        }
        this.computeValues();
        this.computePositions();

        this.drawAxis()
        this.makePaths();
    }
    getPos() {
        return this.pos.slice();
    }
    posToValue(pos) {
            const x = pos.x / this.unitSizeX;
            const y = (this.size - pos.y) / this.unitSizeY
        return {x, y}
    }

    xPosToyPos(xPos) {
        const y = this.size - this.f(xPos/this.unitSizeX) * this.unitSizeY;
        return y;
    }
    computeValues(){
        const t = this;
        if (!t.f) {Console.log('PLOT CLASS has not FUNCTION')};

        t.Xs = new Array(t.size).fill(1).map((x, i) => (i-t.interval[0])  / t.unitSizeX);
        //this.Ys = Xs.map(x => this.f(x));
        t.values = t.Xs.map(function(e) {
            return {x: e, y: t.f(e)}
        });
    }
    computePositions() {
        const t = this;
        t.pos = t.values.map(function(v) {
            return {
                x: v.x * t.unitSizeX,
                y: t.size - v.y * t.unitSizeY}
        });
    }
    makePaths(pos = this.pos){
        const t = this;
        for (let i= 0; i < pos.length-1; i++) {
            const v = pos[i];
            const v2 = pos[i+1];
            t.pathGroup.path().attr('d', `M ${v.x} ${v.y} L ${v2.x} ${v2.y}`)
                .attr('stroke-width', 0.5)
                .attr('stroke-opacity', 0.9)
                .attr('stroke', `black` )
        }
    }
}

export default Plot;




