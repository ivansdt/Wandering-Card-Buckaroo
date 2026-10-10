export default class Game {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
    }

    start() {
        this.lastTime = performance.now();
        requestAnimationFrame((time) => this.loop(time));
    }

    update(dt) {
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    loop(currentTime) {
        requestAnimationFrame((time) => this.loop(time));
    }
}