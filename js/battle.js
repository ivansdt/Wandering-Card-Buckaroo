import Card from './card.js';

export default class Battle {
    constructor(entity) {
        this.rivalEntity = entity;
        this.rivalDeck = entity.deck;

    }

    DrawDeck(deck, canvas, ctx) {
        // test de renderizado de cartas placeholder
        for (let i = 0; i < deck.length; i++) {
            const sprite_card = new Image();
            sprite_card.src = deck[i].sprite;
            ctx.drawImage(sprite_card, ((canvas.width / 2) - (80 * 3)) + (i * 80), canvas.height - 200, this.rivalDeck[i].width, this.rivalDeck[i].height);
        }
    }

    StartBattle() {

    }
}