import Input from './input.js';

export default class Game {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.input = new Input;
    }

    Start() {

        this.lastTime = performance.now();
        requestAnimationFrame((time) => this.Loop(time));
        console.log("Start");
    }

    Update(dt) {
    }

    Draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = "green";
        this.ctx.fillRect(50, 50, 50, 50);
    }

    Loop(currentTime) {
        const dt = (currentTime - this.lastTime) / 1000;
        this.lastTime = currentTime;

        if (dt < 0.1) {

            this.Update(dt);
            this.Draw();
        }
        requestAnimationFrame((time) => this.Loop(time));
    }
}