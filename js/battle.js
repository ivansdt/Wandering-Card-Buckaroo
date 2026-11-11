import Card from './card.js';
import Zone from './zone.js';
import Input from './input.js';
import Player from './player.js';

let maxHand = 6;
let maxZones = 5;

const delay = (ms) => new Promise(r => setTimeout(r, ms))

export default class Battle {

    static DUEL_STATE = {
        PLAYING: 0,
        CALC: 1,
        REVEAL: 2,
    }
    constructor(plrEnt, rivalEnt, input, dt) {
        this.player = plrEnt;
        this.plrDeck = plrEnt.deck;
        this.rival = rivalEnt;
        this.rvlDeck = rivalEnt.deck;
        this.isPlrTurn = false;
        this.plrZones = new Array();
        this.rvlZones = new Array();
        this.input = input;
        this.rvlLife = plrEnt.life;
        this.plrLife = rivalEnt.life;
        this.plrScore;
        this.rvlScore;
        this.canvas;
        this.ctx;
        this.state;

        /* Reutilizar este codigo en card.js en la funcion de Effect(), probablemente utilizando un switch general sin importar el genero
        
        this.executeCowboyEffect = function (sourceCard, targetCard, playerDeck, board) {
            console.log("Procesando efecto de: " + sourceCard.name);

            switch (sourceCard.name) {
                case "Mysterious Stranger":
                    let totalCowboys = board.filter(card => card && card.genre === sourceCard.CARD_GENRE.COW_COWBOYS).length;

                    sourceCard.attack -= totalCowboys;
                    if (sourceCard.attack < 0) {
                        sourceCard.attack = 0;
                    }

                    console.log("Mysterious Stranger cambia a tener: " + sourceCard.attack);
                    break;

                case "Bandit Leader":
                    // EFFECT: Al ser jugado, invoca un Goon en tu hand/deck
                    console.log("Efecto activado de Bandit Leader: Invocando Goon");

                    let goon = {
                        name: "Goon",
                        value: 1,
                        attack: 1,
                        genre: sourceCard.CARD_GENRE.COW_COWBOYS,
                        type: sourceCard.CARD_TYPE.CREATURE,
                        sprite: 'assets/card-template-goon.png'
                    };

                    if (playerDeck.length < 6) {
                        playerDeck.push(goon);
                        console.log("Goon invocado con exito.");
                    } else {
                        console.log("Hand llena. El Goon no pudo ser invocado.");
                    }
                    break;

                case "Big Iron":
                    // EFFECT: Otorga +3 de ataque, pero la carta muere al siguiente turno. El objeto permanece en el sitio
                    if (targetCard && targetCard.type === targetCard.CARD_TYPE.CREATURE) {
                        console.log("Equipando Big Iron a" + targetCard.name);

                        targetCard.attack += 3;
                        targetCard.doomedByBigIron = true;
                        if (targetCard.zone !== undefined && board[targetCard.zone]) {
                            board[targetCard.zone].permanentObject = "Big Iron";
                        }
                    }
                    break;

                default:
                    console.log("Ningún efecto inmediato requerido en esta carta.");
                    break;
            }
        }

        {
            advanceTurn(board)
            console.log("Avanzando al siguiente turno...");

            for (let i = 0; i < board.length; i++) {
                let card = board[i];

                if (card && card.doomedByBigIron) {
                    console.log("Efecto del Big Iron activado, destruyendo: " + card.name);
                    board[i] = null;
                }
            }
        }
        */
    }

    GetCardsFromDeck(entity) {
        let availableCards = new Array();
        for (let i = 0; i < entity.deck.length; i++) {
            availableCards.push(entity.deck[i]);
        }

        for (let i = 0; i < maxHand; i++) {
            let randomIndex = Math.floor(Math.random() * availableCards.length);
            let randomCard = availableCards.splice(randomIndex, 1)[0];
            entity.hand.push(randomCard);
        }
    }

    DeleteHand(hand) {
        let handSize = hand.length;
        for (let i = 0; i < handSize; i++) {
            hand.splice(0, 1);
            // console.log("i = " + i + " | hand size = " + hand.length);
            // console.log(hand);
        }
    }

    CreateZones() {
        // player zones
        for (let i = 0; i < maxZones; i++) {
            this.plrZones[i] = new Zone();
        }

        for (let i = 0; i < maxZones; i++) {
            this.rvlZones[i] = new Zone();
        }
    }

    CalculateValue(zones) {
        let totalValue = 0;
        for (let i = 0; i < maxZones; i++) {
            if (zones[i].cards[Card.CARD_TYPE.CREATURE]) {
                totalValue += zones[i].cards[Card.CARD_TYPE.CREATURE].value;
            }
            console.log("value of " + (i + 1) + " zones: " + totalValue);
        }
        return totalValue;
    }

