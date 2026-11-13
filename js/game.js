import Input from './input.js';
import Battle from './battle.js';
import Rival from './rival.js';
import Player from './player.js';
import Button from './button.js'

export default class Game {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.input = new Input;
        this.bg = new Image();
        this.logo = new Image();

        window.addEventListener('keydown', (e) => this.input.OnKeyDown(e, this, this.player, this.battle));
    }

    Start() {
        this.playButton = new Button(this.canvas.width / 2 - 75, this.canvas.height / 6 * 4, 'assets/buttons/boton-jugar.png', 'assets/buttons/boton-jugar-a.png');
        this.playButton.isSelected = true;
        this.input.onButton = this.playButton;
        this.creditsButton = new Button(this.canvas.width / 2 - 75, this.canvas.height / 6 * 4 + 60, 'assets/buttons/boton-creditos.png', 'assets/buttons/boton-creditos-a.png');
        this.bg.src = 'assets/bg/wildwest-bg.png';
        this.logo.src = 'assets/logo/title.png';
        this.lastTime = performance.now();
        requestAnimationFrame((time) => this.Loop(time));
    }

    CreateBattle() {
        this.player = new Player("Mike");
        this.rival = new Rival("Mouse");
        this.battle = new Battle(this.player, this.rival, this.input);

        const deck = [
            "Mysterious Stranger",
            "Mysterious Stranger",
            "Mysterious Stranger",
            "Bandit Leader",
            "Bandit Leader",
            "Bandit Leader",
            "Big Iron",
            "Big Iron",
            "Big Iron",
            "Cheese Moon",
            "Cheese Moon",
            "Cheese Moon",
            "Sheriff Badge",
            "Sheriff Badge",
            "Sheriff Badge",
            "Cheese Amulet",
            "Cheese Amulet",
            "Cheese Amulet",
        ];

        this.player.CreateDeck(deck);
        this.rival.CreateDeck(deck);
        this.battle.StartBattle(this.canvas, this.ctx);
    }

    Update(dt) {
        if (this.input.gameState == Input.GAME_STATES.PLAY) {
            for (let i = 0; i < this.battle.plrZones.length; i++) {
                for (let j = 0; j < this.battle.plrZones[i].cards.length; j++) {
                    if (this.battle.plrZones[i].cards[j]) {
                        this.battle.plrZones[i].cards[j].holo.Update(dt);
                        //console.log(this.battle.plrZones[i].cards[j].holo.scaleX);
                    }
                }
            }
            for (let i = 0; i < this.battle.rvlZones.length; i++) {
                for (let j = 0; j < this.battle.rvlZones[i].cards.length; j++) {
                    if (this.battle.rvlZones[i].cards[j]) {
                        this.battle.rvlZones[i].cards[j].holo.Update(dt);
                    }
                }
            }
        }
    }

    DrawPause() {

    }

    Draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        if (this.input.gameState != Input.GAME_STATES.TITLE) {
            if (this.input.gameState == Input.GAME_STATES.WIN) {
                this.ctx.drawImage(this.bg, 0, 0, this.canvas.width, this.canvas.height);
                this.ctx.fillStyle = 'white';
                this.ctx.font = 'bold 80px serif';
                this.ctx.direction = "ltr";
                this.ctx.textAlign = "center";
                this.ctx.textBaseline = "middle";
                this.ctx.fillText("VICTORIA", this.canvas.width / 2, this.canvas.height / 3);
                this.ctx.font = '30px serif';
                this.ctx.fillText("Presiona Escape para regresar al menú principal", this.canvas.width / 2 - 280, this.canvas.height / 3 * 2);

            } else if (this.input.gameState == Input.GAME_STATES.LOSE) {
                this.ctx.drawImage(this.bg, 0, 0, this.canvas.width, this.canvas.height);
                this.ctx.fillStyle = 'white';
                this.ctx.font = 'bold 80px serif';
                this.ctx.direction = "ltr";
                this.ctx.textAlign = "center";
                this.ctx.textBaseline = "middle";
                this.ctx.fillText("DERROTA", this.canvas.width / 2, this.canvas.height / 3);
                this.ctx.font = '30px serif';
                this.ctx.fillText("Presiona Escape para regresar al menú principal", this.canvas.width / 2 - 280, this.canvas.height / 3 * 2);
            } else if (this.input.gameState == Input.GAME_STATES.PAUSE) {
                let offset = 150;
                this.ctx.drawImage(this.bg, 0, 0, this.canvas.width, this.canvas.height);
                this.ctx.fillStyle = 'white';
                this.ctx.font = 'bold 80px serif';
                this.ctx.direction = "ltr";
                this.ctx.textAlign = "center";
                this.ctx.textBaseline = "middle";
                this.ctx.fillText("PAUSADO", this.canvas.width / 2, offset);
                this.ctx.font = '40px serif';
                this.ctx.fillText("Presiona Escape para regresar", this.canvas.width / 2, this.canvas.height - offset - 70);
                this.ctx.fillText("Presiona R para reiniciar el juego", this.canvas.width / 2, this.canvas.height - offset);
            } else {
                this.battle.Draw();
            }

        } else {
            this.ctx.drawImage(this.bg, 0, 0, this.canvas.width, this.canvas.height);
            this.ctx.drawImage(this.logo, this.canvas.width / 2 - 455 / 2, 50, 455, 270);
            this.playButton.Draw(this.canvas, this.ctx);
            // this.creditsButton.Draw(this.canvas, this.ctx);
            this.ctx.fillStyle = "#ffffff";
            this.ctx.font = "20px serif";
            this.ctx.direction = "ltr";
            // this.ctx.fillText('W - Mover hacia arriba', 10, this.canvas.height - 70);
            // this.ctx.fillText('S - Mover hacia abajo', 10, this.canvas.height - 40);
            this.ctx.fillText('ENTER - Seleccionar', 10, this.canvas.height - 10);
        }
    }

    Loop(currentTime) {
        if (this.input.gameState != Input.GAME_STATES.PAUSE) {
            const dt = (currentTime - this.lastTime) / 1000;
            this.lastTime = currentTime;

            if (dt < 0.1) {
                this.Update(dt);
                this.Draw();
            }
        } else {
            this.Draw();
        }
        requestAnimationFrame((time) => this.Loop(time));
    }
}