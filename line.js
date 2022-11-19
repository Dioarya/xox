// Made by Dio Arya Raditya.
class Line {
    constructor(positions, size, color) {
        this.positions = [];
        for (let i = 0; i < 3; i++) {
            let x = positions[i][0] * size[0];
            let y = positions[i][1] * size[1];
            let v = createVector(x, y);
            this.positions.push(v);
        }
        this.size = createVector(...size);
        this.color = color;
        this.time = 0;
        this.prevTime = new Date();
        this.totalTime = 0.5;
    }

    update() {
        let now = new Date();
        let dt = new Date();
        dt.setTime(now - this.prevTime);
        this.prevTime = now;
        this.time = min(this.time + dt.getMilliseconds() / 1000 / this.totalTime, 1);
    }

    show() {
        let p = 2;
        let t = easeIn(this.time, p) * (this.positions.length - 1);
        stroke(0, 0, 0, Math.floor(256 / 4));
        strokeWeight(10 * screenData.strokeRatio);
        fill(255, 255, 255);
        beginShape();
        // t is a floating point number so k can run on value 1 when t = 1.01, 
        // this ensures that all the vertices that are already passed are 
        // displayed as normal.
        for (let k = 0; k < t; k++) {
            let v = this.positions[k];
            vertex(...shiftCoordinatesMiddle(v.x, v.y, this.size.x, this.size.y));
        }

        let i = Math.floor(t);
        let j = Math.ceil(t);
        // t is exactly on a vertex, show normally.
        if (i === j) {
            let v = this.positions[i];
            vertex(...shiftCoordinatesMiddle(v.x, v.y, this.size.x, this.size.y));
            endShape();
            return;
        }

        // t is between 2 vertices, lerp them.
        let a = this.positions[i];
        let b = this.positions[j];
        let vx = lerp(a.x, b.x, t % 1);
        let vy = lerp(a.y, b.y, t % 1);
        vertex(...shiftCoordinatesMiddle(vx, vy, this.size.x, this.size.y));
        endShape();
    }
}