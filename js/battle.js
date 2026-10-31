import Card from './card.js';
export default class Battle {
    constructor(plrEnt, rivalEnt) 
    {
        this.player = plrEnt;
        this.plrDeck = plrEnt.deck;
        this.rival = rivalEnt;
        this.rvlDeck = rivalEnt.deck;

        this.executeCowboyEffect = function(sourceCard, targetCard, playerDeck, board) {
        console.log("Procesando efecto de: " + sourceCard.name);

        switch (sourceCard.name) {
            case "Mysterious Stranger":
                // EFFECT: Pierde 1 de ataque por cada Cowboy en juego
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
                    

    }

    DrawDeck(deck, canvas, ctx) {
        // test de renderizado de cartas placeholder
        for (let i = 0; i < 6; i++) {
            const sprite_card = new Image();
            sprite_card.src = deck[i].sprite;
            let cardX = ((canvas.width / 2) - (80 * 3)) + (i * 80);
            let cardY = canvas.height - 200;
            ctx.drawImage(sprite_card, ((canvas.width / 2) - (80 * 3)) + (i * 80), canvas.height - 200, deck[i].width, deck[i].height);
            if (deck[i].type === deck[i].CARD_TYPE.CREATURE) {
                ctx.font = "bold 14px monospace";
                ctx.fillStyle = "black";
                ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
                ctx.fillRect(cardX + 5, cardY + 25, 45, 20);
                ctx.fillStyle = "red";

            }
        }
    }

    GetCardsFromDeck(entity) {
        let availableCards = new Array();
        for (let i = 0; i < entity.deck.length; i++) {
            availableCards.push(entity.deck[i]);
        }

        for (let i = 0; i < 6; i++) {
            let randomIndex = Math.floor(Math.random() * availableCards.length);
            let randomCard = availableCards.splice(randomIndex, 1)[0];
            //console.log(randomCard);
            entity.hand.push(randomCard);
        }
    }

    StartBattle() {

    }
}