import Card from './card.js';
export default class Battle {
    constructor(plrEnt, rivalEnt) {
        this.player = plrEnt;
        this.plrDeck = plrEnt.deck;
        this.rival = rivalEnt;
        this.rvlDeck = rivalEnt.deck;

    }

    DrawDeck(deck, canvas, ctx) {
        // test de renderizado de cartas placeholder
        for (let i = 0; i < 6; i++) {
            const sprite_card = new Image();
            sprite_card.src = deck[i].sprite;
            ctx.drawImage(sprite_card, ((canvas.width / 2) - (80 * 3)) + (i * 80), canvas.height - 200, deck[i].width, deck[i].height);
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