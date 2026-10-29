import Input from './input.js';
import Entity from './entity.js';
import Battle from './battle.js';

export default class Game {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.input = new Input;
    }

    Start() {
        engine.useDefaultMainLoop = false;
        this.rival = new Entity("Mouse");
        this.battle = new Battle(this.rival);
        this.lastTime = performance.now();
        requestAnimationFrame((time) => this.Loop(time));
        console.log("Start");
    }

    Update(dt) {
    }

    Draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.battle.CreateDeck();
        this.battle.DrawDeck(this.canvas, this.ctx);
    }

    Loop(currentTime) {
        const dt = (currentTime - this.lastTime) / 1000;
        this.lastTime = currentTime;

        if (dt < 0.1) {
            engine.update();
            this.Update(dt);
            this.Draw();
        }
        requestAnimationFrame((time) => this.Loop(time));
    }
}