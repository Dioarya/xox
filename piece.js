// Made by Dio Arya Raditya.
class Piece {
    constructor(pos, size, player, color, isx) {
        this.pos = createVector(pos[0] * size[0], pos[1] * size[1]);
        this.size = createVector(...size);
        this.player = player;
        this.color = color;
        this.isx = isx;
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
        stroke(this.color);
        strokeWeight(5 * screenData.strokeRatio);
        noFill();

        const p = 2;
        const x0 = this.pos.x + (this.size.x * 1 / 8); // left
        const y0 = this.pos.y + (this.size.y * 1 / 8); // top
        const x1 = this.pos.x + (this.size.x * 7 / 8); // right
        const y1 = this.pos.y + (this.size.y * 7 / 8); // bottom
        if (this.isx) {
            // Ratio of the first line to the second line's timing. 0 -> 1.
            // 0 means first stroke takes no time. 1 means second stroke takes no time.
            const ratio = 0.5;
            // The second line's start relative to the start of the animation. 0 -> ratio. 
            // The time the second line starts drawing.
            const offset = 0.2;
            let start0 = 0, end0 = ratio;
            let start1 = ratio - offset, end1 = 1 - offset;

            const t0 = easeInOut(constrain(map(this.time, start0, end0, 0, 1), 0, 1), p);
            const t1 = easeInOut(constrain(map(this.time, start1, end1, 0, 1), 0, 1), p);

            line(x0, y0, lerp(x0, x1, t0), lerp(y0, y1, t0));
            if (this.time < start1) { return; }
            line(x1, y0, lerp(x1, x0, t1), lerp(y0, y1, t1));
        } else if (!this.isx) {
            const t = easeIn(this.time, p);

            ellipseMode(CENTER);
            arc(
                this.pos.x + (this.size.x / 2),
                this.pos.y + (this.size.y / 2),
                (this.size.x) * 3 / 4,
                (this.size.y) * 3 / 4,
                -Math.PI / 2,
                2 * Math.PI * t - Math.PI / 2
            );
        }
    }
}