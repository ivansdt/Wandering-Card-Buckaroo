import Card from './card.js';
import Zone from './zone.js';

let maxHand = 6;
let maxZones = 5;

export default class Battle {
    constructor(plrEnt, rivalEnt) {
        this.player = plrEnt;
        this.plrDeck = plrEnt.deck;
        this.rival = rivalEnt;
        this.rvlDeck = rivalEnt.deck;
        this.isPlrTurn = false;
        this.plrZones = new Array();
        this.rvlZones = new Array();

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
            //console.log(randomCard);
            entity.hand.push(randomCard);
        }
    }

    CreateZones() {
        // player zones
        for (let i = 0; i < maxZones; i++) {
            this.plrZones[i] = new Zone();
            console.log(this.plrZones);
        }

        for (let i = 0; i < maxZones; i++) {
            this.rvlZones[i] = new Zone();
        }
    }

    DrawHand(hand, canvas, ctx) {
        let offsetX = 80;
        let offsetY = 100;
        // test de renderizado de cartas placeholder
        for (let i = 0; i < hand.length; i++) {
            let totalWidth = hand[i].width + ((hand.length - 1) * offsetX);
            hand[i].x = (canvas.width / 2) + (i * offsetX) - (totalWidth / 2);
            hand[i].y = canvas.height - offsetY;
            const sprite_card = new Image();
            sprite_card.src = hand[i].sprite;
            ctx.drawImage(sprite_card, hand[i].x, hand[i].y, hand[i].width, hand[i].height);
        }
    }

    DrawZones(canvas, ctx) {
        // dibujar player zone
        let zoneWidth = 150;
        let zoneHeight = 50;
        let offset = 20;

        for (let i = 0; i < maxZones; i++) {
            let zoneX = canvas.width / 4;
            let zoneY = offset + (i * (zoneHeight + 20));
            ctx.fillStyle = "#7d7d7d";
            ctx.fillRect(zoneX, zoneY, zoneWidth, zoneHeight);
            // dibujar sprite de la carta aqui con el .hologram, lo estoy testeando con cajas de colores por ahora. 
            for (let k = 0; k < this.plrZones[i].cards.length; k++) {
                if (this.plrZones[i].cards[k]) {
                    ctx.fillStyle = "orange";
                    ctx.fillRect(zoneX + (k * (zoneWidth / 2) - 15), zoneY + (zoneHeight / 2) - 15, 30, 30);
                }
            }

        }
        // dibujar rival zone
        for (let i = 0; i < maxZones; i++) {
            let zoneX = ((canvas.width / 4) * 3) - zoneWidth;
            let zoneY = offset + (i * (zoneHeight + 20));
            ctx.fillStyle = "#9a3f3f";
            ctx.fillRect(zoneX, zoneY, zoneWidth, zoneHeight);
            if (this.rvlZones[i].cards.length != 0) {
                // dibujar sprite de la carta aqui con el .hologram, lo estoy testeando con cajas de colores por ahora.

            }
        }
    }

    EndTurn(entity) {
        if (this.isPlrTurn) {
            this.isPlrTurn = false;
        } else {
            this.isPlrTurn = true;
        }
        entity.cardsPlayed = 0;
    }

    StartBattle() {
        this.CreateZones();
        this.GetCardsFromDeck(this.player);
        this.GetCardsFromDeck(this.rival);

        // testeo de carta en zona
        this.plrZones[0].InsertCard(this.player.hand[0]);
    }

    Draw(player, rival, canvas, ctx) {
        this.DrawHand(player.hand, canvas, ctx);
        this.DrawZones(canvas, ctx);
    }
}