    CompareValues(totalValueP, totalValueR) {
        if (totalValueP > totalValueR) {
            this.rvlLife -= totalValueP - totalValueR
            console.log("Player wins the round");
            return this.player;
        } else if (totalValueP < totalValueR) {
            this.plrLife -= totalValueR - totalValueP
            console.log("Rival wins the round");
            return this.rival;
        } else {
            console.log("It's a tie");
            return null;
        }
    }

    DoTurnEffects(ent, zones) {
        for (let i = 0; i < maxZones; i++) {
            for (let j = 0; j < zones[i].cards.length; j++) {
                if (zones[i].cards[j]) {
                    console.log("doing turn effect for " + zones[i].cards[j].name + " on zone " + i)
                    zones[i].cards[j].TurnEffect(ent, zones, zones[i]);
                }
            }
        }
    }

    DrawHand(hand) {
        let offsetX = 80;
        let offsetY = 50;
        let riseOffset = 150
        // test de renderizado de cartas placeholder
        for (let i = hand.length - 1; i >= 0; i--) {
            // console.log("i: " + i);
            let totalWidth = hand[i].width + ((hand.length - 1) * offsetX);
            hand[i].x = (this.canvas.width / 2) + (i * offsetX) - (totalWidth / 2);
            hand[i].y = this.canvas.height - offsetY;
            if (hand[i].isSelected) {
                hand[i].y -= riseOffset;
            }
            this.ctx.drawImage(hand[i].sprite, hand[i].x, hand[i].y, hand[i].width, hand[i].height);
        }
    }

    DrawZones() {
        // dibujar player zone
        let zoneWidth = 150;
        let zoneHeight = 50;
        let holoSize = 50;
        let offset = 20;
        for (let i = 0; i < maxZones; i++) {
            let zoneX = this.canvas.width / 4;
            let zoneY = offset + (i * (zoneHeight + 20));
            let totalValue = 0;
            if (this.plrZones[i].isSelected && this.input.onSection == Input.SECTION.ZONES) {
                this.ctx.fillStyle = "#367a9f";
            } else {
                this.ctx.fillStyle = "#7d7d7d";
            }
            this.ctx.fillRect(zoneX, zoneY, zoneWidth, zoneHeight);
            // dibujar sprite de la carta aqui con el .hologram, lo estoy testeando con cajas de colores por ahora. 
            for (let j = 0; j < this.plrZones[i].cards.length; j++) {
                if (this.plrZones[i].cards[j]) {
                    if (this.plrZones[i].cards[j].type == Card.CARD_TYPE.CREATURE) {
                        totalValue += this.plrZones[i].cards[j].value
                    }
                    this.ctx.fillStyle = "orange";
                    // this.ctx.fillRect(zoneX + zoneWidth - (j * ((zoneWidth / 2) - 15) + 30), zoneY + (zoneHeight / 2) - 15, 30, 30);
                    this.ctx.drawImage(this.plrZones[i].cards[j].holo, zoneX + zoneWidth - (j * ((zoneWidth / 2) - (holoSize / 2)) + holoSize), zoneY + (zoneHeight / 2) - (holoSize / 2), holoSize, holoSize);
                }
            }
            this.ctx.fillStyle = "#000000";
            this.ctx.font = "16px serif";
            this.ctx.direction = "ltr";
            this.ctx.fillText(totalValue, zoneX - offset, zoneY + (zoneHeight / 2));

        }
        // dibujar rival zone
        for (let i = 0; i < maxZones; i++) {
            let zoneX = ((this.canvas.width / 4) * 3) - zoneWidth;
            let zoneY = offset + (i * (zoneHeight + 20));
            let totalValue = 0;
            this.ctx.fillStyle = "#9a3f3f";
            this.ctx.fillRect(zoneX, zoneY, zoneWidth, zoneHeight);
            for (let j = 0; j < this.rvlZones[i].cards.length; j++) {
                if (this.rvlZones[i].cards[j]) {
                    if (this.rvlZones[i].cards[j].type == Card.CARD_TYPE.CREATURE) {
                        totalValue += this.rvlZones[i].cards[j].value
                    }
                    this.ctx.save();
                    this.ctx.translate(zoneX + (j * ((zoneWidth / 2) - (holoSize / 2))) + holoSize, zoneY + (zoneHeight / 2) - (holoSize / 2));
                    this.ctx.scale(-1, 1);
                    this.ctx.drawImage(this.rvlZones[i].cards[j].holo, 0, 0, holoSize, holoSize);
                    this.ctx.restore();
                }
            }
            this.ctx.fillStyle = "#000000";
            this.ctx.font = "16px serif";
            this.ctx.direction = "rtl";
            this.ctx.fillText(totalValue, zoneX + zoneWidth + offset, zoneY + (zoneHeight / 2));
        }
    }

