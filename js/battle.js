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
        this.plrGraveyard = [];
        this.rvlGraveyard = [];
        this.rival = rivalEnt;
        this.rvlDeck = rivalEnt.deck;
        this.deckSprites = {
            Full: new Image(),
            Mid: new Image(),
            Low: new Image(),
            Empty: new Image(),
        };
        this.deckSprites.Full.src = 'assets/cards/deck/Deck Full.png';
        this.deckSprites.Mid.src = 'assets/cards/deck/Deck Mid.png';
        this.deckSprites.Low.src = 'assets/cards/deck/Deck Low.png';
        this.deckSprites.Empty.src = 'assets/cards/deck/Deck Empty.png';
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
        this.bg = new Image();
        this.light = new Image();
        this.bg.src = 'assets/bg/battle-bg/test-bg.png';
        this.light.src = 'assets/bg/battle-bg/lighting.png';
    }

    GetCardsFromDeck(entity) {
        let availableCards = new Array();
        for (let i = 0; i < entity.deck.length; i++) {
            availableCards.push(entity.deck[i]);
        }
        for (let i = 0; i < maxHand; i++) {
            if (availableCards.length > 0) {
                let randomIndex = Math.floor(Math.random() * availableCards.length);
                let randomCard = availableCards.splice(randomIndex, 1)[0];
                entity.hand.push(randomCard);
                entity.hand[i].isSelected = false;
            } else {
                break;
            }
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
        let zoneWidth = 180;
        let zoneHeight = 20;
        let offset = 210;
        let zoneOffset = 25;
        let numOffset = 10;
        let diagonalOffset = 10;
        let extraDiagonalOffset = diagonalOffset;
        for (let i = 0; i < maxZones; i++) {
            let zoneX = (this.canvas.width / 8) * 2 - (diagonalOffset + extraDiagonalOffset) * i + diagonalOffset;
            let zoneY = offset + (i * (zoneHeight + zoneOffset));
            let totalValue = 0;
            if (this.plrZones[i].isSelected && this.input.onSection == Input.SECTION.ZONES) {
                this.ctx.strokeStyle = "#5ba7cf";
            } else {
                this.ctx.strokeStyle = "#ffffff";
            }
            this.ctx.save();
            this.ctx.lineWidth = 3;
            this.ctx.shadowColor = 'rgba(0, 0, 0, 0.25)';
            this.ctx.shadowBlur = 10;
            this.ctx.shadowOffsetX = -5;
            this.ctx.shadowOffsetY = 5;
            this.ctx.beginPath();
            this.ctx.moveTo(zoneX, zoneY);
            this.ctx.lineTo(zoneX + zoneWidth, zoneY);
            this.ctx.lineTo(zoneX + zoneWidth - diagonalOffset, zoneY + zoneHeight);
            this.ctx.lineTo(zoneX - diagonalOffset, zoneY + zoneHeight);
            this.ctx.closePath();
            this.ctx.stroke();
            this.ctx.restore();
            //this.ctx.fillRect(zoneX, zoneY, zoneWidth, zoneHeight);
            for (let j = 0; j < this.plrZones[i].cards.length; j++) {
                if (this.plrZones[i].cards[j]) {
                    if (this.plrZones[i].cards[j].type == Card.CARD_TYPE.CREATURE) {
                        totalValue += this.plrZones[i].cards[j].value
                    }
                    this.plrZones[i].cards[j].holo.x = zoneX - diagonalOffset + zoneWidth - (j * (zoneWidth / 2)) - (this.plrZones[i].cards[j].holo.sizeX / 2 * (2 - j)) + (diagonalOffset * (1 - (j * 0.5)));
                    this.plrZones[i].cards[j].holo.y = zoneY + zoneHeight - this.plrZones[i].cards[j].holo.sizeY - (zoneHeight / 2);

                    this.ctx.save()
                    this.ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
                    this.ctx.shadowBlur = 10;
                    this.ctx.shadowOffsetX = 0;
                    this.ctx.shadowOffsetY = 5;
                    this.plrZones[i].cards[j].holo.Draw(this.ctx, this.player);
                    this.ctx.restore();
                    //this.ctx.drawImage(this.plrZones[i].cards[j].holo.sprite, this.plrZones[i].cards[j].holo.x, this.plrZones[i].cards[j].holo.y, this.plrZones[i].cards[j].holo.sizeX, this.plrZones[i].cards[j].holo.sizeY);
                }
            }
            this.ctx.save();
            this.ctx.fillStyle = "#000000";
            this.ctx.font = "20px serif";
            this.ctx.direction = "rtl";
            this.ctx.textAlign = "right";
            this.ctx.textBaseline = "middle";
            this.ctx.shadowColor = 'rgba(0, 0, 0, 0.25)';
            this.ctx.shadowBlur = 10;
            this.ctx.shadowOffsetX = 0;
            this.ctx.shadowOffsetY = 3;
            this.ctx.strokeText(totalValue, zoneX - diagonalOffset - numOffset, zoneY + (zoneHeight / 2));
            this.ctx.fillText(totalValue, zoneX - diagonalOffset - numOffset, zoneY + (zoneHeight / 2));
            this.ctx.restore();

        }
        // dibujar rival zone
        for (let i = 0; i < maxZones; i++) {
            let zoneX = ((this.canvas.width / 8) * 6) - zoneWidth + (diagonalOffset + extraDiagonalOffset) * (maxZones - 1 - i);
            let zoneY = offset + (i * (zoneHeight + zoneOffset));
            let totalValue = 0;
            this.ctx.save();
            this.ctx.shadowColor = 'rgba(0, 0, 0, 0.25)';
            this.ctx.shadowBlur = 10;
            this.ctx.shadowOffsetX = -5;
            this.ctx.shadowOffsetY = 5;
            this.ctx.strokeStyle = "#9a3f3f";
            this.ctx.lineWidth = 3;
            this.ctx.beginPath();
            this.ctx.moveTo(zoneX, zoneY);
            this.ctx.lineTo(zoneX + zoneWidth, zoneY);
            this.ctx.lineTo(zoneX + zoneWidth - diagonalOffset, zoneY + zoneHeight);
            this.ctx.lineTo(zoneX - diagonalOffset, zoneY + zoneHeight);
            this.ctx.closePath();
            this.ctx.stroke();
            this.ctx.restore();
            //this.ctx.fillRect(zoneX, zoneY, zoneWidth, zoneHeight);
            for (let j = 0; j < this.rvlZones[i].cards.length; j++) {
                if (this.rvlZones[i].cards[j]) {
                    if (this.rvlZones[i].cards[j].type == Card.CARD_TYPE.CREATURE) {
                        totalValue += this.rvlZones[i].cards[j].value
                    }
                    this.ctx.save();
                    this.rvlZones[i].cards[j].holo.x = zoneX + this.rvlZones[i].cards[j].holo.sizeX + (zoneWidth / 2 * j) - (this.rvlZones[i].cards[j].holo.sizeX / 2 * j) - (diagonalOffset * (1 - (j * 0.5)));
                    this.rvlZones[i].cards[j].holo.y = zoneY + zoneHeight - this.rvlZones[i].cards[j].holo.sizeY - (zoneHeight / 2);
                    this.ctx.save()
                    this.ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
                    this.ctx.shadowBlur = 10;
                    this.ctx.shadowOffsetX = 0;
                    this.ctx.shadowOffsetY = 5;
                    this.rvlZones[i].cards[j].holo.Draw(this.ctx, this.rival);
                    //this.ctx.drawImage(this.rvlZones[i].cards[j].holo.sprite, 0, 0, this.rvlZones[i].cards[j].holo.sizeX, this.rvlZones[i].cards[j].holo.sizeY);
                    this.ctx.restore();
                }
            }
            this.ctx.save();
            this.ctx.strokeStyle = "#b55a5a";
            this.ctx.fillStyle = "#501717";
            this.ctx.font = "20px serif";
            this.ctx.shadowColor = 'rgba(0, 0, 0, 0.25)';
            this.ctx.shadowBlur = 10;
            this.ctx.shadowOffsetX = 0;
            this.ctx.shadowOffsetY = 3;
            this.ctx.direction = "ltr";
            this.ctx.textAlign = "left";
            this.ctx.textBaseline = "middle";
            this.ctx.strokeText(totalValue, zoneX + zoneWidth + numOffset, zoneY + (zoneHeight / 2));
            this.ctx.fillText(totalValue, zoneX + zoneWidth + numOffset, zoneY + (zoneHeight / 2));
            this.ctx.restore();
        }
    }

    DrawHP() {
        let offsetX = 20;
        let offsetY = 20;
        this.ctx.fillStyle = "#ffffff";
        this.ctx.font = "32px serif";
        this.ctx.textAlign = "left";
        this.ctx.textBaseline = "top";
        this.ctx.direction = "ltr";
        this.ctx.fillText("Player: " + this.plrLife, offsetX, offsetY);
        this.ctx.textAlign = "right";
        this.ctx.textBaseline = "top";
        this.ctx.direction = "rtl";
        this.ctx.fillText("Rival: " + this.rvlLife, this.canvas.width - offsetX, offsetY);

    }

    DrawLight() {
        this.ctx.save();
        this.ctx.globalAlpha = 0.15;
        this.ctx.globalCompositeOperation = 'lighter';
        this.ctx.drawImage(this.light, 0, 0, this.canvas.width, this.canvas.height);
        this.ctx.globalAlpha = 0.05;
        this.ctx.globalCompositeOperation = 'hard-light';
        this.ctx.drawImage(this.light, 0, 0, this.canvas.width, this.canvas.height);
        this.ctx.restore();
    }

    DrawTotalScore(score, entity) {
        this.ctx.direction = "ltr";
        this.ctx.font = "32px serif";
        this.ctx.textAlign = "center";
        this.ctx.textBaseline = "middle";
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
            this.TurnHandler();
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
            if (this.player.cardsPlayed >= 3 || this.player.hand.length <= 0) {
                this.input.ResetNode();
                if (this.player.cardsPlayed < 3 && this.player.hand.length <= 0) {
                    console.log("no more cards");
                    await delay(1000);
                }
                this.EndTurn(this.player);
            }
        }
    }

    GetDeckSprite(currentCount, maxCount = 20) {
        if (currentCount <= 0) {
            return this.deckSprites.Empty;
        }
        const ratio = currentCount / maxCount;
        if (ratio > 0.7) {
            return this.deckSprites.Full;
        } else if (ratio > 0.35) {
            return this.deckSprites.Mid;
        } else {
            return this.deckSprites.Low;
        }
    }

    DrawBackground() {
        this.ctx.drawImage(this.bg, 0, 0, this.canvas.width, this.canvas.height);
    }

    DrawDeckAndGraveyard() {
        const zoneWidth = 80;
        const zoneHeight = 110;

        // Left Side (Player)
        const plrGyX = 30;
        const plrGyY = 75;
        const plrDeckX = 30;
        const plrDeckY = 225;

        // Right Side (Rival)
        const rvlGyX = this.canvas.width - 30 - zoneWidth;
        const rvlGyY = 75;
        const rvlDeckX = this.canvas.width - 30 - zoneWidth;
        const rvlDeckY = 225;

        this.ctx.save();
        this.ctx.direction = "ltr";

        // 1. Zonas de Cementerios (GY)
        this.ctx.strokeStyle = "#555555";
        this.ctx.lineWidth = 2;
        this.ctx.fillStyle = "rgba(0, 0, 0, 0.15)";

        // Player
        this.ctx.fillRect(plrGyX, plrGyY, zoneWidth, zoneHeight);
        this.ctx.strokeRect(plrGyX, plrGyY, zoneWidth, zoneHeight);

        // Rival
        this.ctx.fillRect(rvlGyX, rvlGyY, zoneWidth, zoneHeight);
        this.ctx.strokeRect(rvlGyX, rvlGyY, zoneWidth, zoneHeight);

        this.ctx.fillStyle = "#ffffff";
        this.ctx.font = "bold 14px serif";
        this.ctx.textAlign = "center";
        this.ctx.fillText("GY: " + this.plrGraveyard.length, plrGyX + zoneWidth / 2, plrGyY + zoneHeight / 2);
        this.ctx.fillText("GY: " + this.rvlGraveyard.length, rvlGyX + zoneWidth / 2, rvlGyY + zoneHeight / 2);

        // 2. Zonas de Deck (4 Visuales)
        const plrCurrentSprite = this.GetDeckSprite(this.plrDeck.length);
        const rvlCurrentSprite = this.GetDeckSprite(this.rvlDeck.length);

        if (plrCurrentSprite.complete && plrCurrentSprite.naturalWidth !== 0) {
            this.ctx.drawImage(plrCurrentSprite, plrDeckX, plrDeckY, zoneWidth, zoneHeight);
        }

        if (rvlCurrentSprite.complete && rvlCurrentSprite.naturalWidth !== 0) {
            this.ctx.drawImage(rvlCurrentSprite, rvlDeckX, rvlDeckY, zoneWidth, zoneHeight);
        }

        // Deck counters debajo de cada mazo
        this.ctx.fillStyle = "#ffffff";
        this.ctx.font = "bold 14px serif";
        this.ctx.textAlign = "center";
        this.ctx.fillText("Deck: " + this.plrDeck.length, plrDeckX + zoneWidth / 2, plrDeckY + zoneHeight + 16);
        this.ctx.fillText("Deck: " + this.rvlDeck.length, rvlDeckX + zoneWidth / 2, rvlDeckY + zoneHeight + 16);

        this.ctx.restore();
    }

    Draw(player) {
        this.DrawBackground();
        this.DrawZones();
        this.DrawLight();
        this.DrawHand(player.hand);
        this.DrawHP();
        this.DrawDeckAndGraveyard();
        if (this.state == Battle.DUEL_STATE.CALC || this.state == Battle.DUEL_STATE.REVEAL) {
            this.DrawTotalScore(this.plrScore, this.player);
            this.DrawTotalScore(this.rvlScore, this.rival);
            if (this.state == Battle.DUEL_STATE.REVEAL) {
                this.DrawDifference(this.plrScore, this.rvlScore);
            }
        }
    }
}