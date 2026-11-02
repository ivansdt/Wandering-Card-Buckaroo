import Input from './input.js';
import Battle from './battle.js';
import Rival from './rival.js';
import Player from './player.js';

export default class Game {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.input = new Input;
    }

    Start() {
        this.player = new Player("Mike");
        this.rival = new Rival("Mouse");
        this.battle = new Battle(this.player, this.rival);
        this.lastTime = performance.now();
        requestAnimationFrame((time) => this.Loop(time));

        const plrDeck = [
            "Mysterious Stranger",
            "Mysterious Stranger",
            "Mysterious Stranger",
            "Mysterious Stranger",
            "Bandit Leader",
            "Bandit Leader",
            "Bandit Leader",
            "Bandit Leader",
            "Big Iron",
            "Big Iron",
            "Big Iron",
            "Big Iron",
            "Cheese Moon",
            "Cheese Moon",
            "Cheese Moon",
            "Cheese Moon",
        ];

        const rvlDeck = [
            "Cheese Moon",
            "Big Iron",
            "Mysterious Stranger",
            "Mysterious Stranger",
            "Bandit Leader",
            "Cheese Moon",
        ];

        this.player.CreateDeck(plrDeck);
        this.rival.CreateDeck(rvlDeck);
        this.battle.StartBattle();
        // console.log(this.player.hand);
    }

    Update(dt) {
    }

    Draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.battle.Draw(this.player, this.rival, this.canvas, this.ctx);
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