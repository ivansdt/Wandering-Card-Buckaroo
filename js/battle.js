import Card from './card.js';

export default class Battle {
    constructor(entity) {
        this.rivalEntity = entity;
        this.rivalDeck = new Array(10);

    }

    CreateDeck() {
        for (let i = 0; i < this.rivalDeck.length; i++) {
            this.rivalDeck[i] = new Card();
            this.rivalDeck[i].genre = this.rivalDeck[i].CARD_TYPE.COW_COWBOYS;
            this.rivalDeck[i].type = this.rivalDeck[i].CARD_TYPE.OBJECT;
            this.rivalDeck[i].sprite = 'assets/card-template-c.png'
        }
    }

    DrawDeck(canvas, ctx) {
        // test de renderizado de cartas placeholder
        for (let i = 0; i < 6; i++) {
            const sprite_card = new Image();
            sprite_card_creature.src = this.rivalDeck[i].sprite;
            ctx.drawImage(sprite_card_creature, -30 + (i * 10), 300, this.rivalDeck[i].width, this.rivalDeck[i].height);
        }
        const sprite_card = new Image();
        sprite_card_creature.src = "assets/card-template-c.png";
        ctx.drawImage(sprite_card_creature, this.pos.x, this.pos.y, this.size, this.size);
    }
}