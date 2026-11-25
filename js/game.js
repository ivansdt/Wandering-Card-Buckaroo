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
        this.tutorial = new Image();
        this.player = new Player("Mike", 'assets/entities/player-side.png');
        this.rival = new Rival("Mouse", 'assets/entities/ban-leader-side.png');

        window.addEventListener('keydown', (e) => this.input.OnKeyDown(e, this, this.player, this.battle));
    }

    Start() {
        this.playButton = new Button(this.canvas.width / 2 - 75, this.canvas.height - 150 - 65, 'assets/buttons/boton-jugar.png', 'assets/buttons/boton-jugar-a.png');
        this.playButton.isSelected = true;
        this.input.onButton = this.playButton;
        this.tutorialButton = new Button(this.canvas.width / 2 - 75, this.canvas.height - 60 - 65, 'assets/buttons/boton-creditos.png', 'assets/buttons/boton-creditos-a.png');
        this.bg.src = 'assets/bg/wildwest-bg.png';
        this.logo.src = 'assets/logo/title.png';
        this.tutorial.src = 'assets/misc/Tutorial.png';
        this.lastTime = performance.now();
        requestAnimationFrame((time) => this.Loop(time));
    }

    CreateBattle() {

        if (!this.player) {
            this.player = new Player("Mike", 'assets/entities/player-side.png');
        }
        if (!this.rival) {
            this.rival = new Rival("Mouse", 'assets/entities/ban-leader-side.png');
        }

        this.player.sizeX = this.player.sprite.width * 1.5;
        this.player.sizeY = this.player.sprite.height * 1.5;

        this.rival.sizeX = this.rival.sprite.width * 1.5;
        this.rival.sizeY = this.rival.sprite.height * 1.5;

        this.battle = new Battle(this.player, this.rival, this.input);

        const plrDeck = [
            "Mysterious Stranger",
            "Mysterious Stranger",
            "Mysterious Stranger",
            "Mysterious Stranger",
            "Bandit Leader",
            "Bandit Leader",
            "Goon",
            "Goon",
            "Big Iron",
            "Big Iron",
            "Cheese Moon",
            "Cheese Moon",
            "Sheriff Badge",
            "Sheriff Badge",
            "Sheriff Badge",
            "Cheese Amulet",
            "Cheese Amulet",
        ];

        const rvlDeck = [
            "Bandit Leader",
            "Bandit Leader",
            "Bandit Leader",
            "Bandit Leader",
            "Sheriff Badge",
            "Sheriff Badge",
            "Sheriff Badge",
            "Cheese Moon",
            "Cheese Moon",
            "Cheese Moon",
            //"Cheese Moon",
        ];

        this.player.CreateDeck(plrDeck);
        this.rival.CreateDeck(rvlDeck);
        this.battle.StartBattle(this.canvas, this.ctx);

    }

    Update(dt) {
        if (this.input.gameState == Input.GAME_STATES.PLAY) {
            this.battle.UpdateHearts(dt);
            this.player.Update(dt);
            this.rival.Update(dt);
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

    Draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.save();
        let offset = 150;
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.strokeStyle = "#000000";
        this.ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
        this.ctx.shadowBlur = 5;
        this.ctx.shadowOffsetX = 0;
        this.ctx.shadowOffsetY = 1;
        this.ctx.lineWidth = 5;
        this.ctx.direction = "ltr";
        this.ctx.textAlign = "center";
        this.ctx.textBaseline = "middle";
        this.ctx.font = 'bold 80px Aseprite'
        if (this.input.gameState != Input.GAME_STATES.TITLE) {
            if (this.input.gameState == Input.GAME_STATES.TUTORIAL) {
                this.ctx.drawImage(this.tutorial, 0, 0, this.canvas.width, this.canvas.height);
                this.ctx.lineWidth = 3;
                this.ctx.font = "14px Aseprite";
                this.ctx.direction = "ltr";
                this.ctx.textAlign = "left";
                this.ctx.textBaseline = "bottom";
                this.ctx.strokeText('Esc / Enter - Regresar a menu principal', 6, this.canvas.height - 6);
                this.ctx.fillText('Esc / Enter - Regresar a menu principal', 6, this.canvas.height - 6);
            } else if (this.input.gameState == Input.GAME_STATES.WIN) {
                this.ctx.drawImage(this.bg, 0, 0, this.canvas.width, this.canvas.height);
                this.ctx.strokeText("VICTORIA", this.canvas.width / 2, offset);
                this.ctx.fillText("VICTORIA", this.canvas.width / 2, offset);
                this.ctx.font = '30px Aseprite';
                this.ctx.lineWidth = 4;
                this.ctx.strokeText("Presiona Escape para regresar al menu principal", this.canvas.width / 2, this.canvas.height - offset);
                this.ctx.fillText("Presiona Escape para regresar al menu principal", this.canvas.width / 2, this.canvas.height - offset);
            } else if (this.input.gameState == Input.GAME_STATES.LOSE) {
                this.ctx.drawImage(this.bg, 0, 0, this.canvas.width, this.canvas.height);
                this.ctx.strokeText("DERROTA", this.canvas.width / 2, offset);
                this.ctx.fillText("DERROTA", this.canvas.width / 2, offset);
                this.ctx.font = '30px Aseprite';
                this.ctx.lineWidth = 4;
                this.ctx.strokeText("Presiona Escape para regresar al menu principal", this.canvas.width / 2, this.canvas.height - offset);
                this.ctx.fillText("Presiona Escape para regresar al menu principal", this.canvas.width / 2, this.canvas.height - offset);
            } else if (this.input.gameState == Input.GAME_STATES.PAUSE) {
                this.ctx.drawImage(this.bg, 0, 0, this.canvas.width, this.canvas.height);
                this.ctx.strokeText("PAUSA", this.canvas.width / 2, offset);
                this.ctx.fillText("PAUSA", this.canvas.width / 2, offset);
                this.ctx.font = '40px Aseprite';
                this.ctx.lineWidth = 4;
                this.ctx.strokeText("Presiona Escape para regresar", this.canvas.width / 2, this.canvas.height - offset - 70);
                this.ctx.fillText("Presiona Escape para regresar", this.canvas.width / 2, this.canvas.height - offset - 70);
                this.ctx.strokeText("Presiona R para reiniciar el juego", this.canvas.width / 2, this.canvas.height - offset);
                this.ctx.fillText("Presiona R para reiniciar el juego", this.canvas.width / 2, this.canvas.height - offset);
            } else {
                this.battle.Draw();
            }
        } else {
            this.ctx.drawImage(this.bg, 0, 0, this.canvas.width, this.canvas.height);
            this.ctx.drawImage(this.logo, this.canvas.width / 2 - this.logo.width / 2, 30, this.logo.width, this.logo.height);
            this.playButton.Draw(this.canvas, this.ctx);
            this.tutorialButton.Draw(this.canvas, this.ctx);
            this.ctx.lineWidth = 3;
            this.ctx.font = "14px Aseprite";
            this.ctx.direction = "ltr";
            this.ctx.textAlign = "left";
            this.ctx.textBaseline = "bottom";
            // this.ctx.fillText('S - Mover hacia abajo', 10, this.canvas.height - 40);
            this.ctx.strokeText('Enter - Seleccionar', 6, this.canvas.height - 6);
            this.ctx.fillText('Enter - Seleccionar', 6, this.canvas.height - 6);
        }
        this.ctx.restore();
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