    DrawHP() {
        let offsetX = 20;
        let offsetY = 40;
        this.ctx.fillStyle = "#000000";
        this.ctx.font = "32px serif";
        this.ctx.direction = "ltr";
        this.ctx.fillText("Player: " + this.plrLife, offsetX, offsetY);
        this.ctx.direction = "rtl";
        this.ctx.fillText("Rival: " + this.rvlLife, this.canvas.width - offsetX, offsetY);

    }

    DrawTotalScore(score, entity) {
        this.ctx.direction = "ltr";
        this.ctx.font = "32px serif";
        if (entity instanceof Player) {
            this.ctx.fillStyle = "#4088f5";
            this.ctx.fillText(score, this.canvas.width / 2, this.canvas.height / 6);
        } else {
            this.ctx.fillStyle = "#ff4747";
            this.ctx.fillText(score, this.canvas.width / 2, (this.canvas.height / 6) * 3);
        }
    }

    DrawDifference(plrScore, rvlScore) {
        let diff;
        if (plrScore > rvlScore) {
            this.ctx.fillStyle = "#c24b4b";
            diff = rvlScore - plrScore;
        } else if (rvlScore > plrScore) {
            this.ctx.fillStyle = "#446faf";
            diff = plrScore - rvlScore;
        } else {
            this.ctx.fillStyle = "#727272";
            diff = 0;
        }
        this.ctx.fillText(diff, this.canvas.width / 2, (this.canvas.height / 6) * 2);
    }

    async EndTurn(entity) {

        if (this.isPlrTurn) {
            console.log("now rival turn");
            this.isPlrTurn = false;
            this.DeleteHand(this.player.hand);
            this.DeleteHand(this.rival.hand);
            // calculo de puntos aqui
            await delay(1500);
            this.state = Battle.DUEL_STATE.CALC;
            console.log("PLAYER SCORE:");
            this.plrScore = this.CalculateValue(this.plrZones);
            console.log("RIVAL SCORE:");
            this.rvlScore = this.CalculateValue(this.rvlZones);
            await delay(1500);
            this.state = Battle.DUEL_STATE.REVEAL;
            await delay(1500);
            this.CompareValues(this.plrScore, this.rvlScore)
            if (this.plrLife <= 0) {
                this.EndBattle(Input.GAME_STATES.LOSE);
            } else if (this.rvlLife <= 0) {
                this.EndBattle(Input.GAME_STATES.WIN);
            } else {
                this.GetCardsFromDeck(this.player);
                this.GetCardsFromDeck(this.rival);
                this.state = Battle.DUEL_STATE.PLAYING;
                this.DoTurnEffects(this.player, this.plrZones);
                this.DoTurnEffects(this.rival, this.rvlZones);
                this.TurnHandler();
            }


        } else {
            console.log("now player turn");
            this.isPlrTurn = true;
            this.input.SelectingNode(this.player.hand);
        }
        entity.cardsPlayed = 0;
    }

    StartBattle(canvas, ctx) {
        this.input.ResetZone();
        this.input.ResetNode();
        this.CreateZones();
        this.GetCardsFromDeck(this.player);
        this.GetCardsFromDeck(this.rival);
        this.TurnHandler();
        this.canvas = canvas;
        this.ctx = ctx;
        this.state = Battle.DUEL_STATE.PLAYING;

        // testeo de carta en zona
        // this.plrZones[0].InsertCard(this.player.hand[0]);
    }

    ReceiveDelta(dt) {
        this.dt = dt;
    }

    SkipTurn() {
        this.EndTurn(this.player);
    }

    EndBattle(finishState) {
        console.log("ENDING GAME");
        this.input.ResetZone();
        this.input.ResetNode();
        this.input.gameState = finishState;
    }

    async TurnHandler() {
        // turno de rival
        if (!this.isPlrTurn) {
            for (let i = 0; i < 3; i++) {
                await delay(1000);
                let wasPlayed = this.rival.PlayRandomCard(this);
                if (!wasPlayed) {
                    break;
                }
            }
            this.EndTurn(this.rival);
            // turno de jugador
        } else {
            if (this.player.cardsPlayed >= 3) {
                this.input.ResetNode();
                this.EndTurn(this.player);
            }
        }
    }

    Draw(player) {
        this.DrawZones();
        this.DrawHand(player.hand);
        this.DrawHP();
        if (this.state == Battle.DUEL_STATE.CALC || this.state == Battle.DUEL_STATE.REVEAL) {
            this.DrawTotalScore(this.plrScore, this.player);
            this.DrawTotalScore(this.rvlScore, this.rival);
            if (this.state == Battle.DUEL_STATE.REVEAL) {
                this.DrawDifference(this.plrScore, this.rvlScore);
            }
        }
    }
}